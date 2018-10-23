export const Pages = {

    items: [],

    init () {
        this.items = document.querySelectorAll('[data-page]');
        this.items.forEach(item => item.style.display = 'none');
    },

    show (name) {
        this.items.forEach(item => {
            item.style.display = item.getAttribute('data-page') === name ? 'block' : 'none';
        });
    }

};