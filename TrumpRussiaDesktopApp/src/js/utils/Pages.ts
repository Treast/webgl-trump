interface PagesManager {
    items: string[];
    init: () => void;
    show: (name: string) => void;
}

export const Pages: PagesManager = {

    items: [],

    init () {
        this.items = document.querySelectorAll('[data-page]');
        this.items.forEach((item: any) => item.style.display = 'none');
    },

    show (name: string) {
        this.items.forEach((item: any) => {
            item.style.display = item.getAttribute('data-page') === name ? 'block' : 'none';
        });
    }

};