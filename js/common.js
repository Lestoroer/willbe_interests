

let timeout = null;
let lastReq = null;

js.get('#search').focus();

js.get('#search').addEventListener('input', function(event) {
    setState('change');
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        search(event.target.value);
        timeout = null;
    }, 200); 
});

search('Interest_');


/** */
js.get('#searched_result').addEventListener('click', function(event) {
    setStatus(event.target, 'focus');
});

document.addEventListener('click', function(event) {
    setStatus(event.target, 'focus');
});

function log(text) {
    console.log(text)
}

const keydown = {};

window.addEventListener('keyup', function(event) {
    let el = event.target;

    // cntrl+enter
    if (keydown[17] && keydown[13]) {
        setStatus(el, 'change');
        return delete keydown[event.keyCode];
    }  
    log(event.keyCode)
    // cntrl+delete
    if (keydown[17] && keydown[46]) {
        setStatus(el, 'remove');
        return delete keydown[event.keyCode];
    }  

    switch(event.keyCode) {
        case 9:
            setStatus(el, 'focus');
            if (js.hasClass(event.target, 'lang')) {
                log('vlf');
                event.preventDefault();
                return false;
            }    
            //log(js.hasClass(event.target, 'lang'))
            break;
    }

    delete keydown[event.keyCode];
});

window.addEventListener('keydown', function(event) {
    keydown[event.keyCode] = 1;
});


function setStatus(target, status) {
    // удаляем пред.
    setDefaultStatus();

    set(target, status);

    switch(status) {
        case 'focus':
            let range = document.createRange();
            let sel = window.getSelection();
            if (target.childNodes[0]) {
                range.setStart(target.childNodes[0], target.innerText.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            return;
        case 'change':
            change(target);
            return;
        case 'success':
            return;
        case 'remove':
            remove(target);
            return;        
        case 'error':
            return;
    }

    let closestSearchedItem = target.closest(`.searched_item`);
    if (!closestSearchedItem) return;

    function set(target, status) {
        let closestSearchedItem = target.closest(`.searched_item`);
        if (!closestSearchedItem) return;
        let wrapperStatus = closestSearchedItem.querySelector('.wrapper_status');
        js.attr(wrapperStatus, 'state', status);
    }

    function remove(target) {
        let interest_id = js.attr(target, 'interest_id');
        if (!interest_id) return set(target, 'error');
        const searched_item = target.closest('.searched_item');
        if (!searched_item) return set(target, 'error');
        const lang_next = searched_item.nextElementSibling.querySelector('.lang');
        if (!lang_next) return;

        return new Promise ( (resolve, reject) => {
            const settings = {
                url : `http://51.75.37.65/api/interests_edit/${interest_id}/`
            }
            req.delete(settings,(error, result) => {
                handlerRespond(reject, resolve, error, result);
                setStatus(lang_next, 'focus');
                searched_item.outerHTML = '';
            });
        }); 
    }

    function change(target) {
        let interest_id = js.attr(target, 'interest_id');
        let interest_name = target.innerText;
        if (!interest_id || 
            !validInterest(interest_name)) return set(target, 'error');

        return new Promise ( (resolve, reject) => {
            const settings = {
                url : `http://51.75.37.65/api/interests_edit/${interest_id}/`
            }
            req.patch(settings, {"name" : interest_name},(error, result) => {
                handlerRespond(reject, resolve, error, result);
            });
        }); 
    }

    function handlerRespond(reject, resolve, error, result) {
        if (error >= 400 || !result) {
            set(target, 'error');
            return reject(error);
        }    
        resolve(result);
        set(target, 'success');
    }

    function validInterest(name) {
        return true;
    }
}


function setDefaultStatus() {
    let pr_wrapper_status = js.get('#searched_result').querySelector(`.wrapper_status:not([state="hidden"]`);
    // ставим дефолтный статус hidden
    if (pr_wrapper_status) js.attr(pr_wrapper_status, 'state', 'hidden');
}

async function search(text) {
    setState('change');
    lastReq = text;
    const searchData = await getSearchData(text);
    renderSearchData(searchData, text);
} 

function getSearchData(text) {
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

function renderSearchData(searchData, text) {

    if (lastReq != text) return;

    const intersts = searchData.details;

    let interstsHTML = [];

    for (let interst of intersts) {
        interstsHTML.push(getSearchedItem(interst));
    }

    let renderInfo = '';

    if (interstsHTML.length == 0) setState('not_found');
    else {
        renderInfo = interstsHTML.join('');
        setState('success');
    }

    js.get('#searched_result').innerHTML = renderInfo;
    
}

function getSearchedItem(item) {
    return `
        <div class="searched_item" interest_id="${item.id}"> 
            <div class="category">${item.category.name}</div>
            <div class="wrapper_status" state="hidden">
                <div class="status save">Со</div>   
                <div class="status loading">За</div>
                <div class="status success">Ус</div>
                <div class="status error">Er</div>
            </div>

            <div class="lang first_lang" interest_id="${item.id}" contentEditable="true">${item.name}</div> 
            <div class="lang second_lang" interest_id="${item.id}" contentEditable="true">${item.translation.name}</div> 
        </div>
    `;
}

function setState(state) {
    js.attr(js.get('.main'), 'state', state);
} 