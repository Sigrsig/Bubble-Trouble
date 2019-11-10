/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

"use strict";

/* 
  * main.js - Object + browser support
  * Author: Elvar (eas20) - But most copied from Pat 
  * The mainloop of the game
*/

// Mainloop-level debug-rendering
var TOGGLE_TIMER_SHOW = keyCode('T');

// Quit the game
var KEY_QUIT = keyCode('Q');
var START_GAME = keyCode('Y');


var main = {

  // ==============
  // "PRIVATE" DATA
  // ==============

  // "Frame Time" is a (potentially high-precision) frame-clock for animations
  _frameTime_ms: null,
  _frameTimeDelta_ms: null,
  _isGameOver: false,
  _doTimerShow: false,


  // =================
  // "PRIVATE" METHODS
  // =================

  /* 
    * main._iterCore(frameTime)
    * Perform the iteration core to do all the "real" work
    * 
    * @param  frameTime   The time of the frame
  */
  _iterCore: function(dt) {
    
    // Handle QUIT
    if(requestedQuit()) {
      this.gameOver();
      return;
    }

    //gatherInputs();
    update(dt);
    render(g_ctx);

    if (eatKey(START_GAME)) {
      GAME_MODE = 1;
    }
  },

  /* 
    * main._requestNextIteration()
    * Request a new frame of the game
    */
  _requestNextIteration: function() {
    window.requestAnimationFrame(mainIterFrame);
  },

  /* 
    * main._updateClocks(frameTime)
    * Use the given frameTime to update all of our game-clocks
    * 
    * @param  frameTime   The time of the frame
  */
  _updateClocks: function(frameTime) {
      
    // First-time initialisation
    if(this._frameTime_ms === null) this._frameTime_ms = frameTime;

    // Track frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
  },

  /* 
    * main._debugRender(ctx)
    * Diagnostics, such as showing current timer values etc.
    * 
    * @param  ctx   The canvas
  */
  _debugRender: function(ctx) {

    if(eatKey(TOGGLE_TIMER_SHOW)) {
      this._doTimerShow = !this._doTimerShow;
    }

    if(!this._doTimerShow) { 
      return;
    }

    var y = 350;
    ctx.fillText('FT ' + this._frameTime_ms, 50, y + 10);
    ctx.fillText('FD ' + this._frameTimeDelta_ms, 50, y + 20);
    ctx.fillText('UU ' + g_prevUpdateDu, 50, y + 30);
    ctx.fillText('FrameSync ON', 50, y + 40);
  },


  // ==============
  // PUBLIC METHODS
  // ==============

  /* 
    * main.init()
    * Bootstrap the main-loop
  */
  init: function() {
    // Un-comment when the game is deployed
    //window.focus(true);

    g_ctx.fillStyle = "white";

    this._requestNextIteration();
  },

  /* 
    * main.iter(frameTime)
    * Perform one iteration of the mainloop
    * 
    * @param  frameTime   The time of the frame
  */
  iter: function(frameTime) {
    this._updateClocks(frameTime);

    this._iterCore(this._frameTimeDelta_ms);
  
    // Diagnostics, such as showing current timer values etc.
    this._debugRender(g_ctx);
  
    // Request the next iteration if needed
    if(!this._isGameOver) {
      this._requestNextIteration();
    }
  },

  /* 
    * main.gameOver()
    * Quits the game
  */
  gameOver: function() {
    this._isGameOver = true;
    console.log("gameOver: quitting...");
  },
};




// Annoying shim for Firefox and Safari
window.requestAnimationFrame =
  window.requestAnimationFrame ||        // Chrome
  window.mozRequestAnimationFrame ||     // Firefox
  window.webkitRequestAnimationFrame;    // Safari

/* 
  * mainIterFrame(frameTime)
  * Calls the iter function because "window" API's 
  * have to have access to a "global" function to work correctly
  * 
  * @param  frameTime   The time of the frame
*/
function mainIterFrame(frameTime) {
    main.iter(frameTime);
}

/* 
  * requestedQuit()
  * Check if a request for quitting the game as been made
  * 
  * @return   Whether or not request has been made
*/
function requestedQuit() {
  return keys[KEY_QUIT];
}

