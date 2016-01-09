//https://gist.githubusercontent.com/Keeguon/2310008/raw/bdc2ce1c1e3f28f9cab5b4393c7549f38361be4e/cities.json
//https://raw.githubusercontent.com/mledoze/cities/master/cities.json

function getLocation() {
    var flag = 0;
    for (var i = 0; i < cities.length; i++) {
        if (cities[i] == $("#locationTextBox").val()) {
            $(".current-location").text($("#locationTextBox").val());
            flag = 1;
        } 
    }
    (flag == 0) ? $(".settings-error").text("Enter a valid city") : setCurrent();
    return false;
}
function swalGetLocation() {
    swal({
        title: "Enter your location",
        text: "",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: true,
        animation: "slide-from-top",
        inputPlaceholder: "Enter your location"
    },
    function(inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError("You need to write something!");
            return false
        }
        // check if location is good and get and set data and show success
        locationModule.checkLocation(inputValue);
    });
}
function anotherTest(x,y) {
    if (x) {
        console.log("y");
        swal("Well done!", "We found "+y+" on this planet!", "success");
        current_city = initialCapitalize(y);
        setCurrent();
    }
    else {
        console.log("n");
        swal("Argh..", "We couldn't find "+y+" on this planet", "error");
    }
    rz = 0;
}

function setCurrent() {
    //$(".settings-error").text("");
    //current_city = $("#locationTextBox").val();
    getTemperature();
    getUV();
    if (default_city !== current_city) {
        $('#defaultToggle').prop('disabled', false);
        $('#defaultToggle').prop('checked', false);
        $('#unitsToggle').attr('disabled', false);
        $('#defaultToggleLabel').text("Off");
    }
}
//onclick="toggle(this)"
function toggle(button) {
    if ($("#" + button).text() == "NO") {
        $("#" + button).text("YES");
        console.log("a");
        $("#" + button).addClass("btn-primary");
        // create a new default location | store new location in cookie
        setCookie("clymate-city", current_city, 30);
        console.log(current_city + " " + getCookie(current_city));
        $('#defaultToggle').prop('disabled', true);
    }
    else {
        console.log($("#" + button).text());
        $("#" + button).text("NO");
        console.log("b");
        $("#"+button).removeClass("btn-primary");
        $('#defaultToggle').prop('disabled', true);
    }
}
/* */
$('#defaultToggle').on('change', function () {
    if ($(this).is(':checked')) {
        $(this).attr('disabled', true); 
        $('#defaultToggleLabel').text("On");
        setCookie("clymate-city", current_city, 30);
        console.log(current_city + " " + getCookie(current_city));
    } else {
        $('#defaultToggleLabel').text("Off");
    }
});
$('#unitsToggle').on('change', function () {
    if ($(this).is(':checked')) {
        $('#unitsToggleLabel').text("Celsius");
        setCookie("clymate-units", "metric", 30);
        current_unit = "metric";
        setTemperature();
    } else {
        $('#unitsToggleLabel').text("Farenheit");
        setCookie("clymate-units", "imperial", 30);
        current_unit = "imperial";
        setTemperature();
    }
});
/* */
var cities = [];
function getCitiesList() {
    $.getJSON("../scripts/world.json", function (data) {
        var items = []; cities = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].cities.length>0) {
                var cty = data[i].cities;
                for (var k = 0; k < cty.length; k++) {
                    (cty[k]!="")?cities.push(cty[k]):null;
                }
            }
        }
        $("#locationTextBox").autocomplete({
            source: cities
        });
    });
}
function changeTimer(id, input) {
    $('.location-btn').removeClass('active-button');
    $(id).addClass('active-button');
    if (input == 0) {
        current_refresh_flag = false;
        current_refresh = input;
    }
    else if(input==900000){
        current_refresh_flag = true;
        current_refresh = input;
    }
    else if (input == 1800000) {
        current_refresh_flag = true;
        current_refresh = input;
    }
    console.log(input + " " + current_refresh);
}
//url: "https://restcities.eu/rest/v1/all",
/* API modules */
var countryModule = (function () {
    return {
        getCountryInfo: function (callback) {
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                url: "https://raw.githubusercontent.com/ClydeDz/json-database/master/cities-cities.json",
                success: function (data) {
                    callback(data);
                },
                error: function (data) {
                    //serrorText();
                    console.log("f"+data);
                }
            });
        }
    };
}());