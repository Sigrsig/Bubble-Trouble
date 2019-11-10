// ======
// Levels 
// ======

"use strict";
/* jshint browser: true, devel: true, globalstrict: true */


var INDEX = 0;  // This should be used to change levels 


/*
Array that contains the levels. Each level has certain features 
that the createLevel function uses to generate a level. 
*/
var Levels = [
    {
        title: "Level 1",
        background: "imgs/cavebg.png", 
        balls: [[600, 250, 2, -10]],  
        bricks: []
    }, 
    {
        title: "Level 2", 
        background: "imgs/Icebg.png",
        balls: [[200, 250, 2, -10],
                [800, 250, -2, -10]],
        bricks: []
    },
    {
        title: "Level 3",
        background: "imgs/Hellbg.png",
        balls: [[250, 200, 2, -10],
                [550, 200, 2, -10],
                [825, 150, 2, -10]],
        bricks: [[850, 200, 150, 4, true],
                 [700, 100, 4, 104, false]]                                       
    },
    {
        title: "Level 4",
        background: "imgs/toxicbg.png",  
        balls: [[200, 200, 2, -10],
                [400, 200, 2, -10],
                [600, 200, 2, -10],
                [800, 200, 2, -10]],  
        bricks: [[87.5, 250, 37.5, 4, true],
                 [212.5, 250, 37.5, 4, true],
                 [350, 250, 50, 4, false],
                 [500, 250, 50, 4, true],
                 [650, 250, 50, 4, false],
                 [787.5, 250, 37.5, 4, true],
                 [915.5, 250, 37.5, 4, true]]
    },
    {
        title: "Level 5", 
        background: "imgs/candylandbg.png",
        balls: [[175, 150, 2, -10],
                [500, 150, 2, -10],
                [650, 325, -2, -10],
                [825, 150, 2, -10]],
        bricks: [[175, 200, 171, 4, true],
                 [350, 100, 4, 104, false],
                 [500, 200, 146, 4, true],
                 [650, 100, 4, 104, false],
                 [825, 200, 171, 4, true]]
    }
];
