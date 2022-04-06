/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 10;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  const GRIDX = 20; // Use to create a nice looking grid to play on
  const GRIDY = 20; // Use to create a nice looking grid to play on

  const BOARDX = $("#board").width();
  const BOARDY = $("#board").height();

  const KEYCODE = {
    "W": 87,
    "S": 83,
    "A": 65,
    "D": 68
  };
  
  // Game Item Objects
  function CreateObject(x, y, id) {
    var object = {};
    object.x = parseFloat($(id).css("left"));
    object.y = parseFloat($(id).css("top"));
    object.id = id;
    object.speedX = 0;
    object.speedY = 0;
    return object;
  }

  var snek = [];
  snek.push(CreateObject(200, 200, "#snekHead"));
  var snekHead = snek[0];

  var apple = CreateObject("#apple");
  
  var isLeft = false;
  var isUp = true;
  var isRight = false;
  var isDown = false;

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  placeApple();
  addSnekPart();

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    moveSnek();
    moveSnekHead();
    handleEatApple();
    stayInBounds();
    noOverlap();
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    // Detect which key is pressed
    // Change the x and y speeds
    var keys = event.which;

          // If "W" is pressed
          // Change speedX to 0 and change speedY to -20
    if(keys === KEYCODE.W && isDown !== true) {
      snekHead.speedX = 0;
      snekHead.speedY = -20;
      
      isUp = true;
      isDown = false;
      isLeft = false;
      isRight = false;
    }

          // If "D" is pressed
          // Change speedX to 20 and change speedY to 0
    if(keys === KEYCODE.D && isLeft !== true) {
      snekHead.speedX = 20;
      snekHead.speedY = 0;

      isRight = true;
      isLeft = false;
      isUp = false;
      isDown = false;
    }

          // If "S" is pressed
          // Change speedX to 0 and change speedY to 20
    if(keys === KEYCODE.S && isUp !== true) {
      snekHead.speedX = 0;
      snekHead.speedY = 20;

      isDown = true;
      isUp = false;
      isLeft = false;
      isRight = false;
    }

          // If "A" is pressed
          // Change speedX to -20 and change speedY to 0
    if(keys === KEYCODE.A && isRight !== true) {
      snekHead.speedX = -20;
      snekHead.speedY = 0;

      isLeft = true;
      isRight = false;
      isUp = false;
      isDown = false;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function placeApple() {
    apple.x = Math.floor(Math.random() * 20) * 20; // Randomly place the apple on the x-axis
    apple.y = Math.floor(Math.random() * 20) * 20; // Randomly place the apple on the y-axis
    // Randomly place said apple on the board
    $("#apple").css("left", apple.x); // Too lazy to call drawObject();
    $("#apple").css("top", apple.y); // Too lazy to call drawObject();
  }

  function addSnekPart() {
    var newID = "snek" + snek.length; // Add new snek body part id

    $("<div>")
      .addClass("snek") // Add it to the snek genus
      .attr("id", newID) // Make it a snek and not a snake
      .appendTo("#board"); // Add the snekPart to the board

    var tail = snek[snek.length - 1]; // This one gets the "tail" end of the deal
    var snekPart = CreateObject(tail.x, tail.y, "#" + newID); // Create the new body

    snek.push(snekPart); // Add the sacrifice to the snek array
  }

  function moveSnek() {
    // Iterate through the "snek" array
    for(var i = snek.length - 1; i >= 1; i--) { // Iterate through snek array

      var snekPart = snek[i]; // Take snekPart out of snek

      if (snekHead.speedX !== 0 || snekHead.speedY !== 0) { // Don't start the game unless the snek is moving
        snekPart.x = snek[i - 1].x; // Move the snek part on the x-axis
        snekPart.y = snek[i - 1].y; // Move the snek part on the y-axis
      }

      // Call something to draw the snek
      drawObject(snekPart); // Draw the snek's body
    }
  }

  function moveSnekHead() {
    snekHead.x += snekHead.speedX; // Move snekHead horizontally
    snekHead.y += snekHead.speedY; // Move snekHead vertically
    drawObject(snekHead); // Make sure the snekHead is seen
  }

  function drawObject(object) {
    $(object.id).css("left", object.x); // Draw the object on the x-pos
    $(object.id).css("top", object.y); // Draw the object on the y-pos
  }

  function handleEatApple() {
    // Check to see if snek[0] is on the apple
    if (snekHead.x === apple.x && snekHead.y === apple.y) { // Check to see if the snake and apple are on the same position
      addSnekPart(); // Add another part to the snake
      placeApple(); // Hide the apple somewhere else
    }

    // If it is then add a snek body to the "snek" array
    // Then move the apple somewhere else on the board where there is no snek

    // If snek[0] isn't on the apple then do nothing
  }

  function checkerTheBoard() {
    // Make the board have a checkered pattern so the player can plan more easily
    // Make a for loop to iterate horizontally
    // Make a for loop to iterate vertically
    // Make good use of GRIDX and GRIDY

    // For every even iteration, make a square that is one color
    // For every odd iteration, make a square that is another color
  }

  function stayInBounds() {
    if (snekHead.x < 0 || snekHead.x >= BOARDX) { // Snek can't leave the right or left of the board
      endGame(); // End it
    }
    if (snekHead.y < 0 || snekHead.y >= BOARDY) { // Snek can't leave the top or bottom of the board
      endGame(); // Execute order 66
    }
  }

  function noOverlap() {
    for(var i = snek.length - 1; i >= 1; i--) { // Iterate through snek array

      var snekPart = snek[i]; // Take snekPart out of snek

      if (snekHead.x === snekPart.x && snekHead.y === snekPart.y) { // Check to see if the snake colapsed in on itself
        endGame(); // Self-Destruct
      }
    }
  }
  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // Create an alert to say that the game is over
    // Inform player of the length of the snek

    // turn off event handlers
    $(document).off();
  }
}
