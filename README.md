# BUGS -N- GEMS GAME
Grab the gems. Avoid the bugs. Profit!

Play it here: [Bugs -N- Gems](https://clockwerkz.github.io/frontend-nanodegree-arcade-game/)

## Classic Arcade Game Clone Udacity Project #3

This is my repository for Udacity's GitHub Project #3, the classic arcade game clone. The project involves using a provided basic game engine (utilizes HTML Canvas) to create game assets, and provide the logic and control for these assets.

### TODO
- [X] Refine collision system : [2D Collision Detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
- [ ] Refine player alignment on the board
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
- [ ] Gameplay: Levels? Refine Game mechanics (Break this category up)
- [ ] Change Lives remaining to be hearts displayed
- [ ] Style the scoreboard

- [X] Refactor JavaScript code:
    - [X] Use MVC pattern: Create Game Object that will keep track of player lives and scoring rather than having that tracked on the   player object
    - [X] Convert player Oject to Player Class
    - [X] Convert Enemy Object to Enemy Class 
    - [X] Create Game Controller - tracks level, lives remaining, and score. Spawns enemies, gems, etc. 
    - [X] Create a screenView - handles updating the screens

### Game Design Doc

What happens when the player gets to the top of the screen? Game resets to a new level and enemies spawn with a slightly harder difficulty? Or does the game screen scroll up and reveal another section? <br>
Potential use of keys in the game? What if the exit was a doorway that is initially closed when the level begins, and the player has to obtain the key in the level in order to unlock and open the exit? <br>
Gems provide bonus points, but there could also be power ups and extra life spawning in the game.


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
