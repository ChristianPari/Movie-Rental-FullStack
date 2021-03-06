window.onload = () => {

    document.getElementById("submitSignup").onclick = subSignup;

    document.getElementById("password").onkeyup = comparePass;

    document.getElementById("confirmPass").onkeyup = comparePass;

    const form = document.getElementById("signup");
    for (let a = 0; a < form.length; a++) {
        form[a].value = "";
    }
}

function comparePass() {

    const pass1value = document.getElementById("password").value;
    const pass2value = document.getElementById("confirmPass").value;
    const pTag = document.getElementById("passMsg");

    if (
        (pass1value !== "" && pass2value !== "") &&
        (pass1value.length >= 7 && pass2value.length >= 7)
    ) {

        if (pass1value !== pass2value) {

            pTag.innerText = "Passwords Don't Match";
            pTag.style = ("display: initial", "color: red");

        } else {

            pTag.innerText = "Passwords Match";
            pTag.style = ("display: initial", "color: green");

        }

    } else {

        pTag.innerText = "";
        pTag.style = ("display: none");

    }

}

function subSignup() {

    // needed variables
    const userEmail = document.getElementById("email");
    const userName = document.getElementById("username");
    const userPassword = document.getElementById("password");
    const userPassword2 = document.getElementById("confirmPass");

    // will store own errors, rough draft
    let errors = {
        email: "",
        username: "",
        password: []
    };

    // user sanitization
    if (!userEmail.validity.valid) {
        errors.email = "Please enter a valid email address.";
    }

    if (!userName.validity.valid) {
        errors.username = `${userName.validationMessage}`;
    }

    if (userPassword.value.indexOf(" ") !== -1) {
        errors.password.push("Passwords cannot contain spaces.");
    }

    if (!userPassword.validity.valid) {
        errors.password.push(`${userPassword.validationMessage}`);
    }

    if (userPassword2.value !== userPassword.value) {
        errors.password.push("Passwords do not match.");
    }

    if (errors.email !== "" || errors.password !== [] || errors.username !== []) {

        const emailErr = errors.email !== "" ? `Email Errors:\n${errors.email}\n\n` : "";

        const passErr = errors.password !== undefined ? `Password Errors:\n${errors.password.join("\n")}\n` : "";

        const userNameErr = errors.username !== "" ? `Username Errors:\n${errors.username}` : "";

        const alertText = `${emailErr}${userNameErr}${passErr}`;

        return alert(alertText)

    }

    // variables for fetch
    const reqBody = {
        email: userEmail.value,
        password: userPassword.value,
        username: userName.value
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

    // this fetch is to create a new user
    fetch(endpoint, reqObj)
        .then(rs => rs.json())
        .then(res => {

            // checks if the response from the POST request was succesful
            if (res.status !== 201) {

                // unsuccessful requests alerts user with error messages

                const errors = res.validation_error;
                const errorMsgs = [];

                errors.forEach(err => {
                    const { field, msg } = err;

                    errorMsgs.push(`${field}: ${msg}`);
                });

                const alertText = errorMsgs.join("\n");

                return alert(alertText);

            } else {
                // successful requests continue to the next request

                // variables fro second fetch
                const endpoint = `${window.location.origin}/user`;
                const nextReqBody = reqBody;
                const reqObj = {
                    method: "PUT",
                    body: JSON.stringify(nextReqBody),
                    headers: {
                        "content-type": "application/json",
                        "Accept": "application/json",
                        "Access-Allow-Origin": "*"
                    }
                };

                // this fetch is to login the user
                fetch(endpoint, reqObj)
                    .then(rs => rs.json())
                    .then(res => {

                        const token = res.token;

                        if (token === undefined) {

                            alert("Login Failed");

                        } else {

                            document.cookie = `token=${token}`;

                            // brings the user to the homepage of the site
                            location = location.origin;

                        }

                    })
                    .catch(err => {
                        console.log({ error: err });
                    });

            }
        })
}