class ModeSearch extends Modes {
    constructor() {
        super();

        js.attr(js.get('.main'), 'state', 'start');
        js.attr(js.get('.main'), 'mode', 'mode_search');
        js.attr(js.get('#checkbox_mode'), 'checked', 'checked')
        js.get('#search').focus();

        if (!store.mode_search) this.setHandlers();
        store.mode_search = true;
    }

    setHandlers() {
        js.get('#search').addEventListener('input', (event) => {
            setState('change');
            if (store.timeout) clearTimeout(store.timeout);
            store.timeout = setTimeout(() => {
                this.search(event.target.value);
                store.timeout = null;
            }, 200); 
        });

        js.get('#button_add_new_interests').addEventListener('click', function(event) {
            interest.notFound();
        
            let search = js.get('#search');
            const search_value = search.value;
            let lang = detectLanguage(search_value);
        
            let lang_class = lang == 1 ? `.ru_lang` : `.en_lang`;
        
            handlerInterest(document.querySelector(`.searched_item ${lang_class}`), 'focus');
        });  

    }

    async search(text) {
        setState('change');
        store.lastReq = text;
        if (store.lastReq != text) return;
        const searchData = await this.getSearchData(text);
        const interests = searchData.details;

        interest.renderInterests(interests, text);
    }

    getSearchData(text) {
        return new Promise ( (resolve, reject) => {
            const settings = {
                url : `http://51.75.37.65/api/interests_hints/?q=${text}`
            }
            req.get(settings, (error, result) => {
                if (error >= 400 || !result) return reject(error);
                resolve(result);
            });
        }); 
    }

    getResultContainer() {
        return document.querySelector('.wrapper_search #searched_result');
    }
}