//create buttons for login, register, logout and profile
function createInitialButtons(){
    account.innerHTML = 
    `<button id="login" style="background-color:lightgrey" onclick=loginScreen()>Login</button>
     <button id="register" style="background-color:lightgrey" onclick=registerScreen()>Register</button>`;
}

function loginScreen()
{
    account.innerHTML = "";
    result.innerHTML = "";
    questions.innerHTML = `<label>
    <br>Username:<br>
    <input type="text" name="username" id="username">
    </label>
    <label><br><br>
    Password:<br>
    <input type="text" name="password" id="password">
    </label><br><br>
    <button id="login" style="background-color:lightgrey" onclick=login()>Login</button>
    <button id="back" onclick=initialState()>Back</button> <br>`
}

function registerScreen()
{
    account.innerHTML = "";
    result.innerHTML = "";
    questions.innerHTML = `<label>
    <br>Username:<br>
    <input type="text" name="username" id="username">
    </label>
    <label><br><br>
    Password:<br>
    <input type="text" name="password" id="password">
    </label><br><br>
    <button id="register" style="background-color:lightgrey" onclick=register()>Register</button>
    <button id="back" onclick=initialState()>Back</button> <br>`
}

function initialState()
{     
    createInitialButtons();
    pickTopic();    
}

function initialStateWithLogIn()
{     
    account.innerHTML = 
    `<u>Welcome ${username}!</u>
     <button id="profile" style="background-color:lightgrey" onclick=profileScreen()>Report page</button>
     <button id="logout" style="background-color:red" onclick=logout()>logout</button>`;
    pickTopic();
}


//create the questions
function makeQuiz(){
    const output = [];
    myQuestions.questions.forEach((currentQuestion, questionNumber) => {
    const possAnswers = [];
    if(currentQuestion.type == 1){
        for(i = 0 ; i < currentQuestion.MCQ.length; i++){
            possAnswers.push( 
                    `<label>
                    <input type="radio" name="question${questionNumber}" value="${currentQuestion.MCQ[i]}"/>
                    ${i}: ${currentQuestion.MCQ[i]} <br>
                    </label>`
   
                );
            }
        }
    else
    {
        possAnswers.push(
            `<label>
            <input type="text" name="question${questionNumber}" id="openQuestion${questionNumber}" placeholder="put your answer here:"/>
            </label>`
        );
    }

    possAnswers.push(`<div class="response"></div>`)

    output.push(
        `<br>
        <div class="title"> Question ${questionNumber + 1}: ${currentQuestion.title}</div>
        <br>
        <div class="question"> ${currentQuestion.question}</div>
        <br>
        <div class="answers"> ${possAnswers.join('')}</div>`
    );
    })
    questions.innerHTML = output.join('') + 
    `<br>
    <button id="submit" onclick=showAnswer()>Submit</button> 
    <br><br> 
    <button id="back" onclick=pickTopic()>Back</button> <br>`;
}

// check the answers
function showAnswer(){
    if(registeredUser){
        const answers = questions.querySelectorAll('.answers')
        var corrAnswers = 0;
        myQuestions.questions.forEach((currentQuestion, questionNumber) => {
            var givenAnswer;
            const answerNumber = answers[questionNumber];
            var response = (answerNumber.querySelector(".response") || {});
            if (currentQuestion.type == 1) {
                const choiceSelector =  `input[name=question${questionNumber}]:checked`;
                givenAnswer = (answerNumber.querySelector(choiceSelector) || {}).value;
                response.innerHTML = "";
            }
            else {
                givenAnswer = (document.getElementById(`openQuestion${questionNumber}`) || {}).value;
                response.innerHTML = "Correct";
            }
            
            if(givenAnswer == currentQuestion.answer){
                corrAnswers++;
                answers[questionNumber].style.color = 'green';
            }
            else{ answers[questionNumber].style.color = 'red'; response.innerHTML = `The correct answer was: ${currentQuestion.answer}.`}
        });
        result.innerHTML = `<br> You got ${corrAnswers} questions correct!`
        if (corrAnswers != myQuestions.questions.length){
            result.innerHTML += `<br><br>
            <button id="info" onClick=goToSite()>If you want to learn more about this topic click here</button>`;
        }
        
        // Send to server
        req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if (req.readyState === 4){
                if(req.status === 200)
                {
                    console.log("DATA SEND");
                }else
                {
                    console.log("FAILED SENDING");
                }
            }
        }
        req.open("POST", "http://localhost:8081/questions", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(`totalQuestions=${myQuestions.questions.length}&correctAnswers=${corrAnswers}`);
    }
    else{
        questions.innerHTML = `<br>
            ya need ta be registered man.
            <br><br>
            <button id="back" onclick=pickTopic()>Back</button> <br>`;
    }
}

