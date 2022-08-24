window.addEventListener("load", () => {

    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationTimeZone = document.querySelector(".location-tz");
    let weatherIcon = document.querySelector(".icon>img");
    let errorDom = document.querySelector(".error-handle");

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(async (postion) => {

            const longitude = postion.coords.longitude;
            const latitude = postion.coords.latitude;
            let navigatorLanguage = navigator.language;

            navigatorLanguage = navigatorLanguage.slice(0, 2);

            const api = `https://api.weatherapi.com/v1/current.json?q=${latitude},${longitude}&lang=${navigatorLanguage}&key=eb202d35273247bb911183753221708`;

            try {
                const response = await fetch(api);
                const weatherData = await response.json();

                // destructure objects

                const { location: { name: cityName, tz_id } } = weatherData;
                const { current: { temp_c, condition: { text, icon } } } = weatherData;

                // set data to dom
                locationTimeZone.textContent = `${tz_id} (${cityName})`;
                temperatureDegree.innerHTML = `${temp_c}<span> C°</span>`;
                temperatureDescription.textContent = `${text}`;
                weatherIcon.src = icon;

            }

            catch (err) {

                console.log(err.message);
                errorHandling(err.message);
            }


        }, error => {

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorHandling("User denied the request for Geolocation.")
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorHandling("Location information is unavailable.")
                    break;
                case error.TIMEOUT:
                    errorHandling("The request to get user location timed out.")
                    break;
                case error.UNKNOWN_ERROR:
                    errorHandling("An unknown error occurred.")
                    break;
            }

        })
    }
    else{

        errorHandling("Browser doesn't support geoloacation");
    }

    // handling Errors

    function errorHandling(errMsg) {
        document.querySelectorAll("body > div:not(:first-child)").forEach(ele => ele.classList.add("hide"));
        errorDom.classList.remove("hide");
        errorDom.innerHTML = `<img src="./sad.png"/>${errMsg}`;
    }


})


