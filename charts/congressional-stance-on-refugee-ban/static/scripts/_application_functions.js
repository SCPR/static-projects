window.percentChange = function(oldValue, newValue){
    var pctChange = ((newValue - oldValue) / oldValue * 100);
    return parseFloat(pctChange.toFixed(2));
};

window.slugify = function(string){
    string = string.toLowerCase();
    output = string.replace(/ /g, '-');
    return output
};

window.percentifyValue = function(value){
    var value = value * 100
    return parseFloat(value.toFixed(2));
};

window.toFixedPercent = function(part, whole){
    var targetValue = part / whole;
    var decimal = parseFloat(targetValue);
    if (isNaN(decimal) === true){
        output = null;
    } else {
        output = decimal;
    }
    return output
};

window.addCommas = function(nStr){
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
        var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, "$1" + "," + "$2");
            }
        return x1 + x2;
};

window.getCensusDataByTract = function(table, tract_id){
    var apiPrefix = "https://api.censusreporter.org/1.0/data/show/acs2014_5yr?table_ids=";
    var apiQuery = apiPrefix + table + "&geo_ids=" + tract_id;
    var output;
    $.ajax({
        url: apiQuery,
        async: true,
        dataType: "json",
        success: function(data){
            output = data.results;
        }
    });
    console.log(output);
};

window.getCensusApiDataByLoco = function(lat, lng){
    var apiPrefix = "http://api.censusreporter.org/1.0/geo/search?";
    var apiQuery = apiPrefix + "lat=" + lat + "&lon=" + lng;
    console.log(apiQuery);
    var output = [];
    $.ajax({
        url: apiQuery,
        async: false,
        dataType: "json",
        success: function(data){
            output = data.results;
        }
    });
    console.log(output);
    for (var i=0; i<output.length; i++){
        if (output[i].sumlevel == "150"){
            return "http://censusreporter.org/profiles/" + output[i].full_geoid;
        };
    };
};

window.ifEmptyStringForTotal = function(value){
    var result;
    if (value === ""){
        result = "Total not available";
    } else {
        result = window.addCommas(value);
    }
    return result;
};

window.createCurrency = function(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
        return "$" + x1 + x2 + ".00";
};

window.percentify = function(value){
    var value = value * 100
    return parseFloat(value.toFixed(2));
};

window.create_groups = function(object, key){
    var output = object.groupBy(function(model){
        return model.get(key);
    });
    return output;
};

window.string_equals_string = function(comparison, input){
    var result;
    if (input === comparison){
        result = true;
    } else {
        result = false;
    }
    return result;
};

window.parse_year = function(date_time){
    var output = moment(date_time).locale("en").format("YYYY");
    output = parseInt(output);
    return output
};

window.parse_month_of_year = function(date_time){
    var output = moment(date_time).locale("en").format("MMM");
    return output
};

window.parse_day_of_week = function(date_time){
    var output = moment(date_time).locale("en").format("dddd");
    return output
};

window.parse_time_of_day = function(date_time){
    var output;
    var moment_date = moment.utc(date_time).format("HH:mm:ss");
    var comparison_date = "2011-01-01 " + moment_date;
    if (Date.parse(comparison_date) >= Date.parse("2011-01-01 00:00:00") && Date.parse(comparison_date) <= Date.parse("2011-01-01 06:00:00")){
        output = "_midnight_to_6_am";
    } else if (Date.parse(comparison_date) >= Date.parse("2011-01-01 06:01:00") && Date.parse(comparison_date) <= Date.parse("2011-01-01 12:00:00")){
        output = "_6_am_to_noon";
    } else if (Date.parse(comparison_date) >= Date.parse("2011-01-01 12:01:00") && Date.parse(comparison_date) <= Date.parse("2011-01-01 18:00:00")){
        output = "_noon_to_6_pm";
    } else if (Date.parse(comparison_date) >= Date.parse("2011-01-01 18:01:00") && Date.parse(comparison_date) <= Date.parse("2011-01-01 23:59:59")){
        output = "_6_pm_to_midnight";
    } else {
        output = "outlier";
    };
    return output;
};

window.comma_values_to_array = function(comma_string){
    var array_of_strings = comma_string.split(",");
    return array_of_strings;
};

window.sum_values_in = function(array){
    return _.reduce(array, function(memo, num){
        return memo + num;
    }, 0);
};

window.create_models_from_comma_separated = function(array){
    var counts = {};
    _.each(array, function(value){
        counts[value] = counts[value] ? counts[value] + 1 : 1;
    });
    var array_of_models = [];
    _.each(counts, function(value, key, obj){
        var output = {
            name: key.replace(/^\s+|\s+$/gm, ""),
            quantity: value
        };
        array_of_models.push(output);
    });
    return array_of_models;
};

// string functions
String.prototype.splitOnCapitalLetter = function(){
    var newString = this.replace(/([a-z])([A-Z])/g, "$1 $2")
    return newString;
};

String.prototype.slugifyString = function(){
    var newString = this.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    return newString;
};

String.prototype.truncateToGraf = function(){
    var lengthLimit = 900;
    if (this.length > lengthLimit){
        return this.substring(0, lengthLimit) + " ... ";
    } else {
        return this;
    }
};

String.prototype.toProperCase = function(){
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

String.prototype.phraseToProperCase = function(){
    return this.replace("+", " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
