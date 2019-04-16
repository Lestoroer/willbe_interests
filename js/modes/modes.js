class Modes {
    constructor() {
        this.saveMode();
        if (store.mode) return;

        js.get('#checkbox_mode').addEventListener('click', function(event) {
            if (event.target.checked) {
                store.mode = 'mode_search';
            } else {
                store.mode = 'mode_list_interests';
            }
        });
    }

    setHandlers() {
        // js.get('#checkbox_mode').addEventListener('click', function(event) {
            
        // });
    }

    saveMode() {
        console.log(this.name)
    }
}