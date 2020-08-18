window.onload = () => {

    document.getElementById("submitSignup").onclick = subSignup;

    document.getElementById("password").onkeyup = comparePass;

    document.getElementById("confirmPass").onkeyup = comparePass;
}

function comparePass() {

    const parent = this.parentNode;
    const thisPassVal = this.value;
    const otherPassVal = this === parent[1] ? parent[2].value : parent[1].value;
    const pTag = document.getElementById("passMsg");

    if (
        (thisPassVal !== "" && otherPassVal !== "") &&
        (thisPassVal.length >= 7 && otherPassVal.length >= 7)
    ) {

        if (thisPassVal !== otherPassVal) {

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
    const userPassword = document.getElementById("password");
    const userPassword2 = document.getElementById("confirmPass");

    // will store own errors, rough draft
    let errors = [];

    // user sanitization
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

    // variables for fetch
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