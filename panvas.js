(function(window, undefined) {
  
  var g = -10, // gravity / px/sec^2
      rotationPeriod = 20, // secs
      coefficientOfRestitution = 0.75,
      maxInitialComponentVelocity = 1000,
      maxParticles = 100,
      colours = ['#900', '#090', '#009', '#099', '#909'],
      sizes = [3, 5, 7];
  
  var document = window.document,
      TWO_PI = Math.PI * 2, // rads
      rotationFrequency = TWO_PI / rotationPeriod, // rads/sec
      ctx,
      canvas,
      canvasWidth,
      canvasHeight,
      originX,
      originY,
      lastSim,
      scene = [],
      gx = 0,
      gy = 0,
      
      // "up" is the direction in which to orient the canvas
      // "down" is the direction in which gravity acts
      thisWayUp = 0, // rads
      thisWayDown = thisWayUp + Math.PI; // rads
  
  function Particle(radius) {
    this.radius = radius;
    this.fill = "#000";
    this.x = originX;
    this.y = originY;
    this.dx = 0; // px/sec
    this.dy = 0; // px/sec
  };
  
  Particle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.arc(this.x, this.y, this.radius, 0, TWO_PI, true); 
    ctx.closePath();
    ctx.fill();
  };
  
  Particle.prototype.advanceSimulationBy = function(interval) {
    
    this.dy += gy;
    this.dx += gx;
    this.x += this.dx * interval;
    this.y += this.dy * interval;
    
    if(this.y + this.radius > canvasHeight) {
        this.y = canvasHeight - this.radius;
        this.dy = -1 * this.dy * coefficientOfRestitution;
    } else if(this.y - this.radius < 0) {
        this.y = 0 + this.radius;
        this.dy = -1 * this.dy * coefficientOfRestitution;
    }
    
    if(this.x + this.radius > canvasWidth) {
        this.x = canvasWidth - this.radius;
        this.dx = -1 * this.dx * coefficientOfRestitution;
    } else if(this.x - this.radius< 0) {
        this.x = 0 + this.radius;
        this.dx = -1 * this.dx * coefficientOfRestitution;
    }
    
  };
  
  function redraw() {
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for(var i=0; i < scene.length; i++) {
      scene[i].draw(ctx);
    }
    
    // Rotate the canvas so as to oppose the gravity delta
    canvas.style['WebkitTransform'] = 'rotate('+thisWayUp+'rad)';
    canvas.style['MozTransform'] = 'rotate('+thisWayUp+'rad)';
    canvas.style['OTransform'] = 'rotate('+thisWayUp+'rad)';
    
  };
  
  function simulate() {
    var now = new Date(),
        interval = (now - lastSim) / 1000;
    
    // Rotate gravity slightly
    var deltaTheta = rotationFrequency * interval;
    thisWayDown = (thisWayDown + deltaTheta) % TWO_PI;
    thisWayUp = (thisWayUp + deltaTheta) % TWO_PI
    gy = g * Math.cos(thisWayDown);
    gx = g * Math.sin(thisWayDown);
    
    for(var i=0; i < scene.length; i++) {
      scene[i].advanceSimulationBy(interval);
    }
    
    lastSim = now;
  };
  
  function cycle(array) {
    var i = -1;
    return function() {
      i = (i + 1) % array.length;
      return array[i];
    };
  };
  
  var cycleColour = cycle(colours),
      cycleSize = cycle(sizes);
  
  function spawn() {
    var p = new Particle(cycleSize());
    p.dx = (Math.random() -0.5) * maxInitialComponentVelocity;
    p.dy = (Math.random() -0.5) * maxInitialComponentVelocity;
    p.fill = cycleColour();
    scene.push(p);
    if(scene.length > maxParticles) {
      scene.shift();
    }
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
    originY = ~~(canvasHeight * 0.5);
    
    ctx = canvas.getContext('2d');
    
    lastSim = new Date();
    setInterval(advance, 0);
    
    setInterval(spawn, 100);
    
  });
  
})(window);
