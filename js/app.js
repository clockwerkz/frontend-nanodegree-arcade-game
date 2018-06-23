// Enemies our player must avoid
var Enemy = function(startingY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -100;
    this.y = startingY;
    this.height=35;
    this.width=50;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x<500) {
        this.x=this.x+(200*dt);
    } else {
        this.x=-100;
    }
    if (((this.y+this.height)>player.y) && ((this.y-this.height)<player.y) 
       &&((this.x+this.width)>player.x) && ((this.x-this.width)<player.x) ) {
           player.reset();
       }
     
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


const Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 380;
    this.yTarget=380;
    this.xTarget=200;
}

Player.prototype.handleInput = function(keyCode) {

      
    switch (keyCode) {
        case('left'):
        if (this.xTarget > 0) this.xTarget-=100;
            break;
        case('up'):
            if (this.yTarget > 0) this.yTarget-=80;
            break;
        case('right'):
            if (this.xTarget < 400) this.xTarget+=100;
            break;
        case('down'):
            if (this.yTarget < 400) this.yTarget+=80;
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
    
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function startingYPos() {
    return (Math.floor(Math.random()*4))*80+120;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const player = new Player();

const allEnemies = [new Enemy(startingYPos()), new Enemy(startingYPos()) ];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
