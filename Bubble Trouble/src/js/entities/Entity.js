/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

"use strict";

/* 
  * Entity.js - Entity Object
  * Author: Elvar (eas20) - But most copied from Pat 
  * Object from which every entity in the game inherit from.
  * Provides simple function like getX() and ect.
  * 
*/

// ============== 
// CONSTRUCTOR
// ==============
function Entity() {
};

/* 
  * setup(descr)
  * Sets up the properties. The "real" constructor. 
  *   
  * @param  descr   The descriptor for the entity 
*/
Entity.prototype.setup = function (descr) {

  // Apply all setup properies from the (optional) descriptor
  for (var property in descr) {
    this[property] = descr[property];
  }

  // Get my (unique) spatial ID
  this._spatialID = spatialManager.getNewSpatialID();

  // I am not dead yet!
  this._isDeadNow = false;
};


// ==============
// PUBLIC METHODS
// ==============

/* 
  * kill()
  * Marks this entity as dead  
*/
Entity.prototype.kill = function () {
  this._isDeadNow = true;
};

/* 
  * findHitEntity()
  * Finds every entity that is colliding with this one 
  * 
  * @return   List of all entities that are colliding with this enity
*/
Entity.prototype.findHitEntity = function () {
  return spatialManager.findEntityInRange(this);
};

/* 
  * isColliding()
  * Finds out if this entity is colliding with any other entity
  * 
  * @return   If the entity is colliding with another entity or not  
*/
Entity.prototype.isColliding = function () {
  return this.findHitEntity();
};


// =======
// SETTERS
// =======

/* 
  * setPos(cx, cy)
  * Sets the current position of the entity
  *   
  * @param  cx  The x coord
  * @param  cy  The y coord
*/
Entity.prototype.setPos = function (cx, cy) {
  this.cx = cx;
  this.cy = cy;
};

// =======
// GETTERS
// =======

/* 
  * getPos()
  * Get the position of the entity and returns it
  * 
  * @return   The position as a list
*/
Entity.prototype.getPos = function () {
  return { posX: this.cx, posY: this.cy };
};

/* 
  * getRadius()
  * Get the radius of the entity and returns it
  * 
  * @return   The radius of the entity
*/
Entity.prototype.getRadius = function () {
  return 0;
};

/* 
  * getSpatialID()
  * Get the spatial ID of the entity and returns it
  * 
  * @return   The spatial ID of the entity
*/
Entity.prototype.getSpatialID = function () {
  return this._spatialID;
};

/* 
  * getSpatialType()
  * Get the spatial type of the entity and returns it
  * 
  * @return   The spatial type of the entity
*/
Entity.prototype.getSpatialType = function () {
    return this._spatialType;
  };
