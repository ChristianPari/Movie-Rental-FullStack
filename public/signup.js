// set event listeners
// fetch req to post the new users

window.onload = () => {

    document.getElementById("submitSignup").onclick = subSignup;

}

function subSignup() {

    const form = this.parentNode.childNodes[0].childNodes[0];
    const userEmail = form[0];
    const userPassword = form[1];
    const userPassword2 = form[2];

    let errors = [];

    //todo convert the "if statements" into a switch
    if (!userEmail.validity.valid) {
        errors.push("Email: Please enter a valid email address.");
    }

    if (userPassword.value.indexOf(" ") !== -1) {
        errors.push("Password: Passwords cannot contain spaces.")
    }

    if (!userPassword.validity.valid) {
        errors.push(`Password: ${userPassword.validationMessage}`)
    }

    if (userPassword2.value !== userPassword.value) {
        errors.push("Passwords: Passwords do not macth.")
    }

    if (errors.length !== 0) {
        return alert(`${errors.join("\n")}`)
    }

    const reqBody = {
        email: userEmail.value,
        password: userPassword.value
    };
    const endpoint = `${window.location.origin}/user`;
    const reqObj = {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "content-type": "application/json",
            "Accept": "application/json"
        }
    };

    fetch(endpoint, reqObj)
        .then(rs => rs.json())
        .then(res => console.log(res))

    //todo create some sort of redirection, have them sent back to the homepage and have them be logged in

}