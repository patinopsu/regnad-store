// 1. Digital Clock (VCR Style)
setInterval(() => {
  const now = new Date();
  document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB');
}, 1000);

// 2. Random Glitch Function
function randglitch() {
  const screen = document.querySelector('.vcr-screen');
  
  // Briefly shake the screen
  screen.style.transform = `translate(${Math.random() * 5}px, ${Math.random() * 5}px)`;
  screen.style.filter = `hue-rotate(${Math.random() * 90}deg) contrast(150%)`;
  
  setTimeout(() => {
    screen.style.transform = 'none';
    screen.style.filter = 'none';
  }, 150);
}

function onchangeglitch() {
    const screen = document.querySelector('.vcr-screen');
    const body = document.body;
    const container = document.querySelector('.content');

    if (!screen) return;

    // 1. Extreme Visual Distortion
    const intenseFilters = [
        `blur(${Math.random() * 2}px) custom-drop-shadow(5px 5px red)`,
        `contrast(500%) brightness(150%) hue-rotate(${Math.random() * 360}deg)`,
        `invert(100%)`,
        `sepia(100%) saturate(1000%)`
    ];

    // Apply random intense filter
    screen.style.backdropFilter = intenseFilters[Math.floor(Math.random() * intenseFilters.length)];
    
    // 2. Vertical "Tape Tear" (The Screen Jumps)
    const jumpValue = Math.floor(Math.random() * 20) - 10;
    body.style.transform = `translateY(${jumpValue}px)`;
    
    // 3. RGB Split Effect via Text-Shadow (applied to the content)
    if (container) {
        container.style.textShadow = `
            ${Math.random() * 5}px 0 red, 
            -${Math.random() * 5}px 0 blue
        `;
    }

    // 4. Random "Static Burst"
    const noise = document.querySelector('.noise');
    if (noise) noise.style.opacity = "0.4"; // Pop the grain intensity

    // RESET AFTER SHORT BURST
    setTimeout(() => {
        screen.style.backdropFilter = "none";
        body.style.transform = "none";
        if (container) container.style.textShadow = "none";
        if (noise) noise.style.opacity = "0.04";
    }, 150 + Math.random() * 300); // Random duration for unpredictability
}

// 3. The "Observer" Effect 
// Randomly trigger glitches every 10-30 seconds
(function loop() {
  const rand = Math.round(Math.random() * 20000) + 10000;
  setTimeout(() => {
    randglitch();
    loop();
  }, rand);
}());

// 4. SPA Hook Simulation
// Call this whenever your SPA changes routes
window.onhashchange = function() {
  const osd = document.getElementById('osd-text');
  osd.innerText = "SEEKING...";
  onchangeglitch();
  
  setTimeout(() => {
    osd.innerText = "PLAY ▶";
  }, 2000);
};

function selfDestruct() {
    const container = document.querySelector('.container');
    const bgcontainer = document.querySelector('.bg-container');
    const noise = document.querySelector('.noise');
    const osd = document.getElementById('osd-text');

    // 1. Force a "Hardware Failure" Flash
    const flash = document.createElement('div');
    flash.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:10000;";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 50);

    // 2. Remove the background elements from the DOM entirely
    if (bgcontainer) bgcontainer.remove(); 


    // 3. Kill the noise or ramp it up (personal preference)
    if (noise) noise.style.opacity = "0.00";

    if (container) {
      container.innerHTML= '';
    }

    document.body.style.backgroundColor = 'black';
    
    // 4. Add cool text
    setTimeout(() => {
    // BLUE-NESS
    document.body.classList.add('bsod-mode');
    setLanguage(currentLang);
      container.innerHTML = `
          <div class="no-signal-wrapper">
              <div class="blue-screen-text">
                  <h1>KERNAL PANIC!!!</h1>
                  <p data-i18n="adviserefresh"></p>
              </div>
          </div>
      `;
    }, 1000)
    
    if (osd) {
        osd.innerText = "STOP ■";
        osd.style.color = "white";
    }

    // 6. Optional: Lock the user out
    //window.onbeforeunload = () => "System halted."; // Warning if they try to leave
}