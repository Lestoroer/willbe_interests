

js.get('#search').addEventListener('input', function(event) {
    setState('change');
    if (store.timeout) clearTimeout(store.timeout);
    store.timeout = setTimeout(() => {
        search(event.target.value);
        store.timeout = null;
    }, 200); 
});

js.get('#checkbox_mode').addEventListener('input', function(event) {
    // if () {
    //     setMode('list_interests');
    // } else if () {
    //     setMode('search_interests');
    // }
    // if (store.timeout) clearTimeout(store.timeout);
    // store.timeout = setTimeout(() => {
    //     search(event.target.value);
    //     store.timeout = null;
    // }, 200); 
});

/** */
js.get('#searched_result').addEventListener('click', function(event) {
    handlerInterest(event.target, 'focus', {event:'click'});
   
    const category_list = event.target.closest('.category_list');
    const wrapper_category = event.target.closest('.wrapper_category');

    // Изменияем категорию
    if (category_list) {
        const searched_item = event.target.closest('.searched_item');

        const clickedCategory = event.target.closest('.category');
        // const interest_id_1 = js.attr(searched_item.querySelector('.first_lang'), 'interest_id');
        // const interest_id_2 = js.attr(searched_item.querySelector('.second_lang'), 'interest_id');
        const category_id = js.attr(clickedCategory, 'category_id');

        const param = {
            interests : getInterests(searched_item),
            category_id : category_id,
        }
  
        handlerInterest(searched_item, 'change-category', param);
        if (param.interests[0].id != 'NEW') handlerInterest(searched_item, 'save-category', param);
        handlerInterest(searched_item.querySelector('.first_lang'), 'focus');
    }
    // Показываем попап с листом категории
    if (wrapper_category) {
        hideListCategory();
        showListCategory(wrapper_category, js.attr(wrapper_category, 'category_id'));
    }
});

function getInterests(searched_item) {
    const interest_id_1 = js.attr(searched_item.querySelector('.first_lang'), 'interest_id');
    const interest_id_2 = js.attr(searched_item.querySelector('.second_lang'), 'interest_id');
    const name_1 = searched_item.querySelector('.first_lang').innerText;
    const name_2 = searched_item.querySelector('.second_lang').innerText;
    return [{id: interest_id_1, name: name_1}, {id: interest_id_2, name: name_2}];
}

function showListCategory(category, id) {
    const category_list = category.querySelector('.category_list');
    let categoryHTML = [];
    for (let category of store.categories) {
        if (!category.name || category.id == id) continue;
        categoryHTML.push(`
            <div class="category" category_id="${category.id}">${category.name}</div>
        `);
    }
    js.addClass(category_list, 'active');
    category_list.innerHTML = categoryHTML.join('');
}

function hideListCategory() {
    const category_list_active = document.querySelector('.category_list.active');
    if (!category_list_active) return;
    category_list_active.innerHTML = '';
    js.removeClass(category_list_active, 'active');
}

document.addEventListener('click', function(event) {
    handlerInterest(event.target, 'focus', {event:'click'});

    if (event.target.closest('.wrapper_category')) return;
    hideListCategory();
});


function log(text) {
    console.log(text)
}
