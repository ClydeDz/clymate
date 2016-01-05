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

function setCurrent() {
    $(".settings-error").text("");
    current_city = $("#locationTextBox").val();
    getTemperature(current_city, current_unit);
    if (default_city !== current_city) {
        $('#defaultToggle').prop('disabled', false);
        $('#toggle').attr('disabled', false);
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
$('#defaultToggle').live('change', function () {
    if ($(this).is(':checked')) {
        $(this).attr('disabled', true);
    } else {
        alert('un-checked');
    }
});
$('#unitsToggle').live('change', function () {
    if ($(this).is(':checked')) {
        $('#unitsToggleLabel').innerHTML("Celsius");
        setCookie("clymate-units", "Celsius", 30);
    } else {
        $('#unitsToggleLabel').innerHTML("Farenheit");
        setCookie("clymate-units", "Farenheit", 30);
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