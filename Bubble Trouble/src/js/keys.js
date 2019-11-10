/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

"use strict";

/* 
  * keys.js
  * Author: Elvar (eas20) - But most copied from Pat 
  * Keyboard handling
*/

var keys = [];

/* 
  * handleKeydown(evt)
  * Handler for key getting pressed down 
  * 
  * @param  evt   The event
*/
function handleKeydown(evt) {
  keys[evt.keyCode] = true;
}

/* 
  * handleKeyup(evt)
  * Handler for key getting released
  * 
  * @param  evt   The event
*/
function handleKeyup(evt) {
  keys[evt.keyCode] = false;
}

/* 
  * eatKey(keyCode)
  * One-shot a key
  * 
  * @param  keyCode   The key
  * @return           If the key is already pressed
*/
function eatKey(keyCode) {
  var isDown = keys[keyCode];
  keys[keyCode] = false;
  return isDown;
}

/* 
  * keyCode(keyChar)
  * Converts a char to a charcode 
  * 
  * @param  keyChar The char 
  * @return         The keycode
*/
function keyCode(keyChar) {
  return keyChar.charCodeAt(0);
}

// Register the handlers
window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);
