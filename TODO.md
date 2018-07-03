## Project #3 TODO/Wishlist

While I'm working on a project, I find it helpful to have a TODO list and a Wishlist so I can keep track of tasks and accomplishments. I also have a small game design doc that I used to think through my game design plans as I worked on the game.

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

- [X] LocalStorage High Score tracker
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

