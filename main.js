// Select Elements 
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let SubmitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function fetQuestions() {
    let myRequest = new XMLHttpRequest();

myRequest.onreadystatechange = function () {
    if(this.readyState === 4 && this.status === 200) {
        let questionsObject = JSON.parse(this.responseText);
        let qCount = questionsObject.length;
        
        // Create Bullets + Set Questions Count
        createBullets(qCount);

        // Add Question Data
        addQuestionData(questionsObject[currentIndex], qCount);

        // Start CountDown
        countdown(180, qCount);

        // Click On Submit
        SubmitButton.onclick = () => {
            let theRightAnswer = questionsObject[currentIndex].right_answer;
            if (currentIndex < qCount) {
                currentIndex++;
            }

            checkAnswer(theRightAnswer, qCount);

            quizArea.innerHTML = "";
            answersArea.innerHTML = "";

            addQuestionData(questionsObject[currentIndex], qCount);

            // Handle Bullets Class
            handleBullets();

            // Start CountDown
            clearInterval(countdownInterval);
        countdown(180, qCount);

            // Show Results
            showResults(qCount);
        }
        
    }
}

    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}
fetQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;
    
    // Create Spans
    for(let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");

        if (i === 0) {
            theBullet.className = "on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {

        // Create H2 Question Title
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj.title);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);

        // Create The Answers
        for (let i =1; i<= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            
            // Create Radio Input
            let radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "question";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // Create Label
            let theLabel = document.createElement("label");
            theLabel.htmlFor = `answer_${i}`;

            //Create Label Text 
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
            theLabel.appendChild(theLabelText);

            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            answersArea.appendChild(mainDiv);
        }
}
}
function checkAnswer(rAnswer, count) {

    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (i = 0; i <answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans =Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {

        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        SubmitButton.remove();
        bullets.remove();

        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class= "good">Good</span>, ${rightAnswers} From ${count} Is Good`;
        } else if (rightAnswers === count) {
            theResults = `<span class= "perfect">Perfect</span>, All Answer Is Right`;
        } else {
            theResults = `<span class= "bad">Bad</span>, ${rightAnswers} From ${count} Is Good`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "wihte";
        resultsContainer.style.marginTop = "10px";
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`

            if (--duration < 0 ) {
                clearInterval(countdownInterval);
                SubmitButton.click();
            }
        }, 1000);
    }
}