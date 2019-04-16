const keydown = {};

document.addEventListener('keyup', function(event) {
    let el = event.target;
    // cntrl+enter
    if (keydown[17] && keydown[13]) {
        if (js.attr(js.get('.main'), 'state') != 'not_found') handlerInterest(el, 'change');
        else handlerInterest(el, 'add-new-interest');
        // handlerInterest(el, 'change');
        return delete keydown[event.keyCode];
    }  
    // cntrl+shift+backspace
    if (keydown[17] && keydown[16] && keydown[8]) {
        handlerInterest(el, 'remove');
        return delete keydown[event.keyCode];
    } 

    switch(event.keyCode) {
        case 9:
            handlerInterest(el, 'focus');
            break;

        // case 17: 

        //     break;
    }

    delete keydown[event.keyCode];
});

window.addEventListener('keydown', function(event) {
    keydown[event.keyCode] = 1;
});