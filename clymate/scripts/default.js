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
var default_unit = "metric";
var current_city;
var current_lat = 40.71;
var current_long = -74.01;
var current_unit = "metric";
var current_refresh = 4000;
var current_refresh_flag = false;
var temperatureJson = [
    {country:"",realFeel:"",min:"",max:"",wind:"",windDirection:"",windUnits:"",humidity:"",description:"",main:"",units:"",sunrise:"",sunset:"",code:""}
];
//var myVar = setInterval(getTemperatureAndUv, current_refresh);
var uvFacts = [
    { uvRadiation: "Low", spf: "Mild sunscreen is advised its a bright day though not required", shield: "No specific clothing is advised at low levels of UV index. However, its recommended to wear shades or hats for protection", shade: "Seek shade if its a bright day or if you have particularly fair skin", exposure: "Avoid being under the sun is it strong" },
    { uvRadiation: "Medium", spf: "Wearing a sunscreen is recommended", shield: "Wear clothes that cover your body and provide protection from the sun", shade: "Seek shade during noon hours when the sun is the strongest", exposure: "Avoid long exposures under the sun without any protection" },
    { uvRadiation: "High", spf: "Wearing 30+ SPF sunscreen is highly recommended", shield: "Wear clothes that provide protection against sun coupled with a headgear and shades", shade: "Avoid long exposure under sun and seek shade whenever possible", exposure: "Avoid exposures under the sun especially during noon time when the sun is the strongest" },
    { uvRadiation: "Very high", spf: "Wear 30+ SPF sunscreen and reapply after every two hours", shield: "Wear clothes that provide protection against sun coupled with a headgear and shades", shade: "Avoid long exposure under sun and seek shade whenever possible", exposure: "Avoid exposure under sun within three hours of solar noon" },
    { uvRadiation: "Extreme", spf: "Wear 30+ SPF sunscreen and reapply after every two hours", shield: "Wear clothes that cover you up entirely and a wide brimmed hat and shades. UV protective clothing is recommended", shade: "Seek shade whenever possible and avoid long exposure to sun", exposure: "Avoid being under the sun for more than ten minutes at a stretch and avoid outdoors within three hours of solar noon" }
];

function loadClymate() {
    // look for cookies
    getOrSetCityCookie();
    getOrSetUnitsCookie();

    // load settings
    getCitiesList();
    //initializeHumidityGauge();
    initializeUnitsToggle()
    $(".current-location").text("" + current_city);
    getTemperatureAndUv();
}

function getTemperatureAndUv() {
    // load temperature
    getTemperature();
    // load uv
    getUV();
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
    temperatureJson[0].country = initialCapitalize(data["sys"].country);
    temperatureJson[0].sunrise = data["sys"].sunrise;
    temperatureJson[0].sunset = data["sys"].sunset;
    temperatureJson[0].main = data.weather[0].main;
    temperatureJson[0].description = (data.weather[0].description).toString().charAt(0).toUpperCase().concat(data.weather[0].description.toString().substr(1, data.weather[0].description.toString().length - 1));
    /*store latitude and longitude*/
    current_lat = data["coord"].lat; current_long = data["coord"].lon;
    /*look out for the codes and show pictures accordingly*/
    if(data.weather[0].id==200||data.weather[0].id==201||data.weather[0].id==202||data.weather[0].id==210||data.weather[0].id==211||data.weather[0].id==212||data.weather[0].id==221||data.weather[0].id==230||data.weather[0].id==231||data.weather[0].id==232){
        temperatureJson[0].code = "thunderstorm";
    }
    else if (data.weather[0].id == 300 || data.weather[0].id == 301 || data.weather[0].id == 302 || data.weather[0].id == 310 || data.weather[0].id == 311 || data.weather[0].id == 312 || data.weather[0].id == 313 || data.weather[0].id == 314 || data.weather[0].id == 321) {
        temperatureJson[0].code = "drizzle";
    }
    else if (data.weather[0].id == 500 || data.weather[0].id == 501 || data.weather[0].id == 502 || data.weather[0].id == 503 || data.weather[0].id == 504 || data.weather[0].id == 511 || data.weather[0].id == 520 || data.weather[0].id == 521 || data.weather[0].id == 522 || data.weather[0].id == 531) {
        temperatureJson[0].code = "rain";
    }
    else if (data.weather[0].id == 600 || data.weather[0].id == 601 || data.weather[0].id == 602 || data.weather[0].id == 611 || data.weather[0].id == 612 || data.weather[0].id == 615 || data.weather[0].id == 616 || data.weather[0].id == 620 || data.weather[0].id == 621 || data.weather[0].id == 622) {
        temperatureJson[0].code = "snow";
    }
    else if (data.weather[0].id == 701 || data.weather[0].id == 711 || data.weather[0].id == 721 || data.weather[0].id == 731 || data.weather[0].id == 741 || data.weather[0].id == 751 || data.weather[0].id == 761 || data.weather[0].id == 762 || data.weather[0].id == 771 || data.weather[0].id == 781) {
        temperatureJson[0].code = "atmosphere";
    }
    else if (data.weather[0].id == 801 || data.weather[0].id == 802 || data.weather[0].id == 803 || data.weather[0].id == 804) {
        temperatureJson[0].code = "clouds";
    }
    else if (data.weather[0].id == 900 || data.weather[0].id == 901 || data.weather[0].id == 902 || data.weather[0].id == 903 || data.weather[0].id == 904 || data.weather[0].id == 905 || data.weather[0].id == 906) {
        temperatureJson[0].code = "extreme";
    }
    else if (data.weather[0].id == 951 || data.weather[0].id == 952 || data.weather[0].id == 953 || data.weather[0].id == 954 || data.weather[0].id == 955 || data.weather[0].id == 956 || data.weather[0].id == 957 || data.weather[0].id == 958 || data.weather[0].id == 959 || data.weather[0].id == 960 || data.weather[0].id == 961 || data.weather[0].id == 962) {
        temperatureJson[0].code = "additional";
    }
    else {
        temperatureJson[0].code = "clear";
    }
    temperatureJson[0].main = data.weather[0].main;
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
    document.getElementById("temperatureMain").style.background = "url('../images/" + temperatureJson[0].code.toString().toLowerCase() + "Timeline.jpe')  no-repeat scroll center center";
    /*custom graphic*/
    document.getElementById('customGraphics').innerHTML = "<img src='images/" + temperatureJson[0].code.toString() + ".png' title='" + temperatureJson[0].description + "' class='img-responsive' height='180' width='180'/>";
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
    var sunriseText = "<h2>Sunrise</h2><div>" + calculateTime(temperatureJson[0].sunrise) + "</div>";
    document.getElementById('sunrise').innerHTML = "" + sunriseText;
    var sunsetText = "<h2>Sunset</h2><div>" + calculateTime(temperatureJson[0].sunset) + "</div>";
    document.getElementById('sunset').innerHTML = "" + sunsetText;
    /**/
    $(".current-location").text("" + current_city + ", " + temperatureJson[0].country);
    console.log(temperatureJson[0].country);
}
function loadHumidityGauge(input) {
    //$(window).stopImmediatePropagation();
    GaugeChart.load({
            columns: [['Humidity', input]]
    }, 1500);

    //setTimeout(this.chart.flush, 300);
}

