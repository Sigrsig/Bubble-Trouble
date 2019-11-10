/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

"use strict";

/* 
  * spatialManager.js - Object
  * Author: Elvar (eas20)
  * General collision detection of the game
*/

var spatialManager = {

    // ==============
    // "PRIVATE" DATA
    // ==============

    _nextSpatialID: 1, // First enity gets 1 as ID

    _entities: [],

    // =================
    // "PRIVATE" METHODS
    // =================

    /* 
      * _collide(e1, e2)
      * Checks if 2 entities are colliding with each other 
      * 
      * @param  e1  Entity number 1
      * @param  e2  Entity number 2
      * @return     Whether or not the 2 entities are colliding
    */
    _collide: function (e1, e2) {
        var type1 = e1.getSpatialType(),
            type2 = e2.getSpatialType();

        if (type1 == spatialManager.CIRCLE && type2 == spatialManager.CIRCLE) {
            return this._collideCircles(e1, e2);
        }
        else if (type1 == spatialManager.CIRCLE && type2 == spatialManager.SQUARE) {
            return this._collideCircleSquare(e1, e2);
        }
        else if (type1 == spatialManager.SQUARE && type2 == spatialManager.CIRCLE) {
            return this._collideCircleSquare(e2, e1);
        }
        else if (type1 == spatialManager.SQUARE && type2 == spatialManager.SQUARE) {
            return this._collideSquares(e1, e2);
        }
    },
    _collideCircles: function (c1, c2) {
        var x1 = c1.getPos().posX,
            x2 = c2.getPos().posX,
            y1 = c1.getPos().posY,
            y2 = c2.getPos().posY,
            r1 = c1.getRadius(),
            r2 = c2.getRadius();

        // Equation to calculate if 2 entities are colliding
        return util.square(x2 - x1) + util.square(y1 - y2) <= util.square(r1 + r2);
    },
    _collideCircleSquare: function (c1, s1) {
        var cx = c1.getPos().posX,
            sx = s1.getPos().posX,
            cy = c1.getPos().posY,
            sy = s1.getPos().posY,
            cr = c1.getRadius(),
            shw = s1.getSpatialHalfWidth(),
            shh = s1.getSpatialHalfHeight();

        var distX = Math.abs(cx - sx);
        var distY = Math.abs(cy - sy);

        if (distX > (shw + cr)) { return false; }
        if (distY > (shh + cr)) { return false; }

        if (distX <= (shw)) { return true; }
        if (distY <= (shh)) { return true; }

        return util.square(distX - shw) + util.square(distY - shh) <= util.square(cr);
    },
    _collideSquares: function (s1, s2) {
    },

    // ==============
    // PUBLIC DATA 
    // ==============
    CIRCLE: 0,
    SQUARE: 1,

    // ==============
    // PUBLIC METHODS
    // ==============

    /* 
      * getNewSpatialID()
      * Generate a new ID and returns it 
      * 
      * @return   New ID
    */
    getNewSpatialID: function () {
        return this._nextSpatialID++; // Returns id before increment
    },

    /* 
      * register(entity)
      * Register a entity in the _enities array
      * 
      * @param  entity  Entity that is getting registered
    */
    register: function (entity) {
        var spatialID = entity.getSpatialID();
        this._entities[spatialID] = entity;
    },

    /* 
      * unregister(entity)
      * Unegister a entity from the _entities array
      * 
      * @param  entity  Entity that is getting unregistered
    */
    unregister: function (entity) {
        var spatialID = entity.getSpatialID();
        delete this._entities[spatialID];
    },

    /*
      * reset() 
      * Resets the spatial manager to 
      * 
      * Initial value  
    */
    reset: function () {
        this._entities.length = 0;
    },

    /* 
      * findEntityInRange(e1)
      * Find every entity that is colliding with single entity
      * 
      * @param  e1  The entity that is getting a collision test
      * @return     Array of entities that is colling with e1
    */
    findEntityInRange: function (e1) {
        var res = [];
        // Iterate through all the registered entities
        this._entities.forEach(function (e2) {
            if (spatialManager._collide(e1, e2)) {
                res.push(e2); // Collision found!
            }
        });
        return res;
    },

    /* 
      * findEntityInRange(e1)
      * Find every entity that is colliding with single entity
      * 
      * @param  e1  The entity that is getting a collision test
      * @return     Array of entities that is colling with e1
    */
    findEntityInRange: function (e1) {
        var res = [];
        // Iterate through all the registered entities
        this._entities.forEach(function (e2) {
            if (spatialManager._collide(e1, e2)) {
                res.push(e2); // Collision found!
            }
        });
        return res;
    },

    /* 
      * render(ctx)
      * Render a red circle to indicate the collision area of all the objects
      * 
      * @param  ctx   The canvas
    */
    render: function (ctx) {
        var oldStyle = ctx.strokeStyle;

        // Iterate through all the registered entities
        this._entities.forEach(function (e) {

            if (e.getSpatialType() == spatialManager.CIRCLE) {
                ctx.strokeStyle = "red";
                util.strokeCircle(ctx, e.getPos().posX, e.getPos().posY, e.getRadius());
            }
            else if (e.getSpatialType() == spatialManager.SQUARE) {
                ctx.strokeStyle = "blue";
                var x = e.getPos().posX,
                    y = e.getPos().posY,
                    hw = e.getSpatialHalfWidth(),
                    hh = e.getSpatialHalfHeight();
                util.strokeBox(ctx, x - hw, y - hh, hw * 2, hh * 2);
            }
        });

        ctx.strokeStyle = oldStyle;
    }
}
