﻿// page load+
// look for cookies
// // if cookies then set default variables from there 
// // else set default variables to preset values

// brkpt: A
// load temperature from API using defaults values and set lat long defaults
// load UV data from API using defaults

// timer 20s, callback A

var default_city = "New York";
var default_lat = 40.71;
var default_long = -74.01;
var default_unit = "metric";
var current_city;
var current_lat = 40.71;
var current_long = -74.01;
var current_unit = "metric";
var temperatureJson = [
    {country:"",realFeel:"",min:"",max:"",wind:"",windDirection:"",windUnits:"",humidity:"",description:"",main:"",units:"",sunrise:"",sunset:""}
];
function loadClymate() {
    // look for cookies
    getOrSetCityCookie();
    getOrSetUnitsCookie();

    // load settings
    getCitiesList();
    initializeHumidityGauge();
    initializeUnitsToggle()
    $(".current-location").text("" + current_city);

    // load temperature
    getTemperature();

    // load uv
    //getUV();
}

/*cookies start*/
function getOrSetCityCookie() {
    if(checkCookie("clymate-city")){
        default_city = getCookie("clymate-city");
    }
    else {
        setCookie("clymate-city", default_city, 30);
    }
    current_city = default_city;
}
function getOrSetUnitsCookie() {
    if (checkCookie("clymate-units")) {
        default_unit = getCookie("clymate-units");
    }
    else {
        setCookie("clymate-units", default_unit, 30);
    }
    current_unit = default_unit;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie(input) {
    var info = getCookie(input);
    if (info != "") {
        return true;
    }
    else {
        return false;
    }
}
function are_cookies_enabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
}
/*cookies end*/

/*init start*/
function initializeUnitsToggle() {
    if(current_unit=="metric"){
        $('#unitsToggleLabel').text("Celsius");
        $('#unitsToggle').attr('checked', true);
    }
    else {
        $('#unitsToggleLabel').text("Farenheit");
        $('#unitsToggle').attr('checked', false);
    }
}
function initializeHumidityGauge() {
    GaugeChart = c3.generate({
        bindto: '#humidityGauge',
        data: {
            columns: [
                ['Humidity', Math.floor(Math.random() * 99) + 1]
            ],
            keys: {
                value: ['Humidity']
            },
            type: 'gauge',
            onclick: function (d, i) { /*console.log("onclick", d, i);*/ },
            onmouseover: function (d, i) { /*console.log("onmouseover", d, i);*/ },
            onmouseout: function (d, i) {/* console.log("onmouseout", d, i); */ }
        },
        gauge: {
            label: {
                format: function (value, ratio) {
                    return value + "%";
                },
                show: false // to turn off the min/max labels.
            },
            min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
            max: 100, // 100 is default
            units: ' %',
            width: 90 // for adjusting arc thickness
        },
        color: {//green 60B044 yello F6C600 orang F97600
            pattern: ['#60B044', '#F6C600', '#F97600', '#AD0F0F'], // the three color levels for the percentage values.
            threshold: {
                //            unit: 'value', // percentage is default
                //            max: 200, // 100 is default
                values: [40, 60, 90, 100]
            }
        },
        size: {
            height: 180
        }
    });
}
/*init end*/

