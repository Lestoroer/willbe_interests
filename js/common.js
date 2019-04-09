

let timeout = null;
let lastReq = null;

js.get('#search').focus();

js.get('#search').addEventListener('input', function(event) {
    setState('loading');
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        search(event.target.value);
        timeout = null;
    }, 200); 
});

search('Interest_');


/** */
js.get('#searched_result').addEventListener('click', function(event) {
    setStatus(event.target, 'save');
});

document.addEventListener('click', function(event) {
    setStatus(event.target, 'save');
});

function log(text) {
    console.log(text)
}

const keydown = {};

window.addEventListener('keyup', function(event) {
    let el = event.target;

    // cntrl+enter
    if (keydown[13] && keydown[17]) {
        setStatus(el, 'loading');
        return delete keydown[event.keyCode];
    }    

    switch(event.keyCode) {
        case 9:
            let range = document.createRange();
            let sel = window.getSelection();
            if (el.childNodes[0]) {
                range.setStart(el.childNodes[0], event.target.innerText.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            setStatus(el, 'save');
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
        case 'save':
            //set(target, status);
            return;
        case 'loading':
            //set(target, status);
            edit(target);
            return;
        case 'success':
            //set(target, status);
            break;
        case 'error':
            return;
    }

    function set(target, status) {
        let closestSearchedItem = target.closest(`.searched_item`);
        if (!closestSearchedItem) return;
        let wrapperStatus = closestSearchedItem.querySelector('.wrapper_status');
        js.attr(wrapperStatus, 'state', status);
    }

    function edit(target) {
        let interest_id = js.attr(target, 'interest_id');
        let interest_name = target.innerText;
        if (!interest_id || 
            !validInterest(interest_name)) return set(target, 'error');

        return new Promise ( (resolve, reject) => {
            const settings = {
                url : `http://51.75.37.65/api/interests_edit/${interest_id}/`
            }
            req.patch(settings, {"name" : interest_name},(error, result) => {
                if (error >= 400 || !result) return reject(error);
                console.log(result)
                resolve(result);
                set(target, 'success');
            });
        }); 
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
    setState('loading');
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