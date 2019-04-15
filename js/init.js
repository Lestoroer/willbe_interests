const _store = {
    timeout : null,
    lastReq : null,
    categories : []
}

let mode;

const store = new Proxy(_store, {
    get(target, prop) {
        return target[prop];
    },
    set(target, prop, value) {

        if (prop == 'mode') {
            switch (value) {
                case 'list_interests':
                    value = new ModeList();
                    break;
                case 'search_interests':
                    mode = new ModeSearch();
                    break;    
            }
        }

        return true;
    }
});

getCategories();

function getCategories() {
    return new Promise ( (resolve, reject) => {
        const settings = {
            url : `http://51.75.37.65/api/categories_debug/`
        }
        req.get(settings,(error, result) => {
            if (error >= 400 || !result) return reject(error);    
            resolve(result);
            store.categories = result;
        });
    }); 

}

function init() {
    let mode = js.attr(js.get('.main'), 'mode');
    store.mode = mode;
}

init();