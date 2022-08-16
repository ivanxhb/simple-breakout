// To render graphics on <canvas> elements, first we must grab  a reference to it in Javascript
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


// about the ball
var ballRadius = 10;

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;


// START OF BRICK FIELD VARIABLES

const brickRowCount = 3;
const brickColumnCount = 5;

const brickWidth = 75; // dimensions of each brick
const brickHeight = 20;

const brickPadding = 10; // for space between bricks

const brickOffsetTop = 30;
const brickOffsetLeft = 30;


const brickArr = [];

for(let c = 0; c < brickColumnCount; c++){
    brickArr[c] = [];
    for(let r = 0; r < brickRowCount; r++){
        brickArr[c][r] = {x:0, y:0}; // what is meant by the x: and y:?
    }
}

// END OF BRICK FIELD VARIABLES


// about presses
var rightPressed = false;
var leftPressed = false;

// JS event listeners for keypresses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true; // targets the variable above
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }   else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}


// Defining the paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) /2;

function drawPaddle(){
    ctx.beginPath(); // Note that to begin drawing to the canvas we must "target it" and begin
    // each section with beginPath() and end it with closePath()
    
    ctx.rect(paddleX, canvas.height-paddleHeight, // realize that the values for the rectage are
    // are actually specify the coordinates of the top left corner of the canvas while the last two specify the width and the height of the rectangle
        paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
// end of paddle def


// START OF COLLISION DETECTION FUNCTION
// There are prob better ways of going about this but for now
// Collision will be implemented by looping through all the bricks and compare every single brick's position to the 
// ball's coordinates as each frame is drawn

function collisionDetection(){
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            // Realize that...
            /**
             * For the center of the ball to be inside the inside of the brick, all four must be true
             * 
             * The x position of the ball is greater than the x position of the brick
             * The x positoin of the ball is less than the x position of the brick plus its width
             * 
             * The y position of the  ball is greater than the y position of the brick.
             * The y positon of the ball is less than the y position of the brick plus its height.
             */


            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
                dy = -dy;
            }
        }
    }
}


// END OF COLLISION DETECTION FUNCTION

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            // adding logic that will calculate the location on where to draw the different bricks

            const brickX = c*(brickWidth+brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

            brickArr[c][r].x = brickX;
            brickArr[c][r].y = brickY;

            ctx.beginPath();
            ctx.rect(brickX,brickY,brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }
}

// START MAIN drawing function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearRect is used to clear the previously drawn content.
    // Required to provide the illusion of "motion"
    drawBricks();
    drawBall();
    drawPaddle();
    
    // Collision detectio logic
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }


    // So that the paddle hits the ball
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }
    // end of game logic interaction

    // Paddle moving logic
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
    } else if(leftPressed) {
        paddleX -= 7;
    } // of paddle moving logic
    
    x += dx; // These two are used in the updating of the drawing.
    y += dy;
}
// END OF MAIN drawing FUNCTION

// Used to keep constantly updating the canvas drawing
// Here we use the setInterval() function to keep calling the function specified. (In this case draw)
const interval = setInterval(draw, 10);