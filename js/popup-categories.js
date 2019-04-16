class PopupCategories {
    constructor() {

    }

    setHandlers() {

    }

    show(category, id) {
        this.hide();

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

    hide() {
        const category_list_active = document.querySelector('.category_list.active');
        if (!category_list_active) return;
        category_list_active.innerHTML = '';
        js.removeClass(category_list_active, 'active');
    }
}