
// const _store = {
//     pickedUser : '',
//     tokens : []
// }

// const store = new Proxy(_store, {
//     get(target, prop) {
//         return target[prop];
//     },
//     set(target, prop, value) {

//         let prev = target[prop];
//         target[prop] = value;

//         if (prop == "tokens") {
//             setSelectOptions(value);
//         }

//         if (prop == "pickedUser" && prev) {
//             loadAndRenderDataUsers();
//         }

//         return true;
//     }
// });


let timeout = null;
let lastReq = null;

js.get('#search').addEventListener('input', function(event) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        search(event.target.value);
        lastReq = event.target.value;
        timeout = null;
    }, 200); 
});


async function search(text) {
    setState('loading');
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
            <div class="first_lang">${item.name}</div> 
            <div class="second_lang">${item.translation.name}</div> 
        </div>
    `;
}

function setState(state) {
    js.attr(js.get('.main'), 'state', state);
} 


// async function getSearchData() {
//     try {  
//         setState('loading_0');

//         if (!store.pickedUser) {
//             store.tokens = await getAllTokens(); 
//             store.pickedUser = store.tokens[0];
//         }

//         setState('loading_1');

//         let userInfo = await getUserInfo();

//         setState('loading_2');

//         let usersForUser = await getUsersForUser();

//         setState('ok');

//         renderUserInfo(userInfo);
//         renderUsersForUser(usersForUser);

//     } catch (error) {
//         return console.log(error);
//     }
// }

//loadAndRenderDataUsers();


// js.get('#tokens').addEventListener('change', function(event) {
//     store.pickedUser = event.target.value;
// });

// function setSelectOptions(tokens) {
//     let arrayTokenHtml = [];
//     for (let token of tokens) {
//         let tokenHtml = `<option name="${token}">${token}</option>`;
//         arrayTokenHtml.push(tokenHtml);
//     }
//     js.get('#tokens').innerHTML = arrayTokenHtml.join('');
// }



// function getAllTokens() {
//     return new Promise ( (resolve, reject) => {
//         req.get('http://51.75.37.65/api/debug_tokens/', (error, result) => {
//             if (error >= 400 || !result) return reject(error);
//             let tokens = [];
//             for (let obj of result.results ) {
//                 tokens.push(obj.token)
//             }
//             resolve(tokens);
//         });
//     }); 
// }

// function getUsersForUser(token=store.pickedUser) {
//     return new Promise ( (resolve, reject) => {
//         let settings = {
//             url : `http://51.75.37.65/api/deck/`,
//             token : token
//         }

//         req.get(settings, (error, result) => {
//             if (error >= 400 || !result) return reject(error); //showError();
//             resolve(result.data);
//         });
//     }); 
// }

// function renderUsersForUser(usersForUser) {
//     let arrayHtmlUser = [];
//     for (let userForUser of usersForUser) {
//         arrayHtmlUser.push(getPage(userForUser));
//     }
//     js.get('#usersForUser').innerHTML = arrayHtmlUser.join('');
// }

// function getUserInfo(token=store.pickedUser) {
//     return new Promise ( (resolve, reject) => {
//         let settings = {
//             url : `http://51.75.37.65/api/get_user_info/`,
//             token : token
//         }

//         req.get(settings, (error, result) => {
//             if (error >= 400 || !result) return reject(error); //showError();
//             resolve(result.details);
//         });
//     }); 
// }

// function renderUserInfo(userInfo) {
//     js.get('#userPage').innerHTML = getPage(userInfo.user);
// }

// function getPage(userInfo) {
//     return `
//         <div class="user_page">
//             <div class="user_page_left">
//                 ${getAvatar(userInfo)}
//                 ${getPeopleOnPhoto(userInfo)}
//             </div>
//             <div class="user_page_right">

//                 <div class="user_item user_page_first_name" >${userInfo.first_name}, ${userInfo.age}</div>
//                 <div class="user_item user_page_" >${userInfo.sex}</div>

//                 ${getDistance(userInfo)}

//                 <div class="user_item user_page_occupation" >${userInfo.occupation}</div>

//                 ${getLastTimeOnline(userInfo.last_time_online)}

//                 <div class="user_item user_page_interests" >
//                     ${getInterests(userInfo.interests)}
//                 </div>
//             </div>    
//         </div>    
//     `;

//     function getAvatar(userInfo) {
//         //if (userInfo.distance === undefined) return '';
//         //
//         return `
//             <img class="user_page_image" src="${userInfo.avatar && userInfo.avatar.url}">
//         `;
//     }

//     function getPeopleOnPhoto(userInfo) {
//         if (!userInfo.avatar) return '';
//         return `
//             <div class="user_page_people_on_photo"> People <span>${userInfo.avatar.people_on_photo}</span></div>
//         `;
//     }

//     function getDistance(userInfo) {
//         if (userInfo.distance === undefined) return '';

//         return `
//             <div class="user_item"> ${userInfo.distance} </div>
//         `;
//     }

//     function getLastTimeOnline(last_time_online) {
//         if (!last_time_online) return '';
//         let date = new Date(last_time_online);
//         let options = {
//             year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
//         };
    
//         let result = date.toLocaleDateString('en', options); 

//         return `
//             <div class="user_item user_page_last_time_online" >${result}</div>
//         `;
//     }

//     function getInterests(interests) {
//         let html = '';
//         for (let interest of interests) {
//             html += `
//                 <div class="user_item user_page_interest">${interest.name}</div>
//             `;
//         }
//         return html;
//     }
    
// }

