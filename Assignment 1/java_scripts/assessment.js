//create the questions
function makeQuiz(){
    const output = [];
    myQuestions.forEach((currentQuestion, questionNumber) => {
    const possAnswers = [];
    if(currentQuestion.choice){
        for(a in currentQuestion.answers){
            possAnswers.push( 
                    `<label>
                    <input type="radio" name="question${questionNumber}" value="${a}"/>
                    ${a}: ${currentQuestion.answers[a]} <br>
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
        output.push(
            `<br>
            <div class="title"> Question ${questionNumber + 1}: ${currentQuestion.title}</div>
            <br>
            <div class="question"> ${currentQuestion.question}</div>
            <br>
            <div class="answers"> ${possAnswers.join('')}</div>
            <br>
            <button id="submit" onclick=showAnswer()>Submit</button>
            <br><br>
            <button id="back" onclick=pickTopic()>Back</button> <br>`
        );
    })
    questions.innerHTML = output.join('');
}

// check the answers
function showAnswer(){
    if(registeredUser){
        const answers = questions.querySelectorAll('.answers')
        var corrAnswers = 0;
        myQuestions.forEach((currentQuestion, questionNumber) => {
            var givenAnswer;
            const answerNumber = answers[questionNumber];
            if (currentQuestion.choice) {
                const choiceSelector =  `input[name=question${questionNumber}]:checked`;
                givenAnswer = (answerNumber.querySelector(choiceSelector) || {}).value;
            }
            else {
                givenAnswer = (document.getElementById(`openQuestion${questionNumber}`) || {}).value;
            }
    
            if(givenAnswer == currentQuestion.correctAnswer){
                corrAnswers++;
                answers[questionNumber].style.color = 'green';
            }
            else{ answers[questionNumber].style.color = 'red'; answers.innerHTML += `The correct answer was ${currentQuestion.correctAnswer}.`}
        });
        result.innerHTML = `<br> You got ${corrAnswers} questions correct!`
        if (corrAnswers != myQuestions.length){
            result.innerHTML += `<br><br>
            <button id="info" onClick=goToSite()>If you want to learn more about this topic click here</button>`;
        }
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
    var topics;
    topicsContainer = [];
    req.onreadystatechange = function(){
        if (req.readyState === 4 && req.status === 200){
            topics = JSON.parse(JSON.parse(req.responseText));
            topicsContainer.push(`<br> What topic would you like to answer questions about? <br>`);
            topics.topics.forEach(topic => { topicsContainer.push(
                `<br><button id="topic" value=${topic.topicID} onclick=pickQuiz(this.value)>${topic.title}</button><br>`);
            });
            questions.innerHTML = topicsContainer.join('');
        }
    }
    req.open("GET", "http://localhost:8081/topics", true);
    req.send();
}
function pickQuiz(topicID){
    theTopic = topicID; // set the global topic to the selected topic
    var quizzes = [];
    quizContainer = [];
    req.onreadystatechange = function(){
        if (req.readyState === 4 && req.status === 200){
            quizzes = JSON.parse(JSON.parse(req.responseText));
            quizContainer.push(`<br> And what quiz would you like to answer? <br>`);
            quizzes.quizzes.forEach(quiz => { quizContainer.push(
                `<br><button id="quiz" value="${quiz.quizID}" onclick=showQuiz(this.value)>${quiz}</button><br>`)
            });
            quizContainer.push(`<br> <button id="back" onclick=pickTopic()>Back</button>`);
            questions.innerHTML = quizContainer.join('');
        }
    }
    req.open("GET", "http://localhost:8081/topic?topic_id="+topicID, true);
    req.send();
}

// show the questions
function showQuiz(quizID){
    theQuiz = quizID;
    req.onreadystatechange = function(){
        if (req.readyState === 4 && req.status === 200){
            myQuestions = JSON.parse(JSON.parse(req.responseText));
        }
    }
    req.open("GET", `http://localhost:8081/quiz?topic_id=${theTopic}&title=${theQuiz}`);
    req.send();
    makeQuiz();
}

function goToSite(){
    if (theTopic == "Web Browsers"){window.location.href = "index.html"};
    if (theTopic == "Safari"){window.location.href = "safari.html"};
    if (theTopic == "Google Chrome"){window.location.href = "google_chrome.html"};
}

//var
const questions = document.getElementById('question');
const result = document.getElementById('output');

var req = new XMLHttpRequest(); // site should support latest browsers, no need to add ifelse for older XML sessions

var theTopic = undefined;
var theQuiz = undefined;
//old: var jsonQuestions = '[{ "title":"Release", "question":"When was the first actual realease of Google Chrome", "answers": {"a":"September 2, 2008", "b":"21st night of september", "c":"December 11, 2008"}, "correctAnswer":"a","choice":"true"}]';

var registeredUser = true; 
    // placeholder, only registered can answer questions.
    // placeholder for the json input, 
    // 8080/quiz?topic_id=int&title="Title"

var myQuestions;//old: = JSON.parse(jsonQuestions);
    // should be parsing the string asked from the DB with all (and only) the questions that should be shown
    // otherwise the checking system won't work

pickTopic();    // begin the quiz