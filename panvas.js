(function(window, undefined) {
  
  var g = -500, // px/sec^2
      maxParticles = 200,
      coefficientOfRestitution = 0.75,
      colours = ['#900', '#090', '#009', '#099', '#909', '#990'];
  
  var document = window.document,
      ctx,
      canvas,
      mouseBall,
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
    this.simulate = true;
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
    
    if(this.simulate) {
      this.dy -= dg;
      this.x += dx;
      this.y += dy;
      
      var distanceFromMouseBall = Math.sqrt(Math.pow(this.x - mouseBall.x, 2)
        + Math.pow(this.y - mouseBall.y, 2));
      
      if(this != mouseBall && distanceFromMouseBall <= this.radius + mouseBall.radius) {
        this.dy = -1 * this.dy * coefficientOfRestitution;
        this.dx = -1 * this.dx * coefficientOfRestitution;
      } else {
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
    }
    
  };
  
  function redraw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);  
    for(var i=0; i < scene.length; i++) {
      scene[i].draw(ctx);
    }
    mouseBall.draw(ctx);
  };
  
  function simulate() {
    var now = new Date(),
        interval = now - lastSim;
        
    for(var i=0; i < scene.length; i++) {
      scene[i].advanceSimulationBy(interval);
    }
    mouseBall.advanceSimulationBy(interval);
    
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
  
  $(function() {
    
    canvas = document.getElementById('panvas');
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    originX = ~~(canvasWidth * 0.5);
    originY = ~~(canvasHeight * 0.25);
    
    ctx = canvas.getContext('2d');
    
    mouseBall = new Particle(25);
    mouseBall.x = 100;
    mouseBall.y = 100;
    mouseBall.dx = -250;
    mouseBall.dy = -500;
    
    $(canvas).mouseenter(function() {
      mouseBall.simulate = false;
    });
    
    $(canvas).mouseleave(function() {
      mouseBall.simulate = true;
    });
    
    canvas.addEventListener('mousemove', function(e) {
      mouseBall.x = e.offsetX;
      mouseBall.y = e.offsetY;
    }, true);
    
    lastSim = new Date();
    setInterval(advance, 0);
    
    setInterval(spawn, 100);
    
  });
  
})(window);
