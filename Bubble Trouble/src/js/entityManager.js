/*

entityManager.js

A module which handles arbitrary entity-management for "Bubble trouble"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_player   : [],
_bullets : [],
_balls : [],
_powerups : [],
_bricks : [],
_maxBullets : 1,
_bulletPowerUp : false,

// "PRIVATE" METHODS

_generateBall : function() {
  
  this.generateBall({cx: 350, cy: 500, xVel: 2, yVel: -10});
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._balls, this._bullets, this._player, this._bricks, this._powerups];
},

init: function() {
    this._level = Levels[INDEX];

    this.generatePlayer({cx:500, cy:520}); 

    this.set();
},

reset: function() { 
    this._player[0].reset();
    this._bullets.length = 0;
    this._balls.length = 0;
    this._powerups.length = 0;
    this._bricks.length = 0;
    this._maxBullets = 1;
    this.clearPlayerPowerup();
    this.clearPowerUp();
    this.set();
},

set: function() {
    this._level.balls.forEach(function(e) {
        entityManager.generateBall({
            cx : e[0],
            cy : e[1],
            xVel : e[2],
            yVel : e[3],
        });      
    });

    this._level.bricks.forEach(function(e) {
        entityManager.generateBrick({
            cx : e[0],
            cy : e[1],
            halfWidth : e[2], halfHeight : e[3],
            breakable : e[4]
        });      
    });
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    if(this._bullets.length < this._maxBullets) {
          this._bullets.push(new Bullet({
          cx : cx, cy : cy + 600,
          halfWidth : 4, halfHeight : 600,
          powerupBullet : this._bulletPowerUp
      }));
    }
},

clearPlayerPowerup: function() {
    this._player[0].clearHasPowerup();
},

clearPowerUp: function() {
    
    this._bulletPowerUp = false;

    for (var i = 0; i< this._balls.length; ++i) {
        this._balls[i].undoPause();
    }

    this._player[0].clearExtraLife();
    
    this._maxBullets = 1;
},

checkPowerUp: function(powerUp, player) {
    // clear current powerup
    this.clearPowerUp();
    // player gets an extra life
    if(powerUp.type==1) {
        player.getExtraLife();
    } 
    // the bullet sticks 
    if(powerUp.type==2) {
        this._bulletPowerUp = true;
    }
    // player can shoot two bullets at the time
    if (powerUp.type==3) {
        this.setMaxBullets(2);
    }
    if (powerUp.type==4) {
        this.pauseAllBalls();
    }
},


pauseAllBalls: function() {
    // pause all the balls 
    for (var i = 0; i< this._balls.length; ++i) {
        this._balls[i].setPause();
    }
},

generatePowerUp : function(cx, cy) {
    this._powerups.push(new PowerUp({
        cx : cx,
        cy : cy,
        type : Math.floor(Math.random() * 4) + 1 
    }));
},

setMaxBullets: function(num){
    this._maxBullets = num;
},

generateBall : function(descr) {
    this._balls.push(new Ball(descr));
},

generateBrick : function(descr) {
    this._bricks.push(new Brick(descr));  
},

generatePlayer : function(descr) {
    this._player.push(new Player(descr));
},

resetPlayer: function() {
    this._forEachOf(this._player, Player.prototype.reset);
},


update: function(du) {
    if(this._balls.length < 1) {
        INDEX += 1;
        this._level = Levels[INDEX];
        RESET = true;
    }

    if(lives < 0) {
        gameOver.play();
        GAME_MODE = 0;
        lives = 5;
        INDEX = 0;
        this._level = Levels[INDEX];
        RESET = true;
    }

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {
            
            var status = aCategory[i].update(du);
            
            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];


        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
},


allEntities: function() {
    var res = [];
    for(var c = 0; c < this._categories.length; c++) {
        var aCategory = this._categories[c];

        for(var i = 0; i < aCategory.length; i++) {

            res.push(aCategory[i]);
            
        }
    }
    return res;
},
}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

