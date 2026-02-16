let steamProductData = null;
let steamTemplateHtml = null;

async function initializeComponent() {
    if (!steamProductData || !steamTemplateHtml) {
        const [dataRes, tempRes] = await Promise.all([
            fetch('/store/index.json'),
            fetch('/store/index.html')
        ]);
        steamProductData = await dataRes.json();
        steamTemplateHtml = await tempRes.text();
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

        // 1. Use DOMParser to turn the fetched string into a document
        const parser = new DOMParser();
        const doc = parser.parseFromString(steamTemplateHtml, 'text/html');

        // 2. Extract the Style and the HTML Wrapper
        const styleTag = doc.querySelector('style');
        const wrapper = doc.querySelector('.wrapper');

        // 3. Clone them so we don't move the original reference
        const finalStyle = styleTag.cloneNode(true);
        const finalHtml = wrapper.cloneNode(true);

        // --- Logic for Prices and Discounts ---
        const hasDiscount = product.discount > 0;
        const finalPrice = product.fullPrice * (1 - (product.discount / 100));
        const formatter = new Intl.NumberFormat('th-TH', {
            style: 'currency', currency: 'THB', minimumFractionDigits: 2
        });

        const discEl = finalHtml.querySelector('#discount-tag');
        const oldEl = finalHtml.querySelector('#price-old');
        const nowEl = finalHtml.querySelector('#price-now');

        if (hasDiscount) {
            discEl.textContent = `-${product.discount}%`;
            oldEl.textContent = formatter.format(product.fullPrice);
        } else {
            discEl.classList.add('hidden');
            oldEl.classList.add('hidden');
        }

        nowEl.textContent = formatter.format(finalPrice);

        // Handle button click
        finalHtml.querySelector('#add-btn').onclick = () => {
            alert(`Added ${productId} to cart!`);
        };

        // 4. Wipe the Shadow DOM and append both Style and HTML
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(finalStyle); // This injects the CSS
        this.shadowRoot.appendChild(finalHtml);  // This injects the Button
    }
}

if (!customElements.get('price-button')) {
    customElements.define('price-button', SteamPriceButton);
}