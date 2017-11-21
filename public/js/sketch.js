var ryu, ryuStandingStill, ryuJump, ryuRun1, ryuRun2, ryuRun3;
var aboboRun1, aboboRun2, aboboRun3, aboboHit, aboboPunch;
var aboboAnimation;
var landscape, enemy, fontObject;
var grassImg, seasideImg, grassTile, display, playAgainButton;
var jumpSFX, backgroundMusic, hitSFX, deadSFX;
var gameStarted = false;
var gameIsOver = false;
var score = 0;
var enemiesArray = [];
var scoreUploaded = false;
//////////////////////////////////////////////////////////
//                       Preload                        //
//////////////////////////////////////////////////////////
function preload(){
    ryuStandingStill = loadImage("images/ryuStandingStill.png");
    ryuJump = loadImage("images/ryuJump.png");
    
    ryuAnimation = //loadAnimation("images/ryuRun1.png","images/ryuRun2.png","images/ryuRun3.png");

    ryuRun1 = loadImage("images/ryuRun1.png");
    ryuRun2 = loadImage("images/ryuRun2.png");
    ryuRun3 = loadImage("images/ryuRun3.png");
    
    seasideImg = loadImage("images/seaside.png");
    grassTile = loadImage("images/grassTile.png");
    aboboRun1 = loadImage("images/aboboRun1.png");
    aboboRun2 = loadImage("images/aboboRun2.png");
    aboboRun3 = loadImage("images/aboboRun3.png");
    aboboHit = loadImage("images/aboboHit.png");
    aboboPunch = loadImage("images/aboboPunch.png");
    //aboboAnimation = loadAnimation("images/aboboRun1.png", "images/aboboRun2.png", "images/aboboRun3.png");

    jumpSFX = loadSound("audio/jump.wav");
    backgroundMusic = loadSound("audio/music.mp3");
    hitSFX = loadSound("audio/hit.wav");
    deadSFX = loadSound("audio/dead.wav");
    fontObject = loadFont("fonts/PressStart2P.ttf");
}
//////////////////////////////////////////////////////////
//                        Setup                         //
//////////////////////////////////////////////////////////
function setup(){
    //getScores();
    var canvas = createCanvas(900,600);
    canvas.parent('canvasDiv');
    ryu = new Ryu();
    landscape = new Landscape();
    enemy = new Enemy(); 
    display = new Display();    
    backgroundMusic.setVolume(0.1);
    jumpSFX.setVolume(0.1);
    hitSFX.setVolume(0.1);
    deadSFX.setVolume(0.1);
    backgroundMusic.loop();
}
//////////////////////////////////////////////////////////
//                        Draw                          //
//////////////////////////////////////////////////////////
function draw(){
    //background
    image(seasideImg, 0,0, 1000, 480);
    ///////refresh page
    landscape.update();
    landscape.drawTiles();
    enemy.update();
    enemy.show();
    display.showScore();
    ryu.show();
    if (!gameStarted){
        display.showStartScreen();

    }
    /////////runner jump
    if (keyIsPressed && keyCode == 32) {
        if (!gameStarted){
            landscape.xspeed -= 5;
            enemy.xspeed -= 5;
            gameStarted = true;
        } 
        if (!gameIsOver){
            ryu.y -= 17;
        }
    }
    /////////////re generate enemies
    if (enemy.x <= -100){
        enemy.x = Math.floor(Math.random()*1500+900)
        enemy.scoredOn = false;
    }
    ///////collision logic
    if ((enemy.x >= ryu.x && enemy.x <= (ryu.x + 30))){
        if (ryu.y + 50 > enemy.y){
            gameOver();
        } else if (!enemy.scoredOn) {
            addScore();
        }
    }
    if (gameIsOver){
        display.showGameOver();
        if (keyIsPressed && keyCode == 114) {
            resetGame();
        } else if (keyIsPressed && keyCode == 115 && !scoreUploaded){
            scoreUploaded = true;
            getScores();
        }
    }
}
//////////////////////////////////////////////////////////
//                        Enemy                         //
//////////////////////////////////////////////////////////
function Enemy() {
    this.scoredOn = false;
    this.x = 1100;
    this.y = 325;
    this.xspeed = 0;
    this.update = function () {
        this.x = this.x + this.xspeed;
    }
    this.show = function () {
        if (gameIsOver){
            image(aboboPunch, this.x-30, this.y, 200, 200);
        } else if (this.scoredOn){
            image(aboboHit, this.x, this.y, 160, 200);
        } else {
            //animation(aboboAnimation, this.x, this.y);
            image(aboboRun1, this.x, this.y, 140, 200);
        }
    }
}
//////////////////////////////////////////////////////////
//                    Landscape                         //
//////////////////////////////////////////////////////////
var grassX = [];
for (var i = 0; i < 5; i++){
    grassX.push(i*229);
}
function Landscape() {
    this.x = 0;
    this.y = 460;
    this.xspeed = 0;
    this.update = function() {
        this.x = this.x + this.xspeed;
    }
    this.drawTiles = function() {
        for (var i = 0; i < grassX.length; i++){
            image(grassTile, grassX[i], this.y, 229, 200);
            grassX[i] += this.xspeed;
            if (grassX[i] <= -229){
                grassX[i] = width;
            }
        }
    }
}
//////////////////////////////////////////////////////////
//                        Ryu                           //
//////////////////////////////////////////////////////////
function Ryu() {
    this.x = 150;
    this.y = 400;
    this.velocityY = 0;
    this.onGround = true;
    this.show = function() {
        if (this.y >= 400){
            if (!gameStarted || gameIsOver){
                image(ryuStandingStill, this.x, this.y, 100, 100);
            } else {
            this.onGround = true;
            //animation(ryuAnimation, this.x, this.y);
            image(ryuRun1, this.x, this.y, 98, 100);
            this.velocityY = 0;
            this.y = constrain(this.y, 0, 400);
            }
        }
        if (this.y < 400) {
            image(ryuJump, this.x, this.y, 110, 125);
            this.playSound();
            this.onGround = false;
            this.y += this.velocityY;
            this.velocityY += 0.6;
        }
    }
    this.playSound = function() {
        if (this.onGround){
            jumpSFX.play();
        }
    }
}
//////////////////////////////////////////////////////////
//                      Game Logic                      //
//////////////////////////////////////////////////////////
function Display() {
    this.showScore = function(){
        fill('#FFFFFF');
        textFont(fontObject);
        textAlign(RIGHT);
        textSize(24);
        text("SCORE:" + score, (width -10), (30));
    }
    this.showGameOver = function() {
        //show game over text
        fill('#FFFFFF');
        textFont(fontObject);
        textAlign(CENTER);
        textSize(28);
        text("GAME OVER!", (width/2), (height/2 - 150));
            
        //display play again message
        fill('#FFFFFF');
        textFont(fontObject);
        textAlign(CENTER);
        textSize(28);
        text("PUSH R TO REPLAY", (width/2), (height - 60));
        fill('#FFFFFF');
        textFont(fontObject);
        textAlign(CENTER);
        textSize(28);
    }
        this.showStartScreen = function() {
            fill('#FFFFFF');
            textFont(fontObject);
            textAlign(CENTER);
            textSize(28);
            text("PUSH SPACEBAR!", (width/2), (height/2));
        }
}
//////////////////////////////////////////////////////////
//                      Game Logic                      //
//////////////////////////////////////////////////////////
function gameOver(){
    ryu.x -= 10;
    deadSFX.play();
    landscape.xspeed = 0;
    enemy.xspeed = 0;
    gameIsOver = true;
}
function addScore() {
    hitSFX.play();
    enemy.scoredOn = true;
    enemy.xspeed -=1;
    landscape.xspeed -=1;
    score++;
    console.log("Scored! : " + score);
}
function resetGame(){
    enemy.scoredOn = false;
    enemy.x = 1100;
    gameIsOver = false;
    gameStarted = false;
    score = 0;
    scoreUploaded = false;
}