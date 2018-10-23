export class AlertDialog {

    constructor ({ name, onAccept = null, onRefuse = null }) {
        this.el = document.getElementById(name);
        this.accept = this.el.querySelector(`[data-alert-dialog="accept"]`);
        this.refuse = this.el.querySelector(`[data-alert-dialog="refuse"]`);

        this.accept.addEventListener('click', this.onResponse.bind(this, onAccept));
        this.refuse.addEventListener('click', this.onResponse.bind(this, onRefuse));

        this.hide();
    }

    onResponse (callback = null) {
        this.hide();
        if (callback !== null) callback();
    }

    show () {
        this.el.style.display = 'block';
        document.body.classList.add('alert-box-active');
    }

    hide () {
        this.el.style.display = 'none';
        document.body.classList.remove('alert-box-active');
    }
}
