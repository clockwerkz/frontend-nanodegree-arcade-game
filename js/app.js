/*******************************************************************************
 *   
 * UDACITY FRONT END DEVELOPER NANODEGREE PROGRAM
 * PROJECT #3: CLASSIC ARCADE GAME CLONE
 * 
 * 
 * By: Carlos Fins
 * Submission Date: 06/28/18
 * Repo: https://github.com/clockwerkz/frontend-nanodegree-arcade-game
 * 
 * 
********************************************************************************/

// View Object
// The screenView Object controls the display of the character selection, gameboard, level and game over screens.
const screenView = (function() {
    /* Main Screen Display */
    const gameStart = document.getElementById('game-start'); 
    const gameScreen = document.getElementById('game-screen');
    const gameOver = document.getElementById('game-over');
    const gameLevel = document.getElementById('game-level');

    /* Score, Countdown Timer, and lives */
    const scoreInfo = document.querySelectorAll('.score-info');
    const livesCount = document.querySelector('.life-count');
    const currentLevel = document.querySelector('.current-level');
    const levelTimer = document.querySelector('.level-timer');
    const newScore = document.querySelector('#new-score');
    const highScores = document.querySelector('.high-scores');
    const maxHighScoreCount = 5; //Tracks the maximum amount of high scores
    let newHighScore;
    let scoresArray = [];

    //Functions that control the displaying and hiding of various screens
    function showGameBoard () {
        gameStart.classList.toggle('hide');
        gameScreen.classList.toggle('hide');  
    }

    function showLevelDisplay(){
        gameLevel.classList.toggle('hide');
    }

    function hideLevelDisplay() {
        gameLevel.classList.toggle('hide');
    }

    const updateLifeCounter = (lives)=> {
        livesCount.textContent = lives;
    }

    const updateCurrentLevel = (level)=> {
        currentLevel.textContent = level;
    }

    const updateLevelTimer = (time) => {
        levelTimer.textContent = time;
    }

    const updateScores = (score) => {
        scoreInfo.forEach( scoreScreen => scoreScreen.textContent = score );
    }

    //this function has the localStorage high score logic
    const showGameOver = (score) => {
        newHighScore = score;
        gameScreen.classList.toggle('hide');
        gameOver.classList.toggle('hide');
        let highScores = localStorage.getItem('bugsHighScore'); //Grab localStorage high scores
        if (highScores) { //if highScores do exist on local storage
            scoresArray = JSON.parse(highScores); 
            scoresArray.sort((a,b) => a.score < b.score ); 
            let lastElement = scoresArray.length-1; 
            //if the current High score is higher than the last score in the record, or if the length of the array is 
            //less than the max amount of scores tracked, display the form to capture the name of player
            if (newHighScore > scoresArray[lastElement].score || scoresArray.length<maxHighScoreCount) {
                showNameFormEntry();
            } else {
                showHighScores();
            }
        } else {
            //if there isn't a localStorage of high scores, display form to capture name
            showNameFormEntry();
        }
    }

    //This is called when the form is submitted with a name for the high score
    const newNameSubmit = (name) => {
        const newPlayer = {
            name,
            score : newHighScore
        }
        if (scoresArray.length < maxHighScoreCount) {
            scoresArray.push(newPlayer);
        } else {
            scoresArray.pop();
            scoresArray.push(newPlayer);
        }
        showHighScores();
        
    }
    //Displays all high scores in an unordered list
    const showHighScores = () => {
        newScore.classList.add('hide');
        scoresArray.sort((a,b) => a.score < b.score );
        console.log(scoresArray);
        const scoresList = highScores.querySelector('ul');
        scoresList.innerHTML = '';
        scoresArray.forEach((score) => {
            scoresList.innerHTML+=`<li><span class="name">${score.name}:</span><span class="score">${score.score}</span></li>`;
        });
        highScores.classList.remove('hide');
        storeHighScores();
    }

    const showNameFormEntry = () => {
        highScores.classList.add('hide');
        newScore.classList.remove('hide');        
    }

    const storeHighScores = () => {
        localStorage.setItem('bugsHighScore', JSON.stringify(scoresArray));
    }

    const redisplayGame = () => {
        gameScreen.classList.toggle('hide');
        gameOver.classList.toggle('hide');
    }


    return {
        updateLifeCounter,
        updateScores,
        showGameBoard,
        showGameOver,
        redisplayGame,
        updateLevelTimer,
        hideLevelDisplay,
        showLevelDisplay,
        updateCurrentLevel,
        newNameSubmit
    };

})();

