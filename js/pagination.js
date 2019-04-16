class Pagination {
    constructor() {
        this.page = localStorage.getItem('page');
        if (!this.page) this.page = 1;

        this.setHandlers();
        this.setPage(this.page, 'init');
    }

    setHandlers() {
        js.listen(js.get('.wrapper_pagination'), 'click', (event) => {
            let target = event.target;
            if (js.hasClass(target, 'pagination_prev')) pagination.prev();
            if (js.hasClass(target, 'pagination_next')) pagination.next();
        });

        js.listen(js.get('#pagination'), 'input', (event) => {
            pagination.setPage(event.target.value);
        });
    }

    setPage(page, state) {
        if (+page < 1 || !+page) return;
        if (typeof +page != 'number') return;
        js.get('#pagination').value = page;
        localStorage.setItem('page', page);
        this.page = page;
        
        if (state == 'init') return; 
        mode.loadInterests(this.page);
    }

    prev() {
        this.setPage(+this.page - 1);
    }

    next() {
        this.setPage(+this.page + 1);
    }
}