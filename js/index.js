var canvas;
var ctx;
var score = 0;

const BALL_X = 70;
var ball_Y ;
var ballSize = 15;

const GRAVITY = 8 ;
const DRAG = -8;
var ballYV = GRAVITY; //Initially let gravity act

window.onload = () => {
  canvas = document.getElementById("mainGame");
  ctx = canvas.getContext('2d'); 
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ball_Y = canvas.height/2;

  document.addEventListener('keydown',handleKeyDown);
  document.addEventListener('keyup',handleKeyUp);
  
  var framesPerSecond = 60;
  setInterval(mainGame,1000/framesPerSecond);
 
};


var mainGame = () => {
 
  ball_Y += ballYV; 

  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  ctx.fillStyle = "orange"
  ctx.beginPath();
  ctx.arc(BALL_X,ball_Y,ballSize,0,Math.PI*2);
  ctx.fill();


 
 

  // ctx.fillStyle = "black";
  // ctx.font="20px Arial";
  // ctx.fillText("Score : " + score ,290,30);
  // console.log(score);
}





// var collision = () => {
//   var bodyBox={
//     x : xv - BODY_SIZE/2,
//     y : yv - BODY_SIZE/2,
//     width : BODY_SIZE,
//     height : BODY_SIZE

//   }
//   var foodBox={
//     x : foodX - FOOD_SIZE/2,
//     y : foodY - FOOD_SIZE/2,
//     width : FOOD_SIZE,
//     height : FOOD_SIZE

//   }

//   return testCollisionRect(bodyBox,foodBox);
// }


// var  testCollisionRect = (rect1,rect2) => {
//   return rect1.x <= rect2.x + rect2.width
//     && rect2.x <= rect1.x + rect1.width
//     && rect1.y <= rect2.y + rect2.height
//     && rect2.y <= rect1.y + rect1.height;

//  }



// var checkBoundaries = () => {
//   if(xv < 0 ){
//       xv = canvas.width - BODY_SIZE
//   }
//   else if (xv > canvas.width){
//     xv = BODY_SIZE
//   }
//   else if(yv < 0 ){
//       yv = canvas.height - BODY_SIZE
//   }
//   else if (yv > canvas.height){
//     yv = BODY_SIZE
//   }

// }


var handleKeyDown = (evt) => {

      if(evt.code == "Space"){
          ballYV = DRAG;
      }
}

var handleKeyUp = (evt) => {

      if(evt.code == "Space"){

          ballYV = GRAVITY;

      }
    


}