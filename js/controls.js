class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch(type) {
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
    }

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            const key = event.key.toLowerCase();
            switch (key) {
                case "arrowleft":
                case "a":
                    this.left = true;
                    break;
                case "arrowright":
                case "d":
                    this.right = true;
                    break;
                case "arrowup":
                case "w":
                    this.forward = true;
                    break;
                case "arrowdown":
                case "s":
                    this.reverse = true;
                    break;
            }
        };
    
        document.onkeyup = (event) => {
            const key = event.key.toLowerCase();
            switch (key) {
                case "arrowleft":
                case "a":
                    this.left = false;
                    break;
                case "arrowright":
                case "d":
                    this.right = false;
                    break;
                case "arrowup":
                case "w":
                    this.forward = false;
                    break;
                case "arrowdown":
                case "s":
                    this.reverse = false;
                    break;
            }
        };
    }    
}