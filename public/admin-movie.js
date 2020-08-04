const body = document.body;

window.onload = () => {

    document.getElementById('submitMovie').onclick = submitNewMovie;

    document.getElementById('updateMovie').onclick = updateMovie;

    for (const input of document.getElementsByTagName('input')) {

        input.value = '';

    }

};

function submitNewMovie() {

    const formArray = document.getElementById('newMovieForm').childNodes;
    let reqBody = {},
        errors = [];

    formArray.forEach(elm => {

        reqBody[elm.name] = elm.value.trim();

    });

    // checking available movie data validation
    const availableNum = parseInt(reqBody.available);

    if (isNaN(availableNum)) errors.push("Available: Must Be A Number");

    reqBody.inventory = {
        available: availableNum,
        rented: []
    };

    // stopping the process if there is an error
    if (errors.length !== 0)
        return alert(errors.join("\n"));

    const endpoint = `${window.location.origin}/movie`,
        reqObj = {

            headers: {

                'Access-Control-Allow-Origin': '*',
                Accept: 'application/json',
                'content-type': 'application/json'

            },

            method: 'POST',
            body: JSON.stringify(reqBody)

        };

    fetch(endpoint, reqObj)
        .then(rs => { return rs.json(); })
        .then(res => { console.log(res); })
        .catch(err => { console.log(err); })

};

function updateMovie() {

    const movieID = document.getElementById('_id').value,
        formArray = document.getElementById('updateForm').childNodes,
        reqBody = {};

    if (!movieID) {

        return alert('Must include the movie ID');

    } else {

        formArray.forEach(elm => {

            if (elm.name != 'movie_id' && elm.value.trim() != '') {

                reqBody[elm.name] = elm.value.trim();

            }

        });

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
            .catch(err => { console.log('Something went wrong, err:' + err); });

    }

};