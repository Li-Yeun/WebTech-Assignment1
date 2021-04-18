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
        myQuestions.questions.forEach((currentQuestion, questionNumber) => {
            var givenAnswer;
            const answerNumber = answers[questionNumber];
            console.log(answerNumber)
            if (currentQuestion.type == 1) {
                const choiceSelector =  `input[name=question${questionNumber}]:checked`;
                givenAnswer = (answerNumber.querySelector(choiceSelector) || {}).value;
                console.log("DEBUG:")
                console.log(givenAnswer);
                console.log(currentQuestion.answer);
            }
            else {
                givenAnswer = (document.getElementById(`openQuestion${questionNumber}`) || {}).value;
            }
            
            if(givenAnswer == currentQuestion.answer){
                corrAnswers++;
                answers[questionNumber].style.color = 'green';
            }
            else{ answers[questionNumber].style.color = 'red'; answers.innerHTML += `The correct answer was ${currentQuestion.answer}.`}
        });
        result.innerHTML = `<br> You got ${corrAnswers} questions correct!`
        if (corrAnswers != myQuestions.questions.length){
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
    console.log(topicAttributes);
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
    console.log(quiz_name);
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState === 4 && req.status === 200){
            myQuestions = JSON.parse(JSON.parse(req.responseText));
            console.log(myQuestions)
            makeQuiz();
  
        }
    }
    req.open("GET", `http://localhost:8081/quiz?topic_id=${theTopic}&title=${theQuiz}`);
    req.send();
}

function goToSite(){
    window.location.href = `http://localhost:8081/${theLink}`;
}

//var
const questions = document.getElementById('question');
const result = document.getElementById('output');

var theTopic = undefined;
var theLink = undefined;
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