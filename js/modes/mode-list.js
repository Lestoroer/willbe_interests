class ModeList extends Modes {
    constructor() {
        super();
        js.attr(js.get('.main'), 'mode', 'mode_list_interests');
        js.removeAttr(js.get('#checkbox_mode'), 'checked');
        
        this.loadInterests();

        if (!store.mode_list_interests) this.setHandlers();
        store.mode_list_interests = true;

        this.name = 'mode_list';
    }

    setHandlers() {
        console.log('ModeList')
    }

    async loadInterests(page=pagination.page) {
        store.lastReq = page;
        let data = await this.getData(page);
        if (store.lastReq != page) return console.log('Not sync render data');
        window.scrollTo(0, 0);
        interest.renderInterests(data.results, page);
    }

    getData(page=1, limit=100) {
        const offset = limit * (page - 1);
        return new Promise ( (resolve, reject) => {
            const settings = {
                url : `${store.url_edit}?limit=${limit}&offset=${offset}`
            }
            req.get(settings, (error, result) => {
                if (error >= 400 || !result) return reject(error);
                resolve(result);
            });
        }); 
    }

    getResultContainer() {
        return document.querySelector('.wrapper_list #searched_result');
    }

    saveMode() {

    }

}