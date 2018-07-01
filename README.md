# BUGS -N- GEMS GAME
Grab the gems. Avoid the bugs. Profit!

Play it here: [Bugs -N- Gems](https://clockwerkz.github.io/frontend-nanodegree-arcade-game/)

## Classic Arcade Game Clone Udacity Project #3

This is my repository for Udacity's GitHub Project #3, the classic arcade game clone. The project involves using a provided basic game engine (utilizes HTML Canvas) to create game assets, and provide the logic and control for these assets.

### TODO
- [ ] Add comments to app.js
- [X] Refine collision system : [2D Collision Detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
- [X] Refine player alignment on the board
- [x] Selection Screen before game begins
- [x] Character Interpolates to new position, doesn't just pop to it.
- [x] Game Display (HUD) over the game board
- [x] Player Lives tracking
- [x] Display Lives Left on the HUD
- [x] Scoring System
- [x] Display Scoring System
- [X] Gem Spawning
- [X] Gem Collision/Scoring
- [x] Game Over Modal
- [x] Add Rocks/Obstacles
- [ ] Instantiate more rocks per level
- ~~[ ] Gameplay: Levels? Refine Game mechanics (Break this category up)~~
- [X] Add Game Countdown Clock
- [X] Add level start/end mechanic
- [X] If Time runs out, game is over
- ~~[ ] Change Lives remaining to be hearts displayed~~
- ~~[ ] Style the scoreboard~~
- ~~[ ] Paint arrow indicators on the last row of stone blocks~~
- [X] Spawn Enemies in Intervals

- [X] Refactor JavaScript code:
    - [X] Use MVC pattern: Create Game Object that will keep track of player lives and scoring rather than having that tracked on the   player object
    - [X] Convert player Oject to Player Class
    - [X] Convert Enemy Object to Enemy Class 
    - [X] Create Game Controller - tracks level, lives remaining, and score. Spawns enemies, gems, etc. 
    - [X] Create a screenView - handles updating the screens

### Game Design Doc

The game consists of a series levels. In each level, the players must grab as many gems they can while avoiding bugs and escape before the time runs out. Players start with 3 lives; they lose a life when they are hit by a bug. Game is over when the player fails to exit before the countdown expires, or they lose all their lives.


### WishList

- [ ] LocalStorage High Score tracker
- [ ] High Score API to record and maintain a permanent list of high scores
- [ ] Sound Effects
- [ ] Injured State - instead of character respawn as a penalty, character blinks and is invulnerable for a short time
- [ ] Power ups - faster speed, shield, etc
- [ ] Extra lives
- [ ] Re-do of the assets


### Resources

#### Font: Press Start 2P 

[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) - Google Font

#### Finite State Machine Design Pattern

[Game Programming Patterns Chapter](http://gameprogrammingpatterns.com/state.html)




frontend-nanodegree-arcade-game
===============================

Students should use this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) for self-checking their submission. Make sure the functions you write are **object-oriented** - either class functions (like Player and Enemy) or class prototype functions such as Enemy.prototype.checkCollisions, and that the keyword 'this' is used appropriately within your class and class prototype functions to refer to the object the function is called upon. Also be sure that the **readme.md** file is updated with your instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).
