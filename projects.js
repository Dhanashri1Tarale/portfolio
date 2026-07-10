/* ==========================================================================
   PROJECTS MATRIX & REAL-TIME INTERACTIVE SIMULATORS
   ========================================================================== */

const PROJECTS_DATA = [
  {
    id: "aethernet",
    title: "AetherNet AI",
    type: "AI & COGNITIVE SYSTEMS",
    shortDesc: "Next-generation neural orchestration engine visualizing real-time cognitive model states.",
    longDesc: "AetherNet coordinates and audits multi-agent generative systems. It visualizes synaptic neural activations, optimizing agent pathing and attention-weight pathways in real-time. Built to reduce cognitive latency and debug model hallucination grids.",
    tech: ["TypeScript", "Rust", "Python", "Pinecone", "WebAssembly"],
    features: [
      "Synaptic activation pathing debugging visualization.",
      "Vector embeddings proximity mapping overlay.",
      "High-throughput model latency tracking interface.",
      "Agent communication network topology matrix."
    ],
    metric: "45ms Mean Sync Speed",
    theme: "cyan",
    simulator: generateAetherNetSimulator
  },
  {
    id: "apexquant",
    title: "Apex Quant",
    type: "QUANTITATIVE FINTECH",
    shortDesc: "High-frequency crypto arbitrage terminal and live market candlestick simulator.",
    longDesc: "Apex Quant is a low-latency financial execution environment designed for decentralized ledger nodes. It processes real-time liquidity pools, simulating automated market-maker (AMM) arbitrage opportunities with direct telemetry feedback.",
    tech: ["Go", "Rust", "WebAssembly", "ClickHouse", "PostgreSQL"],
    features: [
      "Dynamic candlestick calculation with millisecond precision.",
      "Order book ledger flow stream simulation.",
      "Real-time slippage optimization analyzer.",
      "Intelligent liquidity pool pathfinder HUD."
    ],
    metric: "0.2ms Arbitrage Latency",
    theme: "emerald",
    simulator: generateApexQuantSimulator
  },
  {
    id: "heliosev",
    title: "Helios EV Autonomous",
    type: "HARDWARE TELEMETRY & AUTO-DRIVE",
    shortDesc: "Vector sweeps and LIDAR point cloud tracking simulator inspired by Tesla autopilot networks.",
    longDesc: "Helios EV simulates an autonomous vehicle control center. By gathering spatial coordinates, it builds a vector-sweep LIDAR map that renders surrounding physics-based obstacles, tracking proximity alarms and vehicle telemetry coordinates.",
    tech: ["C++", "TypeScript", "React", "Docker", "gRPC"],
    features: [
      "360-degree LIDAR radar swept tracking interface.",
      "Spatial object proximity classification alerts.",
      "Realtime coordinates and speed vector telemetry dials.",
      "System diagnostic failure log overlays."
    ],
    metric: "60 FPS LIDAR Refresh Rate",
    theme: "amber",
    simulator: generateHeliosEVSimulator
  },
  {
    id: "cipherguard",
    title: "CipherGuard CyberHUD",
    type: "CYBERSECURITY & NETWORK FORENSICS",
    shortDesc: "Intrusion alerts and scrolling threat maps tracking mock network packet routing anomalies.",
    longDesc: "CipherGuard represents a distributed defense network console. It isolates anomalous traffic patterns, presenting real-time geo-located network threat packets, firewall status reports, and localized node intrusion warnings.",
    tech: ["Go", "Next.js", "Redis", "Docker", "Kubernetes"],
    features: [
      "Simulated firewall node connectivity statuses.",
      "Interactive intrusion log shell scrolling in real-time.",
      "Threat classification and severity metrics indicators.",
      "Data packet route tracing node arrays."
    ],
    metric: "99.998% Intrusion Detection Rate",
    theme: "ruby",
    simulator: generateCipherGuardSimulator
  }
];

// Active loop registry to safely close unused modal loops
let activeSimulators = {};

document.addEventListener("DOMContentLoaded", () => {
  renderProjectsGrid();
  setupModalHandlers();
});

/* ==========================================================================
   RENDER CARDS IN GRID
   ========================================================================== */
