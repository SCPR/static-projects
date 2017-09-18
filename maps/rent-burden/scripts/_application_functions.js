// helper functions
window.percentifyValue = function(value){
    var value = value * 100
    return parseFloat(value.toFixed(2));
};

window.toFixedPercent = function(part, whole){
    var targetValue = part / whole;
    var decimal = parseFloat(targetValue);
    return decimal
};

window.toFixed = function(value){
    var decimal = parseFloat(value);
    return decimal.toFixed(1);
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
        .replace(/\W/g, " ")
        .replace(/\s\s/g, "")
        .split(" ")
        .join("-");
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
