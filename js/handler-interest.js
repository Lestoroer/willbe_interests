
function handlerInterest(target, status, param) {
    console.log(status)
    // удаляем пред.
    setDefaultStatus();
    set(target, status);   

    switch(status) {
        case 'focus':
            let lang = target.closest('.lang');
            if (lang && param && param.event == 'click') return;

            let range = document.createRange();
            let sel = window.getSelection();

            if (target.childNodes[0] && js.hasClass(target, 'lang')) {
                //console.log(js.hasClass(target, 'lang'))
                range.setStart(target.childNodes[0], target.innerText.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            } 
            return;
        case 'add-new-interest':
            let searched_item = target.closest(`.searched_item`);
            if (searched_item) addNewInterest(target.closest(`.searched_item`));
            return;
        case 'edit':
            edit(target);
            return;
        case 'change-category':
            changeCategory(target);
            return; 
        case 'save-category':
            saveCategory(param);
            return;       
        case 'success':
            return;
        case 'remove':
            remove(target);
            return;
        case 'removeBoth':
            removeBoth(target);
            return;    
        case 'open-image':
            openImage(target);
            return; 
            case 'open-google':
            openGoogle(target);
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

    async function addNewInterest(searched_item, settings) {
        //const new_interest = document.querySelector('[interest_id="NEW"]');
        const category_id = js.attr(searched_item.querySelector('[category_id]'), 'category_id');
        const name_first = searched_item.querySelector('.ru_lang').innerText;
        const name_second = searched_item.querySelector('.en_lang').innerText;

        let name = name_first ? name_first : name_second;
        let language = name_first ? 1 : 2;

        const param = {
            name : name,
            language : language,
            category : { id : category_id },
        }

        if (settings && settings.set_translations) {
            param.name = settings.name;
            param.set_translations = [settings.id];
            param.language = settings.language;
        }    
 
        if (!validInterest(name)) return set(target, 'error');

        const result = await send(param);

        if (settings && settings.set_translations) return set(target, 'success');

        param.name = name_first ? name_second : name_first;

        if (!validInterest(param.name)) return set(target, 'success');

        param.name = name_first ? name_second : name_first;
        param.language = name_first ? 2 : 1;
        param.set_translations = [result.id];

        send(param);
        set(target, 'success');;

        function send(param) {
            return new Promise ( (resolve, reject) => {
                const settings = {
                    url : `http://51.75.37.65/api/interests_edit/`
                }
                req.post(settings, param, (error, result) => {
                    if (error >= 400 || !result) {
                        set(target, 'error');
                        return reject(error);
                    }    
                    resolve(result);
                });
            }); 
        }

    }

    function remove(target) {
        console.log(target)
        // const searched_item = target.closest('.searched_item');
        // if (!searched_item) return set(target, 'error');
        // const next_sibling = searched_item.nextElementSibling;

        // let lang_next;
        // if (next_sibling) lang_next = searched_item.nextElementSibling.querySelector('.lang');

        // let interests = getInterests(searched_item);
        
        // for (let i = 0; i < interests.length; i++) {
        //     if (!interests[i].id || interests[i].id === 'undefined') continue;

        //     new Promise ( (resolve, reject) => {
        //         const settings = {
        //             url : `http://51.75.37.65/api/interests_edit/${interests[i].id}/`
        //         }
        //         req.delete(settings,(error, result) => {
        //             handlerRespond(reject, resolve, error, result);

        //             if (lang_next) handlerInterest(lang_next, 'focus');
        //             if (searched_item) searched_item.outerHTML = '';

        //         });
        //     }); 
        // }
    }

    function removeBoth(target) {
        return console.log('removeBoth')
        const searched_item = target.closest('.searched_item');
        if (!searched_item) return set(target, 'error');
        const next_sibling = searched_item.nextElementSibling;

        let lang_next;
        if (next_sibling) lang_next = searched_item.nextElementSibling.querySelector('.lang');

        let interests = getInterests(searched_item);
        
        for (let i = 0; i < interests.length; i++) {
            if (!interests[i].id || interests[i].id === 'undefined') continue;

            new Promise ( (resolve, reject) => {
                const settings = {
                    url : `http://51.75.37.65/api/interests_edit/${interests[i].id}/`
                }
                req.delete(settings,(error, result) => {
                    handlerRespond(reject, resolve, error, result);

                    if (lang_next) handlerInterest(lang_next, 'focus');
                    if (searched_item) searched_item.outerHTML = '';

                });
            }); 
        }
    }

    function edit(target) {
        const interest_id = js.attr(target, 'interest_id');
        const interest_name = target.innerText;
        if (!validInterest(interest_name)) return set(target, 'error');

        if (interest_id === "") {
            const searched_item = target.closest('.searched_item');
            const opposite_item = searched_item.querySelector(`.lang:not([interest_id=""])`);
            const settings = {
                set_translations : true,
                id : js.attr(opposite_item, 'interest_id'),
                name : target.innerText,
                language : js.attr(target, 'language')
            }
            addNewInterest(searched_item, settings);
            return;
        }

        return new Promise ( (resolve, reject) => {
            const settings = {
                url : `http://51.75.37.65/api/interests_edit/${interest_id}/`
            }
            req.patch(settings, {"name" : interest_name}, (error, result) => {
                handlerRespond(reject, resolve, error, result);
            });
        });
    }

    function changeCategory(target) {
        const wrapper_category = target.querySelector(`.wrapper_category`);
        const clickedCategory = target.querySelector(`[category_id="${param.category_id}"]`);
        const category_name = clickedCategory.innerText;
        const category_active = target.querySelector('.category_active');
        // Устанавливаем новый category_id
        js.attr(wrapper_category, 'category_id', param.category_id);
        // Перезаписываем название активной категории
        category_active.innerText = category_name;
    }

    function saveCategory(param) {
        for (let interest of param.interests) {
            if (!interest.id || interest.id === 'undefined') continue;
            new Promise ( (resolve, reject) => {
                const settings = {
                    url : `http://51.75.37.65/api/interests_edit/${interest.id}/`
                }
                req.patch(settings, {"category" : param.category_id},(error, result) => {
                    handlerRespond(reject, resolve, error, result);
                });
            }); 
        }
    }

    function openImage(target) {
        window.open(`https://yandex.ru/images/search?text=${target.innerText}`);
    }

    function openGoogle(target) {
        window.open(`https://www.google.com/search?q=${target.innerText}`);
    }

    function handlerRespond(reject, resolve, error, result) {
        if (error >= 400 /*|| !result*/) {
            set(target, 'error');
            return reject(error);
        }    
        resolve(result);
        set(target, 'success');
    }

    function setDefaultStatus() {
        const container_interest = document.querySelectorAll('.container_interest');
        let prev_wrapper_interest; 

        for (let container of container_interest) {
            let temp = container.querySelector(`.wrapper_status:not([state="hidden"]`);
            if (temp) prev_wrapper_interest = temp;
        }
        // ставим дефолтный статус hidden
        if (prev_wrapper_interest) js.attr(prev_wrapper_interest, 'state', 'hidden');
    }

    function validInterest(name) {
        if (!name) return false;
        return true;
    }
}