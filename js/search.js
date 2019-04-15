
async function search(text) {
    setState('change');
    store.lastReq = text;
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

    if (store.lastReq != text) return;

    const intersts = searchData.details;

    let interstsHTML = [];

    for (let interst of intersts) {
        interstsHTML.push(getSearchedItem(interst));
    }

    let renderInfo = '';

    if (interstsHTML.length == 0) {
        return makeInterest();
        //renderInfo = getSearchedItem({category:{}, translation:{}});
    }    
    else {
        renderInfo = interstsHTML.join('');
        setState('success');
    }

    js.get('#searched_result').innerHTML = renderInfo;
    
}

js.get('#button_add_new_interests').addEventListener('click', function(event) {
    makeInterest();

    let search = js.get('#search');
    const search_value = search.value;
    let lang = detectLanguage(search_value);

    let lang_class = lang == 1 ? `.first_lang` : `.second_lang`;

    handlerInterest(document.querySelector(`.searched_item ${lang_class}`), 'focus');
});    


function makeInterest() {
    setState('not_found');

    let search = js.get('#search');
    const search_value = search.value;
    let lang = detectLanguage(search_value)

    let interest = {
        id : 'NEW',
        name : '',
        language : lang,
        category:{id:store.categories[0].id, name: store.categories[0].name}, 
        translation: {
            name : ''
        }
    }

    if (lang == 2) {
        interest.translation.name = search_value;
    } else if (lang == 1) {
        interest.name = search_value;
    }

    js.get('#searched_result').innerHTML = getSearchedItem(interest, false);
    //handlerInterest(document.querySelector('.searched_item .first_lang'), 'focus');
    //search.value = "";
}

function detectLanguage(text) {
    let text_without_numbers = text.replace(/[0-9]/g, '');
    if (/^[a-zA-Z]+$/.test(text_without_numbers)) {
        return 2;
    } else {
        return 1;
    }
}

function getSearchedItem(item, reverce=true) {

    let item_ru = item;
    let item_en = item.translation;

    if (reverce) {
        item_ru = item.language == 1 ? item : item.translation;
        item_en = item.language == 2 ? item : item.translation;
    }

    item_ru.id = item_ru.id ? item_ru.id : '';
    item_en.id = item_en.id ? item_en.id : '';

    return `
        <div class="searched_item"> 
            <div class="wrapper_category" category_id=${item.category.id}>
                <div class="category_active">${item.category.name}</div>
                <div class="category_list"></div>
            </div>
            <div class="wrapper_status" state="hidden">
                <div class="status save"></div>   
                <div class="status loading">
                    ${getSpinner()}
                </div>
                <div class="status success">&#10003;</div>
                <div class="status error"></div>
            </div>

            <div class="lang first_lang" language="1" interest_id="${item_ru.id}" contentEditable="true">${item_ru.name}</div> 
            <div class="lang second_lang" language="2" interest_id="${item_en.id}" contentEditable="true">${item_en.name}</div> 
        </div>
    `;
}

function getSpinner() {
    return `
    <div class="sk-fading-circle">
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    </div>
    `;
}


function getState() {
    return js.attr(js.get('.main'), 'state');
} 

function setState(state) {
    js.attr(js.get('.main'), 'state', state);
} 