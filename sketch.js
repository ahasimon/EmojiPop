var emojiData;
var emojiA, emojiB;

var guessed;
var mouseIsUp;

var score;
var highscore;
var nextButton;

var confetti;


// Load All Emoji Data
function preload() {
  emojiData = loadJSON("grouped.json");
}

// Setup
function setup() {
  createCanvas(700, 600);
  
  // Get local saved highscore
  highscore = 0;
  
  if (localStorage.getItem("EmojiPop_highscore") === null) {
    localStorage.setItem("EmojiPop_highscore", highscore);
  }
  else {
    highscore = localStorage.getItem("EmojiPop_highscore");
  }
  
  score = {
    val: 0,
    ani: 0,
    add: 0,
  };
  
  mouseIsUp = false;
  
  confetti = [];
  
  nextButton = {
    x: width/2,
    y: height * 0.88,
    w: 110,
    h: 50,
    scl: 0,
    
    bool: false,
    ani: 0,
  };
  
  Reset();
  
}

// Reset
function Reset() {
  
  guessed = {
    bool: false,
    ani: 0,
  };
  
  // Setup Emojis
  emojiA = {
    x: width * 0.25,
    
    rank: round(random(0, Object.keys(emojiData).length - 1)),
    scl: 0,
    fade: 255,
  };
  
  emojiB = {
    x: width * 0.75,
    
    rank: round(random(0, Object.keys(emojiData).length - 1)),
    scl: 0,
    fade: 255,
  };
  
}

// Title Case Function
function toTitleCase(str) {
  
  str = str.toLowerCase().split(' ');
  
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  
  return str.join(' ');
}

// 1st 2nd 3rd Function
function numberEnd(number) {
  
  var numberString = number + "";
  
  if (numberString.charAt(numberString.length - 1) == "1") { return "st"; }
  if (numberString.charAt(numberString.length - 1) == "2") { return "nd"; }
  if (numberString.charAt(numberString.length - 1) == "3") { return "rd"; }
  else { return "th"; }
  
}

