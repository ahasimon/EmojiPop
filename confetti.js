// Confetti particle system
function Confetti() 
{
  // Available Color
  this.colors = [
    color(255, 59, 59), // red
    color(255, 89, 183), // pink
    color(255, 196, 0), // yellow
    color(0, 219, 117), // green
    color(23, 201, 255) // blue
  ];
  
  // Genorate Particles
  this.particle = [];
  
  for (var i = 0; i < 70; i++) 
  {
    this.particle.push({
      x: random(0, width),
      y: random(0, -height * 0.5),
      
      w: 10,
      h: 7,
      
      scl: random(0.55, 1.9),
      color: this.colors[round(random(0, this.colors.length - 1))],
      
      frameOffset: random(-50, 50),
      rotaionSpeed: random(5, 28),
    });
  }
  
  
  // Update
  this.update = function() 
  {
    // Render all particles
    for (var i = 0; i < this.particle.length; i++) 
    {
      this.particle[i].x += sin((frameCount + this.particle[i].frameOffset) / this.particle[i].rotaionSpeed) * QUARTER_PI;
      this.particle[i].y += this.particle[i].scl * 4.2;
      
      push();
      translate(this.particle[i].x, this.particle[i].y);
      rotate(sin((frameCount + this.particle[i].frameOffset) / this.particle[i].rotaionSpeed) * QUARTER_PI);
      scale(this.particle[i].scl, sin((frameCount + this.particle[i].frameOffset) / this.particle[i].rotaionSpeed) * this.particle[i].scl)
      
      fill(this.particle[i].color);
      noStroke();
      rect(0, 0, this.particle[i].w, this.particle[i].h);
      
      pop();
      
      // remove if out of canvas bounds
      if (this.particle[i].y - this.particle[i].h * this.particle[i].scl > height) 
      {
        this.particle.splice(i, 1);
        i--;
      }
      
    }
    
  }
}