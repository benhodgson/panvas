(function(window, undefined) {
  
  var g = -500, // px/sec^2
      maxParticles = 100,
      coefficientOfRestitution = 0.75,
      colours = ['#900', '#090', '#009', '#099', '#909'];
  
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
    this.fill = "#000";
    this.x = originX;
    this.y = originY;
    this.dx = 0; // pixels per second
    this.dy = 0; // pixels per second
    this.bounces = 0;
    this.simulate = true;
  };
  
  Particle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
  };
  
  Particle.prototype.advanceSimulationBy = function(interval) {
    
    var intervalSecs = interval / 1000,
        dg = g * intervalSecs,
        dx = this.dx * intervalSecs,
        dy = this.dy * intervalSecs;
    
    if(this.simulate) {
      this.dy -= dg;
      this.x += dx;
      this.y += dy;
      
      if(this.y + this.radius > canvasHeight) {
          this.bounces++;
          this.y = canvasHeight - this.radius;
          this.dy = -1 * this.dy * coefficientOfRestitution;
      } else if(this.y - this.radius < 0) {
          this.bounces++;
          this.y = 0 + this.radius;
          this.dy = -1 * this.dy * coefficientOfRestitution;
      }

      if(this.x + this.radius > canvasWidth) {
          this.bounces++;
          this.x = canvasWidth - this.radius;
          this.dx = -1 * this.dx * coefficientOfRestitution;
      } else if(this.x - this.radius< 0) {
          this.bounces++;
          this.x = 0 + this.radius;
          this.dx = -1 * this.dx * coefficientOfRestitution;
      }
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
  
  function cycle(array) {
    var idx = -1;
    return function() {
      idx = (idx + 1) % array.length;
      return array[idx];
    };
  };
  
  var cycleColour = cycle(colours),
      cycleSize = cycle([3, 5, 7]),
  
  function spawn() {
    var p = new Particle(cycleSize());
    p.dx = (Math.random() -0.5) * 500;
    p.dy = Math.random() * -400;
    p.fill = cycleColour();
    scene[idx] = p;
    idx = (idx + 1) % maxParticles;
  };
  
  function advance() {
    simulate();
    redraw();
  };
  
  $(function() {
    
    canvas = document.getElementById('panvas');
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    originX = ~~(canvasWidth * 0.5);
    originY = ~~(canvasHeight * 0.25);
    
    ctx = canvas.getContext('2d');
    
    lastSim = new Date();
    setInterval(advance, 0);
    
    setInterval(spawn, 100);
    
  });
  
})(window);
