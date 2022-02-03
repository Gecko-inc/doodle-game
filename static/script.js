var doodlerSize = 60;
var doodlerX;
var doodlerY;
var doodlerVelocity;
var doodlerXSpeed = 4;
var platformWidth = 85;
var platformHeight = 15;
var numOfPlatforms = 5;
var platformList = [];
var platYChange = 0;
var gameStarted;
var score = 0;
var highScore = 0;
var doodlerLeftImg;
var doodlerRightImg;
var platformImg;
var backgroundImg;
var skinSave
if(localStorage.skinNumber){
  skinSave = localStorage.skinNumber
} else {
  skinSave = 0
}
// localStorage.setItem('skins', doodle-jump-doodler-right.png)
// ===========================
//  Preload the Image Sprites
// ===========================
function preload() {
  backgroundImg = loadImage("static/1024px-Graph-paper.png");
  if(localStorage.skins){
    doodlerLeftImg = loadImage(localStorage.skins);
    doodlerRightImg = loadImage(localStorage.skins);
  } else {
    doodlerLeftImg = loadImage("static/img/2.png");
    doodlerRightImg = loadImage("static/img/2.png");
  }
  platformImg = loadImage("static/doodle-jump-platform.png");
}



// ===========================
//  Controllers
// ===========================
function setup() {
  createCanvas(400, 600);
  frameRate(60);
  gameStarted = false;
}

function draw() {
  background(247, 239, 231);
  image(backgroundImg, 0, 0, 400, 600);
  if(gameStarted == true) {
    //Set up and draw the game
    drawPlatforms();
    drawDoodler();
    checkCollision();
    moveDoodler();
    moveScreen();
  } else {
    // Start menu
    fill(0);
    textSize(60);
    text("Start", 140, 275);
    textSize(30);
    text("Score: " + score, 150, 325);
    textSize(20);
    text("High Score: " + highScore, 150, 360);

  }
}

document.querySelector('.register-screen__form button.start-game').addEventListener('click', function(){
  defaultCanvas0.style.display = 'block'
  document.querySelector('.register-screen').style.display = 'none'
  draw()
})

document.querySelector('.skins-screen button.start-game').addEventListener('click', function(){
  defaultCanvas0.style.display = 'block'
  document.querySelector('.register-screen').style.display = 'none'
  draw()
})

document.querySelector('.register-screen button.skins-game').addEventListener('click', function(){
  document.querySelector('.register-screen__form').style.display = 'none'
  document.querySelector('.skins-screen').style.display = 'flex'
})

document.querySelector('.back').addEventListener('click', function(){
  document.querySelector('.register-screen__form').style.display = 'flex'
  document.querySelector('.skins-screen').style.display = 'none'
})

document.querySelectorAll('.skin-item').forEach((element, elementId, elementArr) => {
  element.classList.remove('active')
  element.querySelector('p').innerText = ''
  elementArr[skinSave].classList.add('active')
  if(element.classList.contains('active')){
    element.querySelector('p').innerText = 'selected'
  }
})

document.querySelector('.skins-screen').addEventListener('click', function(e){
  let target = e.target
  if(target.closest('.skin-item')){
    if(!target.classList.contains('active')){
      let skinId = target.getAttribute('data-skin')
      document.querySelectorAll('.skin-item').forEach((element, elementId, elementArr) => {
        localStorage.setItem('skinNumber', skinId-1)
        element.classList.remove('active')
        element.querySelector('p').innerText = ''
        elementArr[skinId-1].classList.add('active')
        elementArr[skinId-1].querySelector('p').innerText = 'selected'
        localStorage.setItem('skins', elementArr[skinId-1].querySelector('img').getAttribute('src'))
        doodlerLeftImg = loadImage(elementArr[skinId-1].querySelector('img').getAttribute('src'))
      })
    }
  }
})

