//show questions
function makeQuiz(){
    const output = [];
    theQuestions.forEach((currentQuestion, questionNumber) => {
        const possAnswers = [];
        if(currentQuestion.choice)
        {
            for(l in currentQuestion.answers){
                possAnswers.push( 
                    `<label>
                    <input type="radio" name="question${questionNumber}" value="${l}"/>
                    ${l}: ${currentQuestion.answers[l]} <br>
                    </label>`
                );
            }
        }
        else
        {
            possAnswers.push(`<input type="text" name="question${questionNumber}" placeholder="put your answer here:"/>`)
        }
        output.push(
            `<div class="question"> ${currentQuestion.question}</div>
            <div class="answers"> ${possAnswers.join('')}</div>`
        );
    })
    questions.innerHTML = output.join('');
}

//button
function showAnswer(){
    const answers = questions.querySelectorAll('.answers')
    let corrAnswers = 0;
    theQuestions.forEach((currentQuestion, questionNumber) => {
        const answerNumber = answers[questionNumber];
        const selector =  `input[name=question${questionNumber}]:checked`;
        const givenAnswer = (answerNumber.querySelector(selector) || {}).value;

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
    choice:false}
]

makeQuiz();
submit.addEventListener('click', showAnswer);