/*temperature start*/
function getTemperature() {
    weatherModule.getWeather(storeTemperature);
}
function storeTemperature(data) {
    temperatureJson[0].realFeel = data["main"].temp;
    temperatureJson[0].min = data["main"].temp_min;
    temperatureJson[0].max = data["main"].temp_max;
    temperatureJson[0].wind = data["wind"].speed;
    temperatureJson[0].units = "&deg;F";
    temperatureJson[0].humidity = data["main"].humidity;
    temperatureJson[0].windDirection = data["wind"].deg;
    temperatureJson[0].windUnits = "mph";
    temperatureJson[0].country = data["sys"].country;
    temperatureJson[0].main = data.weather[0].main;
    temperatureJson[0].sunrise = data["sys"].sunrise;
    temperatureJson[0].sunset = data["sys"].sunset;
    temperatureJson[0].description = (data.weather[0].description).toString().charAt(0).toUpperCase().concat(data.weather[0].description.toString().substr(1, data.weather[0].description.toString().length - 1));
    /*store latitude and longitude*/
    current_lat = data["coord"].lat; current_long = data["coord"].lon;
    setTemperature();
}
function setTemperature() {
    if (current_unit == "metric"&&temperatureJson[0].units=="&deg;F") {
        temperatureJson[0].realFeel = toCelsius(temperatureJson[0].realFeel);
        temperatureJson[0].min = toCelsius(temperatureJson[0].min);
        temperatureJson[0].max = toCelsius(temperatureJson[0].max);
        temperatureJson[0].wind = toKph(temperatureJson[0].wind);
        temperatureJson[0].units = "&deg;C";
        temperatureJson[0].windUnits = "Km/hr";
    }
    else if (current_unit == "imperial" && temperatureJson[0].units == "&deg;C") {
        temperatureJson[0].realFeel = toFarenheit(temperatureJson[0].realFeel);
        temperatureJson[0].min = toFarenheit(temperatureJson[0].min);
        temperatureJson[0].max = toFarenheit(temperatureJson[0].max);
        temperatureJson[0].wind = toMph(temperatureJson[0].wind);
        temperatureJson[0].units = "&deg;F";
        temperatureJson[0].windUnits = "mph";
    }
    else {

    }
    /*main temperature timeline*/
    var temperatureMainText = "<div class='city-name'>" + current_city+ "</div>";
    temperatureMainText += "<div class='city-country'>" + temperatureJson[0].country + "</div><div class='temperature-value'>" + temperatureJson[0].realFeel + "<span class='temperature-unit'>" + temperatureJson[0].units + "</span></div>";
    temperatureMainText += "<div class='weather-description'>" + temperatureJson[0].description + "</div>";
    document.getElementById('temperatureMain').innerHTML = "" + temperatureMainText;
    document.getElementById("temperatureMain").style.background = "url('../images/" + temperatureJson[0].main.toString().toLowerCase() + "Timeline.jpe')  no-repeat scroll center center";
    /*custom graphic*/
    document.getElementById('customGraphics').innerHTML = "<img src='images/" + temperatureJson[0].main.toString().toLowerCase() + ".png' class='img-responsive' height='180' width='180'/>";
    /*wind*/
    var windText = "<div><h2>Wind</h2></div><div class='temperature-unit'>" + temperatureJson[0].wind + " " + temperatureJson[0].windUnits + "</div>";
    document.getElementById('wind').innerHTML = "" + windText;
    $(".wind-direction>img").css("transform", "rotate(" + temperatureJson[0].windDirection + "deg)");
    /*min max*/
    var minmaxText = "<h2>Min </h2><div class='temperature-unit'>" + temperatureJson[0].min + " " + temperatureJson[0].units + "</div><h2>Max </h2><div class='temperature-unit'>" + temperatureJson[0].max + " " + temperatureJson[0].units + "</div>";
    document.getElementById('minMax').innerHTML = "" + minmaxText;
    /*humidity*/
    loadHumidityGauge(temperatureJson[0].humidity);
    /**/
    console.log(temperatureJson[0].sunrise + " " + temperatureJson[0].sunset);
    var sunriseText = "<h2>Sunrise</h2><div>" + temperatureJson[0].sunrise + "</div>";
    document.getElementById('sunrise').innerHTML = "" + sunriseText;
    var sunsetText = "<h2>Sunset</h2><div>" + temperatureJson[0].sunset + "</div>";
    document.getElementById('sunset').innerHTML = "" + sunsetText;
    /**/
    $(".current-location").text("" + current_city + ", " + temperatureJson[0].country);
}
function loadHumidityGauge(input) {
    GaugeChart.load({
        columns: [['Humidity', input]]
    },1500);
}

/*conversion functions*/
function toCelsius(faren) {
    return ((faren - 32) * (5 / 9)).toFixed(2);
}
function toFarenheit(cel) {
    return ((cel*1.800)+32);
}
function toMph(kph) {
    return (kph/1.609344).toFixed(2);
}
function toKph(mph) {
    return (mph*1.609344).toFixed(2);
}
/*conversion functions end*/


/* APIs */
var weatherModule = (function () {
    return {
        getWeather: function (callback) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://api.openweathermap.org/data/2.5/weather?q=" + current_city + "&units=imperial&appid=2de143494c0b295cca9337e1e96b00e0",
                success: function (data) {
                    if (data["cod"] == 200)
                        callback(data);
                    else
                        errorText();
                }
            });
        }
    };
}());
/* APIs*/