// Draw
function draw() {
  background(255);
  rectMode(CENTER);
  textFont("Quicksand");
  
  // Mouse Logic
  if (mouseIsPressed == false) { mouseIsUp = true; }
  
  // Press Emoji A
  if (mouseX <= width/2 && guessed.bool == false) {
    emojiA.scl += (1.5 - emojiA.scl) / 7;
    emojiB.scl += (1 - emojiB.scl) / 7;
    
    if (mouseIsPressed && mouseIsUp) {
      mouseIsUp = false;
      guessed.bool = true;
      
      if (emojiA.rank < emojiB.rank) {
        score.val++;
        score.add = 1;
        
        // Update Highscore
        if (score.val > highscore) { 
          highscore = score.val; 
          localStorage.setItem("EmojiPop_highscore", highscore);
        }
        
        confetti.push(new Confetti());
      }
      else {
        score.val = 0;
      }
      
    }
  }
  
  // Press Emoji B
  if (mouseX > width/2 && guessed.bool == false) {
    emojiB.scl += (1.5 - emojiB.scl) / 7;
    emojiA.scl += (1 - emojiA.scl) / 7;
    
    if (mouseIsPressed && mouseIsUp) {
      mouseIsUp = false;
      guessed.bool = true;
      
      if (emojiB.rank < emojiA.rank) {
        score.val++;
        score.add = 1;
        
        // Update Highscore
        if (score.val > highscore) { 
          highscore = score.val; 
          localStorage.setItem("EmojiPop_highscore", highscore);
        }
        
        confetti.push(new Confetti());
      }
      else {
        score.val = 0;
      }
      
    }
  }
  
  // If Placed a Guess
  var emojiAH = 0, emojiBH = 0;
  var pollHeight = 200;
  var yPos = height * 0.5;
  
  if (guessed.bool) {
    guessed.ani += (1 - guessed.ani) / 38;
    
    if (guessed.ani > 0.9) {
      
      if (emojiA.rank > emojiB.rank) {
        emojiA.fade += (90 - emojiA.fade) / 20;
      }
      else {
        emojiB.fade += (90 - emojiB.fade) / 20;
      }
      
    }
    else {
      emojiA.scl += (1 - emojiA.scl) / 7;
      emojiB.scl += (1 - emojiB.scl) / 7;
    }
    
    var pollWidth = 80;
    
    emojiAH = map(emojiA.rank, 0, Object.keys(emojiData).length - 1, pollHeight * guessed.ani, 0);
    emojiBH = map(emojiB.rank, 0, Object.keys(emojiData).length - 1, pollHeight * guessed.ani, 0);
    
    // Poll correlation line
    var pclW = map(guessed.ani, 0, 1, 0, emojiB.x - emojiA.x + pollWidth/2);
    var pcl = createVector(emojiA.x + pclW/2, yPos + pollHeight/2 - emojiAH + 1.75);
    
    if (emojiA.rank > emojiB.rank) {
      pcl = createVector(emojiB.x - pclW/2, yPos + pollHeight/2 - emojiBH + 1.75);
    }
    
    fill(220, map(nextButton.ani, 0, 0.5, 255, 0));
    noStroke();
    
    for (i = 0; i < 17; i++) {
      //ellipse(pcl.x - pclW/2 + (i * pclW/21), pcl.y, 10, 5);
      rect(pcl.x - pclW/2 + (i * pclW/16), pcl.y, pclW/24, 3.5, 100)
    }
    
    // EmojiA rank poll
    fill(0, 187, 255, emojiA.fade);
    rect(emojiA.x, yPos + pollHeight/2 - emojiAH/2, pollWidth, emojiAH, pollWidth * 0.1);
    
    // EmojiB rank poll
    fill(0, 187, 255, emojiB.fade);
    rect(emojiB.x, yPos + pollHeight/2 - emojiBH/2, pollWidth, emojiBH, pollWidth * 0.1);
    
  }
  
  // Emoji Hover Effect after guess
  var hoverA = 0, hoverB = 0;
  
  if (emojiA.rank < emojiB.rank && guessed.bool) {
    hoverA = sin(frameCount * 0.03) * 8 - 5;
  }
  else if (emojiA.rank > emojiB.rank && guessed.bool) {
    hoverB = sin(frameCount * 0.03) * 8 - 5;
  }
  
  // Render Emojis
  noStroke();
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  
  // Emoji A - Emoji
  fill(100, emojiA.fade);
  textSize(90 * emojiA.scl);
  text(emojiData[emojiA.rank].emojis2021.emoji, emojiA.x, (yPos + pollHeight/2 - emojiAH) - pollHeight * 0.22 + hoverA);
  
  // Emoji A - Rank
  textStyle(BOLD);
  textSize(22 * guessed.ani + 0.1);
  text("#" + (emojiA.rank + 1), emojiA.x, yPos + 125);
  
  // Emoji A - Name Desc.
  fill(map(constrain(emojiA.scl, 1, 1.5), 1, 1.5, 100, 0), map(constrain(emojiA.scl, 1, 1.5), 1, 1.5, 100, 187), map(constrain(emojiA.scl, 1, 1.5), 1, 1.5, 100, 255), map(guessed.ani, 0, 1, 255, emojiA.fade - 50));
  textStyle(NORMAL);
  textSize(18 - map(guessed.ani, 0, 1, 0, 4));
  text(toTitleCase(emojiData[emojiA.rank].emojis2021.name), emojiA.x, yPos + 140 + (emojiA.scl - 1) * 30 + guessed.ani * 20);
  
  
  // Emoji B - Emoji
  fill(100, emojiB.fade);
  textSize(90 * emojiB.scl);
  text(emojiData[emojiB.rank].emojis2021.emoji, emojiB.x, (yPos + pollHeight/2 - emojiBH) - pollHeight * 0.22 + hoverB);
  
  // Emoji B - Rank
  textStyle(BOLD);
  textSize(22 * guessed.ani + 0.1);
  text("#" + (emojiB.rank + 1), emojiB.x, yPos + 125);
  
  // Emoji B - Name Desc.
  fill(map(constrain(emojiB.scl, 1, 1.5), 1, 1.5, 100, 0), map(constrain(emojiB.scl, 1, 1.5), 1, 1.5, 100, 187), map(constrain(emojiB.scl, 1, 1.5), 1, 1.5, 100, 255), map(guessed.ani, 0, 1, 255, emojiB.fade - 50));
  textStyle(NORMAL);
  textSize(18 - map(guessed.ani, 0, 1, 0, 4));
  text(toTitleCase(emojiData[emojiB.rank].emojis2021.name), emojiB.x, yPos + 140 + (emojiB.scl - 1) * 30 + guessed.ani * 20);
  
  
  // Next Button hover scl, only show when has guessed
  if (nextButton.bool == false) {
    
    if (guessed.bool && guessed.ani > 0.9) {
    
      // Click Next Button
      if (mouseX > nextButton.x - nextButton.w/2 && mouseX < nextButton.x + nextButton.w/2 && mouseY > nextButton.y - nextButton.h/2 && mouseY < nextButton.y + nextButton.h/2) {
        nextButton.scl += (1.2 - nextButton.scl) / 10;

        if (mouseIsPressed && mouseIsUp) {
          mouseIsUp = false;

          nextButton.bool = true;
        }
      }
      else {
        nextButton.scl += (1 - nextButton.scl) / 24;
      }

    }
    else {
      nextButton.scl += -nextButton.scl / 8;
    }
    
  }
  
  // Render Next Button
  push();
  translate(nextButton.x, nextButton.y);
  scale(nextButton.scl);
  
  fill(0, 187, 255);
  noStroke();
  rect(0, 0, nextButton.w, nextButton.h, nextButton.h);
  
  fill(255);
  textSize(20);
  textStyle(BOLD);
  text("NEXT", 0, 0);
  
  pop();
  
  // Next Button after pressed
  if (nextButton.bool) {
    nextButton.ani += (1 - nextButton.ani) / 20;
    nextButton.scl = constrain(nextButton.scl - 0.1, 0, 1.5);
    
    emojiA.x = map(nextButton.ani, 0, 1, width * 0.25,       -150);
    emojiB.x = map(nextButton.ani, 0, 1, width * 0.75, width +150);
    
    if (nextButton.ani > 0.75) {
      nextButton.bool = false;
      nextButton.ani = 0;
      
      Reset();
    }
    
  }
  
  // Score Animation
  score.ani += score.add * 0.07;
  if (score.ani >= 0.97) { score.add = -1; }
  else if (score.ani <= 0.05) { score.add = 0; score.ani = 0; }
  
  // Render Score Text
  fill(100);
  textSize(map(score.ani, 0, 1, 38, 38 + 16));
  textStyle(BOLD);
  text("Score: " + score.val, width/2, height * 0.15);
  
  // Highscore text
  var onFire = "";
  if (score.val >= highscore && score.val > 0) { onFire = "🔥"; }
  
  fill(0, 80);
  textSize(18);
  textStyle(NORMAL);
  text("High: " + highscore + onFire, width/2, height * 0.15 + 35);
  
  
  // render confetti
  for (i = 0; i < confetti.length; i++) {
    confetti[i].update();
    
    // remove confetti particle system if is empty
    if (confetti[i].particle.length < 1) 
    {
      confetti.splice(i, 1);
      i--;
    }
    
  }
}