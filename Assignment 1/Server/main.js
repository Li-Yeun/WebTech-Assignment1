var fs = require("fs");
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
   var response = "" 
    db.serialize(function() {

        db.each("SELECT topicID, title FROM Topics", function(err, row) {
        if (err) {
            throw err;
        }
        response += `${row.topicID} : ${row.title}`
        console.log(response);
        }, function(){ // calling function when all rows have been pulled
            db.close(); //closing connection
            callback(response);});
    }); 
}


var express = require('express');
const { debug, Console } = require("console");
var app = express();
app.get('/', function (req, res) {
    getAllTopics(function(response){
        console.log(response);
        res.send(response);
    });
});
app.listen(8081);