// __        __   ____                _       _   _____ 
// \ \      / /  / ___| ___ _ __ ___ (_)_ __ (_) |___ / 
//  \ \ /\ / /  | |  _ / _ \ '_ ` _ \| | '_ \| |   |_ \ 
//   \ V  V /   | |_| |  __/ | | | | | | | | | |  ___) |
//    \_/\_/     \____|\___|_| |_| |_|_|_| |_|_| |____/
// I have no idea what I'm doing.

const images = [
    '0', '1', '2'
];

let currentIndex = 0;
const currentLayer = document.querySelector('.current');
const nextLayer = document.querySelector('.next');

// Set initial image
currentLayer.style.backgroundImage = `url('res/bg/${images[currentIndex]}.webp')`;

function changeBackground() {
    let randomIndex;
    
    // Ensure we don't pick the same image that is currently showing
    do {
        randomIndex = Math.floor(Math.random() * images.length);
    } while (randomIndex === currentIndex);

    currentIndex = randomIndex;
    
    // Set the "next" layer to the random image
    nextLayer.style.backgroundImage = `url('res/bg/${images[currentIndex]}.webp')`;
    
    // Fade the next layer in
    nextLayer.style.opacity = 1;

    // Wait for the CSS transition (1.5s) to finish, then swap
    setTimeout(() => {
        currentLayer.style.backgroundImage = `url('res/bg/${images[currentIndex]}.webp')`;
        nextLayer.style.opacity = 0;
    }, 1500); 
}

// Change image every 5.15 seconds
setInterval(changeBackground, 6000);


// SPA Application Navigation with Fade Effect
async function navigateTo(path, addHistory = true) {
    const container = document.querySelector('.container');
    const content = document.querySelector('.content');
    const osd = document.getElementById('osd-text');

    // Scary Element
    const glitchInterval = setInterval(onchangeglitch, 50);
    container.classList.add('vcr-tear');
    if (osd) osd.innerText = "SEEKING..."; 
    onchangeglitch();

    content.classList.add('hidden');

    setTimeout(async () => {
        try {
            if (!path) return; // Stop if path is empty
            console.log("Navigating to:", path); // Debugging: check your console (F12) 
            // 1. Clean the path for CSS (Replace "/" with "-" for the data-attribute)
            // Example: "blog/post-1" becomes "blog-post-1"
            const pageKey = path.replace(/\//g, '-');
            document.body.setAttribute('data-page', pageKey);
            
            // 2. Fetch from the sub-folder
            const response = await fetch(`./pages/${path}.html`);
            
            if (!response.ok) throw new Error('Page not found');
            const html = await response.text();
            
            content.innerHTML = html;
            await setLanguage(currentLang);

            const scripts = content.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                
                // Copy attributes (like src, type, etc.)
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });

                // Copy inline code
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                
                // Append to body to execute, then immediately remove to keep DOM clean
                document.body.appendChild(newScript);
                oldScript.parentNode.removeChild(oldScript);
            });
            
            // 3. Set Web Page Title
            const formattedName = path.split('/').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' | ');
            document.title = `Regnad Computing | ${formattedName}`; 
            if (addHistory) {
                window.history.pushState({ path }, '', `#${path}`);
            }   
            content.classList.remove('hidden');

            clearInterval(glitchInterval);
            container.classList.remove('vcr-tear');
            if (osd) osd.innerText = "PLAY ▶";
        } catch (error) {
        console.error("System Malfunction:", error);
            const osd = document.getElementById('osd-text');

            let seconds = 5;
            
            // Initial warning
            if (osd) osd.innerText = `CRITICAL ERROR: SELF DESTRUCT IN ${seconds}s`;
            
            const countdown = setInterval(() => {
                seconds--;
                if (osd) osd.innerText = `CRITICAL ERROR: SELF DESTRUCT IN ${seconds}s`;
                
                // Trigger a violent glitch on every tick
                onchangeglitch();

                if (seconds <= 0) {
                    clearInterval(countdown);
                    clearInterval(glitchInterval);
                    container.classList.remove('vcr-tear');
                    selfDestruct();
                }
            }, 1000);

            container.classList.remove('hidden');
            //setTimeout(() => {
            //    console.log('Crashing Browser')
            //    txt = "a";
            //    while(1){
            //        txt = txt += "[Instrumental Intro] [Refrain] So close, no matter how far Couldn't be much more from the heart Forever trusting who we are And nothing else matters [Verse] Never opened myself this way Life is ours, we live it our way All these words, I don't just say And nothing else matters Trust I seek and I find in you Every day for us something new Open mind for a different view And nothing else matters [Chorus] Never cared for what they do Never cared for what they know But I know [Refrain] So close, no matter how far It couldn't be much more from the heart Forever trusting who we are And nothing else matters See Metallica Live Get tickets as low as $240 You might also like What Was I Made For? Billie Eilish The Tortured Poets Department Taylor Swift loml Taylor Swift [Chorus] Never cared for what they do Never cared for what they know But I know [Instrumental Break] [Verse] I never opened myself this way Life is ours, we live it our way All these words, I don't just say And nothing else matters Trust I seek and I find in you Every day for us something new Open mind for a different view And nothing else matters [Chorus] Never cared for what they say Never cared for games they play Never cared for what they do Never cared for what they know And I know, yeah, yeah [Guitar Solo] [Refrain] So close, no matter how far Couldn't be much more from the heart Forever trusting who we are No, nothing else matters [Instrumental Outro]"; 
            //    }
            //}, 9000)
        }
    }, 300); 
}

