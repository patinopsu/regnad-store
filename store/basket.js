export const Basket = {
    // Save to LocalStorage
    addItem(productId) {
        let cart = JSON.parse(localStorage.getItem('steam_cart') || '[]');
        if (!cart.includes(productId)) {
            cart.push(productId);
            localStorage.setItem('steam_cart', JSON.stringify(cart));
            
            // Notify the rest of the app that the basket updated
            window.dispatchEvent(new CustomEvent('basket-updated', { detail: cart }));
        }
    },

    getContents() {
        return JSON.parse(localStorage.getItem('steam_cart') || '[]');
    },

    clear() {
        localStorage.removeItem('steam_cart');
        window.dispatchEvent(new CustomEvent('basket-updated', { detail: [] }));
    }
};