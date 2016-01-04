// page load+
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
var default_unit = "imperial";

function loadClymate() {
    // load settings
    getCitiesList();
    initializeHumidityGauge();
    // look for cookies
    checkCookie("clymate-city", "clymate-latitude", "clymate-longitude");
    // load temper
    getTemperature(default_city,default_unit);
}

function getTemperature(input,unit) {
    weatherModule.getWeather(setTemperature);
}
function setTemperature(data) {
    var temperatureMainText = "<div class='city-name'>"+data["name"]+"</div>";
    temperatureMainText += "<div class='city-country'>" + data["sys"].country + "</div><div class='temperature-value'>" + toCelsius(data["main"].temp) + "<span class='temperature-unit'>&deg;C</span></div>";
    temperatureMainText += "<div class='weather-description'>" + (data.weather[0].description).toString().charAt(0).toUpperCase().concat(data.weather[0].description.toString().substr(1, data.weather[0].description.toString().length - 1)) + "</div>";
    document.getElementById('temperatureMain').innerHTML = "" + temperatureMainText;
    document.getElementById("temperatureMain").style.background = "url('../images/" + data.weather[0].main.toString().toLowerCase() + "Timeline.jpe')  no-repeat scroll center center";
    var minmaxText = "<div>Minimum: <h2>" + data["main"].temp_min + "</h2></div><div>Maximum: <h2>" + data["main"].temp_max + "</h2></div>";
    document.getElementById('minMax').innerHTML = "" + minmaxText;
    var humidityText = "<div>Humidity</div>";
    //<div><h2>" + data["main"].humidity + "%</h2></div>";
    //document.getElementById('humidity').innerHTML = "" + humidityText;
    loadHumidityGauge(data["main"].humidity);

    var windText = "<div>Wind</div><div>" + data["wind"].speed + " mph</div>";
    document.getElementById('wind').innerHTML = "" + windText;
    document.getElementById('wind').innerHTML = "" + windText;
    document.getElementById('customGraphics').innerHTML = "<img src='images/" + data.weather[0].main.toString().toLowerCase() + ".png' class='img-responsive' height='150' width='150'/>";
}
function loadHumidityGauge(input) {
    GaugeChart.load({
        columns: [['Humidity', input]]
    },1500);
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
            width: 49 // for adjusting arc thickness
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
                //            unit: 'value', // percentage is default
                //            max: 200, // 100 is default
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 180
        }
    });
}
var customGraphicsJson = [
    { "name": "Thunderstorm", "image": "thunderstorm" },
    { "name": "Drizzle", "image": "" },
    { "name": "Rain", "image": "" },
    { "name": "Snow", "image": "" },
    { "name": "Atmosphere", "image": "" },
    { "name": "Clear", "image": "" },
    { "name": "Clouds", "image": "" },
    { "name": "Extreme", "image": "" },
    { "name": "Additional", "image": "" }
];
function toCelsius(faren) {
    return ((faren - 32) * (5 / 9)).toFixed(2);
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

function checkCookie(input,latitude,longitude) {
    var info = getCookie(input);
    if (info != "") {
        default_city = info;
        default_lat = Number(getCookie(latitude));
        default_long = Number(getCookie(longitude));
    }
    else {
        setCookie(input, default_city, 30);
        setCookie(latitude, default_lat, 30);
        setCookie(longitude, default_long, 30);
    }
}

/* API */
var weatherModule = (function () {
    return {
        getWeather: function (callback) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://api.openweathermap.org/data/2.5/weather?q=" + default_city + "&units="+default_unit+"&appid=2de143494c0b295cca9337e1e96b00e0",
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