var fs = require("fs");
var cors = require('cors');
var file = __dirname + "/" + "database.db";
var exists = fs.existsSync(file);

if(!exists) {
    // Database does not exist
    console.log("OHNO");
    return;
}

var sqlite3 = require("sqlite3").verbose();

function getAllTopics(callback)
{
    var db = new sqlite3.Database(file);
    var response = []; 
    db.serialize(function() {

        db.each("SELECT topicID, title FROM Topics", function(err, row) {
        if (err) {
            throw err;
        }
        response.push(`{ "topicID" : ${row.topicID}, "title" : "${row.title}"}`)
        console.log(response);
        }, function(){ // calling function when all rows have been pulled
            db.close(); //closing connection
            callback(response);});
    }); 
}

function getTopic(topic_id, callback)
{
    var db = new sqlite3.Database(file);
    var response = "";
    console.log(topic_id);

    db.each(`SELECT quizzes FROM Topics WHERE topicID = ${topic_id}`, function(err, row) {
    if (err) {
        throw err;
    }
    if(row.quizzes != "")
    {
        row.quizzes = `"${row.quizzes.replaceAll('$', '" , "')}"`;
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
    console.log(topic_id);
    console.log(title);
    db.each(`SELECT quizID FROM Quizzes WHERE topicID = ${topic_id} AND title = "${title}"`, function(err, row) {
    if (err) {
        throw err;
    }
    response += row.quizID;
    console.log(response);
    }, function(){ // calling function when all rows have been pulled
        db.close(); //closing connection
        callback(response);});
}

function getQuestions(quizID, callback)
{
    var db = new sqlite3.Database(file);
    var response = []; 
    console.log(quizID);

    db.each(`SELECT * FROM Questions WHERE quizID = ${quizID}`, function(err, row) {
    if (err) {
        throw err;
    }

    if(row.MCQ == "")
    {
        response.push(`{  "questionID" : "${row.questionID}", "title" : "${row.title}", "question" : "${row.question}", "type" : ${row.type}, "MCQ ": [${row.MCQ}] }`);

    }else
    {
        row.MCQ = row.MCQ.replaceAll('$', '","')
        response.push(`{ "title" : "${row.title}", "question" : "${row.question}", "type" : ${row.type}, "MCQ ": ["${row.MCQ}"] }`);
    }

    }, function(){ // calling function when all rows have been pulled
        db.close(); //closing connection
        //response += quizID;
        callback(response);});
}

var express = require('express');
const { debug, Console } = require("console");
var app = express();

app.use(cors());

app.get('/', function (req, res) {
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

app.get('/', function (req, res) {
    let topic_id = req.query.topic_id;
    getTopic(topic_id, function(response){
        console.log(response);
        res.json(response);
    });
});

app.get('/quiz', function (req, res) {
    let topic_id = req.query.topic_id;
    let title = req.query.title;
    getQuizID(topic_id, title, function(response){
        console.log(response);
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

app.post('/question', function (req, res) {
    let topic_id = req.query.topic_id;
    getTopic(topic_id, function(response){
        console.log(response);
        res.send(response);
    });
})


app.listen(8081);