var express = require('express');
var session = require('express-session');
//var SQLiteStore = require('sqlite3')(session);
var uuid = require ('uuid').v4;
var app = express();
var { debug, Console } = require("console");

var fs = require("fs");
var file = __dirname + "/" + "database.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();

function checkCredentials(username, password, sessionID, callback)
{
    var db = new sqlite3.Database(file);
    var response = false;

    db.each("SELECT password FROM Registered_Users WHERE username = ?", username, function(err, row) {
    if (err) {
        throw err;
    }
    if(row.password == password)
    {
        response = true
        // insert the new sessionID
        db.run("UPDATE Registered_Users SET sessionID = ?, session_total_questions = ?, session_correct_answers = ? WHERE username = ?", [sessionID, 0, 0, username]);
    }
    }, function(){ // calling function when all rows have been pulled
        db.close(); //closing connection
        callback(response);});
}

function checkUniqueUserName(username, callback)
{
    var db = new sqlite3.Database(file);
    var unique = true;

    db.each("SELECT sessionID FROM Registered_Users WHERE username = ?", username, function(err, row) {
        if (err) {
            throw err;
        }
        unique = false
    }, function(){ // calling function when all rows have been pulled
        db.close(); //closing connection
        callback(unique);});
}

function registerNewUser(username, password, sessionID)
{
    var db = new sqlite3.Database(file);
    db.run("INSERT INTO Registered_Users(sessionID, username, password, total_questions, total_correct_answers, session_total_questions, session_correct_answers) Values(?, ?, ?, ?, ?, ?, ?)", [sessionID, username, password, 0, 0, 0, 0]);
    db.close()
}

app.use(session({
    //store: new SQLiteStore, //Can also be done with FileStore?
    secret: 'noSecret',
    resave: true,
    saveUninitialized: true,
    genid: (req)=>{
        return uuid() //session id == userid (?)
    },
    cookie : { maxAge: 60000 }
    /*saveUninitialized: true,
    resave: true,
    secure: false,
    httpOnly: true,
    path: '/',
    maxAge: null*/ //some options for sessions&cookies
    
    /*Options:
    •table='sessions' Database table name
    •db='sessionsDB' Database file name
    •dir='.'Directory to save '.db' file*/ // some options for storing session
}))

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

var currentSession;
app.get('/', (req, res)=>{
    currentSession = req.session;
    console.log(currentSession);
    res.send(currentSession);
});

app.post('/login', (req, res)=>{
    if(req.body.username && (req.body.password))
    {
        checkCredentials(req.body.username, req.body.password, req.sessionID, function(response){
            if(response == true)
            {
                res.sendStatus(200);
                console.log(req.sessionID)
            }else
            {
                res.sendStatus(404);
            }
        });
    }else
    {
        res.sendStatus(404);
    }
});

app.post('/register', (req, res)=>{ //session save
    if(req.body.username && (req.body.password))
    {
        checkUniqueUserName(req.body.username, function(unique){
            if(unique)
            {
                registerNewUser(req.body.username, req.body.password, req.sessionID)
                console.log(req.sessionID)
                res.sendStatus(200);
            }else
            {
                res.sendStatus(404);
            }
        });
    }else
    {
        res.sendStatus(404);
    }
});

app.listen(8080)
