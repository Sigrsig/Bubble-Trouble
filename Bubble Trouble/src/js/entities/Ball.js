// ====
// BALL
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// All active balls in game. Use this array if the intention is to implement multiple-balls feature
var g_activeBalls = [];

// A generic contructor which accepts an arbitrary descriptor object
function Ball(descr) {

    // Common inherited setup logic from Entity
    
    this.setup(descr);
      
    this.origYVel = this.yVel;
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ball;
    this.scale  = this.scale  || 0.5;
    this.pause = false;
    
    this.rotation = Math.random()*6;

    this._spatialType = spatialManager.CIRCLE;
};

Ball.prototype = new Entity();


Ball.prototype.pauseLifespan = 4000 / NOMINAL_UPDATE_INTERVAL;
var NOMINAL_GRAVITY = 0.12;
Ball.prototype.update = function (du) {
    
    spatialManager.unregister(this);

    if(this.pause){
        this.pauseLifespan -= du; 
    }

    if(this.pauseLifespan<0) {
        entityManager.clearPowerUp(); 
        entityManager.clearPlayerPowerup();
    }
    
    var prevX = this.cx;
    var prevY = this.cy;

    this.yVel += NOMINAL_GRAVITY;
    
    this.rotation += 0.005;
  
    // Compute my provisional new position (barring collisions)
    this.nextX = prevX + this.xVel * du;
    this.nextY = prevY + this.yVel * du;

    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    if (!this.pause){
        var r = this.getRadius();
        // Bounce off top, bottom and side edges
        if(this.nextY < r) {
            this.yVel *= -1;
        }  
        if(this.nextY > g_canvas.height - r) {
            this.yVel = this.origYVel;
        }
        if (this.nextX < r || this.nextX > g_canvas.width - r) {
            this.xVel *= -1;
        }
        

        this.cx += this.xVel * du;
        this.cy += this.yVel * du;
    }
    



    var entities = this.findHitEntity(), // Finds every entity that is colliding with the bullet
    ball = this; // JavaScript is unable to recognize 'this' in the function below

    entities.forEach(function(entity) {
      /* What to do if the bullet is colliding with a rock or another bullet */
        if(entity instanceof Bullet) {
            entity.takeHit();
            ball.takeHit();
            return entityManager.KILL_ME_NOW;
        }
        if(entity instanceof Player) { 
            entity.takeHit();
        }
        if(entity instanceof Brick) { 
            ball.yVel = ball.origYVel/2;
        }
    });


    spatialManager.register(this);
};

Ball.prototype.undoPause= function (){
    this.pause=false;
    this.pauseLifespan =  3000 / NOMINAL_UPDATE_INTERVAL;
}

Ball.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.6;
};

Ball.prototype.setPause = function () {
    this.pause = true;
}

Ball.prototype.takeHit = function () {
    this.kill();
    // Powerup drops down
    // 25% chance
    var i = Math.floor(Math.random() * 3) + 1;
    if(i===2){
        entityManager.generatePowerUp(this.cx, this.cy);
    }
    
    if (this.scale > 0.125) {
        this._spawnFragment(1, this.origYVel+1);
        this._spawnFragment(-1, this.origYVel+1);
    } else {
    }
};

Ball.prototype._spawnFragment = function(xVel, yVel) {
    entityManager.generateBall({
        cx : this.cx,
        cy : this.cy,
        xVel : xVel,
        yVel : yVel,
        scale : this.scale/2
    });
};

Ball.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
