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
            //const openSelector = `div.answers.input[name=question${questionNumber}][type="text"]`;
            //givenAnswer = (document.querySelector(openSelector) || {}).value;
            givenAnswer = (document.getElementById('openQuestion') || {}).value;
        }

        if(givenAnswer == currentQuestion.correctAnswer){corrAnswers++;}
    });
    result.innerHTML = `You got ${corrAnswers} questions correct!`;
}

//var
const questions = document.getElementById('question');
const submit = document.getElementById('submit');
const result = document.getElementById('output');
const theQuestions = [
    { question:"Finish the lyrics: \"I want...\"", 
    answers: {a:"to break free", b:"it all", c:"to ride my bicycle", d:"to make a supersonic man out of you"}, 
    correctAnswer:"a",
    choice:true},
    { question:"What is the name of the football club located in Breda?",
    answers:{a:"NAC", b:"Noad Advendo Combinatie", c: "Nooit Opgeven Altijd Doorzetten Aangenaam Door Vermaak En Nuttig Door Ontspanning Combinatie", d:"Ajax"},
    correctAnswer:"c",
    choice:true},
    { question:"What browser is made for apple devices?",
    correctAnswer:"Safari",
    answers: undefined,
    choice:false}
]

makeQuiz();
submit.addEventListener('click', showAnswer);