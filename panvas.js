(function(window, undefined) {
  
  var G = -400, // px/sec^2
      maxParticles = 50;
  
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
    this.x = originX;
    this.y = originY;
    this.dx = 0; // pixels per second
    this.dy = 0; // pixels per second
  };
  
  Particle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
  };
  
  Particle.prototype.advanceSimulationBy = function(interval) {
    var intervalSecs = interval / 1000,
        dG = G * intervalSecs,
        dx = this.dx * intervalSecs,
        dy = this.dy * intervalSecs;
    this.dy -= dG;
    this.x += dx;
    this.y += dy;
  };
  
  function redraw() {
    simulate();
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
  
  function spawn() {
    var p = new Particle(2);
    p.dx = (Math.random() -0.5) * 300;
    p.dy = Math.random() * -300;
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
    
    ctx = panvas.getContext('2d');
    ctx.fillStyle = '#036';
    
    setInterval(spawn, 100);
    
    lastSim = new Date();
    setInterval(advance, 10);
    
  };
  
  document.addEventListener('DOMContentLoaded', init, true);
  
})(window);