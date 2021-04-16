var express = require('express');
var session = require('express-session');
//var SQLiteStore = require('sqlite3')(session);
var uuid = require ('uuid').v4;
var app = express();
var { debug, Console } = require("console");

app.use(session({
    //store: new SQLiteStore, //Can also be done with FileStore?
    secret: 'noSecret',
    genid: (req)=>{
        return uuid() //session id == userid (?)
    },
    cookie : { maxAge: 60000 }
    /*saveUnitialized: true,
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

var currentSession;
app.get('/', (req, res)=>{
    currentSession = req.session;
    console.log(currentSession);
    res.send(currentSession);
});

app.get('/login', (req, res)=>{ //session reload
    currentSession = req.session;
    var str = "login";
    console.log(str);
    console.log(currentSession);
    res.send(currentSession);
});

app.get('/register', (req, res)=>{ //session save
    currentSession = req.session;
    var str = "register";
    console.log(str);
    console.log(currentSession.id);
    res.send(currentSession.id);
});

app.listen(8080)
