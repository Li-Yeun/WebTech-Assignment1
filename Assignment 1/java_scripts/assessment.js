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

function test(test){alert(test)}

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
            else{ answers[questionNumber].style.color = 'red';}
        });
        result.innerHTML = `<br> You got ${corrAnswers} questions correct!`;
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
    topics = ["Web Browsers", "Safari", "Google Chrome"];
    topicsContainer = [];
    topicsContainer.push(`<br> What topic would you like to answer questions about? <br>`);
    topics.forEach(topic => { topicsContainer.push(`<br><button id="topic" value="${topic}" onclick=pickQuiz(this.value)>${topic}</button><br>`);});
    questions.innerHTML = topicsContainer.join('');
}
function pickQuiz(topic){
    quizzes = [];
    if(topic == "Web Browsers"){quizzes = ["History", "Functionality"]};
    if(topic == "Safari"){quizzes = ["Apple", "Benefits & drawbacks"]};
    if(topic == "Google Chrome"){quizzes = ["Features"]};
    // feels like spaghetti
    quizContainer = [];
    quizContainer.push(`<br> And what quiz would you like to answer? <br>`);
    quizzes.forEach(quiz => { quizContainer.push(`<br><button id="quiz" value="${quiz}" onclick=showQuiz(this.value)>${quiz}</button><br>`)});
    quizContainer.push(`<br> <button id="back" onclick=pickTopic()>Back</button> <br>`);
    questions.innerHTML = quizContainer.join('');
}

// show the questions
function showQuiz(quiz){
    const thecorrectquestions = myQuestions;  // should be retrieved from DB using quiz
    makeQuiz(thecorrectquestions);
}

//var
const questions = document.getElementById('question');
const submit = document.getElementById('submit');
const result = document.getElementById('output');
var registeredUser = false; 
    // placeholder, only registered can answer questions.
const jsonQuestions = '[{ "title":"Release", "question":"When was the first actual realease of Google Chrome", "answers": {"a":"September 2, 2008", "b":"21st night of september", "c":"December 11, 2008"}, "correctAnswer":"a","choice":"true"}]';
    // placeholder for the json input
    // N.B. assignment 3 needs titles for questions, this has already been implemented in showing the question.
var myQuestions = JSON.parse(jsonQuestions);
    // should be parsing the string asked from the DB with all (and only) the questions that should be shown
    // otherwise the checking system won't work

pickTopic();    // begin the quiz