window.onload = () => {

    for (const div of document.getElementsByClassName('editMovie')) {

        div.style.display = 'none';

    }

    for (const input of document.getElementsByTagName('input')) {

        input.value = '';

    }

    setEventListeners();

};

function setEventListeners() {

    const getBtns = document.getElementsByClassName('getBtns'),
        deleteBtns = document.getElementsByClassName('deleteBtns'),
        confirmBtns = document.getElementsByClassName('confirmEdits'),
        editBtns = document.getElementsByClassName('editBtns'),
        actionBtns = document.getElementsByClassName("actionBtns"),
        reLoginBtns = document.getElementsByClassName("redirectLogin");

    const logoutButton = document.getElementById("LogoutBtn");
    const loginButton = document.getElementById("LoginBtn");
    const signupButton = document.getElementById("SignupBtn");
    const adminButton = document.getElementById("AdminBtn");

    if (loginButton) loginButton.onclick = loginUser;

    if (logoutButton) logoutButton.onclick = logoutUser;

    if (signupButton) signupButton.onclick = userSignup;

    if (adminButton) adminButton.onclick = redirectAdmin;

    for (const btn of getBtns) { btn.onclick = reqMovieData; }

    for (const btn of deleteBtns) { btn.onclick = deleteMovie; }

    for (const btn of confirmBtns) { btn.onclick = confirmEdit; }

    for (const btn of editBtns) { btn.onclick = editMovie; }

    for (const btn of actionBtns) { btn.onclick = rent_return; }

    for (const btn of reLoginBtns) { btn.onclick = loginUser; }

};

async function rent_return() {

    // req body { movieID, isRenting = true }
    // api req thats a patch, endpoint is /user/rent_return
    // parse msg from api res and alert to user

    const reqBody = {
        movieID: this.parentElement.id,
        isRenting: this.attributes.bool.value === "true" ? true : false
    };

    const endpoint = `${location.origin}/user/rent_return`;

    const reqObj = {

        headers: {

            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json',
            'content-type': 'application/json'

        },
        method: 'PATCH',
        body: JSON.stringify(reqBody)

    };

    await fetch(endpoint, reqObj)
        .then(rs => rs.json())
        .then(res => alert(res.msg || res.error))

    // below are new value assignments to properties to flip the use of the button according to what the user is renting or returning
    this.innerText = reqBody.isRenting ? "Return Movie" : "Rent Movie";
    this.attributes.bool.value = this.attributes.bool.value === "true" ? "false" : "true";

}

async function rentMovie() {

    // req body { movieID, isRenting = true }
    // api req thats a patch, endpoint is /user/rent_return
    // parse msg from api res and alert to user

    const reqBody = {
        movieID: this.parentElement.id,
        isRenting: true
    };

    const endpoint = `${location.origin}/user/rent_return`;

    const reqObj = {

        headers: {

            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json',
            'content-type': 'application/json'

        },
        method: 'PATCH',
        body: JSON.stringify(reqBody)

    };

    await fetch(endpoint, reqObj)
        .then(rs => rs.json())
        .then(res => alert(res.msg || res.error))

    window.location.reload();


};

async function returnMovie() {

    // req body { movieID, isRenting = true }
    // api req thats a patch, endpoint is /user/rent_return
    // parse msg from api res and alert to user

    const reqBody = {
        movieID: this.parentElement.id,
        isRenting: false
    };

    const endpoint = `${location.origin}/user/rent_return`;

    const reqObj = {

        headers: {

            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json',
            'content-type': 'application/json'

        },
        method: 'PATCH',
        body: JSON.stringify(reqBody)

    };

    await fetch(endpoint, reqObj)
        .then(rs => rs.json())
        .then(res => alert(res.msg || res.error))

    window.location.reload();


};

function reqMovieData() {

    const movieID = this.parentNode.id;

    fetch(`${window.location.origin}/movie/${movieID}`)
        .then(rs => {

            if (rs.status !== 200) {

                return console.log(`Something went wrong\nStatus Code: ${rs.status}\nrsponse: ${rs.statusText}`);

            }

            rs.json()
                .then(res => { console.log(res); })

        })
        .catch(err => {

            console.log('Something went wrong, error:\n', err);

        });

};

function deleteMovie() {

    const movieID = this.parentNode.parentNode.id;

    fetch(`${window.location.origin}/movie/${movieID}`, {
            method: 'DELETE'
        })
        .then(rs => {

            if (rs.status !== 200) {

                return console.log({ status: rs.status, message: rs.statusText });

            }

            return rs.json()

        })
        .then(res => {

            console.log(res);

            const movieID = res.deleted_movie._id;
            document.getElementById(movieID).remove();

        })
        .catch(err => {

            console.log('Something went wrong, error:\n', err);

        });

};