function getUV() {
    uvModule.getUVData(setUV);
}

function calculateTime(weirdTime) {
    var d = new Date(weirdTime * 1000);
    return d;
}
function setUV(data) {
    console.log(data);
    console.log(data.data.weather[0].uvIndex);
    console.log("uv country test "+temperatureJson[0].country);
    var uvText = "<div class='row'><div class='col-md-10 col-xs-12'><div class='city-name'>" + current_city + "</div>";
    uvText += "<div class='city-country'>" + temperatureJson[0].country + "</div>";
    uvText += "<div class='city-country'>UV intensity:  " + defineUvIndex(data.data.weather[0].uvIndex) + "</div></div>";
    uvText += "<div class='col-md-2 col-xs-12 text-center'><div class='temperature-value uv-index'>" + data.data.weather[0].uvIndex + "</div></div></div>";
    document.getElementById('uvMain').innerHTML = "" + uvText;
    var localUvData = translateUvData(defineUvIndex(data.data.weather[0].uvIndex));
    document.getElementById('spf').innerHTML = localUvData.spf;
    document.getElementById('shield').innerHTML = localUvData.shield;
    document.getElementById('shade').innerHTML = localUvData.shade;
    document.getElementById('exposure').innerHTML = localUvData.exposure;
    console.log("before refresh");
    // auto refresh
    if(current_refresh_flag==true)
        setTimeout(getTemperatureAndUv, current_refresh);
}
function translateUvData(input){
    for (var i = 0; i < uvFacts.length; i++) {
        if(uvFacts[i].uvRadiation==input){
            return uvFacts[i];
        }
    }
}
function defineUvIndex(input) {
    if (input >= 0 && input <= 2.9) {
        return "Low";
    }
    else if (input >= 3 && input <= 5.9) {
        return "Moderate";
    }
    else if (input >= 6 && input <= 7.9) {
        return "High";
    }
    else if (input >= 8 && input <= 10.9) {
        return "Very high";
    }
    else {
        return "Extreme";
    }
}
/*conversion functions*/
function toCelsius(faren) {
    return ((faren - 32) * (5 / 9)).toFixed(0);
}
function toFarenheit(cel) {
    return ((cel * 1.800) + 32).toFixed(0);
}
function toMph(kph) {
    return (kph/1.609344).toFixed(2);
}
function toKph(mph) {
    return (mph*1.609344).toFixed(2);
}
function initialCapitalize(input) {
    return (input).toString().charAt(0).toUpperCase().concat(input.toString().substr(1, input.toString().length - 1));
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
                       return false;
                }
            });
        }
    };
}());
var locationModule = (function () {
    return {
        checkLocation: function (input) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=2de143494c0b295cca9337e1e96b00e0",
                success: function (data) {
                    if (data["cod"] == 200)
                    { anotherTest(true,input);}
                    else
                    { anotherTest(false,input); }
                }
            });
        }
    };
}());
var uvModule = (function () {
    return {
        getUVData: function (callback) {
            $.ajax({
                type: "GET",
                dataType: "json",
                //http://api.worldweatheronline.com/free/v2/weather.ashx?q=thane&key=f41008acf13edf7e61c1d4a61f288&format=json
                url: "http://api.worldweatheronline.com/free/v2/weather.ashx?q="+current_lat+","+current_long+"&key=f41008acf13edf7e61c1d4a61f288&format=json",
                success: function (data) {
                    //if (data["cod"] == 200)
                        callback(data);
                    ///else
                       // errorText();
                }
            });
        }
    };
}());
/* APIs*/