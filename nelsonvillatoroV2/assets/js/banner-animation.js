document.addEventListener('DOMContentLoaded', () => {
  // Configuration parameters
  const config = {
    numParticles: 50, // Reduced number of particles for header
    connectionDistance: 40, // Shorter connections for the smaller space
    particleRadius: 1.5,
    animationDuration: 2000, // in milliseconds
    colors: {
      particles: '#ffffff',
      connections: 'rgba(255, 255, 255, 0.2)',
      nStroke: '#ffffff',
      vStroke: '#ffffff',
      highlight: 'rgba(93, 173, 226, 0.8)' // Light blue highlight from your theme
    }
  };

  // Initialize SVG container
  const svgContainer = document.getElementById('banner-animation');
  if (!svgContainer) return; // Safety check
  
  const svgWidth = svgContainer.clientWidth;
  const svgHeight = svgContainer.clientHeight;
  
  // Create SVG namespace element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  svgContainer.appendChild(svg);

  // Define the NV paths - adjusted for header size
  const nPath = 'M30,15 L30,45 M30,15 L50,45 M50,15 L50,45';
  const vPath = 'M60,15 L75,45 M75,15 L90,45';
  
  // Create N letter path element (hidden initially)
  const nElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  nElement.setAttribute('d', nPath);
  nElement.setAttribute('stroke', config.colors.nStroke);
  nElement.setAttribute('stroke-width', '3');
  nElement.setAttribute('fill', 'none');
  nElement.setAttribute('stroke-linecap', 'round');
  nElement.setAttribute('stroke-opacity', '0');
  svg.appendChild(nElement);
  
  // Create V letter path element (hidden initially)
  const vElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  vElement.setAttribute('d', vPath);
  vElement.setAttribute('stroke', config.colors.vStroke);
  vElement.setAttribute('stroke-width', '3');
  vElement.setAttribute('fill', 'none');
  vElement.setAttribute('stroke-linecap', 'round');
  vElement.setAttribute('stroke-opacity', '0');
  svg.appendChild(vElement);

  // Parse the path data to get points along the NV shape
  const getNVPoints = () => {
    const points = [];
    const parsePath = (pathStr) => {
      const commands = pathStr.split(/(?=[MLZ])/);
      let currentX = 0;
      let currentY = 0;
      
      commands.forEach(cmd => {
        if (cmd.startsWith('M') || cmd.startsWith('L')) {
          const parts = cmd.substring(1).trim().split(',');
          if (parts.length === 1 && parts[0].includes(' ')) {
            const [x, y] = parts[0].split(' ').map(Number);
            points.push({ x, y });
            currentX = x;
            currentY = y;
          }
        }
      });
    };
    
    parsePath(nPath);
    parsePath(vPath);
    return points;
  };

  // Create particles
  const particles = [];
  const nvPoints = getNVPoints();
  
  // Function to create a random particle
  const createRandomParticle = () => {
    return {
      x: Math.random() * svgWidth,
      y: Math.random() * svgHeight,
      size: Math.random() * 0.8 + config.particleRadius,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      targetX: null,
      targetY: null,
      isForming: false,
      opacity: Math.random() * 0.5 + 0.2
    };
  };

  // Initialize particles
  for (let i = 0; i < config.numParticles; i++) {
    particles.push(createRandomParticle());
  }

  // Create SVG elements for particles
  particles.forEach(particle => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', particle.size);
    circle.setAttribute('fill', config.colors.particles);
    circle.setAttribute('opacity', particle.opacity);
    circle.setAttribute('cx', particle.x);
    circle.setAttribute('cy', particle.y);
    svg.appendChild(circle);
    particle.element = circle;
  });

  // Create a group for connections
  const connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.appendChild(connectionsGroup);

  // Animation timing
  let startTime = null;
  let animationPhase = 'random'; // phases: random, forming, formed
  let animationComplete = false;

  // Update particle positions and connections
  const update = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / config.animationDuration, 1);

    // Update animation phase
    if (progress >= 0.2 && animationPhase === 'random') {
      animationPhase = 'forming';
      
      // Assign NV points as targets to some particles
      const numParticlesToAssign = Math.min(nvPoints.length, particles.length * 0.6);
      const particlesToAssign = [...particles].sort(() => Math.random() - 0.5).slice(0, numParticlesToAssign);
      
      nvPoints.forEach((point, index) => {
        if (index < particlesToAssign.length) {
          particlesToAssign[index].targetX = point.x;
          particlesToAssign[index].targetY = point.y;
          particlesToAssign[index].isForming = true;
        }
      });
    }
    
    if (progress >= 0.7 && animationPhase === 'forming') {
      animationPhase = 'formed';
      
      // Fade in the NV paths
      const opacity = Math.min((progress - 0.7) * 3, 1);
      nElement.setAttribute('stroke-opacity', opacity);
      vElement.setAttribute('stroke-opacity', opacity);
    }

    // Stop adding random movement once animation is complete
    if (progress >= 1 && !animationComplete) {
      animationComplete = true;
      
      // Fix particles in place that are part of the NV shape
      particles.forEach(particle => {
        if (particle.isForming) {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          // Make formed particles glow a bit
          particle.element.setAttribute('r', particle.size * 1.2);
          particle.element.setAttribute('opacity', 0.8);
          particle.element.setAttribute('fill', config.colors.highlight);
        } else {
          // Fade out non-NV particles
          particle.element.setAttribute('opacity', '0.1');
        }
      });
    }

    // Clear previous connections
    while (connectionsGroup.firstChild) {
      connectionsGroup.removeChild(connectionsGroup.firstChild);
    }

    // Don't update particles if animation is complete
    if (!animationComplete) {
      // Update particles
      particles.forEach(particle => {
        if (particle.isForming && animationPhase === 'forming') {
          // Move towards target
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          particle.x += dx * 0.08; // Faster movement
          particle.y += dy * 0.08;
        } else if (!animationComplete) {
          // Random movement
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          // Boundary check
          if (particle.x < 0 || particle.x > svgWidth) particle.speedX *= -1;
          if (particle.y < 0 || particle.y > svgHeight) particle.speedY *= -1;
        }
        
        // Update particle element
        particle.element.setAttribute('cx', particle.x);
        particle.element.setAttribute('cy', particle.y);
      });
    }

    // Draw connections between particles
    particles.forEach((particle, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = other.x - particle.x;
        const dy = other.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.connectionDistance) {
          const opacity = (1 - distance / config.connectionDistance) * 0.5;
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', particle.x);
          line.setAttribute('y1', particle.y);
          line.setAttribute('x2', other.x);
          line.setAttribute('y2', other.y);
          line.setAttribute('stroke', config.colors.connections);
          line.setAttribute('stroke-opacity', opacity);
          line.setAttribute('stroke-width', 1);
          connectionsGroup.appendChild(line);
        }
      }
    });
    
    // Continue animation loop even after completion, but with reduced updates
    requestAnimationFrame(update);
  };

  // Start animation
  requestAnimationFrame(update);
});