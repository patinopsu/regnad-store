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
    const container = document.querySelector('.content');

    container.classList.add('hidden');

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
            
            container.innerHTML = html;
            await setLanguage(currentLang);
            
            // 3. Set Web Page Title
            const formattedName = path.split('/').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' | ');
            document.title = `Regnad Computing | ${formattedName}`;

            if (addHistory) {
                window.history.pushState({ path }, '', `#${path}`);
            }

            container.classList.remove('hidden');
        } catch (error) {
            container.innerHTML = "<h2>404</h2><p>Page not found.</p>";
            container.classList.remove('hidden');
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