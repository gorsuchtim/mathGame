$(document).ready(function () {
    /*---------------------
    Gameplay variables
    -----------------------*/
    var introRing = 1;
    var world = 0;
    var level = 0;
    var difficulty;
    var rightAnswers = 0;
    var forNewRing = 0;
    var reqRings;
    var ringsInRound = 0;
    var totalPoints = 0;
    var highScore = 0;
    var choice;
    var range;
    var answer;
    var timer = 0;
    var rings = 2;
    var chances = 0;
    var demo = false;

    /*------------------
    Utility functions
    ------------------*/
    function resetContainer(container, location, speed) {
        setTimeout(function () {
            $(container).addClass(location); // reset levelDifficulty to offScreenTop
        }, speed);
    }

    function sequenceFade(element, style, speed, directive) {
        if (directive === 'add') {
            $(element).each(function (i) {
                setTimeout(function () {
                    $(element).eq(i).addClass(style);
                }, speed * (i + 1));
            });
        } else if (directive === 'remove') {
            $(element).each(function (i) {
                setTimeout(function () {
                    $(element).eq(i).removeClass(style);
                }, speed * (i + 1));
            });
        } else {
            return false;
        }
    }

    /*---------------------------
    Initial game load animation
    -----------------------------*/
    introRingLoad();

    function introRingLoad() {
        sequenceFade('.introRing', 'showing', 100, 'add');
        sequenceFade('.introRing', 'introRingGreenBorder', 150, 'add');
        setTimeout(function () {
            sequenceFade('.introRing', 'showing', 100, 'remove');
            sequenceFade('.introRing:not(.introRing1)', 'introRingGreenBorder', 150, 'remove');
        }, 1200);
    }
    $('.introRingContainer').click(function () {
        $('.welcomeIntro').addClass('offScreenRight');
        $('.addSubtract').removeClass('offScreenLeft'); // show 1st option-sequence screen
    });

    $('.welcomeInfo').click(function () { // clicking infoIcon brings down information screen about the game
        $('.learnMore').removeClass('offScreenTop');
    });

    $('#backToTitle').click(function () { // send the info screen back up, off screen
        $('.learnMore').addClass('offScreenTop');
    });

    /*--------------------------------
    Option sequence screen behavior
    ---------------------------------------*/

    $('.choiceBox').click(function (e) {
        var target = e.currentTarget;
        userChoice = $('.mathSelected'); // define selected choice
        if ($(this).siblings().hasClass('mathSelected') === false) { // on clicking choices, add selected class if no options are currently selected
            choice = this.id;
            setOperatorText(); // define selected game play operator 
            $(this).toggleClass('mathSelected');
            if ($('.choiceBox').hasClass('mathSelected')) { // if an operator has been selected
                setTimeout(function () { // slide in the next container/pre-game option set of range
                    $('.welcomeInfo').fadeOut();
                    $('.mathRange').removeClass('offScreenRight'); // show next sequence screen (mathrange)
                }, 300);
                resetContainer('.addSubtract', 'offScreenLeft', 2000); // reset addSubtract screen position for next game load
                $('.welcomeInfo').fadeOut();
            }
        }
    });

    $('.rangeBox').click(function () {
        if ($(this).siblings().hasClass('mathSelected') === false) { // on clicking a range, add selected class if no options are currently selected
            $(this).toggleClass('mathSelected');
            range = this.id; // define selected range
            if ($('.rangeBox').hasClass('mathSelected')) {
                randomizeFirstNum(); // randomize the first game board number based on user's range choice
                randomizeSecondNum(); // randomize the second gameboard number based on user's range choice
                getCorrectAnswer(); // get the correct answer (sum/difference/product) of the two numbers
                setTimeout(function () { // slide in the next container/pre-game option set of choosing difficulty
                    $('.levelDifficulty').removeClass('offScreenTop'); // show next sequence screen (levelDifficulty)
                }, 300);
                resetContainer('.mathRange', 'offScreenRight', 2000); // reset mathRange screen position for next game load
            }
        }
    });

    $('.difficultyChoice').click(function () {
        if ($(this).siblings().hasClass('mathSelected') === false) { // on clicking a difficulty, add selected class if no options are currently selected
            $(this).toggleClass('mathSelected');
            if ($('.difficultyChoice').hasClass('mathSelected')) {
                difficulty = this.id; // define selected difficulty    
                loadWorldWelcome(); // load world welcome screen
                resetContainer('.levelDifficulty', 'offScreenTop', 2000); // reset levelDifficulty screen position for next game load
            }
        }
    });

    /*-------------------------------
    World intro behavior
    ------------------------------*/

    function loadWorldWelcome() {
        checkDynamicCSS();
        setWorldLevelNumber();
        setChances();
        setTimer();
        setWorldRingRequirements();
        setLevelRingRequirements();

        setTimeout(function () {
            $('.worldIntroNumber').text(world); // dynamically populate world number
            $('.worldIntroContainer').attr('id', 'world' + (world) + 'Intro'); // dynamically set id using upcoming world number to set correct background color
            $('.worldIntroContainer').removeClass('offScreenRight'); // show worldIntroContainer
        }, 800);
        setTimeout(function () { // after sliding in the welcome screen            
            sequenceFade('.worldWelcome', 'showing', 50, 'add'); // fade in and flip "Welcome to World X"
            sequenceFade('.worldWelcome', 'flippedText', 50, 'remove'); // flipping all letters takes 1.5s (100ms x 15 chars)           
        }, 1500);
        setTimeout(function () {
            $('.dynamicWorldNumber').text(forNewRing); // populate content for level load screen            
            sequenceFade('.worldReqSpans', 'showing', 150, 'add'); // flipping all letters takes 1.5s (100ms x 15 chars)
            sequenceFade('.worldReqSpans', 'flippedText', 150, 'remove'); // flipping all letters takes 1.5s (100ms x 15 chars)
        }, 2500);
        setTimeout(function () {
            sequenceFade('.worldWelcome', 'showing', 50, 'remove'); // fade in and flip "Welcome to World X"
            sequenceFade('.worldWelcome', 'flippedText', 50, 'add'); // flipping all letters takes 1.5s (100ms x 15 chars) 
            sequenceFade('.worldReqSpans', 'showing', 225, 'remove'); // flipping all letters takes 1.5s (100ms x 15 chars)
            sequenceFade('.worldReqSpans', 'flippedText', 225, 'add'); // flipping all letters takes 1.5s (100ms x 15 chars)
            $('.worldIntroContainer').fadeTo(1500, 0);
        }, 5000);
        setTimeout(function () {
            loadMathGameContainer(); // load mathGameContainer early, with no mathGameContent before worldintro fades out so world intro fades out to a plain white screen
        }, 6500);
        setTimeout(function () {
            $('.worldIntroContainer').addClass('offScreenRight').fadeTo(0.5, 1);
        }, 10000);
    }

    function loadMathGameContainer() {
        $('.mathGameContainer').removeClass('offScreen');
        $('.ringContainer').removeClass('offScreen');
        showReqRings();
    }

    /*---------------------------
    Dynamic pre-game ring display functions
    ----------------------------------*/

    function showReqRings() {
        switch (level) {
            case 1:
                $('.ringContainer').append('<div class="ring ring6"></div>');
                $('.ring6').fadeTo(250, 1).addClass('dynamicBorderColor');
                break;
            case 2:
                $('.ringContainer').append('<div class="ring ring8"></div>');
                $('.ring8').fadeTo(250, 1).addClass('dynamicBorderColor');
                break;
            case 3:
                $('.ringContainer').append('<div class="ring ring11"></div>');
                $('.ring11').fadeTo(250, 1).addClass('dynamicBorderColor');
                break;
        }
        setTimeout(function () {
            $('.mathGameBoard').removeClass('offScreen').fadeTo(800, 1);
            timedCount();
        }, 2500);
    }

    function checkDynamicCSS() {
        if (!demo) { //DO NOT LOAD dynamic css if var demo === true.  Demo mode uses only world 1 and it is pre-loaded with styles.css
            var cssHref = 'css/world' + (world + 1) + '.css';
            $('#dynamicCSS').attr('href', cssHref); // load the css for the next world's dynamicText colors, etc   
        } else {
            return false;
        }
    }

    function setWorldLevelNumber() {
        if (world < 5) { // on load of new level or game if world is 1-1 through 1-4
            if (level === 4 || world === 0) { // and if level is 4 on new load OR if it is a new game and world still = 0
                world++; // then advance a world (ex: after world 1-4, user goes to world 2-1)
            }
        }
        if (level < 4) { // if level is 1, 2, or 3
            level++; // then advance one level            
        } else if (level === 4) { // if level is 4 though, then         
            level = 1; // when that level has ended, reset var level to 1 because user is advancing to first stage of next world (world X-1)
        }
    }

    function setChances() { //use var difficulty to determine chances user has to answer incorrectly before game over
        if (level < 4) {
            switch (difficulty) {
                case 'beginner':
                    chances = 7;
                    break;
                case 'novice':
                    chances = 5;
                    break;
                case 'expert':
                    chances = 3;
                    break;
            }
        } else if (level === 4) {
            chances = 1;
        }
        $('#userChances').text('R: ' + chances); // set text for userChances      
    }

    function setTimer() { //use var difficulty to determine time user has to earn the necessary rings to advance each level
        if (level < 4) {
            switch (difficulty) { // for levels 1, 2, 3 use difficulty to determine time
                case 'beginner':
                    timer = 30;
                    break;
                case 'novice':
                    timer = 25;
                    break;
                case 'expert':
                    timer = 20;
                    break;
            }
        } else if (level === 4) { // level 4 is a bonus round to earn up to 10 rings in 10 seconds regardless of difficulty
            timer = 10;
        }
    }

    function setWorldRingRequirements() { // define how many questions must be answered correctly to earn a new ring
        switch (world) {
            case 1:
                forNewRing = 1; // in world 1 user needs to answer 1 question to earn 1 ring
                break;
            case 2:
                forNewRing = 2; // in world 2 user needs to answer 2 questions to earn 1 ring
                break;
            case 3:
                forNewRing = 3; // in world 3 user needs to answer 3 questions to earn 1 ring
                break;
            case 4:
                forNewRing = 4; // in world 4 user needs to answer 4 questions to earn 1 ring
                break;
            case 5:
                forNewRing = 5; // in world 4 user needs to answer 4 questions to earn 1 ring
                break;
            case 6:
                forNewRing = 6; // in world 4 user needs to answer 4 questions to earn 1 ring
                break;
        }
        $('#answersNeeded').text(forNewRing);
    }

    function setLevelRingRequirements() { // define how many rings are required to advance to the next level
        switch (level) {
            case 1:
                reqRings = 5; // in level 1 user must earn 5 rings
                break;
            case 2:
                reqRings = 7; // in level 2 user must earn 7 rings
                break;
            case 3:
                reqRings = 10; // in level 3 user must earn 10 rings
                break;
            case 4:
                reqRings = 1; // level 4 is a bonus level, user needs to earn at least 1 ring and can earn up to 10
                break;
        }
    }

    /*----------------------------
    Timer functions and variables
    -----------------------------*/
    var t;
    var timer_is_on = 0;

    function timedCount() {
        document.getElementById("timer").innerHTML = timer;
        timer--;
        t = setTimeout(function () {
            timedCount()
        }, 1000);

        if (timer < 0) { // if timer hits 0
            if (level < 4) { // if level is < 4 (not bonus level)
                stopCount(); // stop the timer
                gameOver(); // run game over
            } else { // else if in the bonus round, running out of time does not end the game
                stopCount(); // stop the timer
                addUpPoints(); // addUpPoints to advance
            }
        }
    }

    function startCount() { // start timer
        if (!timer_is_on) {
            timer_is_on = 1;
            timedCount();
        }
    }

    function stopCount() { // stop timer              
        clearTimeout(t);
        timer = 5;
        timer_is_on = 0;
    }

    /*-------------------------
    Populate game board functions
    --------------------------------*/
    function setOperatorText() {
        if (choice === 'add') {
            $('#operator').text('+');
        } else if (choice === 'subtract') {
            $('#operator').text('-');
        } else if (choice === 'multiply') {
            $('#operator').text('*');
        } else {
            return false;
        }
    }

    function randomizeFirstNum() { // use user range selection to randomize first number on game board within that arnge
        if (range === 'to10') {
            range = 10;
        } else if (range === 'to20') {
            range = 20;
        } else if (range === 'to100') {
            range = 100;
        }
        $('#firstNumber').text(Math.floor(Math.random() * (range - 1 + 1)) + 1);
    }

    function randomizeSecondNum() { // set second number as random number from 1-10
        var secondNumber = parseInt(Math.floor(Math.random() * (10 - 1 + 1)) + 1);
        $('#secondNumber').text(secondNumber);
    }

    function getCorrectAnswer() { // determine the actual correct answer between the first and second number
        var firstNum = parseInt($('#firstNumber').text()), // set firstNumber text to integer
            secondNum = parseInt($('#secondNumber').text()), // set secondNumber text to integer
            operator = $('#operator').text(); // determine mathmatical operator

        if (operator === "+") { // if operator is +, then add the two numbers for the correct answer
            answer = firstNum + secondNum;
        } else if (operator === '-') { // if operator is -, then subract the two numbers for the correct answer
            answer = firstNum - secondNum;
        } else if (operator === '*') { // if operator is *, then multiple the two numbers for the correct answer
            answer = firstNum * secondNum;
        }
        createChoicesArray(answer);
    }

    function createChoicesArray(answer) { // create choices for user: two randomly chosen incorrect answers and the correct answer provided via getCorrectAnswer()
        var randomPlus = answer + (Math.floor(Math.random() * (5 - 1 + 1)) + 1), // set an incorrect choice that is HIGHER than the correct answer
            randomMinus = answer - (Math.floor(Math.random() * (5 - 1 + 1)) + 1), // set an incorrect choice that is LOWER than the correct answer
            multiChoiceArray = [answer, randomPlus, randomMinus]; // push all 3 values to an array
        shuffleChoicesArray(multiChoiceArray, answer);
    }

    function shuffleChoicesArray(array, answer) { // shuffle the array of choices (2 incorrect, 1 correct) by randomizing the array element/index order        
        for (var i = array.length - 1; i > 0; i--) { // Durstenfeld shuffle algorithm found via http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array     
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        setupChoices(array, answer);
    }

    function setupChoices(array, answer) { // iterate over the .choices elements AND the shuffled array.  
        var choices = $('.choices'); // set the content of the .choice element[i] equal to the value of array element[j]
        for (var i = 0, j = 0; i < choices.length, j < array.length; i++ , j++) {
            $(choices[i]).text(array[j]);
        }
    }

    /*-------------------------------
    Gameplay & interaction functions
    ----------------------------------*/
    $('.choices').click(function () { // on clicking a choice
        var userChoice = parseInt($(this).text()), // convert the user choice to an integer
            elementChoice = $(this)[0];

        if (userChoice === answer) { // if user's choice was correct                    
            rightAnswers++; // increase rightAnswers
            totalPoints++; // increase totalPoints            
            $('#userPoints').text('P: ' + totalPoints); // set totalPoints element to new value of totalPoints

            if (highScore < totalPoints) { // if highScore is now < totalPoints
                highScore = totalPoints; // set highScore equal to totalPoints
                $('#highScore').text('High: ' + highScore).addClass('pulse'); // set highScore element to new value of highScore and addClass pulse
            }
            checkPoints(); // check to see if rightAnswers value is high enough to earn a new ring
            $(this).addClass('success'); // addClass success (add's success checkmark to correct-choice element on screen)
            $('#highScore').removeClass('pulse'); // remove pulse class so element does not have multiple pulse classes 
            loadNextProblemRightAnswer(); // prepare to load next problem 
        } else { // if the user's choice is incorrect
            wrongAnswer(elementChoice); // run wrongAnswer
        }
    });

    function checkPoints() { // determines if rightAnswers is high enough to earn a new ring based on var forNewRing value (forNewRing value determined by World)
        $('#rightAnswers').text(rightAnswers); // set the rightAnswers element text equal to rightAnswers so user can keep track of how close to a new ring
        if (rightAnswers === forNewRing) { // if rightAnswers is high enough forNewRing
            resetRightAnswers(); // reset rightAnswers to 0 
        }
    }

    function resetRightAnswers() { // reset rightAnswers element content to 0
        rightAnswers = 0;
        setTimeout(function () {
            $('#rightAnswers').text(rightAnswers);
        }, 750);
        showNextRing(); // run function to display the next ring in line
    }

    function loadNextProblemRightAnswer() {
        $('.choices').removeClass('tryAgain success'); // when user answers correctly remove all classes from the .choices elements (wrong answer x and right answer checkmark)
        randomizeFirstNum(range); // retrieve new first number for next problem
        randomizeSecondNum(); // retrieve new second number for next problem
        getCorrectAnswer(); // get the correct answer for the loaded problem
    }

    function wrongAnswer(answer) {
        $(answer).addClass('tryAgain'); // add tryAgain class (wrong answer x)
        chances--; // decrement chances by 1
        $('#userChances').text('R: ' + chances); // update chances element text to reflect to value

        if (chances === 0) { // if timer hits 0
            stopCount(); // stop the timer
            if (level < 4) { // if level is < 4 (not bonus level)
                gameOver(); // run game over
            } else { // else if in the bonus round, running out of time does not end the game
                addUpPoints(); // addUpPoints to advance
            }
        }
    }

    function showNextRing() {
        ringsInRound++; // increase count of ringsInRound by 1        
        if (rings === 12) {
            return false;
        } else {
            $('.ring' + rings + '').fadeTo(300, 1).addClass('showing');
            rings++;
        }
        checkRingsInRound();
    }

    function checkRingsInRound() { // use var level value to determine if ringsInRound has increased enough to progress to next level
        switch (level) {
            case 1:
                if (ringsInRound === 1) {
                    $('.gameContentWrap, #timer').fadeOut();
                    $('.ring1').addClass('spinSlow dynamicBorderColor');
                    $('.ring6').addClass('spinMed dynamicBorderColor');
                    sequenceFade('.ring', 'dynamicBorderColor', 300, 'add');
                    stopCount();
                    addUpPoints();
                }
                break;
            case 2:
                if (ringsInRound === 1) {
                    $('.gameContentWrap, #timer').fadeOut();
                    $('.ring1').addClass('spinSlow dynamicBorderColor');
                    $('.ring8').addClass('spinMed dynamicBorderColor');
                    sequenceFade('.ring', 'dynamicBorderColor', 300, 'add');
                    stopCount();
                    addUpPoints();
                }
                break;
            case 3:
                if (ringsInRound === 1) {
                    $('.gameContentWrap, #timer').fadeOut();
                    $('.ring1').addClass('spinSlow dynamicBorderColor');
                    $('.ring11').addClass('spinMed dynamicBorderColor');
                    sequenceFade('.ring', 'dynamicBorderColor', 300, 'add');
                    stopCount();
                    addUpPoints();
                }
                break;
            case 4:
                if (ringsInRound === 10) {
                    $('.gameContentWrap, #timer').fadeOut();
                    $('.ring1').addClass('spinSlow dynamicBorderColor');
                    $('.ring11').addClass('spinMed dynamicBorderColor');
                    sequenceFade('.ring', 'dynamicBorderColor', 200, 'add');
                    stopCount();
                    addUpPoints();
                }
                break;
        }
    }

    function addUpPoints() {
        var timeLeft, chancesLeft, totalTally;
        $('#ringsEarned').text('Rings: ' + ringsInRound);
        timeLeft = parseInt($('#timer').text()); // retrieve the time left on the counter and convert to integer
        $('#timeLeft').text('Time left: ' + timeLeft + 's');
        chancesLeft = chances; // retrieve the user chances remaining
        $('#chancesLeft').text('Chances left: ' + chancesLeft);
        totalTally = ringsInRound + timeLeft + chancesLeft;
        $('#totalTally').text('Bonus this round: ' + totalTally);

        if (level === 3) {
            $('#nextLevel').text('Bonus level');
        } else if (level === 4) {
            $('#nextLevel').text('World ' + (world + 1));
        } else {
            $('#nextLevel').text('Go to Level ' + world + '-' + (level + 1));
        }
        showTotalPoints(totalTally);
    }

    function showTotalPoints(totalTally) {
        setTimeout(function () {
            $('.pointsTallyWrap').addClass('displayInline');
            sequenceFade('.tallyText', 'showing', 300, 'add');
        }, 1500);
        setTimeout(function () {
            totalPoints = totalPoints + totalTally;
            $('#userPoints').text('P: ' + totalPoints).addClass('bigPulse');
        }, 4000);
        setTimeout(function () {
            if (highScore < totalPoints) {
                highScore = totalPoints;
                $('#highScore').text('High: ' + highScore).addClass('bigPulse');
            }
        }, 5500);
    }

    $('#nextLevel').click(function () {
        setTimer(); // reset timer    
        $('.pointsTallyWrap').removeClass('displayInline');
        sequenceFade('.tallyText', 'showing', 500, 'remove');
        $('#userPoints, #highScore').removeClass('bigPulse');
        setTimeout(function () {
            $('.gameContentWrap, #timer').fadeIn(); // we need to fade in the game board and content again
        }, 1400);
        prepNextLevel();
    });

    function prepNextLevel() {
        $('.choices').removeClass('tryAgain success'); // remove checks and x's from all choices leftover from last round          
        $('.ring:not(.ring1)').remove(); // remove all appended rings except ring1 (which contains the timer html)
        $('.ring1').removeClass('spinSlow spinMed dynamicBorderColor'); // remove dynamic border color and spin classes from ring1
        rings = 2; // reset rings for showNextRing
        ringsInRound = 0;

        if (level < 4) { // if we aren't currently in level 4             
            setWorldLevelNumber(); // increase the level                        
            setLevelRingRequirements(); // set ring requirements for level we are going to (which has been increased above in setWorldLevelNumber)                        
            showReqRings();
        } else if (level === 4) { // if we ARE in level 4 then we need to load the next world                                   
            $('.mathGameContainer').addClass('offScreen');
            loadWorldWelcome();
        }
    }

    function gameOver() {
        $('.finalHighScore').text('High score: ' + highScore);
        $('.finalScore').text('You scored ' + totalPoints + ' this game');

        setTimeout(function () {
            $('.mathGameContainer').addClass('offScreen');
            $('.gameOverContainer').removeClass('offScreen');
            $('.scoreResults').fadeTo(800, 1);
        }, 1000);
        setTimeout(function () {
            sequenceFade('.gameOverText', 'showing', 200, 'add');
            sequenceFade('.gameOverText', 'flippedText', 200, 'remove');
        }, 1500);

        setTimeout(function () {
            sequenceFade('.gameOverText', 'showing', 100, 'remove');
            sequenceFade('.gameOverText', 'flippedText', 100, 'add');
            $('.scoreResults').fadeTo(800, 0);
        }, 4500);

        setTimeout(function () {
            $('.gameOverContainer').addClass('offScreen');
        }, 6000);

        setTimeout(function () {
            resetVariables();
            resetContainers();
            $('.welcomeInfo').fadeIn();
        }, 7000);

        setTimeout(function () {
            introRingLoad();
        }, 8000);
    }

    function resetContainers() {
        $('.welcomeIntro').removeClass('offScreenRight');
        $('.ringContainer, .mathGameContainer').addClass('offScreen');
        $('#dynamicCSS').attr('href', ''); // reset dynamic CSS to empty  
        $('.highScore').removeClass('pulse');
        $('.choices, .mathCheckbox').removeClass('tryAgain success mathSelected'); // remove checks and x's from all choices leftover from last round          
        $('.ring:not(.ring1)').remove(); // remove all appended rings except ring1 (which contains the timer html)
        $('.ring1').removeClass('spinSlow spinMed dynamicBorderColor'); // remove dynamic border color and spin classes from ring1
        $('.introRing1').removeClass('introRingGreenBorder');
        $('.mathGameBoard').fadeTo(0.5, 0).addClass('offScreen');
        $('#timer').text('');
        rings = 2; // reset rings for showNextRing
        ringsInRound = 0; // reset ringsInRound to 0
    }

    function resetVariables() {
        introRing = 1;
        world = 0;
        level = 0;
        difficulty;
        rightAnswers = 0;
        forNewRing = 0;
        reqRings;
        choice;
        range;
        answer;
        timer = 0;
        totalPoints = 0;
    }
});