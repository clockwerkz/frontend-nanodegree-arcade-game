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
    const gameStart = document.getElementById('gameStart'); /* TODO: change this to game-start for naming consistency */
    const gameScreen = document.getElementById('game-screen');
    const gameOver = document.getElementById('game-over');

    /* Score and lives */
    const scoreInfo = document.querySelectorAll('.score-info');
    const livesCount = document.querySelector('.life-count');

    function showGameBoard () {
        gameStart.classList.toggle('hide');
        gameScreen.classList.toggle('hide');  
    }

    const updateLifeCounter = (lives)=> {
        livesCount.textContent = lives;
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
        redisplayGame
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
        this.width = 80;
        this.height = 80; 
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
                        if (this.yTarget < 400) this.yTarget+=80;
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
    constructor(startingY) {
        this.x = -100;
        this.y = startingY;
        this.height=60;
        this.width=50;
        this.canMove = false;
        this.startingY = startingY;
        this.sprite = 'images/enemy-bug.png';
    }

    update(dt) {
        if (this.canMove)
        {
            if (this.x<500) {
                this.x=this.x+(200*dt);
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



//Game Controller Object
const gameController = (function(player, allEnemies, allGems) {
    let lives = 3;
    let score = 0;
    gameStarted = false;
    numberOfEnemies = 4;
    laneScore = 100;
    let clock = 0;
    let clockRunning=null;
    let isClockRunning = false;
    const gemColors = ['images/Gem Orange.png','images/Gem Green.png','images/Gem Blue.png'];
    maxGemCount = 2;
    gemTiming = 5;

    function init (){
        createEnemies();
    }

    /* Player is Hit by Enemy */
    function playerHit() {
        lives-=1;
        screenView.updateLifeCounter(lives);
        if (lives === 0) {
            gameOver();
        } else {
            player.reset();
            createEnemies();
            startEnemyMovement();
        }
    }

    function createGem() {
        let randomColor = Math.floor(Math.random()*gemColors.length);
        return new Gem(gemColors[randomColor],newLanePosX(),newLanePos() );
    }

    function gemSpawn() {
        if (clock%gemTiming===0 && allGems.length<maxGemCount) {
            createGem();
            allGems.push(createGem());
        }
    }

    function gemCollected(gem) {
        let index = allGems.indexOf(gem);
        allGems.splice(index, 1);
        score+=500;
        screenView.updateScores(score);

    }

    function laneClearedScore() {
        score+=laneScore;
        screenView.updateScores(score);
        player.reset();
    }

    function gameOver() {
        stopClock();
        gameStarted = false;
        player.reset();
        deleteEnemies();
        deleteGems();
        screenView.updateScores(score);
        screenView.showGameOver();
        
    }

    function gameStart(characterChoice) {
        startClock();
        player.sprite = characterChoice; 
        screenView.showGameBoard();
        gameStarted = true;
        startEnemyMovement();
    }
    
    function gameRestart() {
        startClock();
        lives = 3;
        score = 0;
        screenView.updateScores(score);
        screenView.updateLifeCounter(lives);
        gameStarted=true;
        createEnemies();
        startEnemyMovement();
        screenView.redisplayGame();
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

    function startEnemyMovement () {
        allEnemies.forEach( enemy => enemy.canMove = true );
    }

      function stopAllEnemyMovement() {
         allEnemies.forEach( enemy => enemy.canMove = false );
     }

    function deleteEnemies() {
        while(allEnemies.length) allEnemies.pop();
    }

    function deleteGems() {
        while(allGems.length) allGems.pop();
    }

    function createEnemies() {
        deleteEnemies();
        for (let i=0; i<numberOfEnemies; i++) allEnemies.push(new Enemy(newLanePos()));
    }
    // Internal Timer functions
    function startClock() {
        if (!isClockRunning) {
            resetClock();
            isClockRunning = true;
            clockRunning = setInterval(()=>{
                clock++;
                gemSpawn();
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
        gemCollected
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
    if (gameController.hasGameStarted()) player.handleInput(allowedKeys[e.keyCode]);

});
