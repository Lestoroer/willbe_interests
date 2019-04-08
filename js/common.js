

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

search('Гарри поттер');

js.get('#searched_result').addEventListener('click', function(event) {
    setFocus(event.target);
});

window.addEventListener('keyup', function(event) {
    if (event.code == 'Tab') {
        let el = event.target;
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(el.childNodes[0], event.target.innerText.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        setFocus(el);
    }
});

function setFocus(target) {
    // удаляем пред.
    setDefaultStatus();

    // добавляем новый статус
    let closestSearchedItem = target.closest(`.searched_item`);
    let wrapperStatus = closestSearchedItem.querySelector('.wrapper_status');
    js.attr(wrapperStatus, 'state', 'save');
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

    //js.attr(js.get('.main'), 'state', state);
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
        <div class="searched_item"> 
            <div class="category">${item.category.name}</div>
            <div class="wrapper_status" state="hidden">
                <div class="status save">Со</div>   
                <div class="status loading">За</div>
                <div class="status success">Ус</div>
                <div class="status error">Er</div>
            </div>

            <div class="lang first_lang" contentEditable="true">${item.name}</div> 
            <div class="lang second_lang" contentEditable="true">${item.translation.name}</div> 
        </div>
    `;
}

function setState(state) {
    js.attr(js.get('.main'), 'state', state);
} 