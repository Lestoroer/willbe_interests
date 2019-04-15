const store = {
    timeout : null,
    lastReq : null,
    categories : []
}

getCategories();

function getCategories() {
    return new Promise ( (resolve, reject) => {
        const settings = {
            url : `http://51.75.37.65/api/categories_debug/`
        }
        req.get(settings,(error, result) => {
            if (error >= 400 || !result) return reject(error);    
            resolve(result);
            store.categories = result;
        });
    }); 

}