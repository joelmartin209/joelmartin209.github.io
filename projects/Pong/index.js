/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const BOARD_WIDTH = $("#board").width();
  const BOARD_HEIGHT = $("#board").height();

  var KEYCODE = {
    "W": 87,
    "S": 83,
    "UP": 38,
    "DOWN": 40,
    "NUM_1": 49,
    "NUM_2": 50
  };
  
  // Game Item Objects
  function GameItem(id, speedY, speedX) {
    var item = {};
    item.id = id;
    item.x = parseFloat($(id).css("left"));
    item.y = parseFloat($(id).css("top"));
    item.width = $(id).width();
    item.height = $(id).height();
    item.speedY = speedY;
    item.speedX = speedX;

    return item;
  }

  var ball = GameItem("#ball", 1, 1);
  var leftPaddle = GameItem("#leftPaddle", 25, 0);
  var rightPaddle = GameItem("#rightPaddle", 25, 0);
  var player1Score = GameItem("#player1Score", 0, 0);
  var player2Score = GameItem("#player2Score", 0, 0);

  var score1 = 0;
  var score2 = 0;
  var ballBorderRadius = 5; // Determines the amount of hits it takes to change the ball to a square

  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keyup', handleKeyUp);                           // change 'eventType' to the type of event you want to handle
  startBall();

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    moveObject(ball);

    wallCollision(ball, false);
    wallCollision(leftPaddle, true);
    wallCollision(rightPaddle, true);

    displayScore(player1Score, score1);
    displayScore(player2Score, score2);

    doCollide(ball, leftPaddle);
    doCollide(ball, rightPaddle);

    checkForVictory();
  }

  /*


    Note to self: Include a counter for the number of bounces


    Note to self: Adding all this notation makes my code look more packed, don't care tho

    Note to self: Do what is in the "Note to self" zone


  */
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    var pie = event.which;

    if (pie === KEYCODE.W) {
      movePaddleUp(leftPaddle); // Left paddle goes up
    }
    if (pie === KEYCODE.S) {
      moveObject(leftPaddle); // Left paddle goes down
    }
    if (pie === KEYCODE.UP) {
      movePaddleUp(rightPaddle); // Right paddle goes up
    }
    if (pie === KEYCODE.DOWN) {
      moveObject(rightPaddle); // Right paddle goes down
    }
    if (pie === KEYCODE.NUM_1) {
      cheat(); // Shhhhh
    }
    if (pie === KEYCODE.NUM_2) {
      otherCheat(); // Shhhhh
    }
  }

  function handleKeyUp(event, gameItem) {
    var pie = event.which;

    if (pie === KEYCODE.W) {
      gameItem.speedY = 0; // Stop movin'
    }
    if (pie === KEYCODE.S) {
      gameItem.speedY = 0; // Stop movin'
    }
    if (pie === KEYCODE.UP) {
      gameItem.speedY = 0; // Stop movin'
    }
    if (pie === KEYCODE.DOWN) {
      gameItem.speedY = 0; // Stop movin'
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

  function startBall() {
    ball.x = BOARD_WIDTH / 2; // Set the ball in the middle of the x-axis
    ball.y = BOARD_HEIGHT / 2; // Set the ball in the middle of the y-axis
    ball.speedX = (Math.random() * 3 + 5) * (Math.random() > 0.5 ? -1 : 1); // Randomly set speed
    ball.speedY = (Math.random() * 3 + 5) * (Math.random() > 0.5 ? -1 : 1); // Randomly set speed
    ballBorderRadius = 5; // Overrides the previous ballBorderRadius
  }

  function moveObject(object) {
    object.x += object.speedX; // Move along the y-axis
    object.y += object.speedY; // Move along the x-axis

    $(object.id).css("left", object.x); // Shows horizontal movement
    $(object.id).css("top", object.y); // Shows vertical movement
  }

  function movePaddleUp(object) {
    object.y -= object.speedY; // Paddle goes up
    $(object.id).css("top", object.y); // Show paddle movement
  }

  function wallCollision(object, isPaddle) {
    if (isPaddle && (object.y > Math.min(BOARD_HEIGHT - object.height, object.y))) {
      object.y = BOARD_HEIGHT - object.height - 10; // Prevents the paddle from going beyond the board
    }
    else if (isPaddle && (object.y < Math.max(0, object.y))) {
      object.y = 20; // Prevents the paddle from going beyond the board
    }
    if(object.x > Math.min(BOARD_WIDTH - object.width, object.x) || object.x < Math.max(0, object.x)) {
      object.speedX = -object.speedX; // Didn't feel like removing this

      if(object.x > Math.min(BOARD_WIDTH - object.width, object.x)) {
        score1++; // Give points to winning player
        startBall(); // Reset the ball
      }
      if(object.x < Math.max(0, object.x)) {
        score2++; // Give points to winning player
        startBall(); // Reset the ball
      }
    }
    if(object.y > Math.min(BOARD_HEIGHT - object.height, object.y) || object.y < Math.max(0, object.y)) {
      object.speedY = -object.speedY; // Bounce of the top & bottom of the walls
    }
  }

  function displayScore(obj ,score) {
    $(obj.id).append("<p>").text("Score: " + score); // Show da score
  }

  function doCollide(bowl, paddle) {
    // TODO: calculate and store the remaining
    // sides of the square1
    bowl.leftX = bowl.x;
    bowl.topY = bowl.y;
    bowl.rightX = bowl.leftX + $(bowl.id).width();
    bowl.bottomY = bowl.topY + $(bowl.id).height();
    
    // TODO: Do the same for square2
    paddle.leftX = paddle.x;
    paddle.topY = paddle.y;
    paddle.rightX = paddle.leftX + $(paddle.id).width();
    paddle.bottomY = paddle.topY + $(paddle.id).height();
  
    // TODO: Return true if they are overlapping, false otherwise
    if ((bowl.rightX > paddle.leftX) &&
      (bowl.leftX < paddle.rightX) &&
      (bowl.bottomY > paddle.topY) &&
      (bowl.topY < paddle.bottomY)){       
        if (bowl.speedX < 0) {
          bowl.speedX -= 1; // Increase ball speed if going left
        } else {
          bowl.speedX += 1; // Increase ball speed if going right
        }
        if (ballBorderRadius > 0) {
          ballBorderRadius--; // Makes the ball into a square
          ball.borderRadius = $("#ball").css("border-radius", ballBorderRadius + "1px"); // Makes square appear on screen
        }
        bowl.speedX = -bowl.speedX; // Reverse ball direction
      } else {
        bowl.speedY = bowl.speedY; // I wanted to put an else statement but didn't know what to put in it
      }
  }  

  function checkForVictory() {
    if (score1 >= 10 || score2 >= 10) {
      endGame(); // I don't want to play infinitely
    }
  }

  function cheat() {
    score1++; // Don't tell anyone
  }

  function otherCheat() {
    score2++; // Seriously, don't say a word
  }
  
}