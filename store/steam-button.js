import { Basket } from './basket.js';

let steamProductData = null;
let steamTemplateHtml = null;
let i18nData = { en: {}, th: {} };

async function initializeComponent() {
    if (!steamProductData || !steamTemplateHtml) {
        // Fetch everything: Data, Template, and your i18n files
        const [dataRes, tempRes, enRes, thRes] = await Promise.all([
            fetch('/store/products.json'),
            fetch('/store/button.html'),
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

    async connectedCallback() {
        await initializeComponent();
        
        const productId = this.getAttribute('product-id');
        const product = steamProductData[productId];
        if (!product) return;

        // Get language preference
        const lang = localStorage.getItem('preferredLang') || 'en';
        const title = i18nData[lang][`${productId}_title`] || productId;

        const parser = new DOMParser();
        const doc = parser.parseFromString(steamTemplateHtml, 'text/html');
        const styleTag = doc.querySelector('style').cloneNode(true);
        const wrapper = doc.querySelector('.wrapper').cloneNode(true);

        // Price Calculations
        const finalPrice = product.fullPrice * (1 - (product.discount / 100));
        const formatter = new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US', {
            style: 'currency', currency: 'THB'
        });

        // Inject Content
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

        // Button Action
        wrapper.querySelector('#add-btn').onclick = () => {
            Basket.addItem(productId);
            console.log(`Added ${title} to basket!`);
        };

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(styleTag);
        this.shadowRoot.appendChild(wrapper);
    }
}

customElements.define('price-button', SteamPriceButton);