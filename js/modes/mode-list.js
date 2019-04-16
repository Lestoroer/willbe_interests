class ModeList extends Modes {
    constructor() {
        super();
        js.attr(js.get('.main'), 'mode', 'mode_list_interests');
        js.attr(js.get('#checkbox_mode'), 'checked', '')
        this.loadInterests();

        if (!store.mode_list_interests) this.setHandlers();
        store.mode_list_interests = true;
    }

    setHandlers() {
        console.log('ModeList')
    }

    async loadInterests(page=pagination.page) {
        let data = await this.getData(page);
        interest.renderInterests(data.results);
    }

    getData(page=1, limit=10) {
        const offset = limit * (page - 1);
        return new Promise ( (resolve, reject) => {
            const settings = {
                url : `http://51.75.37.65/api/interests_edit/?limit=${limit}&offset=${offset}`
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