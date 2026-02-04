// __        __   ____                _       _   _____ 
// \ \      / /  / ___| ___ _ __ ___ (_)_ __ (_) |___ / 
//  \ \ /\ / /  | |  _ / _ \ '_ ` _ \| | '_ \| |   |_ \ 
//   \ V  V /   | |_| |  __/ | | | | | | | | | |  ___) |
//    \_/\_/     \____|\___|_| |_| |_|_|_| |_|_| |____/
// I have no idea what I'm doing.

const images = [
    'res/background0.webp',
    'res/background1.webp',
    'res/background2.webp',
    'res/background3.webp',
    'res/background4.webp',
    'res/background5.webp'
];

let currentIndex = 0;
const currentLayer = document.querySelector('.current');
const nextLayer = document.querySelector('.next');

// Set initial image
currentLayer.style.backgroundImage = `url('${images[currentIndex]}')`;

function changeBackground() {
    let randomIndex;
    
    // Ensure we don't pick the same image that is currently showing
    do {
        randomIndex = Math.floor(Math.random() * images.length);
    } while (randomIndex === currentIndex);

    currentIndex = randomIndex;
    
    // Set the "next" layer to the random image
    nextLayer.style.backgroundImage = `url('${images[currentIndex]}')`;
    
    // Fade the next layer in
    nextLayer.style.opacity = 1;

    // Wait for the CSS transition (1.5s) to finish, then swap
    setTimeout(() => {
        currentLayer.style.backgroundImage = `url('${images[currentIndex]}')`;
        nextLayer.style.opacity = 0;
    }, 1500); 
}

// Change image every 5 seconds
setInterval(changeBackground, 5150);


// SPA Application Navigation with Fade Effect
// 1. Handle the page change logic
async function navigateTo(page, addHistory = true) {
    const container = document.querySelector('.content');

    // Update data-page attribute for CSS styling
    document.body.setAttribute('data-page', page);
    
    // Start Fade Out
    container.classList.add('hidden');

    setTimeout(async () => {
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Page not found');
            const html = await response.text();

            // Update content
            container.innerHTML = html;

            // 2. Update the URL without reloading
            if (addHistory) {
                window.history.pushState({ page }, '', `#${page}`);
            }

            // Fade In
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
    if (event.state && event.state.page) {
        navigateTo(event.state.page, false);
    }
});