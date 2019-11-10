/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

"use strict";

/* 
  * handleMouse.js
  * Author: Elvar (eas20) - But most copied from Pat 
  * Mouse handling
*/

var g_mouseX = 0,
    g_mouseY = 0;

/* 
  * handleMouse(evt)
  * Handler for the mouse being moved 
  * 
  * @param  evt   The event
*/
function handleMouse(evt) {

  g_mouseX = evt.clientX - g_canvas.offsetLeft;
  g_mouseY = evt.clientY - g_canvas.offsetTop;

  // If no button is being pressed, then bail
  var button = evt.buttons === undefined ? evt.which : evt.buttons;
  if(!button) {
    return;
  }
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouse);
window.addEventListener("mousemove", handleMouse);
