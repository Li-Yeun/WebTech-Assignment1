var fs = require("fs");
var file = __dirname + "/" + "database.db";
var exists = fs.existsSync(file);
if(!exists) {
fs.openSync(file, "w");
}
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

class Topic {
    constructor(topic_name, link) {
      this.topic = topic_name;
      this.quizzes = [];
      this.link = link;
      topicCounter = generateID(topicCounter)
      this.topicID = topicCounter;
    }
}

class Quiz {
    constructor(quiz_name) {
      this.quiz_name = quiz_name;
      this.questions = [];
      quizCounter = generateID(quizCounter)
      this.quizID = quizCounter;
    }
}

class Question {
    constructor(title, question, answer, type, multiple_choice) {
      this.title = title
      this.question = question;
      this.answer = answer;
      this.type = type
      this.multiple_choice = multiple_choice;
    }
}
var topicCounter = 0;
var quizCounter = 0;
function generateID(counter)
{
  counter += 1;
  return counter;
}
var topics = [];
topic = new Topic("Web browsers");

quiz = new Quiz("History");
questions = [new Question("WWW", "What does WWW stand for?", "World Wide web", false), 
             new Question("The first browser", "Who invented the first browser?", "Tim Berners-Lee", true, ["Steve Jobs", "Neil Larson", "Tim Berners-Lee", "Ted Larson"]), 
             new Question("Browser war", "The browser war started with the release of:", "Internet Explorer", false)];
quiz.questions = questions;
topic.quizzes.push(quiz);

quiz = new Quiz("Functionality");
questions = [new Question("Functions", "What's the primary function of a web browser?", "render HTML", true, ["render HTML", "writing Javascript", "start a connection with the server"]), 
             new Question("CSS", "CSS is used to _ the web browser.", "style", false),
             new Question("HTML", "What does HTML stand for?", "Hypertext Markup Language", false)];
quiz.questions = questions;
topic.quizzes.push(quiz);
topics.push(topic);

topic = new Topic("Safari");

quiz = new Quiz("Apple");
questions = [new Question("Founder", "Who's the creator of Apple?", "Steve Jobs", false), 
             new Question("Devices", "Which of these devices isn't an Apple device?", "IClock", true, ["Iphone", "IMac", "IPad", "IClock", "IWatch"]), 
             new Question("Standards", "What's the standard web browser for IOS-devices?", "Safari", false)];
quiz.questions = questions;
topic.quizzes.push(quiz);

quiz = new Quiz("Benefits & drawbacks");
questions = [new Question("Drawbacks", "Safari's biggest downside on Apple devices is:", "lack of a robust ecosystem", true, ["poor battery optimization", "lack of a robust ecosystem", "lack of privacy regulations"]), 
             new Question("Benefits", "Is the following statement true or false? Safari boasts better integration with Apple’s graphics rendering pipeline.", "True", true, ["True", "False"]),
             new Question("Privacy", "One of safari's benefit is that Apple’s business is not founded upon the idea of tracking and analyzing user data. Which of Apple's competitor do build their business upon that idea?", "Google", false)];
quiz.questions = questions;
topic.quizzes.push(quiz);
topics.push(topic);

topic = new Topic("Google Chrome");

quiz = new Quiz("Features");
questions = [new Question("Extensions", "There are two marketplaces to install extensions on Chrome. Which one is false?", "Google Play Store", true, ["Google Play Store", "Chrome Web Store", "G Suite"]), 
             new Question("Requirements", "Before Chrome users can synchronize their bookmarks, history and settings across all devices with the browser, they first need to create a _.", "Google Account", false), 
             new Question("Missing service", "What doesn't Google Chrome offer?", "Non privacy related issues", true, ["A minimalistic user interface", "Strong browser performance", "Ad-block extensions", "Non privacy related issues"])];
quiz.questions = questions;
topic.quizzes.push(quiz);

quiz = new Quiz("History");
questions = [new Question("CEO", "Who was the CEO of Google when Google Chrome was released?", "Eric Schmidt", false),
             new Question("Initial release", "In which year was the public release of Google Chrome?", "2008", false),
             new Question("Wchievement", "Did Google Chrome passed the Acid1 and Acid2 tests after its first release?", "Yes", true, ["Yes", "No"])]; 
quiz.questions = questions;
topic.quizzes.push(quiz);
topics.push(topic);

db.serialize(function() {
    if(!exists) {
    db.run("CREATE TABLE Topics (topicID INTEGER, title TEXT, link TEXT, quizzes TEXT)");
    db.run("CREATE TABLE Quizzes (topicID INTEGER, quizID INTEGER, title TEXT)");
    db.run("CREATE TABLE Questions (quizID INTEGER, title TEXT, question TEXT, answer TEXT, type INTEGER, MCQ TEXT)");
    }

    for(let i = 0; i < topics.length; i++)
    {
      let current_topic = topics[i]
      let quiz_names = "";

      for(let j = 0; j < current_topic.quizzes.length; j++)
      {
        let current_quiz = current_topic.quizzes[j];
        quiz_names += current_quiz.quiz_name +"$";
        db.run("INSERT INTO Quizzes(topicID, quizID, title) Values(?, ?, ?)", [current_topic.topicID, current_quiz.quizID, current_quiz.quiz_name]);

        for(let k = 0; k < current_quiz.questions.length; k++)
        {
          let current_question = current_quiz.questions[k];
          let multiple_choice_options = "";
          if(current_question.type)
          {
            for(let l = 0; l < current_question.multiple_choice.length; l++)
            {
              multiple_choice_options += current_question.multiple_choice[l] + "$";
            }
            multiple_choice_options = multiple_choice_options.slice(0, -1); 
          }
          db.run("INSERT INTO Questions(quizID, title, question, answer, type, MCQ) Values(?, ?, ?, ?, ?, ?)", [current_quiz.quizID, current_question.title, current_question.question, current_question.answer, current_question.type, multiple_choice_options]);
        }
      }
      quiz_names = quiz_names.slice(0, -1); 
      db.run("INSERT INTO Topics(topicID, title, link, quizzes) Values(?, ?, ?, ?)", [current_topic.topicID, current_topic.topic, current_topic.link, quiz_names]);
    }
});
db.close();