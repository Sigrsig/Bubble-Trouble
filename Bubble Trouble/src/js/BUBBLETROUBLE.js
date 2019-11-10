// =========
// BUBBLE TROUBLE
// =========
/*

   TODO:  LÝSING Á LEIKNUM.


*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// =================
// UPDATE SIMULATION
// =================


// GAME-SPECIFIC UPDATE LOGIC

var RESET = false;

function updateSimulation(du) {
    if(GAME_MODE === 1) {
        processDiagnostics();
        entityManager.update(du);
        util.setBackground(Levels[INDEX]["background"]);
        if(RESET) {
            entityManager.reset();
            spatialManager.reset();
            RESET = false;
        }
    }    
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;

var KEY_SPATIAL = keyCode('X');

var KEY_RESET = keyCode('R');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) {
        g_renderSpatialDebug = !g_renderSpatialDebug;
    }

    if (eatKey(KEY_RESET)) {
        RESET = true;
    }

}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
    if (GAME_MODE === 0) {
        gameSong.play();
        menu.renderMenu();
    }
    if (GAME_MODE === 1) {
        entityManager.render(ctx);
        renderLife(ctx);
    }
    if (g_renderSpatialDebug) {
        spatialManager.render(ctx);
    }
}

// Render remaining life count
function renderLife(ctx) {
    var life = "Extra lives: "
    ctx.fillText(life, 30, 50);
    
    for (var i = 0; i < lives; i++) {
      fillCircle(ctx, 200 + 30*i, 42, 8);
    }
  }


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        // TODO: use another image for player
        player   : "imgs/demonBack.png",
        playerRight : "imgs/demonSide.png",
        playerLeft : "imgs/demonLeft.png",
        ball     : "imgs/bubbleboi.png",
        bullet : "imgs/pitchfork.png",
       
        lifePu : "imgs/HeartPu.png",
        bulletPu : "imgs/BulletPu.png",
        bulletPlusPu : "imgs/PulletPlusPu.png",
        stopPu : "imgs/stopPu.png",
       
        menuDemon : "imgs/demonFront.png",
        menuBg : "imgs/menuBg.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.playerLeft  = new Sprite(g_images.playerLeft);
    g_sprites.playerRight  = new Sprite(g_images.playerRight);
    g_sprites.player  = new Sprite(g_images.player);
    

    g_sprites.bullet = new Sprite(g_images.bullet);
    g_sprites.powerup = new Sprite(g_images.player);

    g_sprites.ball = new Sprite(g_images.ball);

    g_sprites.lifePu = new Sprite(g_images.lifePu);
    g_sprites.bulletPu = new Sprite(g_images.bulletPu);
    g_sprites.bulletPlusPu = new Sprite(g_images.bulletPlusPu);
    g_sprites.stopPu = new Sprite(g_images.stopPu);


    g_sprites.powerup.scale = 0.5;

    entityManager.init();

    main.init();
}

// Kick it off
requestPreloads();
