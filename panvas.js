(function(window, undefined) {
  
  var g = -500, // px/sec^2
      maxParticles = 200,
      coefficientOfRestitution = 0.75,
      colours = ['#900', '#090', '#009', '#099', '#909', '#990'];
  
  var document = window.document,
      ctx,
      canvas,
      canvasWidth,
      canvasHeight,
      originX,
      originY,
      lastSim,
      scene = [],
      idx = 0;
  
  function Particle(radius) {
    this.radius = radius;
    this.colour = "#000";
    this.x = originX;
    this.y = originY;
    this.dx = 0; // pixels per second
    this.dy = 0; // pixels per second
    this.bounces = 0;
  };
  
  Particle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
  };
  
  Particle.prototype.advanceSimulationBy = function(interval) {
    
    var intervalSecs = interval / 1000,
        dg = g * intervalSecs,
        dx = this.dx * intervalSecs,
        dy = this.dy * intervalSecs;
    
    this.dy -= dg;
    this.x += dx;
    this.y += dy;
    
    if (this.y > canvasHeight) {
        this.bounces++;
        this.y = canvasHeight;
        this.dy = -1 * this.dy * coefficientOfRestitution;
    } else if (this.y < 0) {
        this.bounces++;
        this.y = 0;
        this.dy = -1 * this.dy * coefficientOfRestitution;
    }
    
    if (this.x > canvasWidth) {
        this.bounces++;
        this.x = canvasWidth;
        this.dx = -1 * this.dx * coefficientOfRestitution;
    } else if (this.x < 0) {
        this.bounces++;
        this.x = 0;
        this.dx = -1 * this.dx * coefficientOfRestitution;
    }
  };
  
  function redraw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);  
    for(var i=0; i < scene.length; i++) {
      scene[i].draw(ctx);
    }
  };
  
  function simulate() {
    var now = new Date(),
        interval = now - lastSim;
        
    for(var i=0; i < scene.length; i++) {
      scene[i].advanceSimulationBy(interval);
    }
    
    lastSim = now;
  };
  
  var cycleColour = (function(colours) {
    var colourIndex = -1;
    return function() {
      colourIndex = (colourIndex + 1) % colours.length;
      return colours[colourIndex];
    };
  })(colours);
  
  function spawn() {
    var p = new Particle(2);
    p.dx = (Math.random() -0.5) * 300;
    p.dy = Math.random() * -300;
    p.colour = cycleColour();
    scene[idx] = p;
    idx = (idx + 1) % maxParticles;
  };
  
  function advance() {
    simulate();
    redraw();
  };
  
  function init() {
    
    canvas = document.getElementById('panvas');
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    originX = ~~(canvasWidth * 0.5);
    originY = ~~(canvasHeight * 0.25);
    
    ctx = canvas.getContext('2d');
    
    setInterval(spawn, 100);
    
    lastSim = new Date();
    setInterval(advance, 0);
    
  };
  
  document.addEventListener('DOMContentLoaded', init, true);
  
})(window);
