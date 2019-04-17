
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
            if (target.innerText === '') return target.focus();
            if (target.childNodes[0] && js.hasClass(target, 'lang')) {
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
            changeCategory(target, param);
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

    async function addNewInterest(searched_item, settings, target) {
        const category_id = js.attr(searched_item.querySelector('[category_id]'), 'category_id');
        const ru_lang = searched_item.querySelector('.ru_lang');
        const en_lang = searched_item.querySelector('.en_lang');

        const interest_ru = {
            name : ru_lang.innerText,
            language : js.attr(ru_lang, 'language'),
            set_category : category_id
        }
        const interest_en = {
            name : en_lang.innerText,
            language : js.attr(en_lang, 'language'),
            set_category : category_id
        }

        // edit with set_translation
        if (settings && settings.set_translations) {
            return send(target, settings, true);
        }
        // add one or both
        if (validInterest(interest_ru.name)) {
            const result = await send(ru_lang, interest_ru);

            if (validInterest(interest_en.name)) {
                interest_en.set_translations = [result.id];
                return send(en_lang, interest_en, true);
            }

            return set(target, 'success');
        }

        if (validInterest(interest_en.name)) {
            return send(en_lang, interest_en, true);
        }

        function send(lang, interest, sucess=false) {
            return new Promise ( (resolve, reject) => {
                const _settings = {
                    url : `http://51.75.37.65/api/interests_edit/`
                }
                req.post(_settings, interest, (error, result) => {
                    if (error >= 400 || !result) {
                        set(target, 'error');
                        return reject(error);
                    }  
                    js.attr(lang, 'interest_id', result.id);
                    js.attr(searched_item.querySelector('[interest_id="NEW"]'), 'interest_id', '');
                    
                    resolve(result);
                    if (sucess) set(target, 'success');
                });
            }); 
        }

    }

    function remove(target) {
        const interests_id = js.attr(target, 'interest_id');

        return new Promise ( (resolve, reject) => {
            const settings = {
                url : `http://51.75.37.65/api/interests_edit/${interests_id}/`
            }
            req.delete(settings,(error, result) => {
                handlerRespond(reject, resolve, error, result);
                handlerSuccess();
            });
        });


        function handlerSuccess() {
            const searched_item = target.closest('.searched_item');
            const opposite_item = searched_item.querySelector(`.lang:not([interest_id="${interests_id}"])`);

            target.innerText = '';
            if (opposite_item.innerText === '') {
                let lang_next = getLangNext(searched_item);
                if (lang_next) handlerInterest(lang_next, 'focus');
                searched_item.outerHTML = '';
            }    
        }
    }

    async function removeBoth(target) {
        const searched_item = target.closest('.searched_item');
        if (!searched_item) return set(target, 'error');

        let lang_next = getLangNext(searched_item);
        let interests = getInterests(searched_item);

        if (interests[0].id) {
            let result = await send(interests[0].id);
            if (interests[1].id) return send(interests[1].id, true);
            return handlerSuccess();
        }

        if (interests[1].id) {
            return send(interests[1].id, true);
        }

        function send(id, success=false) {
            new Promise ( (resolve, reject) => {
                const settings = {
                    url : `http://51.75.37.65/api/interests_edit/${id}/`
                }
                req.delete(settings, (error, result) => {
                    handlerRespond(reject, resolve, error, result);

                    if (success) handlerSuccess();
                });
            });
        }

        function handlerSuccess() {
            if (lang_next) handlerInterest(lang_next, 'focus');
            if (searched_item) searched_item.outerHTML = '';
        }
    }

    function getLangNext(searched_item) {
        const next_sibling = searched_item.nextElementSibling;
        if (next_sibling) return searched_item.nextElementSibling.querySelector('.lang');
    }

    function edit(target) {
        const interest_id = js.attr(target, 'interest_id');
        const interest_name = target.innerText;
        if (!validInterest(interest_name)) return set(target, 'error');

        if (interest_id === "") {
            const searched_item = target.closest('.searched_item');
            const opposite_item = searched_item.querySelector(`.lang:not([interest_id=""])`);
            const interest_id = js.attr(opposite_item, 'interest_id');
            const wrapper_category = searched_item.querySelector(`.wrapper_category`);
            const category_id = js.attr(wrapper_category, 'category_id');

            const settings = {
                set_translations : [interest_id],
                name : target.innerText,
                language : js.attr(target, 'language'),
                set_category: category_id
            }

            addNewInterest(searched_item, settings, target);
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

    function changeCategory(searched_item, param) {
        const wrapper_category = searched_item.querySelector(`.wrapper_category`);
        const category_active = searched_item.querySelector('.category_active');
        js.attr(wrapper_category, 'category_id', param.category_id);
        category_active.innerText = param.category_name;

        if (js.attr(js.get('.main'), 'state' != 'not_found')) saveCategory(param);
        handlerInterest(searched_item.querySelector('.ru_lang'), 'focus');    

    }

    function saveCategory(param) {
        for (let interest of param.interests) {
            if (!interest.id) continue;
            new Promise ( (resolve, reject) => {
                const settings = {
                    url : `http://51.75.37.65/api/interests_edit/${interest.id}/`
                }
                req.patch(settings, {"set_category" : param.category_id},(error, result) => {
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