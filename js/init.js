const _store = {
    timeout : null,
    lastReq : null,
    categories : [],
    url_edit : 'https://willbe.io/debug.edit/',
    url_hints : 'https://willbe.io/debug.hints/',
    url_debug : 'https://willbe.io/debug/',
}

const store = new Proxy(_store, {
    get(target, prop) {
        return target[prop];
    },
    set(target, prop, value) {
        
        if (prop == 'mode') {
            switch (value) {
                case 'mode_list_interests':
                    mode = new ModeList();
                    break;
                case 'mode_search':
                    mode = new ModeSearch();
                    break;    
            }
            localStorage.setItem('mode', value);
        }

        target[prop] = value;

        return true;
    }
});

const pagination = new Pagination();
const interest = new Interest();
const popupCategories = new PopupCategories();

let mode;
getCategories();
init();

// Загружаем категории в store
function getCategories() {
    return new Promise ( (resolve, reject) => {
        const settings = {
            url : `${store.url_debug}`
        }
        req.get(settings,(error, result) => {
            if (error >= 400 || !result) return reject(error);    
            resolve(result);
            store.categories = result;
        });
    }); 

}

function init() {

    let mode = localStorage.getItem('mode');
    if (!mode) mode = js.attr(js.get('.main'), 'mode');

    store.mode = mode;
}