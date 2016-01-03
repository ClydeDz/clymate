//https://gist.githubusercontent.com/Keeguon/2310008/raw/bdc2ce1c1e3f28f9cab5b4393c7549f38361be4e/cities.json
//https://raw.githubusercontent.com/mledoze/cities/master/cities.json
function getLocation() {
    alert($("#locationTextBox").val());
    return false;
}

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