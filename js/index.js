var canvas;
var ctx;
var score = 0;

const BALL_X = 50;
var ball_Y ;
var BALL_SIZE = 15;
const BALL_SHRINK = 2;

const GRAVITY = 9 ;
const DRAG = -9;
var ballYV = GRAVITY; //Initially let gravity act

const PIPE_WIDTH = 15;
var pipeXV = 6 ;
const XV_SHRINK = 0.5;
// var pipe_X ;

// SCORE MATH
var numLives = 3;
var lastCollidedElement;

// POWERUPS 
const powerup_effects = [ 'FREE_LIFE','SHRINK_BALL','SLOW_DOWN']; // can add more powerups as needed
const powerup_colours = ['#006600', '#660066', "#995511"]; // colour powerups as needed

var pipes = [];
var powerups = [];
var score = 0;

var gameOver; //boolean

window.onload = () => {
  canvas = document.getElementById("mainGame");
  ctx = canvas.getContext('2d'); 
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ball_Y = canvas.height/2;
  gameOver = false;
  numLives = 3;
  lastCollidedElement = {};

  document.addEventListener('keydown',function(evt){
      if(evt.code == "Space"){
          ballYV = DRAG;
      }});

  document.addEventListener('keyup',function(evt){
      if(evt.code == "Space"){
            ballYV = GRAVITY;
        }
  });

  document.addEventListener('mousedown',function(evt){
   
      if(gameOver == true){
            gameOver = false;
            gameReset();
        }
  });
  
  var framesPerSecond = 60;
  setInterval(mainGame,1000/framesPerSecond);

  var pipeGeneratePerSecond = 2;
  setInterval(generatePipes,1000/pipeGeneratePerSecond);

  var powerupGeneratePerSecond = 0.55;
  setInterval(generatePowerup,1000/powerupGeneratePerSecond);

}; //initializing function


var mainGame = () => {

  if(!gameOver){
      
      if(outsideBoundaries()){
        gameOver = true;
      };

      ball_Y += ballYV; 

      ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      
      ctx.fillStyle = "salmon"
      ctx.beginPath();
      ctx.arc(BALL_X,ball_Y,BALL_SIZE,0,Math.PI*2);
      ctx.fill();
      
      pipes.forEach((elem,index) => {

        if(elem.X < 0){
          //delete the pipe if it moves out of canvas;
          score++;
          pipes.splice(index,1)
        }

        elem.X -= pipeXV;

        if (isPipeColliding(elem) && lastCollidedElement !== elem){
          // get reference to the element we're colliding with and only subtract a life it we haven't hit it before 
          // (this removes the 'instakill' from when the counter decreases per frame as you're colliding with the bar)
          lastCollidedElement = elem;
          // if we have a life remaining, we'll decrease by 1. if that was our last life, we're dead.
          if (numLives > 1){
            takeDamage();
          }else{
            gameOver = true;
          }
        }

        ctx.fillStyle = "#acacac";
        ctx.fillRect(elem.X , elem.Y, PIPE_WIDTH, elem.height);

      });

      // draw powerups
      powerups.forEach((elem, index) => {
        if (elem.X < (0 - elem.width ))
          // remove powerup off screen
          powerups.splice(index, 1);

        // apply velocity
        elem.X -= pipeXV;
        
        // Collision with player has some effect
        if (isPowerupColliding(elem)){
          switch(elem.effect){
            case 'FREE_LIFE':
            // we can simply increase the number of lives
              numLives++;
            break;
            case 'SHRINK_BALL':
              // shrink ball size by BALL_SHRINK pix
              if (BALL_SIZE > 5){
                BALL_SIZE -= BALL_SHRINK;
              }
            break;
            case 'SLOW_DOWN':
            // Slow ball down by XV_SHRINK amount
            if (pipeXV > 2){
              pipeXV -= XV_SHRINK;
            }
          break;
          }
          // remove after contact
          powerups.splice(index, 1);
        }

        // draw powerup
        ctx.fillStyle = elem.color;
        ctx.fillRect(elem.X , elem.Y, elem.width, elem.height);
      });

      showStats();
  } else {
      showDeathScreen();
  }
} //main game


var showStats = () => {
  ctx.fillStyle = "black";
  ctx.font="20px Arial";
  ctx.fillText("Score : " + score , 480,30);
  // let's show our remaining lives
  ctx.fillText("Lives : " + numLives , 0,30);
  ctx.fillText("Width : " + BALL_SIZE , 95,30);
  ctx.fillText("Speed : " + pipeXV , 250,30);
}

var showDeathScreen = () =>
{
  ctx.fillStyle = "salmon";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "black";
  ctx.font="60px Arial";
  ctx.fillText("GAME OVER",112,150);
  ctx.font="30px Arial";
  ctx.fillText("Final Score : " + score , canvas.width/2 - 100,200);
  ctx.fillStyle = "#474747";
  ctx.font="20px Arial";
  ctx.fillText("Click to Play ", canvas.width/2  - 60,250);
}

var takeDamage = () => 
{
  // reduce number of lives
  numLives -= 1;

  // we could remove the powerups and set the ball params back to their defaults:
  BALL_SIZE = 15;
  pipeXV = 6;

  // lets flash the screen red on hit to show taking damage
  ctx.fillStyle = "red";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

var gameReset = () => {
  ball_Y = canvas.height/2;
  pipes = [];
  powerups = [];
  numLives = 3;
  score = 0;
  BALL_SIZE = 15;
  lastCollidedElement = {};
}

var outsideBoundaries = () => {
  return ball_Y < 0 || ball_Y > canvas.height;
}

var generatePowerup = () => {

  var powerup = {
    height :25,
    width :25,
    X : canvas.width,
    Y : canvas.height,
    origin : 0,
    effect : '',
    color:''
  };

  powerup.Y = Math.floor(Math.random()*(canvas.height - BALL_SIZE * 3));
  var ind = Math.floor(Math.random()*powerup_effects.length);
  powerup.effect = powerup_effects[ind];
  powerup.color = powerup_colours[ind];

  powerups.push(powerup);
}

// pickup collision check (without 'origin' logic for pipe)
var isPowerupColliding  = (elem) => {
  if(elem.X <= BALL_X + BALL_SIZE && elem.X >= BALL_X - BALL_SIZE){
    if(elem.height > ball_Y){
      return true;
    }
    else if(elem.Y < ball_Y){
      return true;
    }
    else{
      return false;
    }
  }
}

var generatePipes = () => {
  
  var pipe =  {
    height : 0,
    X : canvas.width,
    Y : canvas.height,
    origin : 0
  };


  pipe.height = Math.floor(Math.random()*(canvas.height - BALL_SIZE*3)-10);
  pipe.origin = Math.floor(Math.random()*2);

  //0 -> means top ; 1 -> means bottom
  if(pipe.origin == 0){
    pipe.Y = 0;
  }
  else{
      pipe.Y = canvas.height - pipe.height 
  }
  pipes.push(pipe);
}


var isPipeColliding = (pipe) => {    
  if(pipe.X <= BALL_X + BALL_SIZE && pipe.X >= BALL_X - BALL_SIZE){
    if(pipe.origin == 0  && pipe.height > ball_Y){
      return true;
    }
    else if(pipe.origin == 1  && pipe.Y < ball_Y){
      return true;
    }
    else{
      return false;
    }

}

}




