var fs = require("fs");
var cors = require('cors');
var session = require('express-session');
var uuid = require ('uuid').v4;
var file = __dirname + "/" + "database.db";
var exists = fs.existsSync(file);

if(!exists) {
    // Database does not exist
    console.log("OHNO");
    return;
}

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
        db.serialize(function() {
            db.run("UPDATE Registered_Users SET sessionID = ? WHERE sessionID = ?", [-1, sessionID]);
            db.run("UPDATE Registered_Users SET sessionID = ?, session_total_questions = ?, session_correct_answers = ? WHERE username = ?", [sessionID, 0, 0, username])
        });
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

function checkRegisteredUsers(sessionID, callback)
{
    var db = new sqlite3.Database(file);
    var response = false;

    db.each("SELECT username FROM Registered_Users WHERE sessionID = ?", sessionID, function(err, row) {
        if (err) {
            throw err;
        }
        response = true;
    }, function(){ 
        db.close(); 
        callback(response);});
}

function logOutRegisteredUser(sessionID, username)
{
    var db = new sqlite3.Database(file);
    db.run("UPDATE Registered_Users SET sessionID = ? WHERE sessionID = ? AND username = ?", [-1, sessionID, username]);
    db.close
}

function updateScore(sessionID, totalQuestions, correctAnswers)
{
    var db = new sqlite3.Database(file);
    db.each("SELECT total_questions, total_correct_answers, session_total_questions, session_correct_answers FROM Registered_Users WHERE sessionID = ?", sessionID, function(err, row) {
        if (err) {
            throw err;
        }
        db.run("UPDATE Registered_Users SET total_questions = ?, total_correct_answers = ?, session_total_questions = ?, session_correct_answers = ? WHERE sessionID = ?", 
        [parseInt(row.total_questions) + parseInt(totalQuestions), parseInt(row.total_correct_answers) + parseInt(correctAnswers), parseInt(row.session_total_questions) + parseInt(totalQuestions), parseInt(row.session_correct_answers) + parseInt(correctAnswers), sessionID]);
    });
}

function getAllTopics(callback)
{
    var db = new sqlite3.Database(file);
    var response = [];
    db.serialize(function() {
        db.each("SELECT topicID, title, link FROM Topics", function(err, row) {
        if (err) {
            throw err;
        }
        response.push(`{ "topicID" : ${row.topicID}, "title" : "${row.title}", "link" : "${row.link}"}`)
        }, function(){ 
            db.close();
            callback(response);});
    });
}

function getTopic(topic_id, callback)
{
    var db = new sqlite3.Database(file);
    var response = "";

    db.each("SELECT quizzes FROM Topics WHERE topicID = ?", topic_id, function(err, row) {
    if (err) {
        throw err;
    }
    if(row.quizzes != "")
    {
        row.quizzes = `"${row.quizzes.replace(/\$/g, '" , "')}"`;
        response = `{ "topic" : { "quizzes" : [ ${row.quizzes} ], "topicID" : ${topic_id}}}`;
    }
    }, function(){ // calling function when all rows have been pulled
        db.close(); //closing connection
        callback(response);});
}

function getQuizID(topic_id, title, callback)
{
    var db = new sqlite3.Database(file);
    var response = ""
    db.each("SELECT quizID FROM Quizzes WHERE topicID = ? AND title = ?", [topic_id, title], function(err, row) {
    if (err) {
        throw err;
    }
    response += row.quizID;
    }, function(){ // calling function when all rows have been pulled
        db.close(); //closing connection
        callback(response);});
}

function getQuestions(quizID, callback)
{
    var db = new sqlite3.Database(file);
    var response = [];

    db.each("SELECT * FROM Questions WHERE quizID = ?", quizID, function(err, row) {
    if (err) {
        throw err;
    }

    if(row.MCQ == "")
    {
        response.push(`{  "questionID" : "${row.questionID}", "title" : "${row.title}", "question" : "${row.question}", "answer" : "${row.answer}", "type" : ${row.type}, "MCQ ": [${row.MCQ}] }`);

    }else
    {
        row.MCQ = row.MCQ.replace(/\$/g, '","')
        response.push(`{ "title" : "${row.title}", "question" : "${row.question}", "answer" : "${row.answer}", "type" : ${row.type}, "MCQ": ["${row.MCQ}"] }`);
    }

    }, function(){ // calling function when all rows have been pulled
        db.close(); //closing connection
        //response += quizID;
        callback(response);});
}

function getReportPage(sessionID, callback)
{
    var db = new sqlite3.Database(file);
    var response = "";
    db.each("SELECT total_questions, total_correct_answers, session_total_questions, session_correct_answers FROM Registered_Users WHERE sessionID = ?", sessionID, function(err, row) {
        if (err) {
            throw err;
        }
        response = `{ "total_questions" : ${row.total_questions},  "total_correct_answers" : ${row.total_correct_answers}, "session_total_questions" : ${row.session_total_questions}, "session_correct_answers" :  ${row.session_correct_answers} }`
    }, function(){ // calling function when all rows have been pulled
        db.close(); //closing connection
        callback(response);});
}

var express = require('express');
const { debug, Console } = require("console");
var path = require("path");
const { response } = require("express");
var staticPath = path.join(__dirname, "static");
var app = express();

app.use(cors());

app.use(session({
    //store: new SQLiteStore, //Can also be done with FileStore?
    secret: 'noSecret',
    resave: true,
    saveUninitialized: true,
    genid: (req)=>{
        return uuid() //session id == userid (?)
    },
    cookie : { maxAge: 1000*60*60 }
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

app.use(express.static(staticPath));

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
        res.sendStatus(400);
    }
});

app.post('/logout', (req, res)=>{
    logOutRegisteredUser(req.sessionID,req.body.username)
    res.sendStatus(200);
});

app.get('/topics', function (req, res) {
    getAllTopics(function(response){
        if(response == [])
        {
            res.send(response);
        }else{
            var responseJSON = `{ "topics" : [`
            for(let i = 0; i < response.length-1; i++)
            {
                responseJSON += response[i] + ',';
            }
            responseJSON += response[response.length-1] + ']}';
            res.json(responseJSON);
        }
    });
});

app.get('/topic', function (req, res) {
    let topic_id = parseInt(req.query.topic_id);
    getTopic(topic_id, function(response){
        res.json(response);
    });
});

app.get('/quiz', function (req, res) {
    let topic_id = req.query.topic_id;
    let title = req.query.title;
    getQuizID(topic_id, title, function(response){
        if(response != "")
        {
            getQuestions(response,  function(questions)
            {
                var questionsJSON = `{ "questions" : [`
                for(let i = 0; i < questions.length-1; i++)
                {
                    questionsJSON += questions[i] + ',';
                }
                questionsJSON += questions[questions.length-1] + '], ';
                questionsJSON += `"quizID" : ${response} }`
                res.json(questionsJSON);
            })
        }else
        {
            res.send(response);
        }
    });
});

app.get('/reportPage', function (req, res) {
    checkRegisteredUsers(req.sessionID, function(response){
        if(response == true)
        {
            getReportPage(req.sessionID, function(report)
            {
                res.json(report);
            })
        }else
        {
            res.sendStatus(404);
        }
    });
});


app.post('/questions', (req, res)=>{
    if(req.body.totalQuestions && (req.body.correctAnswers))
    {
        checkRegisteredUsers(req.sessionID, function(response){
            if(response == true)
            {
                updateScore(req.sessionID, req.body.totalQuestions, req.body.correctAnswers)
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


app.listen(8081);