class Entity {
    constructor(x, y, width, height, sprite) {
        this.sprite = sprite,
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

//Player Class
class Player extends Entity {
    constructor() {
        super(200, 300, 50, 40, 'images/char-boy.png');
        this.isMoving = false;
        this.yTarget=380;   // yTarget and xTarget are used to anticipate the new location of the player when 
        this.xTarget=200;   // Input is recieved. Instead of the player popping to the new location, they translate to it.
    }

    update() {
        //Update tracks if player's x and y match the x and yTarget values, if not, increment x or y until it matches.
        if (this.y > this.yTarget) this.y= this.y-5;
        if (this.y < this.yTarget) this.y= this.y+5;
        if (this.x > this.xTarget) this.x= this.x-5;
        if (this.x < this.xTarget) this.x= this.x+5;
        if (this.x === this.xTarget && this.y === this.yTarget) this.isMoving = false; //used to prevent multiple inputs at once
        
    }

    /* Hides character offscreen during level display */
    hide() {
        this.x = -100;
        this.y = -100;
        this.yTarget = -100;
        this.xTarget = -100;
    }
    //resets character back to the bottom of the screen
    reset() {
        this.x = 200;
        this.y = 380;
        this.yTarget=380;
        this.xTarget=200;
    }

    //handleInput checks to make sure player is within the boundaries of the game, and also checks for rock collisions
    handleInput(keyCode) {
        if (!this.isMoving) {
            this.isMoving = true;
            switch (keyCode) {
                case('left'):
                    if (!this.checkForRocks(-100,0)) {
                        if (this.xTarget > 0) this.xTarget-=100;
                    }
                    break;
                case('up'):
                    if (!this.checkForRocks(0,-80)) {
                        if (this.yTarget > 0) {
                            this.yTarget-=80;
                        } else {
                            gameController.laneClearedScore();
                        }
                    }
                    break;
                case('right'):
                    if (!this.checkForRocks(100,0)) {
                        if (this.xTarget < 400) this.xTarget+=100;
                    }
                    break;
                case('down'):
                    if (!this.checkForRocks(0, 80)) {
                        if (this.yTarget < 380) this.yTarget+=80;
                    }
                }       
        }
    }

    //breaking out the collision check for Rocks into it's own function
    checkForRocks(x, y) {
        let rockPresent = false;
        allRocks.forEach(function(rock) {
            if ( 
                (rock.x < player.x + player.width + x) &&
                (rock.x + rock.width > player.x + x) &&   
                (rock.y < player.y + player.height + y) &&
                (rock.y + rock.height  > player.y + y)
            ) rockPresent = true;
        });
        return rockPresent;
    }

    
}

class Gem extends Entity{
    constructor(gem_type, x, y) {
        super(x, y, 50, 60, gem_type)
    }

    //update checks for player collisions
    update(dt) {
        if ( 
                (this.x < player.x + player.width ) &&
                (this.x + this.width > player.x) &&   
                (this.y < player.y + player.height ) &&
                (this.y + this.height > player.y) 
            )
            {
                gameController.gemCollected(this);  //called to delete the current gem and to update the score
            }
    } 
}

//Enemies our player must avoid
class Enemy extends Entity {
    constructor(startingY,speed, canMove) {
        super(-100, startingY, 50, 60,'images/enemy-bug.png');
        this.canMove = canMove || false;
        this.startingY = startingY;
        this.sprite = 'images/enemy-bug.png';
        this.speed = speed || 200;
    }
    //update checks for player collisions
    update(dt) {
        if (this.canMove)
        {
            if (this.x<500) {
                this.x=this.x+(this.speed*dt);
            } else {
                this.y=gameController.newLanePos();
                this.x=-100;
            } 
            if ( 
                (this.x < player.x + player.width ) &&
                (this.x + this.width > player.x) &&   
                (this.y < player.y + player.height ) &&
                (this.y + this.height > player.y) 
               )
            {
                gameController.playerHit(); //called to record a player hit and update lives
            }
        }
    }   
}

class Rock extends Entity{
    constructor(x){
        super(x, -20, 100, 43, 'images/Rock.png');
    }

    update() {
    }
}

const allRocks = [];

const allEnemies = []; 
const player = new Player();
const allGems = [];

//This array of objects provides individual level states for levels 1-8. After 8, the the level count will still continue but the difficulty
//remains at level 8.
const gameModel = [
    {
        numberOfEnemies : 3,
        maxGemCount : 3,
        gemTiming : 4,
        spawnSpeed : 1500,
        totalTimeToComplete : 30,
        numberOfRocks : 0,
        enemySpeed : 75
    },
    {
        numberOfEnemies : 3,
        maxGemCount : 3,
        gemTiming : 4,
        spawnSpeed : 1500,
        totalTimeToComplete : 30,
        numberOfRocks : 0,
        enemySpeed : 75
    },
    {
        numberOfEnemies : 4,
        maxGemCount : 3,
        gemTiming : 4,
        spawnSpeed : 1400,
        totalTimeToComplete : 30,
        numberOfRocks : 1,
        enemySpeed : 150
    },
    {
        numberOfEnemies : 5,
        maxGemCount : 3,
        gemTiming : 4,
        spawnSpeed :1400,
        totalTimeToComplete : 30,
        numberOfRocks : 2,
        enemySpeed : 150
    },
    {
        numberOfEnemies : 5,
        maxGemCount : 4,
        gemTiming : 4,
        spawnSpeed : 1000,
        totalTimeToComplete : 30,
        numberOfRocks : 3,
        enemySpeed : 200
        },
    {
        numberOfEnemies : 5,
        maxGemCount : 5,
        gemTiming : 4,
        spawnSpeed : 500,
        totalTimeToComplete : 30,
        numberOfRocks : 4,
        enemySpeed : 255
    },
    {
        numberOfEnemies : 6,
        maxGemCount : 2,
        gemTiming : 3,
        spawnSpeed : 1000,
        totalTimeToComplete : 30,
        numberOfRocks : 4,
        enemySpeed : 250
    },
    {
        numberOfEnemies : 6,
        maxGemCount : 2,
        gemTiming : 3,
        spawnSpeed : 1000,
        totalTimeToComplete : 30,
        numberOfRocks : 4,
        enemySpeed : 250
    }

];

//Game Controller Object
const gameController = (function(player, allEnemies, allGems) {
    let lives = 3;  
    let score = 0;
    let level = 1;
    gameStarted = false;
    playerCanMove = false;
    numberOfEnemies = 4;
    laneScore = 100;
    let clock = 0;
    let clockRunning=null;
    let isClockRunning = false;
    const gemColors = ['images/Gem Orange.png','images/Gem Green.png','images/Gem Blue.png'];
    maxGemCount = 2;
    gemTiming = 5;
    let enemySpawnTimer;
    let spawnSpeed = 1000;
    let totalTimeToComplete = 30;
    let levelTimer = totalTimeToComplete;
    let enemySpeed = 150;
    let numberOfRocks = 2;

    function init (){
        screenView.updateLevelTimer(levelTimer);
    }

    function setLevel(gameModelObj) {
        numberOfEnemies = gameModelObj.numberOfEnemies;
        spawnSpeed = gameModelObj.spawnSpeed;
        maxGemCount = gameModelObj.maxGemCount;
        gemTiming = gameModelObj.gemTiming;
        totalTimeToComplete = gameModelObj.totalTimeToComplete;
        numberOfRocks = gameModelObj.numberOfRocks;
        enemySpeed = gameModelObj.enemySpeed;
    }

    /* Player is Hit by Enemy */
    function playerHit() {
        lives-=1;
        screenView.updateLifeCounter(lives);
        if (lives === 0) {
            gameOver();
        } else {
            player.reset();
        }
    }
    /* Starts with a random choice of gem_color from array gemCOlors, and then returns an instantiaion of a new Gem */
    function createGem() {
        let randomColor = Math.floor(Math.random()*gemColors.length);
        return new Gem(gemColors[randomColor],newLanePosX(),newLanePos() );
    }

    /* Checks if gem array is not at max gem count. If not, calls for a new gem and pusnes it into array of allGems */
    function gemSpawn() {
        if (clock%gemTiming===0 && allGems.length<maxGemCount) {
            createGem();
            allGems.push(createGem());
        }
    }

    /* If a gem is collected, deletes the gem and updates the score */
    function gemCollected(gem) {
        let index = allGems.indexOf(gem);
        allGems.splice(index, 1);
        score+=500;
        screenView.updateScores(score);

    }

    /* At the start of every level, the level number displays briefly before the level begins. This is handled with a 
       setTimeout callback that resets the board and restarts gameplay */
    function levelStart() {
        screenView.updateCurrentLevel(level);
        screenView.showLevelDisplay();
        createEnemies();
        createRocks();
        setTimeout(function() {
            screenView.hideLevelDisplay();
            resetLevelTimer();
            startClock(levelTimer);
            player.reset();
            gameStarted = true;
            playerCanMove = true;
        }, 2000);
    }

    /* When the player successfully reaches the top lane, this function updates the game state.  */
    function laneClearedScore() {
        score+=laneScore;
        stopClock();
        screenView.updateScores(score);
        resetLevelTimer();
        deleteGems();
        deleteEnemies();
        level+=1;
        if (level < gameModel.length) setLevel(gameModel[level-1]); //Finite amount of levels provided, this check
        levelStart();                                               //keeps the level state at the last level provided
        player.hide();
        playerCanMove = false;
    }

    /* When the clock runs out or player loses all 3 lives, call up the game over screen and delete/clear game assets */
    function gameOver() {
        stopClock();
        gameStarted = false;
        if (enemySpawnTimer) clearInterval(enemySpawnTimer);
        deleteEnemies();
        deleteGems();
        screenView.updateScores(score);
        screenView.showGameOver(score);
        level = 1;
        
    }
    /* resets the timer */
    function resetLevelTimer() {
        levelTimer = totalTimeToComplete;
        screenView.updateLevelTimer(levelTimer);
    }

    /* Called when the game begins */
    function gameStart(characterChoice) {
        screenView.showLevelDisplay();
        screenView.showGameBoard();
        player.sprite = characterChoice; 
        level = 1;
        setLevel(gameModel[level-1]);
        createEnemies();
        createRocks();
        setTimeout(function() {
            screenView.hideLevelDisplay();
            resetLevelTimer();
            startClock(levelTimer);
            gameStarted = true;
            playerCanMove = true;
        }, 2000);
    }

    //used to expose the playerCanMove boolean value to the event listener for the controller
    function canPlayerMove() {
        return playerCanMove;
    }
    
    function gameRestart() {
        lives = 3;
        score = 0;
        level = 1;
        setLevel(gameModel[level-1]);
        resetLevelTimer();
        player.hide();
        screenView.updateScores(score);
        screenView.updateLifeCounter(lives);
        screenView.redisplayGame();
        levelStart();
    }

    //used to expose the whether the game is running or not
    function hasGameStarted() {
        return gameStarted;
    }

    //helper function to create a random lane location for the gems
    function newLanePosX() {
        return (Math.floor(Math.random()*5))*100;
    }
    //helper function to create a random y location for enemies and gems
    function newLanePos() {
        return (Math.floor(Math.random()*4))*83+60;
    }

    function deleteEnemies() {
        clearInterval(enemySpawnTimer);
        while(allEnemies.length) allEnemies.pop();
    }

    function createRocks() {
        let rockCount = numberOfRocks;
        deleteRocks();
        let rockLocations = [0,100,200,300,400];
        while (rockCount>0) {
            let randomLane = Math.floor(Math.random()*rockLocations.length);
            allRocks.push(new Rock(rockLocations[randomLane]));
            rockLocations.splice(randomLane, 1);
            rockCount--;   
        }
    } 

    function deleteRocks() {
        while(allRocks.length) allRocks.pop();
    }

    function deleteGems() {
        while(allGems.length) allGems.pop();
    }

    function createEnemies() {
        deleteEnemies();
        let number = numberOfEnemies;
        enemySpawnTimer = setInterval(function() { //Enemies are spawned in intervals
            if (number <= 1) clearInterval(enemySpawnTimer);
            allEnemies.push(new Enemy(newLanePos(),enemySpeed, true));
            number--;
        }, spawnSpeed);
    }
    // Internal Timer functions
    function startClock(levelTimer) {
        if (!isClockRunning) {
            resetClock();
            isClockRunning = true;
            clockRunning = setInterval(()=>{
                levelTimer--;
                screenView.updateLevelTimer(levelTimer);
                if (levelTimer%4===0) gemSpawn();
                if (levelTimer <= 0) gameOver();
            }, 1000);
        }
    }

    function stopClock() {
        if (clockRunning) clearInterval(clockRunning);
        isClockRunning = false;
        clockRunning = null;
    }

    function resetClock() {
        clock = 0;
    }

    //exposes certain functions
    return {
        gameStart,
        playerHit,
        hasGameStarted,
        gameRestart,
        laneClearedScore,
        newLanePos,
        init,
        gemCollected,
        canPlayerMove
    }
})(player, allEnemies, allGems);

gameController.init();




//Button and keyboard event Handlers
document.querySelector(".character-selection").addEventListener("click", (e)=> {
    if (e.target.nodeName==='IMG') {
        const currentSelection = document.querySelector(".selected");
        if (e.target !== currentSelection) {
            currentSelection.classList.remove("selected");
            e.target.classList.add('selected');
        }
    }
});

document.querySelector('#game-over .btn').addEventListener('click', ()=> {
    gameController.gameRestart();
});


document.querySelector('.btn-start').addEventListener('click', ()=> {
    gameController.gameStart(document.querySelector('.selected').dataset.value);
});

document.addEventListener('keydown', function(e) {
    if (e.keyCode >=37 && e.keyCode <= 40) e.preventDefault();
})

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (gameController.hasGameStarted() && gameController.canPlayerMove()) player.handleInput(allowedKeys[e.keyCode]);

});

document.getElementById('new-score').addEventListener('submit', (e)=> {
    e.preventDefault();
    const newName =  document.querySelector('input');
    screenView.newNameSubmit(newName.value);
});
