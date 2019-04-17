const keydown = {};

document.addEventListener('keyup', function(event) {
    let el = event.target;
    // cntrl+enter
    if (keydown[17] && keydown[13]) {
        const interest_id = js.attr(el, 'interest_id');
        if (interest_id === 'NEW') handlerInterest(el, 'add-new-interest');
        else handlerInterest(el, 'edit');

        console.log(el)
        return delete keydown[event.keyCode];
    } 
    // cntrl+backspace
    if (keydown[17] && keydown[8] && !keydown[16]) {
        handlerInterest(el, 'remove');
        return delete keydown[event.keyCode];
    }
    // cntrl+shift+backspace
    if (keydown[17] && keydown[16] && keydown[8]) {
        handlerInterest(el, 'removeBoth');
        return delete keydown[event.keyCode];
    } 
    // cntrl+t
    if (keydown[17] && keydown[84]) {
        handlerInterest(el, 'open-image');
        return delete keydown[event.keyCode];
    } 
    // cntrl+b
    if (keydown[17] && keydown[66]) {
        handlerInterest(el, 'open-google');
        return delete keydown[event.keyCode];
    } 

    switch(event.keyCode) {
        case 9:
            handlerInterest(el, 'focus');
            break;
    }

    delete keydown[event.keyCode];
});

window.addEventListener('keydown', function(event) {
    keydown[event.keyCode] = 1;
});