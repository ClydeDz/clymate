function toGetCountries() {
    countryModule.getCountryInfo(getCountries);
}
var countries = [];
function getCountries(data) {
    countries = [];
    for (var i = 0; i < data.length ; i++) {
        countries.push(data[i].name);
    }

    $("#locationTextBox").autocomplete({
        source: countries
    });
    console.log($(".ui-autocomplete").width() + "P" + $("#locationTextBox").width());
    
    console.log(countries);
    //https://gist.githubusercontent.com/Keeguon/2310008/raw/bdc2ce1c1e3f28f9cab5b4393c7549f38361be4e/countries.json
    //https://raw.githubusercontent.com/mledoze/countries/master/countries.json
}
function locationTextBoxListener(x) {
    //if (!('contains' in String.prototype)) String.prototype.contains = function (str, startIndex) {
    //    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    //};
    //var predictiveText = "<ul>";
    //for (var i = 0; i < countries.length; i++) {
    //    if (countries[i].contains(x.valu) == true) {
    //        var id = (predictiveWords.push(helpSet[i].command)) - 1;
    //        predictiveText += "<li id='Predictive_" + id + "' class='predictive-default' onmouseover=\"mouseoverLi('" + id + "')\" onmouseout=\"mouseoutLi('" + id + "')\" onclick=\"completePredictiveText('" + helpSet[i].command + "')\" title='" + helpSet[i].description + "&#013;Example: " + helpSet[i].command + " " + helpSet[i].args + "' >" + helpSet[i].command.toString().replace("" + text, "<span class='predictive-search-highlight'>" + text + "</span>") + "</li>";
    //    }
    //    else {
    //    }
    //}
    console.log(x.value);

}

/* API modules */
var countryModule = (function () {
    return {
        getCountryInfo: function (callback) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "https://restcountries.eu/rest/v1/all",
                success: function (data) {
                    callback(data);
                },
                error: function (data) {
                    errorText();
                }
            });
        }
    };
}());