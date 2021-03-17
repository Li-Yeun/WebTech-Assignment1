//show questions
function makeQuiz(){
    const output = [];
    theQuestions.forEach((currentQuestion, questionNumber) => {
        const possAnswers = [];
        if(currentQuestion.choice)
        {
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
                <input type="text" name="question${questionNumber}" id="openQuestion" placeholder="put your answer here:"/>
                </label>`
            );
        }
        output.push(
            `<div class="question"> ${currentQuestion.question}</div>
            <div class="answers"> ${possAnswers.join('')}</div><br>`
        );
    })
    questions.innerHTML = output.join('');
}

//button
function showAnswer(){
    const answers = questions.querySelectorAll('.answers')
    var corrAnswers = 0;
    theQuestions.forEach((currentQuestion, questionNumber) => {
        var givenAnswer;
        const answerNumber = answers[questionNumber];
        if (currentQuestion.choice) {
            const choiceSelector =  `input[name=question${questionNumber}]:checked`;
            givenAnswer = (answerNumber.querySelector(choiceSelector) || {}).value;
        }
        else {
            givenAnswer = (document.getElementById('openQuestion') || {}).value;
        }

        if(givenAnswer == currentQuestion.correctAnswer){corrAnswers++;}
    });
    result.innerHTML = `<br>You got ${corrAnswers} questions correct!`;
}

//var
const questions = document.getElementById('question');
const submit = document.getElementById('submit');
const result = document.getElementById('output');
const theQuestions = [
    { question:"When was the first actual realease of Google Chrome", 
    answers: {a:"September 2, 2008", b:"21st night of september", c:"December 11, 2008"}, 
    correctAnswer:"a",
    choice:true},
    { question:"What was Microsoft Edge's code-name?",
    answers:{a:"Hercules", b:"Chromium", c: "Spartan", d:"Ajax"},
    correctAnswer:"c",
    choice:true},
    { question:"What browser is made for apple devices?",
    correctAnswer:"Safari",
    answers: undefined,     // so that .answers gives the same amount as length of theQuestions
    choice:false},
    {question:"What is the main villain of an online platforming game?",
    answers: undefined,
    correctAnswer:"Browser",
    choice:false},
    {question:"Who developed Safari?",
    answers: {a:"Apple", b:"Steve Jobs", c:"Microsoft", d:"Nvidia"},
    correctAnswer:"a",
    choice:true}
]

makeQuiz();
submit.addEventListener('click', showAnswer);