function renderProjectsGrid() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = "";

  PROJECTS_DATA.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.setAttribute("data-id", p.id);
    
    card.innerHTML = `
      <div class="project-showcase">
        <div class="mockup-container" id="showcase-${p.id}">
          <!-- Dynamic Simulator Canvas will be injected here -->
        </div>
      </div>
      <div class="project-info">
        <div class="project-meta-top">
          <span class="project-type-tag text-${p.theme}">${p.type}</span>
          <span class="hud-status" style="color: var(--color-${p.theme})">${p.metric}</span>
        </div>
        <div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.shortDesc}</p>
        </div>
        <div class="project-tags">
          ${p.tech.map(t => `<span class="project-tag">${t}</span>`).join("")}
        </div>
      </div>
    `;

    grid.appendChild(card);
    
    // Initialize preview card simulator
    setTimeout(() => {
      p.simulator(`showcase-${p.id}`, false);
    }, 50);
  });
}

/* ==========================================================================
   PROJECT DETAIL MODAL CONTROLS
   ========================================================================== */
function setupModalHandlers() {
  const grid = document.getElementById("projects-grid");
  const modal = document.getElementById("project-modal");
  const backdrop = document.getElementById("modal-backdrop");
  const closeBtn = document.getElementById("modal-close-btn");
  const modalBody = document.getElementById("modal-body");

  if (!grid || !modal || !modalBody) return;

  // Open Project Details
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (!card) return;

    const projectId = card.getAttribute("data-id");
    const project = PROJECTS_DATA.find(p => p.id === projectId);
    
    if (project) {
      // Clear any active modal loops
      if (activeSimulators["modal"]) {
        cancelAnimationFrame(activeSimulators["modal"]);
        delete activeSimulators["modal"];
      }

      modalBody.innerHTML = `
        <div class="modal-project-layout">
          <!-- Visual Left Panel -->
          <div class="modal-project-visual" id="modal-visual-container">
            <!-- Simulated high quality visual canvas -->
          </div>
          
          <!-- Details Right Panel -->
          <div class="modal-project-details">
            <div>
              <div class="modal-project-meta">
                <span class="project-type-tag text-${project.theme}">${project.type}</span>
                <span class="project-tag">${project.metric}</span>
              </div>
              <h2 class="modal-project-title">${project.title}</h2>
              <p class="modal-project-desc">${project.longDesc}</p>
            </div>
            
            <div class="modal-features-list">
              <h4>CORE CORE PERFORMANCE FEATURES</h4>
              <ul>
                ${project.features.map(f => `<li>${f}</li>`).join("")}
              </ul>
            </div>
            
            <div>
              <h4 class="card-title">DEPLOYED INFRASTRUCTURE</h4>
              <div class="project-tags" style="margin-top: 10px; margin-bottom: 24px;">
                ${project.tech.map(t => `<span class="project-tag">${t}</span>`).join("")}
              </div>
              <button class="btn btn-primary btn-glow-${project.theme === 'ruby' ? 'indigo' : project.theme} btn-block" onclick="alert('Simulation node is currently running in isolated sandbox mode.')">
                LAUNCH SANDBOX GRID
              </button>
            </div>
          </div>
        </div>
      `;

      modal.classList.add("active");
      
      // Start larger high fidelity simulation in modal
      setTimeout(() => {
        project.simulator("modal-visual-container", true);
      }, 100);
    }
  });

  // Close Project Details
  function closeModal() {
    modal.classList.remove("active");
    if (activeSimulators["modal"]) {
      cancelAnimationFrame(activeSimulators["modal"]);
      delete activeSimulators["modal"];
    }
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  
  // Close with ESC key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ==========================================================================
   SIMULATOR 1: AETHERNET AI (Synaptic Activation Engine)
   ========================================================================== */
function generateAetherNetSimulator(containerId, isModal) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<canvas class="sim-canvas"></canvas>`;
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  // Size logic
  function setSize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }
  setSize();
  
  const nodes = [];
  const count = isModal ? 45 : 20;

  class SynapseNode {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 3 + 2;
      this.weight = Math.random();
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      this.pulse += 0.03;
      this.weight = (Math.sin(this.pulse) + 1) / 2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${0.4 + this.weight * 0.6})`;
      ctx.shadowColor = "rgba(0, 242, 254, 0.5)";
      ctx.shadowBlur = this.size * 2;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    }
  }

  for (let i = 0; i < count; i++) nodes.push(new SynapseNode());

  function animate() {
    if (!document.getElementById(containerId)) return; // Stop if DOM detached
    
    ctx.fillStyle = "rgba(4, 4, 8, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines first
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < (isModal ? 110 : 80)) {
          const strength = (isModal ? 110 : 80) - dist;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(127, 0, 255, ${strength / 250})`;
          ctx.lineWidth = strength / 60;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      n.update();
      n.draw();
    });

    const loopId = requestAnimationFrame(animate);
    if (isModal) activeSimulators["modal"] = loopId;
  }
  animate();
}

/* ==========================================================================
   SIMULATOR 2: APEX QUANT (Decentralized Exchange Engine)
   ========================================================================== */
function generateApexQuantSimulator(containerId, isModal) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="quant-container" style="display: flex; flex-direction: column; width: 100%; height: 100%; font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary); background: #030307; padding: 12px; box-sizing: border-box;">
      <div class="quant-header" style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px; margin-bottom: 6px;">
        <span style="color: var(--color-emerald)">SYS_POOL: ETH/USDC</span>
        <span id="${containerId}-price" style="font-weight: 700;">$3,421.42</span>
      </div>
      <div style="flex-grow: 1; position: relative;">
        <canvas class="sim-canvas"></canvas>
      </div>
      <div id="${containerId}-trades" style="height: ${isModal ? '120px' : '60px'}; overflow: hidden; border-top: 1px dotted rgba(255,255,255,0.05); padding-top: 6px; margin-top: 6px;">
        <!-- Scrolling list of trades -->
      </div>
    </div>
  `;

  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const priceEl = document.getElementById(`${containerId}-price`);
  const tradesEl = document.getElementById(`${containerId}-trades`);

  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  let price = 3421.42;
  const candleCount = isModal ? 30 : 15;
  const candles = [];

  // Generate initial candles
  for (let i = 0; i < candleCount; i++) {
    const open = price + (Math.random() - 0.5) * 15;
    const close = open + (Math.random() - 0.5) * 12;
    const high = Math.max(open, close) + Math.random() * 8;
    const low = Math.min(open, close) - Math.random() * 8;
    candles.push({ open, close, high, low });
    price = close;
  }

  // Draw chart
  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const spacing = canvas.width / candleCount;
    const candleWidth = spacing * 0.6;
    
    // Find min and max of current batch
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const maxVal = Math.max(...highs) + 5;
    const minVal = Math.min(...lows) - 5;
    const range = maxVal - minVal;

    candles.forEach((c, idx) => {
      const x = idx * spacing + spacing * 0.2;
      const yOpen = canvas.height - ((c.open - minVal) / range) * canvas.height;
      const yClose = canvas.height - ((c.close - minVal) / range) * canvas.height;
      const yHigh = canvas.height - ((c.high - minVal) / range) * canvas.height;
      const yLow = canvas.height - ((c.low - minVal) / range) * canvas.height;

      const color = c.close >= c.open ? "rgba(16, 185, 129, 0.85)" : "rgba(239, 68, 68, 0.85)";

      // Draw wick
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.moveTo(x + candleWidth / 2, yHigh);
      ctx.lineTo(x + candleWidth / 2, yLow);
      ctx.stroke();

      // Draw candle body
      ctx.fillStyle = color;
      ctx.fillRect(x, Math.min(yOpen, yClose), candleWidth, Math.max(Math.abs(yOpen - yClose), 1.5));
    });
  }

  // Inject a simulated trade log
  function addTradeLog() {
    const isBuy = Math.random() > 0.45;
    const amount = (Math.random() * 2.5 + 0.1).toFixed(3);
    const logColor = isBuy ? "var(--color-emerald)" : "var(--color-ruby)";
    const buySell = isBuy ? "BUY" : "SELL";
    
    // Shift prices
    const diff = (Math.random() - 0.5) * 8;
    price += diff;
    if (priceEl) priceEl.textContent = `$${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Update candles
    candles.shift();
    const lastC = candles[candles.length - 1];
    candles.push({
      open: lastC.close,
      close: price,
      high: Math.max(lastC.close, price) + Math.random() * 4,
      low: Math.min(lastC.close, price) - Math.random() * 4
    });

    drawChart();

    if (tradesEl) {
      const tradeLine = document.createElement("div");
      tradeLine.style.display = "flex";
      tradeLine.style.justify = "space-between";
      tradeLine.style.padding = "2px 0";
      tradeLine.innerHTML = `
        <span>SYS:[PACK_LOG]</span>
        <span style="color: ${logColor}">${buySell} ${amount} ETH</span>
        <span>$${price.toFixed(2)}</span>
      `;
      tradesEl.insertBefore(tradeLine, tradesEl.firstChild);

      // Keep logs size tidy
      if (tradesEl.children.length > (isModal ? 8 : 4)) {
        tradesEl.removeChild(tradesEl.lastChild);
      }
    }
  }

  drawChart();

  // Run update loop
  let lastTime = 0;
  function animate(timestamp) {
    if (!document.getElementById(containerId)) return;

    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;

    if (elapsed > 1000) { // Every 1s trigger random trade and shift chart
      addTradeLog();
      lastTime = timestamp;
    }

    const loopId = requestAnimationFrame(animate);
    if (isModal) activeSimulators["modal"] = loopId;
  }
  requestAnimationFrame(animate);
}

/* ==========================================================================
   SIMULATOR 3: HELIOS EV (Autonomous Autopilot Sweep)
   ========================================================================== */
function generateHeliosEVSimulator(containerId, isModal) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<canvas class="sim-canvas" style="background:#020205"></canvas>`;
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  let sweepAngle = 0;
  const obstacles = [];
  const obstacleCount = isModal ? 12 : 6;

  // Set initial coordinates
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 80 + 30, // Distance from center
      size: Math.random() * 6 + 3,
      alpha: 0
    });
  }

  function animate() {
    if (!document.getElementById(containerId)) return;

    ctx.fillStyle = "rgba(2, 2, 5, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxRadius = Math.min(cx, cy) - 15;

    // Draw grid rings
    ctx.strokeStyle = "rgba(245, 158, 11, 0.08)";
    ctx.lineWidth = 1;
    for (let r = maxRadius / 3; r <= maxRadius; r += maxRadius / 3) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw crosshair axes
    ctx.beginPath();
    ctx.moveTo(cx - maxRadius, cy); ctx.lineTo(cx + maxRadius, cy);
    ctx.moveTo(cx, cy - maxRadius); ctx.lineTo(cx, cy + maxRadius);
    ctx.stroke();

    // Draw sweeping sensor beam
    sweepAngle += 0.025;
    if (sweepAngle > Math.PI * 2) sweepAngle = 0;

    const sx = cx + Math.cos(sweepAngle) * maxRadius;
    const sy = cy + Math.sin(sweepAngle) * maxRadius;

    ctx.beginPath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
    grad.addColorStop(0, "rgba(245, 158, 11, 0.2)");
    grad.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
    ctx.lineWidth = 2.5;
    ctx.moveTo(cx, cy);
    ctx.lineTo(sx, sy);
    ctx.stroke();

    // Draw central node (Autonomous unit)
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "var(--color-amber)";
    ctx.fill();

    // Update and draw targets detected
    obstacles.forEach(o => {
      // Check if sweep line is crossing target
      const angleDiff = Math.abs(sweepAngle - o.angle);
      if (angleDiff < 0.05) {
        o.alpha = 1; // Pulse detection highlight
      } else {
        o.alpha -= 0.008; // Decay
      }
      o.alpha = Math.max(o.alpha, 0.15);

      const ox = cx + Math.cos(o.angle) * (o.dist / 110 * maxRadius);
      const oy = cy + Math.sin(o.angle) * (o.dist / 110 * maxRadius);

      ctx.beginPath();
      ctx.arc(ox, oy, o.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 158, 11, ${o.alpha})`;
      ctx.shadowColor = "var(--color-amber)";
      ctx.shadowBlur = o.alpha * 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw vector connector line if illuminated
      if (o.alpha > 0.7) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
        ctx.moveTo(cx, cy);
        ctx.lineTo(ox, oy);
        ctx.stroke();
      }
    });

    // Draw HUD logs overlay in Modal
    if (isModal) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "10px monospace";
      ctx.fillText(`SYS.HELIOS_AUTODRIVE: LOG_OK`, 15, 25);
      ctx.fillText(`RADAR SCAN RANGE: 250m`, 15, 40);
      ctx.fillText(`GPS SYNC: 37.7749° N, 122.4194° W`, 15, 55);
      ctx.fillText(`ACTIVE_OBSTACLES: ${obstacleCount}`, 15, 70);
    }

    const loopId = requestAnimationFrame(animate);
    if (isModal) activeSimulators["modal"] = loopId;
  }
  animate();
}

/* ==========================================================================
   SIMULATOR 4: CIPHERGUARD (Cyber Threat Map)
   ========================================================================== */
function generateCipherGuardSimulator(containerId, isModal) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; font-family: var(--font-mono); font-size: 0.65rem; color: #ef4444; background: #050101; padding: 12px; box-sizing: border-box; border: 1px solid rgba(239,68,68,0.15)">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(239,68,68,0.2); padding-bottom: 6px; margin-bottom: 6px; font-weight: 700;">
        <span>THREAT VECTOR MONITOR</span>
        <span id="${containerId}-status" class="hud-status" style="color: #ef4444;">SHIELD_ENGAGED</span>
      </div>
      <div style="flex-grow: 1; position: relative;">
        <canvas class="sim-canvas"></canvas>
      </div>
      <div id="${containerId}-shell" style="height: ${isModal ? '110px' : '50px'}; overflow: hidden; border-top: 1px solid rgba(239,68,68,0.2); padding-top: 6px; margin-top: 6px; color: #fca5a5;">
        <!-- Intrusion alert streams -->
      </div>
    </div>
  `;

  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const shellEl = document.getElementById(`${containerId}-shell`);

  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const threatIpPrefixes = ["192.168.1", "10.0.12", "172.16.8", "64.233.19"];
  const anomalies = ["DDOS_ATTACK", "PORT_SCAN", "SQL_INJECTION", "MALWARE_HIT", "SSH_BRUTE"];

  // Draw node structure on grid
  const columns = 8;
  const rows = 5;
  const gridNodes = [];

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      gridNodes.push({
        x: (c + 0.5) * (canvas.width / columns),
        y: (r + 0.5) * (canvas.height / rows),
        anomaly: false,
        timer: 0
      });
    }
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    ctx.strokeStyle = "rgba(239, 68, 68, 0.05)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < gridNodes.length; i++) {
      const n1 = gridNodes[i];
      for (let j = i + 1; j < gridNodes.length; j++) {
        const n2 = gridNodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        // Only draw grid connections if they are adjacent
        if (dist < canvas.width / columns * 1.5) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    gridNodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      
      if (n.anomaly) {
        n.timer -= 0.015;
        if (n.timer <= 0) n.anomaly = false;

        ctx.fillStyle = `rgba(239, 68, 68, ${n.timer})`;
        ctx.strokeStyle = `rgba(239, 68, 68, ${n.timer})`;
        ctx.lineWidth = 1;
        ctx.arc(n.x, n.y, 10 * (1 - n.timer), 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
      } else {
        ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
      }
      
      ctx.fill();
    });
  }

  // Trigger simulated threat
  function triggerThreat() {
    // Pick random node
    const randomNode = gridNodes[Math.floor(Math.random() * gridNodes.length)];
    randomNode.anomaly = true;
    randomNode.timer = 1.0;

    // Pick details
    const ip = `${threatIpPrefixes[Math.floor(Math.random() * threatIpPrefixes.length)]}.${Math.floor(Math.random() * 254) + 1}`;
    const type = anomalies[Math.floor(Math.random() * anomalies.length)];
    const port = Math.random() > 0.5 ? 443 : 80;

    if (shellEl) {
      const line = document.createElement("div");
      line.style.display = "flex";
      line.style.justify = "space-between";
      line.style.padding = "2px 0";
      line.innerHTML = `
        <span>ALERT: ${type}</span>
        <span>IP: ${ip}</span>
        <span>PORT: ${port}</span>
      `;
      shellEl.insertBefore(line, shellEl.firstChild);
      
      if (shellEl.children.length > (isModal ? 7 : 3)) {
        shellEl.removeChild(shellEl.lastChild);
      }
    }
  }

  drawGrid();

  // Simulation run loops
  let lastThreatTime = 0;
  function animate(timestamp) {
    if (!document.getElementById(containerId)) return;

    if (!lastThreatTime) lastThreatTime = timestamp;
    const elapsed = timestamp - lastThreatTime;

    if (elapsed > 1600) { // Threat triggers every 1.6s
      triggerThreat();
      lastThreatTime = timestamp;
    }

    drawGrid();

    const loopId = requestAnimationFrame(animate);
    if (isModal) activeSimulators["modal"] = loopId;
  }
  requestAnimationFrame(animate);
}
