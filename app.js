/* ==========================================================================
   PORTFOLIO ENGINE & INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Remove loading overlay
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, 100);

  // Initialize all subsystems
  initCustomCursor();
  initNeuralBackground();
  initHudDiagnostics();
  initScrollAnimations();
  initBentoTerminal();
  initTimelineProgress();
  initContactForm();
});

/* ==========================================================================
   1. CUSTOM GLOWING CURSOR & HOVER GLOWS
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('glowing-cursor');
  const bentoCards = document.querySelectorAll('.bento-card');
  const projectCards = document.querySelectorAll('.project-card');
  
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  // Track global cursor coordinates
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Smooth cursor follow (Spring interpolation)
  function updateCursor() {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    
    currentX += dx * 0.15;
    currentY += dy * 0.15;
    
    document.documentElement.style.setProperty('--mouse-x', `${currentX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${currentY}px`);
    
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Local Hover Glows for Bento Cards (Stripe-inspired)
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', `${x}px`);
      card.style.setProperty('--card-mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   2. NEURAL NETWORK BACKGROUND (PARTICLE SYSTEM)
   ========================================================================== */
let globalParticleSystem = null; // Reference to interact with background from other scripts

function initNeuralBackground() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Particle Settings
  const settings = {
    particleCount: window.innerWidth < 768 ? 40 : 80,
    connectDistance: 120,
    mouseRadius: 180,
    particleSpeed: 0.5,
    colors: {
      cyan: { h: 190, s: 100, l: 50 },
      indigo: { h: 260, s: 100, l: 60 }
    }
  };

  let particles = [];
  let mouse = { x: null, y: null, active: false, radius: settings.mouseRadius };

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    settings.particleCount = window.innerWidth < 768 ? 40 : 85;
    initParticles();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Track Mouse Interaction
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : (Math.random() > 0.5 ? -10 : canvas.height + 10);
      this.vx = (Math.random() - 0.5) * settings.particleSpeed;
      this.vy = (Math.random() - 0.5) * settings.particleSpeed;
      this.radius = Math.random() * 2 + 1;
      this.hue = Math.random() > 0.6 ? settings.colors.cyan.h : settings.colors.indigo.h;
      this.alpha = Math.random() * 0.5 + 0.3;
      this.pulseDir = Math.random() > 0.5 ? 0.005 : -0.005;
    }

    update() {
      // Dynamic Drift
      this.x += this.vx;
      this.y += this.vy;

      // Pulse particle luminosity
      this.alpha += this.pulseDir;
      if (this.alpha > 0.85 || this.alpha < 0.25) this.pulseDir *= -1;

      // Mouse Attraction (Gravitational pull)
      if (mouse.active && mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 0.8;
          this.y += (dy / dist) * force * 0.8;
        }
      }

      // Border checks
      if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${this.alpha})`);
      grad.addColorStop(1, `hsla(${this.hue}, 100%, 60%, 0)`);
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < settings.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connecting synapses
  function drawSynapses() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < settings.connectDistance) {
          const alpha = (settings.connectDistance - dist) / settings.connectDistance * 0.18;
          ctx.beginPath();
          const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, `hsla(${p1.hue}, 100%, 60%, ${alpha})`);
          grad.addColorStop(1, `hsla(${p2.hue}, 100%, 60%, ${alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.active && mouse.x !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const alpha = (mouse.radius - dist) / mouse.radius * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${p1.hue}, 100%, 50%, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Engine Animation Loop
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;

  function render(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // FPS Diagnostics
    frameCount++;
    if (time > lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (time - lastTime));
      frameCount = 0;
      lastTime = time;
      const fpsLabel = document.getElementById('hud-fps');
      if (fpsLabel) fpsLabel.textContent = `${fps.toFixed(1)} FPS`;
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawSynapses();

    animationFrameId = requestAnimationFrame(render);
  }
  animationFrameId = requestAnimationFrame(render);

  // External interface to push temporary burst particles (for form submission)
  globalParticleSystem = {
    triggerBurst: function(startX, startY, count = 25) {
      for (let i = 0; i < count; i++) {
        const p = new Particle();
        p.x = startX;
        p.y = startY;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.hue = Math.random() > 0.5 ? settings.colors.cyan.h : settings.colors.indigo.h;
        p.alpha = 0.9;
        particles.push(p);
      }
    }
  };
}

/* ==========================================================================
   3. HERO HUD DIAGNOSTICS & OSCILLOSCOPE
   ========================================================================== */
function initHudDiagnostics() {
  const latencyEl = document.getElementById('hud-latency');
  const throughputEl = document.getElementById('hud-throughput');
  const hudChart = document.getElementById('hud-chart');
  
  if (!hudChart) return;
  const ctx = hudChart.getContext('2d');
  
  // Realtime metric fluctuation
  setInterval(() => {
    if (latencyEl) {
      const latencyVal = Math.floor(Math.random() * 8) + 8; // 8-15ms
      latencyEl.textContent = `${latencyVal}ms`;
    }
    if (throughputEl) {
      const throughputVal = (82.5 + Math.random() * 3.4).toFixed(1); // 82.5-85.9 Gbps
      throughputEl.textContent = `${throughputVal} Gbps`;
    }
  }, 1500);

  // Oscilloscope Waveform Animation
  let phase = 0;
  function drawWave() {
    ctx.clearRect(0, 0, hudChart.width, hudChart.height);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1.5;

    for (let x = 0; x < hudChart.width; x++) {
      // Combination of two waves (sin and cos) to look sophisticated
      const y = hudChart.height / 2 + 
                Math.sin(x * 0.05 + phase) * 12 + 
                Math.cos(x * 0.02 - phase) * 5;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    phase += 0.05;
    requestAnimationFrame(drawWave);
  }
  drawWave();
}

/* ==========================================================================
   4. CINEMATIC INTERSECTION OBSERVER (SCROLL REVEALS)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-text, .reveal-fade, .reveal-hud, .reveal-slide');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.luxury-nav a');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => revealObserver.observe(el));

  // Sync Active Section in Navbar
  window.addEventListener('scroll', () => {
    let currentSectionId = 'hero';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. BENTO TERMINAL SHELL SIMULATOR
   ========================================================================== */
function initBentoTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  
  if (!input || !body) return;

  const specs = [
    'CHASSIS: Apple M3 Max 16-Core CPU / 40-Core GPU',
    'RAM: 128GB LPDDR5X Unified Architecture',
    'STORAGE: 2TB Solid-State NVMe Drive',
    'DISPLAYS: 1x Apple Studio Display XDR 5K, 1x LG UltraFine 4K',
    'EDITOR: VS Code with custom minimal dark configuration',
    'SHELL: Zsh combined with oh-my-zsh & starship prompt template',
    'KEYBOARD: custom ortholinear split ergonomics'
  ];

  const bio = [
    'IDENTITY: [Your Name]',
    'SECTOR: Visual Engineering & Core Software Systems Architecture',
    'PHILOSOPHY: Design interfaces like complex machinery and code them like lightweight clockwork.',
    'EXPERTISE: Full-Stack React/Next frameworks, high-throughput backend infrastructure, Rust tooling, WebAssembly integrations, vector data alignment.'
  ];

  const commands = {
    '/help': [
      'Available console directives:',
      '  <span class="text-cyan">/bio</span>       Retrieve digital identity specifications.',
      '  <span class="text-cyan">/specs</span>     Display workstation telemetry data.',
      '  <span class="text-cyan">/projects</span>  Enumerate current portfolio components.',
      '  <span class="text-cyan">/secret</span>    Establish secure backdoor protocols.',
      '  <span class="text-cyan">/clear</span>     De-initialize telemetry prints.'
    ],
    '/bio': bio,
    '/specs': specs,
    '/projects': [
      'Active Sandbox Labs:',
      '  [1] <span class="text-indigo">AetherNet</span> - AI cognitive neural visualizer tool.',
      '  [2] <span class="text-indigo">Apex Quant</span> - Fintech dashboard with live market simulators.',
      '  [3] <span class="text-indigo">Helios EV</span> - Telemetry panel for autonomous navigation.',
      '  [4] <span class="text-indigo">CipherGuard</span> - Real-time network threat cyber-HUD.',
      'Navigate to the Projects section to activate full dashboard environments.'
    ],
    '/secret': [
      '<span class="text-indigo">[SECRET HANDSHAKE CODE CONFIRMED]</span>',
      'Easter Egg: "The digital universe is built on code, but illuminated by aesthetics."',
      'Uptime synchronization verified.'
    ]
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      input.value = '';

      // Print prompt and command
      printLine(`&gt; ${command}`, 'text-primary');

      if (command === '') return;

      if (command === '/clear') {
        // Clear all except system init lines
        body.querySelectorAll('.terminal-line').forEach((line, index) => {
          if (index > 1) line.remove();
        });
        return;
      }

      if (commands[command]) {
        commands[command].forEach(line => printLine(line));
      } else {
        printLine(`neural_shell: command directive not found: ${command}. Type <span class="text-cyan">/help</span> for commands.`, 'text-ruby');
      }

      // Autoscroll terminal
      body.scrollTop = body.scrollHeight;
    }
  });

  function printLine(htmlText, customClass = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${customClass}`;
    line.innerHTML = htmlText;
    // Insert before the input container
    body.insertBefore(line, body.querySelector('.terminal-input-container'));
  }
}

/* ==========================================================================
   6. TIMELINE SCROLL-DRIVEN PROGRESS
   ========================================================================== */
function initTimelineProgress() {
  const progressBar = document.getElementById('timeline-progress-bar');
  const section = document.getElementById('achievements');
  const items = document.querySelectorAll('.timeline-item');
  
  if (!progressBar || !section) return;

  window.addEventListener('scroll', () => {
    const sectionRect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    // Calculate how far section is scrolled
    const scrolledAmt = windowHeight - sectionRect.top;
    let percentage = 0;

    if (scrolledAmt > 0) {
      percentage = Math.min((scrolledAmt / (sectionHeight + windowHeight * 0.3)) * 100, 100);
    }
    if (sectionRect.top > windowHeight) {
      percentage = 0;
    }

    progressBar.style.height = `${percentage}%`;

    // Highlight active timeline nodes
    items.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop < windowHeight * 0.6) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/* ==========================================================================
   7. CONTACT COMPILATION & PACKET BURST ANIMATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const latencyLabel = document.getElementById('footer-latency');
  
  // Realtime ping check for footer
  setInterval(() => {
    if (latencyLabel) {
      const ping = Math.floor(Math.random() * 5) + 3; // 3-7ms local ping
      latencyLabel.textContent = `${ping}ms`;
    }
  }, 3000);

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Disable inputs & submit button to mimic transmission locking
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => input.disabled = true);
    submitBtn.disabled = true;
    
    const originalText = submitBtn.querySelector('.btn-text').innerHTML;
    submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING COGNITIVE PACKET...';

    // Particle Burst from Submit Button
    if (globalParticleSystem) {
      const rect = submitBtn.getBoundingClientRect();
      const burstX = rect.left + rect.width / 2;
      const burstY = rect.top + rect.height / 2;
      globalParticleSystem.triggerBurst(burstX, burstY, 30);
    }

    // Simulate luxury API transit delay
    setTimeout(() => {
      submitBtn.querySelector('.btn-text').textContent = 'TRANSMISSION STABILIZED';
      submitBtn.style.background = 'var(--color-emerald)';
      submitBtn.style.color = '#000';
      submitBtn.style.boxShadow = 'var(--glow-emerald)';
      
      // Flash input borders green
      inputs.forEach(input => {
        input.style.borderColor = 'var(--color-emerald)';
        input.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.1)';
      });

      setTimeout(() => {
        // Reset Form
        form.reset();
        inputs.forEach(input => {
          input.disabled = false;
          input.removeAttribute('style');
        });
        submitBtn.disabled = false;
        submitBtn.removeAttribute('style');
        submitBtn.querySelector('.btn-text').innerHTML = originalText;
      }, 3000);

    }, 2000);
  });
}