// select the correct topic and quiz
function pickTopic(){
    result.innerHTML = "";
    var topics;
    topicsContainer = [];
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState === 4 && req.status === 200){
            topics = JSON.parse(JSON.parse(req.responseText));
            topicsContainer.push(`<br> What topic would you like to answer questions about? <br>`);
            topics.topics.forEach(topic => { topicsContainer.push(
                `<br><button id="topic" value=${topic.topicID + "," + topic.link} onclick=pickQuiz(this.value)>${topic.title}</button><br>`);
            });
            questions.innerHTML = topicsContainer.join('');
        }
    }
    req.open("GET", "http://localhost:8081/topics", true);
    req.send();
}
function pickQuiz(topicAttributes){
    var attributes = topicAttributes.split(",");
    theTopic = attributes[0]; // set the global topic to the selected topic
    theLink = attributes[1];
    var quizzes = [];
    quizContainer = [];
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState === 4 && req.status === 200){
            quizzes = JSON.parse(JSON.parse(req.responseText));
            quizContainer.push(`<br> And what quiz would you like to answer? <br>`);
            quizzes.topic.quizzes.forEach(quiz => {quizContainer.push(
                `<br><button id="quiz" value="${quiz}" onclick=showQuiz(this.value)>${quiz}</button><br>`)
            });
            quizContainer.push(`<br> <button id="back" onclick=pickTopic()>Back</button>`);
            questions.innerHTML = quizContainer.join('');
        }
    }
    req.open("GET", "http://localhost:8081/topic?topic_id="+theTopic, true);
    req.send();
}

// show the questions
function showQuiz(quiz_name){
    theQuiz = quiz_name;
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState === 4 && req.status === 200){
            myQuestions = JSON.parse(JSON.parse(req.responseText));
            makeQuiz();
  
        }
    }
    req.open("GET", `http://localhost:8081/quiz?topic_id=${theTopic}&title=${theQuiz}`);
    req.send();
}

function goToSite(){
    window.location.href = `http://localhost:8081/${theLink}`;
}


function profileScreen()
{
    questions.innerHTML = "";
    result.innerHTML = "";
    req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState === 4){
            if(req.status === 200)
            {
                account.innerHTML = `<u>Report page: ${username}</u><br>`;
                let profile = JSON.parse(JSON.parse(req.responseText));
                account.innerHTML += `total questions : ${profile.total_questions}<br>`
                account.innerHTML += `total correct answers : ${profile.total_correct_answers}<br>`
                if(profile.total_questions == 0)
                {
                    account.innerHTML += "<b>overall success rate: 100%</b><br><br>"
                }else
                {
                    account.innerHTML += `<b>overall success rate : ${(parseFloat(profile.total_correct_answers)/parseFloat(profile.total_questions)*100).toFixed(2)}%</b><br><br>`
                }
                account.innerHTML += `session total questions : ${profile.session_total_questions}<br>`
                account.innerHTML += `session correct answer : ${profile.session_correct_answers}<br>` 
                if(profile.session_total_questions == 0)
                {
                    account.innerHTML += "<b>session success rate: 100%</b><br>"
                }else
                {
                    account.innerHTML += `<b>session success rate : ${(parseFloat(profile.session_correct_answers)/parseFloat(profile.session_total_questions)*100).toFixed(2)}%</b><br>`
                }
                account.innerHTML += `<br> <button id="back" onclick=initialStateWithLogIn()>Back</button>`
            }else
            {
                console.log("FAILED GETTING PROFILE");
            }
        }
    }
    req.open("GET", "http://localhost:8081/profile", true);
    req.send();
}

function login()
{
    username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState === 4){
            if(req.status === 200)
            {
                // CODE ALS LOGIN GESLAAGD IS
                registeredUser = true;
                initialStateWithLogIn();
            }else
            {
                // CODE ALS LOGIN GEFAALD IS
                result.innerHTML = "<br> <b> Wrong username or password </b>"
            }
        }
    }
    req.open("POST", "http://localhost:8081/login", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(`username=${username}&password=${password}`);
}

function register()
{
    username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState === 4){
            if(req.status === 200)
            {
                // CODE ALS REGISTREREN GESLAAGD IS
                registeredUser = true; 
                initialStateWithLogIn();
            }else if(req.status === 400)
            {
                result.innerHTML = "<br> <b>Invalid username or password. Try Again!</b>"
            }else
            {
                result.innerHTML = "<br> <b>Username already exist. Try Again!</b>"
            }
        }
    }
    req.open("POST", "http://localhost:8081/register", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(`username=${username}&password=${password}`);
}

function logout()
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState === 4){
            if(req.status === 200)
            {
                // LogOut succeeded
                registeredUser = false;
                initialState();
            }
        }
    }
    req.open("POST", "http://localhost:8081/logout", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(`username=${username}`);
}

//var
const account = document.getElementById('account');
const questions = document.getElementById('question');
const result = document.getElementById('output');

var theTopic = undefined;
var theLink = undefined;
var theQuiz = undefined;
//old: var jsonQuestions = '[{ "title":"Release", "question":"When was the first actual realease of Google Chrome", "answers": {"a":"September 2, 2008", "b":"21st night of september", "c":"December 11, 2008"}, "correctAnswer":"a","choice":"true"}]';

var registeredUser = false; 
var username = undefined;
    // placeholder, only registered can answer questions.
    // placeholder for the json input, 
    // 8080/quiz?topic_id=int&title="Title"

var myQuestions;//old: = JSON.parse(jsonQuestions);
    // should be parsing the string asked from the DB with all (and only) the questions that should be shown
    // otherwise the checking system won't work

initialState(); // begin the quiz