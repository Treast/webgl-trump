class PhoneManager {
    private readonly numbers: NodeListOf<HTMLElement>;
    private readonly input: HTMLElement;
    private readonly deleteInput: HTMLElement;
    private readonly callInput: HTMLElement;

    constructor() {
        this.numbers = document.querySelectorAll('.phone .numbers .number span');
        this.deleteInput = document.querySelector('.phone .numbers .number.delete');
        this.callInput = document.querySelector('.phone .numbers .number.call');
        this.input = document.querySelector('.phone .phone-number');
    }

    init() {
        this.setupListeners();
    }

    setupListeners() {
        for(let number of this.numbers) {
            number.addEventListener('click', (e) => {
                const element: HTMLElement = e.target as HTMLElement;
                const number: string = element.getAttribute('data-number');
                if(number) this.addNumber(number);
            });
        }
        this.deleteInput.addEventListener('click', () => {
            this.deleteNumber();
        });
        this.callInput.addEventListener('click', () => {
            this.call();
        });
    }

    addNumber(number: string) {
        if(this.input.innerText.length < 14) {
            let newNumber: string = this.input.innerText + number;
            newNumber = newNumber.replace(/(\d{2})/g, '$1 ');
            this.input.innerText = newNumber;
        }
    }

    deleteNumber() {
        this.input.innerText = this.input.innerText.slice(0, -1);
    }

    call() {

    }
}

export default new PhoneManager();
