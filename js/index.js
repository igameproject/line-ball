var canvas;
var ctx;
var score = 0;

const BALL_X = 50;
var ball_Y ;
const BALL_SIZE = 15;

const GRAVITY = Math.round(document.documentElement.clientHeight/56);
alert(GRAVITY);
const DRAG = GRAVITY*-1;//So that you're dragged up to the same degree that you're pulled down.
var ballYV = GRAVITY; //Initially let gravity act

const PIPE_WIDTH = 15;
var pipeXV = 7 ;
// var pipe_X ;

var pipes = [];
var score = 0;
var lives;
var gameOver; //boolean

window.onload = () => {
  canvas = document.getElementById("mainGame");
  canvas.height = document.documentElement.clientHeight;
  canvas.width = document.documentElement.clientWidth;
  ctx = canvas.getContext('2d'); 
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ball_Y = canvas.height/2;
  gameOver = false;
  lives = 3;


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
            gameReset();    
            gameOver = false;
        }
  });
  
  
  var framesPerSecond = 60;
  setInterval(mainGame,1000/framesPerSecond);
  var pipeGeneratePerSecond = 2;
  setInterval(generatePipes,1000/pipeGeneratePerSecond);

}; //initializing function


var mainGame = () => {

  if(!gameOver){
      
      if(outsideBoundaries()){
        checkLives();
      };

      ball_Y += ballYV; 

      ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      
      ctx.fillStyle = "salmon"
      ctx.beginPath();
      ctx.arc(BALL_X,ball_Y,BALL_SIZE,0,Math.PI*2);
      ctx.fill();

      pipes.forEach(function(elem,index){

        if(elem.pipe_X < 0){

          //delete the pipe if it moves out of canvas;
          score++;
          pipes.splice(index,1)

        }
        elem.pipe_X -= pipeXV;
     
        if (isColliding(elem)){
            checkLives();
        }
        
        ctx.fillStyle = "#acacac";
        ctx.fillRect(elem.pipe_X , elem.pipe_Y, PIPE_WIDTH, elem.pipeHeight);
        
      

      });

      ctx.fillStyle = "black";
      ctx.font="20px Arial";

      var scoreText = "Score : " + score;
      var livesText = "Lives : " + lives;

      ctx.fillText(scoreText, canvas.width - ctx.measureText(scoreText).width - 10,30);
      ctx.fillText(livesText, canvas.width - ctx.measureText(livesText).width - 10,50);

  }

  else{

      ctx.fillStyle = "salmon";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = "black";
      ctx.font="60px Arial";
      ctx.fillText("GAME OVER",canvas.width/2 - ctx.measureText("GAME OVER").width/2,150);
      ctx.font="30px Arial";
      ctx.fillText("Final Score : " + score , canvas.width/2 - 100,200);
      ctx.fillStyle = "#474747";
      ctx.font="20px Arial";
      ctx.fillText("Click to Play ", canvas.width/2  - 60,250);


  }

} //main game

var checkLives = () => {
  lives--;
  lives > 0 ? gameReset() : gameOver = true;
}

var gameReset = () => {
  ball_Y = canvas.height/2;
  pipes = [];
  if(gameOver) {
    score = 0;
    lives = 3;
  }
}



var outsideBoundaries = () => {

  return ball_Y < 0 || ball_Y > canvas.height;

}


var generatePipes = () => {


  var pipe =  {
    pipeHeight : 0,
    pipe_X : canvas.width,
    pipe_Y: canvas.height,
    pipeOrigin : 0

  };

  pipe.pipeHeight = Math.floor(Math.random()*(canvas.height/6)-10)+canvas.height/2;

  pipe.pipeOrigin = Math.floor(Math.random()*2);
  //0 -> means top ; 1 -> means bottom
  if(pipe.pipeOrigin == 0){
    pipe.pipe_Y = 0;

  }
  else{
      pipe.pipe_Y = canvas.height - pipe.pipeHeight 
  }

  pipes.push(pipe);

}



var isColliding  = (pipe) => {
 
  if(pipe.pipe_X <= BALL_X + BALL_SIZE && pipe.pipe_X >= BALL_X - BALL_SIZE){
      if(pipe.pipeOrigin == 0  && pipe.pipeHeight > ball_Y){
        return true;
      }
      else if(pipe.pipeOrigin == 1  && pipe.pipe_Y < ball_Y){
        return true;
      }
      else{
        return false;
      }

  }


}




