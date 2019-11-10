// ==========
// Player STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.player;
    
    // Set normal drawing scale, and warp state off
    this.scale = 1;
    this.rotation = 0;
    this.extraLife = false;
    this.hasPowerUp = false;
    this._spatialType = spatialManager.SQUARE;
};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
};

Player.prototype.clearHasPowerup = function () {
    this.hasPowerUp = false;
}

Player.prototype.KEY_LEFT   = keyCode('A');
Player.prototype.KEY_RIGHT  = keyCode('D');

Player.prototype.KEY_FIRE   = keyCode(' ');

// Initial, inheritable, default values

Player.prototype.cx = 200;
Player.prototype.cy = 200;

Player.prototype.numSubSteps = 1;
    
Player.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);

    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.updatePlayer();
    // Handle firing
    this.maybeFireBullet();

    var entities = this.findHitEntity();
    var player = this; // Finds every entity that is colliding with the bullet
    

    entities.forEach(function(entity) {
      /* if player collides with powerup */
        if(entity instanceof PowerUp) { 
            player.powerUp = entity;
            player.hasPowerUp = true;
            entityManager.checkPowerUp(entity, player);
            entity.takeHit();
        }
    });

    spatialManager.register(this);
    
};


Player.prototype.clearExtraLife = function () {
    this.extraLife = false;
}

Player.prototype.takeHit = function () {
    if(this.extraLife) {
        this.extraLife = false;
    } else {
        lives--;
    }
    RESET = true;
    this.hasPowerUp = false;
    entityManager.clearPowerUp();
};

Player.prototype.getExtraLife = function () {
    this.extraLife = true;
}


Player.prototype.maybeFireBullet = function () {
    if(eatKey(this.KEY_FIRE)) {
        entityManager.fireBullet(this.cx, this.cy-this.getRadius());
    }
};

Player.prototype.getSpatialHalfWidth  = function () {
    return 30;
};

Player.prototype.getSpatialHalfHeight  = function () {
    return 40;
};

Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy, this.lives);
};

Player.prototype.getPowerUp = function () {
    return this.powerUp;
}


Player.prototype.updatePlayer = function (du) {
    var haltflag = true;
    if (keys[this.KEY_LEFT]) {
        haltflag = false;
        if (this.cx == 30) {
            this.cx = this.cx;
        } else {
            this.cx -= 5;
        }
        this.sprite = g_sprites.playerLeft;
    }
    if (keys[this.KEY_RIGHT]) {
        haltflag = false;
        if (this.cx == g_canvas.width-30) {
            this.cx = this.cx;
        } else {
            this.cx += 5;
        }
        this.sprite = g_sprites.playerRight;
    }
    if(haltflag) {
      this.sprite = g_sprites.player;
    }
};

Player.prototype.drawPowerUp = function (ctx) {
   var sprite = this.powerUp.getSprite();
   sprite.drawCentredAt(
    ctx, 900, 50);

}

Player.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.lives = 5;
    this.sprite.scale = this._scale;
    this.sprite.scale = origScale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    // if player has a powerup then draw it on the screen
    if(this.hasPowerUp){
        this.drawPowerUp(ctx);
    }
    
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

};
