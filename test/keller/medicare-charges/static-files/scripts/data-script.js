var jqueryNoConflict = jQuery;
var dataConfig = dataConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {

    getValueFromHospitalSelect();

});




// create objects from json data
function getValueFromHospitalSelect(){
    var hospitalLeftValue;
    var procedureComparison;
    var hospitalRightValue;
    dataConfig.retrieveValueFromSelect('#hospital-comparison-left', hospitalLeftValue);
    dataConfig.retrieveValueFromSelect('#procedure-comparison', procedureComparison);
    dataConfig.retrieveValueFromSelect('#hospital-comparison-right', hospitalRightValue);
}
// end


// begin data configuration object
var dataConfig = {

    retrieveValueFromSelect: function(selectMenuId, value){
        jqueryNoConflict(selectMenuId).change(function () {
            value = jqueryNoConflict(selectMenuId + ' :selected').val();
            console.log(value);
        });
    },






}
// end data configuration object