function moveScreen() {
  if(doodlerY < 250) {
    platYChange = 3;
    doodlerVelocity += 0.25;
  } else {
    platYChange = 0;
  }
}

// Start Game
function mousePressed() {
  if(gameStarted == false) {
    score = 0;
    setupPlatforms();
    doodlerY = 350;
    doodlerX = platformList[platformList.length - 1].xPos + 15;
    doodlerVelocity = 0.1;
    gameStarted = true;
  }
}

// ===========================
//  Doodler
// ===========================
function drawDoodler() {
  fill(204, 200, 52);
  image(doodlerLeftImg, doodlerX, doodlerY, doodlerSize, doodlerSize);
}

function moveDoodler() {
  // doodler falls with gravity
  doodlerVelocity += 0.2;
  doodlerY += doodlerVelocity;

  if (keyIsDown(LEFT_ARROW)) {
    doodlerX -= doodlerXSpeed;
    if(localStorage.skinNumber == 0){
      doodlerLeftImg = loadImage('static/img/2left.png')
    } else {
      doodlerLeftImg = loadImage('static/img/3left.png')
    }
    
  }
  if (keyIsDown(RIGHT_ARROW)) {
    doodlerX += doodlerXSpeed;
    if(localStorage.skinNumber == 0){
      doodlerLeftImg = loadImage('static/img/2.png')
    } else {
      doodlerLeftImg = loadImage('static/img/3.1.png')
    }
    
  }
}

// ===========================
//  Platforms
// ===========================
function setupPlatforms() {
  for(var i=0; i < numOfPlatforms; i++) {
    var platGap = height / numOfPlatforms;
    var newPlatformYPosition = i * platGap;
    var plat = new Platform(newPlatformYPosition);
    platformList.push(plat);
  }
}

function drawPlatforms() {
  fill(106, 186, 40);
  platformList.forEach(function(plat) {
    // move all platforms down
    plat.yPos += platYChange;
    image(platformImg, plat.xPos, plat.yPos, plat.width, plat.height);

    if(plat.yPos > 600) {
      score++;
      platformList.pop();
      var newPlat = new Platform(0);
      platformList.unshift(newPlat); // add to front
    }
  });
}

function Platform(newPlatformYPosition) {
  this.xPos = random(15, 300);
  this.yPos = newPlatformYPosition;
  this.width = platformWidth;
  this.height = platformHeight;
}

// ===========================
//  Collisions
// ===========================
function checkCollision() {
  platformList.forEach(function(plat) {
    if(
      doodlerX < plat.xPos + plat.width &&
      doodlerX + doodlerSize > plat.xPos &&
      doodlerY + doodlerSize < plat.yPos + plat.height &&
      doodlerY + doodlerSize > plat.yPos &&
      doodlerVelocity > 0
    ) {
      doodlerVelocity = -10;
    }
  });
  
  if(doodlerY > height) {
    if(score > highScore) {
      highScore = score;
    }
    gameStarted = false;
    document.querySelector('canvas').style.display = 'none'
    document.querySelector('.result-game').style.display = 'flex'
    document.querySelectorAll('.table-result__row').forEach((element, elementId, elementArr) => {
      element.querySelector('.table-number').innerText = elementId+1
      element.querySelector('.table-nick').innerHTML = 'Nick'
      element.querySelector('.table-result').innerHTML = score
    })
    platformList = [];
  }
    
    
    // screen wraps from left to right
  if(doodlerX < -doodlerSize) {
    doodlerX = width;
  } else if(doodlerX > width) {
    doodlerX = -doodlerSize;
  }
}

document.querySelector('.result-game__menu').addEventListener('click', function(){
  document.querySelector('.register-screen').style.display = 'flex'
  document.querySelector('.result-game').style.display = 'none'
})

document.querySelector('.result-game__restart').addEventListener('click', function(){
  document.querySelector('.result-game').style.display = 'none'
  document.querySelector('canvas').style.display = 'block'
  draw()
})