// 3. Load "Home" on startup
window.addEventListener('DOMContentLoaded', () => {
    // Check if there is already a hash in the URL (e.g., mysite.com/#about)
    const initialPage = window.location.hash.replace('#', '') || 'home';
    navigateTo(initialPage, false);
});

// 4. Handle the Browser Back/Forward buttons
window.addEventListener('popstate', (event) => {
    // 1. Check if we have state data saved from pushState
    if (event.state && event.state.path) {
        // 2. Call your function, but set 'addHistory' to false
        // so we don't create an infinite loop of history entries!
        navigateTo(event.state.path, false);
    } else {
        // 3. Fallback: If no state (like returning to the very start), 
        // try to load the page from the URL hash or default to 'home'
        const path = window.location.hash.replace('#', '') || 'home';
        navigateTo(path, false);
    }
});


// DON'T USE HREF in <a> TAG
document.getElementById('nav').addEventListener('click', (e) => {
    const link = e.target.closest('a'); // Works even if you have an icon inside the link
    if (link) {
        e.preventDefault(); // STOP the browser from refreshing
        
        // Get the path from the href (removing the '#' part)
        const path = link.getAttribute('href').replace('#', '');
        
        if (path) {
            navigateTo(path);
        }
    }
});

// i18n Support
const langToggle = document.getElementById('lang-toggle');
let currentLang = localStorage.getItem('preferredLang') || 'en';
let cachedTranslations = null;

async function setLanguage(lang) {
    try {
        const response = await fetch(`./i18n/${lang}.json`);
        const translations = await response.json();
        
        // Find all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        document.documentElement.lang = lang;
        localStorage.setItem('preferredLang', lang);
        currentLang = lang;
    } catch (error) {
        content.innerHTML = "<p>Could not load language file</p>";
        console.error("Could not load language file:", error);
    }
}

langToggle.addEventListener('click', () => {
    const content = document.querySelector('.content');
    const nav = document.querySelector('.nav');
    const nextLang = currentLang === 'en' ? 'th' : 'en';

    content.classList.add('hidden');
    nav.classList.add('hidden');
    setTimeout(() => {
        setLanguage(nextLang);
        nav.classList.remove('hidden');
        content.classList.remove('hidden');
    }, 400)
});