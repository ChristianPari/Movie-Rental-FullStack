window.onload = () => {

    document.getElementById("submitLogin").onclick = () => {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const reqBody = {
            email: email,
            password: password
        };

        const endpoint = `${window.location.origin}/user`;
        const reqObj = {
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(reqBody)
        };

        fetch(endpoint, reqObj)
            .then(rs => {
                console.log(rs);
                return rs.json();
            })
            .then(res => {

                const token = res.token;

                if (token === undefined) {

                    alert("Login Failed");

                } else {

                    localStorage.setItem("login_token", token);

                    location = location.origin;

                }

            })
            .catch(err => {
                console.log({ error: err });
            });

    };

};