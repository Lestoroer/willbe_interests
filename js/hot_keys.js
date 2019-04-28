let keydown = {};

document.addEventListener('keyup', function(event) {
    let el = event.target;
    

    // cntrl+enter
    if (keydown[17] && keydown[13]) {
        const interest_id = js.attr(el, 'interest_id');
        if (interest_id === 'NEW') handlerInterest(el, 'add-new-interest');
        else handlerInterest(el, 'edit');
    } 
    // cntrl+backspace
    if (keydown[17] && keydown[8]) {
        handlerInterest(el, 'remove');
    }
    // cntrl+shift+backspace
    if (keydown[17] && keydown[16] && keydown[8]) {
        handlerInterest(el, 'removeBoth');
    } 
    // cntrl+shift+y
    if (keydown[17] && keydown[16] && keydown[69]) {
        handlerInterest(el, 'open-image');
    } 
    // cntrl+shift+g
    if (keydown[17] && keydown[16] && keydown[70]) {
        handlerInterest(el, 'open-google');
    }
    // cntrl+shift+a
    if (keydown[17] && keydown[16] && keydown[65]) {
        mode.checkoutToAddNewInterest();
    }
    // cntrl+shift+d
    if (keydown[17] && keydown[16] && keydown[68]) {
        // const is_selected = 
        // handlerInterest(el, 'edit', {is_selected : true});
    } 

    console.log(event.keyCode)

    keydown = {};

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