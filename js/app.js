// Game Start Modal
const characterSelection = document.querySelector(".character-selection");
const btnStart = document.querySelector('.btn-start');
// let gameStarted = false;


characterSelection.addEventListener("click", (e)=> {
    if (e.target.nodeName==='IMG') {
        const currentSelection = characterSelection.querySelector(".selected");
        if (e.target !== currentSelection) {
            currentSelection.classList.remove("selected");
            e.target.classList.add('selected');
        }
    }
});

const btnEnd = document.querySelector('#game-over .btn');
btnEnd.addEventListener('click', ()=> {
    gameController.gameRestart();
});


btnStart.addEventListener('click', ()=> {
    gameController.gameStart(document.querySelector('.selected').dataset.value);
});



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

const Player = function() {
    // this.moveStateType = {
    //     STANDING : 0,
    //     MOVING_LEFT : 1,
    //     MOVING_RIGHT : 2,
    //     MOVING_UP : 3,
    //     MOVING_DOWN  : 4
    // };
    //this.moveState = moveStateType.STANDING;
    this.isMoving = false;
    this.sprite = 'images/char-boy.png';
    //this.spriteInjured = 'images/char-boy_injured.png';
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


Player.prototype.handleInput = function(keyCode) {

    if (!this.isMoving) {
        this.isMoving = true;
        switch (keyCode) {
            case('left'):
            if (this.xTarget > 0) this.xTarget-=100;
                break;
            case('up'):
                if (this.yTarget > 0) {
                    this.yTarget-=80;
                } else {
                    gameController.laneClearedScore();
                }
                break;
            case('right'):
                if (this.xTarget < 400) this.xTarget+=100;
                break;
            case('down'):
                if (this.yTarget < 400) this.yTarget+=80;
            }       
    }
}

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 380;
    this.yTarget=380;
    this.xTarget=200;
}

Player.prototype.update = function() {
    if (this.y > this.yTarget) this.y= this.y-5;
    if (this.y < this.yTarget) this.y= this.y+5;
    if (this.x > this.xTarget) this.x= this.x-5;
    if (this.x < this.xTarget) this.x= this.x+5;
    if (this.x === this.xTarget && this.y === this.yTarget) this.isMoving = false;
    
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid

class Enemy {
    constructor(startingY) {
        
    }
}
var Enemy = function(startingY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -100;
    this.y = startingY;
    this.height=60;
    this.width=50;
    this.canMove = false;
    this.startingY = startingY;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.canMove)
    {
        if (this.x<500) {
            this.x=this.x+(200*dt);
        } else {
            this.y=gameController.newLanePos();
            this.x=-100;
        }
        // if (((this.y+this.height)>player.y) && ((this.y-this.height)<player.y) 
        // &&((this.x+this.width)>player.x) && ((this.x-this.width)<player.x) ) 
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
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


const allEnemies = []; 
const player = new Player();

const gameController = (function(player, allEnemies) {
    let lives = 3;
    let score = 0;
    gameStarted = false;
    numberOfEnemies = 2;
    laneScore = 100;

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

    function laneClearedScore() {
        score+=laneScore;
        screenView.updateScores(score);
        player.reset();
    }

    function gameOver() {
        gameStarted = false;
        screenView.updateScores(score);
        screenView.showGameOver();
        
    }

    function gameStart(characterChoice) {
        player.sprite = characterChoice;
        console.log
        screenView.showGameBoard();
        gameStarted = true;
        startEnemyMovement();
    }
    
    function gameRestart() {
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

    function newLanePos() {
        return (Math.floor(Math.random()*4))*83+66;
    }

    function startEnemyMovement () {
        allEnemies.forEach( enemy => enemy.canMove = true );
    }

     function stopAllEnemyMovement() {
        allEnemies.forEach( enemy => enemy.canMove = false );
    }

    function createEnemies() {
        while(allEnemies.length) allEnemies.pop();
        for (let i=0; i<numberOfEnemies; i++) allEnemies.push(new Enemy(newLanePos()));
        console.log(allEnemies);
    }

    return {
        gameStart,
        playerHit,
        hasGameStarted,
        gameRestart,
        laneClearedScore,
        newLanePos,
        init,
    }
})(player, allEnemies);

gameController.init();


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    console.log(gameController.hasGameStarted());

    if (gameController.hasGameStarted()) player.handleInput(allowedKeys[e.keyCode]);
});
