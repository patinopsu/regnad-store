import { Basket } from './basket.js';

// Global cache so we don't re-fetch on every button
let steamProductData = null;
let steamTemplateHtml = null;
let i18nData = { en: {}, th: {} };

async function initializeComponent() {
    if (!steamProductData) {
        console.log('Initializing Steam Component Data...'); // Check if this fires
        const [dataRes, tempRes, enRes, thRes] = await Promise.all([
            fetch('/store/products.json'),
            fetch('/store/steam-button.html'),
            fetch('/i18n/en.json'),
            fetch('/i18n/th.json')
        ]);
        
        steamProductData = await dataRes.json();
        steamTemplateHtml = await tempRes.text();
        i18nData.en = await enRes.json();
        i18nData.th = await thRes.json();
    }
}

class SteamPriceButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // This is the "Magic" for SPAs. 
    // It runs every time the tag enters the DOM, even after navigation.
    async connectedCallback() {
        console.log('Button detected in DOM!'); 
        await initializeComponent();
        this.render();
    }

    render() {
        const productId = this.getAttribute('product-id');
        const product = steamProductData[productId];
        if (!product) return;

        const lang = localStorage.getItem('preferredLang') || 'en';
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(steamTemplateHtml, 'text/html');
        const styleTag = doc.querySelector('style').cloneNode(true);
        const wrapper = doc.querySelector('.wrapper').cloneNode(true);

        const finalPrice = product.fullPrice * (1 - (product.discount / 100));
        const formatter = new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US', {
            style: 'currency', currency: 'THB'
        });

        const discEl = wrapper.querySelector('#discount-tag');
        const oldEl = wrapper.querySelector('#price-old');
        
        if (product.discount > 0) {
            discEl.textContent = `-${product.discount}%`;
            oldEl.textContent = formatter.format(product.fullPrice);
        } else {
            discEl.classList.add('hidden');
            oldEl.classList.add('hidden');
        }

        wrapper.querySelector('#price-now').textContent = formatter.format(finalPrice);

        wrapper.querySelector('#add-btn').onclick = () => {
            Basket.addItem(productId);
            // Optional: Trigger a UI feedback here
        };

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(styleTag);
        this.shadowRoot.appendChild(wrapper);
    }
}

// Define it globally once
if (!customElements.get('price-button')) {
    customElements.define('price-button', SteamPriceButton);
}