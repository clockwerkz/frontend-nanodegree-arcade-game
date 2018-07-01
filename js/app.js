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
    const levelTimer = document.querySelector('.level-timer')

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

    const showGameOver = () => {
        gameScreen.classList.toggle('hide');
        gameOver.classList.toggle('hide');
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
        updateCurrentLevel
    };

})();


//Player Class
class Player {
    constructor() {
        this.isMoving = false;
        this.sprite = 'images/char-boy.png';
        this.x = 200;
        this.y = 380;
        this.yTarget=380;
        this.xTarget=200;
        // this.injured = false;
        // this.lives = 3;
        // this.score = 0;
        this.width = 50;
        this.height = 40; 
    }

    update() {
        if (this.y > this.yTarget) this.y= this.y-5;
        if (this.y < this.yTarget) this.y= this.y+5;
        if (this.x > this.xTarget) this.x= this.x-5;
        if (this.x < this.xTarget) this.x= this.x+5;
        if (this.x === this.xTarget && this.y === this.yTarget) this.isMoving = false;
        
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /* Hides character offscreen during level display */
    hide() {
        this.x = -100;
        this.y = -100;
        this.yTarget = -100;
        this.xTarget = -100;
    }

    reset() {
        this.x = 200;
        this.y = 380;
        this.yTarget=380;
        this.xTarget=200;
    }

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

class Gem{
    constructor(gem_type, x, y) {
        this.sprite = gem_type;
        this.x = x;
        this.y = y;
        this.height=60;
        this.width=50;   
    }

    update(dt) {
        if ( 
                (this.x < player.x + player.width ) &&
                (this.x + this.width > player.x) &&   
                (this.y < player.y + player.height ) &&
                (this.y + this.height > player.y) 
            )
            {
                gameController.gemCollected(this);
            }
    } 

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

//Enemies our player must avoid
class Enemy {
    constructor(startingY,speed, canMove) {
        this.x = -100;                           
        this.y = startingY;
        this.height=60;
        this.width=50;
        this.canMove = canMove || false;
        this.startingY = startingY;
        this.sprite = 'images/enemy-bug.png';
        this.speed = speed || 200;
    }

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
                gameController.playerHit();
            }
        }
    }   

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Rock {
    constructor(x){
        this.x =x;
        this.y = -20;
        this.sprite = 'images/Rock.png';
        this.width = 100;
        this.height = 43;
    }

    update() {

    }
    
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

const allRocks = [new Rock(100), new Rock(400)];

const allEnemies = []; 
const player = new Player();
const allGems = [];

const gameModel = [
    {
        numberOfEnemies : 4,
        maxGemCount : 2,
        gemTiming : 5,
        spawnSpeed : 1000,
        totalTimeToComplete : 30,
        numberOfRocks : 2
    },
    {
        numberOfEnemies : 5,
        maxGemCount : 3,
        gemTiming : 4,
        spawnSpeed : 800,
        totalTimeToComplete : 30,
        numberOfRocks : 3
    },
    {
        numberOfEnemies : 5,
        maxGemCount : 4,
        gemTiming : 4,
        spawnSpeed : 1000,
        totalTimeToComplete : 30,
        numberOfRocks : 4
    },
    {
        numberOfEnemies : 5,
        maxGemCount : 5,
        gemTiming : 5,
        spawnSpeed : 500,
        totalTimeToComplete : 30,
        numberOfRocks : 5
    },
    {
        numberOfEnemies : 4,
        maxGemCount : 2,
        gemTiming : 5,
        spawnSpeed : 1000,
        totalTimeToComplete : 30,
        numberOfRocks : 5
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
    let numberOfRocks = 2;

    function init (){
        screenView.updateLevelTimer(levelTimer);
    }

    function setLevel(gameModelObj) {
        console.log("setLevel called level",level);
        numberOfEnemies = gameModelObj.numberOfEnemies;
        spawnSpeed = gameModelObj.spawnSpeed;
        maxGemCount = gameModelObj.maxGemCount;
        gemTiming = gameModelObj.gemTiming;
        totalTimeToComplete = gameModelObj.totalTimeToComplete;
        numberOfRocks = gameModelObj.numberOfRocks;
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
        console.log('in levelStart');
        console.log('level',level)
        screenView.showLevelDisplay();
        createEnemies();
        setTimeout(function() {
            screenView.hideLevelDisplay();
            resetLevelTimer();
            startClock(levelTimer);
            player.reset();
            gameStarted = true;
            playerCanMove = true;
        }, 2000);
        // setTimeout(function() {
        //     screenView.hideLevelDisplay();
        //     startClock(levelTimer);
        //     player.reset();
        //     playerCanMove=true;
        // }, 2000);
    }

    
    function laneClearedScore() {
        score+=laneScore;
        stopClock();
        screenView.updateScores(score);
        resetLevelTimer();
        deleteGems();
        deleteEnemies();
        level+=1;
        if (level < gameModel.length) setLevel(gameModel[level-1]);
        levelStart();
        player.hide();
        playerCanMove = false;
    }

    function gameOver() {
        stopClock();
        gameStarted = false;
        if (enemySpawnTimer) clearInterval(enemySpawnTimer);
        deleteEnemies();
        deleteGems();
        screenView.updateScores(score);
        screenView.showGameOver();
        level = 1;
        
    }

    function resetLevelTimer() {
        levelTimer = totalTimeToComplete;
        screenView.updateLevelTimer(levelTimer);
    }

    function gameStart(characterChoice) {
        screenView.showLevelDisplay();
        screenView.showGameBoard();
        player.sprite = characterChoice; 
        level = 1;
        setLevel(gameModel[level-1]);
        createEnemies();
        setTimeout(function() {
            screenView.hideLevelDisplay();
            resetLevelTimer();
            startClock(levelTimer);
            gameStarted = true;
            playerCanMove = true;
        }, 2000);
    }

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
        console.log('calling levelStart');
        levelStart();
    }

    function hasGameStarted() {
        return gameStarted;
    }

    function newLanePosX() {
        return (Math.floor(Math.random()*5))*100;
    }

    function newLanePos() {
        return (Math.floor(Math.random()*4))*83+60;
    }

    // function startEnemyMovement () {
    //     allEnemies.forEach( enemy => enemy.canMove = true );
    // }

    //   function stopAllEnemyMovement() {
    //      allEnemies.forEach( enemy => enemy.canMove = false );
    //  }

    function deleteEnemies() {
        clearInterval(enemySpawnTimer);
        while(allEnemies.length) allEnemies.pop();
    }

    function deleteGems() {
        while(allGems.length) allGems.pop();
    }

    function createEnemies() {
        deleteEnemies();
        let number = numberOfEnemies;
        enemySpawnTimer = setInterval(function() {
            if (number <= 1) clearInterval(enemySpawnTimer);
            allEnemies.push(new Enemy(newLanePos(),150, true));
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
