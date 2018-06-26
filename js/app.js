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
    clearEnemies();
    gameRestart();
});


// function gameRestart() {
//     player.lives = 3;
//     player.score = 0;
//     updateScore();
//     document.querySelector('.life-count').textContent = player.lives;
//     document.getElementById('game-screen').classList.remove('hide');
//     document.querySelector('#game-over .score-info').textContent = player.score;
//     document.getElementById('game-over').classList.add('hide');
//     gameStarted=true;
// }

btnStart.addEventListener('click', ()=> {
    gameHasStarted();
});

function gameHasStarted () {
    const gameStart = document.getElementById('gameStart');
    const gameScreen = document.getElementById('game-screen');
    gameStart.classList.add('hide');
    gameStarted=true;
    gameScreen.classList.remove('hide');
    player.sprite = document.querySelector('.selected').dataset.value;
    gameScreen.querySelector('.life-count').textContent = player.lives;
    gameScreen.querySelector('.current-score').textContent = player.score;

}

const screenView = (function() {
    /* Main Screen Display */
    const gameStart = document.getElementById('gameStart'); /* TODO: change this to game-start for naming consistency */
    const gameScreen = document.getElementById('game-screen');
    const gameOver = document.getElementById('game-over');

    /* Score and lives */
    const scoreInfo = document.querySelectorAll('.score-info');
    const livesCount = document.querySelector('.life-count');

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

// Enemies our player must avoid
var Enemy = function(startingY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -100;
    this.y = startingY;
    this.height=60;
    this.width=50;
    this.canMove = false;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

const gameController = (function() {
    let lives = 3;
    let score = 0;
    gameStarted = false;
    numberOfEnemies = 2;
    let player;
    const allEnemies = [];

    function init (){
        player = new Player();
        createEnemies();
    }

    /* Player is Hit by Enemy */
    function playerHit() {
        lives-=1;
        screenView.updateLifeCounter(lives);
        if (this.lives === 0) {
            gameOver();
        } else {
            player.reset();
            createEnemies();
        }
    }

    // function handleHit() {
    //     isHit();
    //     allEnemies = [new Enemy(startingYPos()), new Enemy(startingYPos()) ];
    // }

    function gameOver() {
        gameStarted = false;
        clearEnemies();
        screenView.updateScores(score);
        screenView.showGameOver();
        
    }
    
    function gameRestart() {
        lives = 3;
        score = 0;
        screenView.updateScores(score);
        screenView.updateLifeCounter(lives);
        gameView.redisplayGame();
        gameStarted=true;
        startEnemyMovement();
    }

    function hasGameStarted() {
        return gameStarted;
    }

    /* Helper Functions */
    function startingPos() {
        return (Math.floor(Math.random()*4))*83+66;
    }

    function startEnemyMovement () {
        allEnemies.forEach( enemy => enemy.isMoving = true );
    }

     function stopAllEnemyMovement() {
        allEnemies.forEach( enemy => enemy.isMoving = false );
    }

    function createEnemies() {
        for (let i=0; i<numberOfEnemies; i++) allEnemies.push(new Enemy(startingPos()));
        console.log(allEnemies);
    }

    return {
        playerHit,
        hasGameStarted,
        gameRestart,
        init,
        allEnemies,
        player
    }
})();

gameController.init();


const allEnemies = gameController.allEnemies; 
const player = gameController.player;



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
            this.y=startingYPos();
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

// function handleHit() {
//     player.isHit();
//     allEnemies = [new Enemy(startingYPos()), new Enemy(startingYPos()) ];
// }

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// function updateScore() {
//     document.querySelector('.current-score').textContent = player.score;
// }

// const Player = function() {
//     // this.moveStateType = {
//     //     STANDING : 0,
//     //     MOVING_LEFT : 1,
//     //     MOVING_RIGHT : 2,
//     //     MOVING_UP : 3,
//     //     MOVING_DOWN  : 4
//     // };
//     //this.moveState = moveStateType.STANDING;
//     this.isMoving = false;
//     this.sprite = 'images/char-boy.png';
//     //this.spriteInjured = 'images/char-boy_injured.png';
//     this.x = 200;
//     this.y = 380;
//     this.yTarget=380;
//     this.xTarget=200;
//     // this.injured = false;
//     // this.lives = 3;
//     // this.score = 0;
//     this.width = 80;
//     this.height = 80;
// }

// Player.prototype.isHit = function () {
//     this.injured = true;
//     this.lives-=1;
//     document.querySelector('.life-count').textContent = player.lives;
//     if (this.lives === 0) gameOver();
//     player.reset();
// }

// function gameOver() {
//     gameStarted = false;
//     clearEnemies();
//     document.getElementById('game-screen').classList.add('hide');
//     document.querySelector('#game-over .score-info').textContent = player.score;
//     document.getElementById('game-over').classList.remove('hide');
    
// }

// function clearEnemies() {
//     allEnemies = [new Enemy(startingYPos()), new Enemy(startingYPos()) ];
// }


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
                    this.score+=100;
                    updateScore();
                    this.reset();
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

Player.prototype.update = function(dt) {
    if (this.y > this.yTarget) this.y= this.y-5;
    if (this.y < this.yTarget) this.y= this.y+5;
    if (this.x > this.xTarget) this.x= this.x-5;
    if (this.x < this.xTarget) this.x= this.x+5;
    if (this.x === this.xTarget && this.y === this.yTarget) this.isMoving = false;
    
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// function startingYPos() {
//     return (Math.floor(Math.random()*4))*82+66;
// }
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// const player = new Player();
// let allEnemies = [new Enemy(startingYPos()), new Enemy(startingYPos()) ];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (gameStarted) player.handleInput(allowedKeys[e.keyCode]);
});
