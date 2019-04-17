class Interest {
    constructor() {
        
    }

    renderInterests(interests) {  
        let interestsHTML = [];
    
        for (let interest_item of interests) {
            interestsHTML.push(this.getTemplate(interest_item));
        }

        let renderInfo = '';

        if (interestsHTML.length == 0) {
            this.notFound();
            return;
        } else {
            renderInfo = interestsHTML.join('');
            setState('success');
        }

        mode.getResultContainer().innerHTML = renderInfo;
    }

    getTemplate(item) {
        let item_ru = item.language == 1 ? item : item.translations[0];
        let item_en = item.language == 2 ? item : item.translations[0];

        let item_empty = {
            id: '',
            name: ''
        }

        if (!item_ru || !item_ru.name) item_ru = item_empty;
        if (!item_en || !item_en.name) item_en = item_empty;
        console.log(item_ru);
        return `
            <div class="searched_item"> 
                <div class="wrapper_category" category_id=${item.category.id}>
                    <div class="category_active">${item.category.name}</div>
                    <div class="category_list"></div>
                </div>
                <div class="wrapper_status" state="hidden">
                    <div class="status save"></div>   
                    <div class="status loading">
                        ${this._getTemplateLoading()}
                    </div>
                    <div class="status success">&#10003;</div>
                    <div class="status error"></div>
                </div>
    
                <div class="lang ru_lang" language="1" interest_id="${item_ru.id}" contentEditable="true">${item_ru.name}</div> 
                <div class="lang en_lang" language="2" interest_id="${item_en.id}" contentEditable="true">${item_en.name}</div> 
            </div>
        `;
    }

    notFound() {
        setState('not_found');

        const search = js.get('#search');
        const lang = detectLanguage(search.value);

        const interest = {
            id: 'NEW',
            name: '',
            language: 1,
            category: { 
                id: '', 
                name: 'Выбрать категорию'
            },  
            translations: [{
                id: 'NEW',
                name: ''
            }]
        }

        if (lang == 1) interest.name = search.value;
        else if (lang == 2) interest.translations[0].name = search.value;

        js.get('#searched_result').innerHTML = this.getTemplate(interest);
    }

    _getTemplateLoading() {
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

    
}