function editMovie() {

    let editDiv = this.parentNode.parentNode.childNodes[1],
        displayDiv = this.parentNode.parentNode.childNodes[0];

    editDiv.style.display = editDiv.style.display == 'none' ? 'flex' : 'none';
    displayDiv.style.display = displayDiv.style.display == 'none' ? 'flex' : 'none';

    this.innerText = this.innerText == "Edit Movie" ? "Cancel Edit" : "Edit Movie";

};

function confirmEdit() {

    const formElms = this.parentNode.childNodes[0],
        movieID = this.parentNode.parentNode.id,
        reqBody = {},
        errIn = [],
        imgRegExp = /.jpg/g,
        urlRegExp = /imdb/g;

    for (const input of formElms) {

        if (input.value != '') {

            switch (input.name) {

                case 'title':

                    reqBody[input.name] = input.value.trim().replace(/\s+/g, ' ');

                    break;

                case 'release':

                    if (input.validationMessage != '') {

                        console.log('release');
                        errIn.push(`${input.name}: ${input.validationMessage}`);

                    } else {

                        reqBody[input.name] = input.value;

                    }

                    break;

                case 'img':

                    if (!imgRegExp.test(input.value)) {

                        console.log('img');
                        errIn.push(`Img: field must contain '.jpg' to be valid`);

                    } else {

                        reqBody[input.name] = input.value.trim().replace(/\s+/g, ' ');

                    }

                    break;

                case 'imdb_link':

                    if (input.validationMessage != '' || !urlRegExp.test(input.value)) {

                        console.log('imdb_link');
                        errIn.push(input.validationMessage);

                    } else {

                        reqBody[input.name] = input.value.trim().replace(/\s+/g, ' ');

                    }

                    break;

                    // case 'available':

                    // if (input.validationMessage != '') {

                    //     console.log('available');
                    //     errIn.push(input.validationMessage);

                    // } else {

                    //     reqBody[input.name] = Number(input.value);

                    // }

                    // break;

                    // case 'rented':

                    // if (input.validationMessage != '') {

                    //     console.log('rented');
                    //     errIn.push(input.validationMessage);

                    // } else {

                    //     reqBody[input.name] = Number(input.value);

                    // }

                    // break;

            }

        }

    };

    if (errIn.length != 0) {

        const errStr = errIn.join(', ');

        return alert(`Following fields need fixing: ${errStr}`);

    }

    if (Object.keys(reqBody).length < 1) { return alert("Must have at least one field filled out"); };

    const endpoint = `${window.location.origin}/movie/${movieID}`,
        reqObj = {

            headers: {

                'Access-Control-Allow-Origin': '*',
                Accept: 'application/json',
                'content-type': 'application/json'

            },
            method: 'PATCH',
            body: JSON.stringify(reqBody)

        };

    fetch(endpoint, reqObj)
        .then(rs => { return rs.json(); })
        .then(res => { console.log(res); })
        .then(refreshMovie({ id: movieID, data: reqBody }))
        .catch(err => { console.log(err); })

};

function refreshMovie({ id, data }) {

    const mainElm = document.getElementById(id),
        childElms = mainElm.childNodes[0].childNodes,
        editDiv = mainElm.childNodes[1],
        displayDiv = mainElm.childNodes[0],
        editBtn = mainElm.childNodes[2].childNodes[1];

    for (const key in data) {

        switch (key) {

            case "title":

                childElms[1].innerText = data[key];

                break;

            case "release":

                childElms[2].innerText = data[key];

                break;

            case "img":

                childElms[3].src = data[key];

                break;

            case "imdb_link":

                childElms[4].innerText = data[key];

                break;

        }

    }

    editDiv.style.display = editDiv.style.display == 'none' ? 'flex' : 'none';
    displayDiv.style.display = displayDiv.style.display == 'none' ? 'flex' : 'none';
    editBtn.innerText = editBtn.innerText == "Edit Movie" ? "Cancel Edit" : "Edit Movie";

};

const loginUser = () => location = `${window.location.origin}/login`;

const logoutUser = () => {

    const token = document.cookie.indexOf("token");

    if (token !== null) {

        document.cookie = "token=; expires=`Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        alert("Logged Out");

        window.location.reload(true);

    } else {

        alert("You are not logged in");

    };
};

const userSignup = () => location = `${window.location.origin}/signup`;

const redirectAdmin = () => location = `${location.origin}/admin`;

// vscode-fold=1