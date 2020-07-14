function createDiv(divObj) { //* id, class

    let div = document.createElement(`div`);

    div.id = divObj.id != undefined && document.getElementById(divObj.id) == null ? divObj.id : ``;

    div.className = divObj.class != undefined ? divObj.class : ``;

    return div

};

function createHeading(headingObj) { //* size, text, id, class

    let heading = headingObj.size >= 1 && headingObj.size <= 5 ? document.createElement(`h` + headingObj.size) : document.createElement(`h5`);

    heading.innerText = typeof headingObj.text == `string` ? headingObj.text : ``;

    heading.id = headingObj.id != undefined && document.getElementById(headingObj.id) == null ? headingObj.id : ``;

    heading.className = headingObj.class != undefined ? headingObj.class : ``;

    return heading

};

function createParagraph(paraObj) { //* text, class, id

    let paragraph = document.createElement(`p`);

    paragraph.innerText = paraObj.text != undefined ? paraObj.text : ``;

    paragraph.className = paraObj.class != undefined ? paraObj.class : ``;

    paragraph.id = paraObj.id != undefined && document.getElementById(paraObj.id) == null ? paraObj.id : ``;

    return paragraph

};

function createImage(imageObj) { //* src, alt, id, class

    let image = document.createElement(`img`);

    image.src = imageObj.src != undefined ? imageObj.src : `images/default.jpg`;

    image.alt = imageObj.alt != undefined ? imageObj.alt : `image couldn't load; broke`;

    image.id = imageObj.id != undefined && document.getElementById(imageObj.id) == null ? imageObj.id : ``;

    image.className = imageObj.class != undefined ? imageObj.class : ``;

    return image

};

function createButton(buttonObj) { //* id, class, text, onClickFunc

    let button = document.createElement(`button`);

    button.id = buttonObj.id != undefined && document.getElementById(buttonObj.id) == null ? buttonObj.id : ``;

    button.className = buttonObj.class != undefined ? buttonObj.class : ``;

    button.innerText = typeof buttonObj.text == `string` ? buttonObj.text : ``;

    button.onclick = buttonObj.onClickFunc != undefined && typeof buttonObj.onClickFunc == `function` ? buttonObj.onClickFunc : ``;

    return button

};

function createHREF(hrefObj) { //* id, newTab (true or false), ref, display (wether text, image, ect.), onClickFunc

    let href = document.createElement(`a`);

    href.id = hrefObj.id != undefined && document.getElementById(hrefObj.id) == null ? hrefObj.id : ``;

    href.target = hrefObj.newTab === true ? href.target = `_blank` : ``;

    href.href = hrefObj.ref != undefined ? hrefObj.ref : `>> No Referenece <<`;

    href.innerText = hrefObj.display != undefined ? hrefObj.display : `>> No Display <<`;

    href.onclick = hrefObj.onClickFunc != undefined && typeof hrefObj.onClickFunc == `function` ? hrefObj.onClickFunc : ``;

    return href
};

function createSelect(selectObj) { //* id, class, defOp, defOpID, data (used to create the options), onChangeFunc

    let select = document.createElement(`select`);

    select.id = selectObj.id != undefined && document.getElementById(selectObj.id) == null ? selectObj.id : ``;

    select.className = selectObj.class != undefined ? selectObj.class : ``;

    let defaultOp = document.createElement(`option`);

    defaultOp.innerText = selectObj.defOp != undefined ? selectObj.defOp : `Select an Option`;

    defaultOp.id = selectObj.defOpID != undefined && document.getElementById(selectObj.defOpID) == null ? selectObj.defOpID : ``;

    defaultOp.value = ``;

    select.appendChild(defaultOp);

    for (let a = 0; a < selectObj.data.length; a++) {

        let option = document.createElement(`option`);

        option.id = selectObj.data[a];

        option.innerText = selectObj.data[a];

        option.value = selectObj.data[a];

        select.appendChild(option);

    }

    select.onchange = selectObj.onChangeFunc != undefined ? selectObj.onChangeFunc : ``;

    return select

};

function createInput(inputObj) { //* id, type, name, class, sCheck, pHolder, onClickFunc, value, text, checked, min, max

    let input = document.createElement(`input`);

    input.id = inputObj.id != undefined && document.getElementById(inputObj.id) == null ? inputObj.id : ``;

    input.innerText = typeof inputObj.text == `string` ? inputObj.text : ``;

    input.type = inputObj.type != undefined ? inputObj.type : ``;

    input.name = inputObj.name != undefined ? inputObj.name : ``;

    input.value = inputObj.value != undefined ? inputObj.value : ``;

    input.spellcheck = inputObj.sCheck != undefined ? inputObj.sCheck : true;

    input.placeholder = inputObj.pHolder != undefined ? inputObj.pHolder : ``;

    input.className = inputObj.class != undefined ? inputObj.class : ``;

    input.min = inputObj.min != undefined ? inputObj.min : ``;

    input.max = inputObj.max != undefined ? inputObj.max : ``;

    input.onclick = inputObj.onClickFunc != undefined && typeof inputObj.onClickFunc == `function` ? inputObj.onClickFunc : ``;

    input.checked = inputObj.checked != undefined && typeof inputObj.checked == `boolean` ? inputObj.checked : ``;

    return input

};

function createLabel(labelObj) { //* text, for

    let label = document.createElement(`label`);

    label.for = labelObj.for != undefined ? labelObj.for : ``;

    label.innerText = labelObj.text != undefined ? labelObj.text : ``;

    return label

};

function createForm(formObj) { //* id

    let form = document.createElement(`form`);

    form.id = formObj.id != undefined ? formObj.id : ``;

    return form

};

// vscode-fold=1