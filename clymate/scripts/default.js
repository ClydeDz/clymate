// page load
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

function loadClymate() {
    // load settings
    getCitiesList()
    // look for cookies
    checkCookie("clymate-city", "clymate-latitude", "clymate-longitude");
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