

/** */

js.listen(js.get('.container_interest'), 'click', (event) => {
    const category_list = event.target.closest('.category_list');

    // Клик на категорию в выпадающем списке
    if (category_list) {
        const searched_item = event.target.closest('.searched_item');
        const clickedCategory = event.target.closest('.category');
        const category_name = clickedCategory.innerText;
        const category_id = js.attr(clickedCategory, 'category_id');

        const param = {
            interests : getInterests(searched_item),
            category_id : category_id,
            category_name : category_name
        }
  
        handlerInterest(searched_item, 'change-category', param);
    }

    const wrapper_category = event.target.closest('.wrapper_category');
    // Клик на выбор категории
    if (wrapper_category) {
        popupCategories.show(wrapper_category, js.attr(wrapper_category, 'category_id')); 
    }
});

function getInterests(searched_item) {
    const interest_id_1 = js.attr(searched_item.querySelector('.ru_lang'), 'interest_id');
    const interest_id_2 = js.attr(searched_item.querySelector('.en_lang'), 'interest_id');
    const name_1 = searched_item.querySelector('.ru_lang').innerText;
    const name_2 = searched_item.querySelector('.en_lang').innerText;
    return [{id: interest_id_1, name: name_1}, {id: interest_id_2, name: name_2}];
}

function detectLanguage(text) {
    let text_without_numbers = text.replace(/[0-9]/g, '');
    if (/^[a-zA-Z]+$/.test(text_without_numbers)) {
        return 2;
    } else {
        return 1;
    }
}

function getState() {
    return js.attr(js.get('.main'), 'state');
} 

function setState(state) {
    js.attr(js.get('.main'), 'state', state);
} 

document.addEventListener('click', function(event) {
    handlerInterest(event.target, 'focus', {event:'click'});

    if (event.target.closest('.wrapper_category')) return;
    popupCategories.hide();
});


function log(text) {
    console.log(text)
}
