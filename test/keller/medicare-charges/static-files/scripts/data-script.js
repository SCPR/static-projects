/*
mv - mechanical ventilator...
without mcc = without major complications
with cc - with complicaitons
*/


var jqueryNoConflict = jQuery;
var dataConfig = dataConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    dataConfig.retrieveDataFromFile();
});

// begin data configuration object
var dataConfig = {

    retrieveDataFromFile: function(){
        var dataSource = 'static-files/data/medicare_charges_test-handlebars.json';
        jqueryNoConflict.getJSON(dataSource, dataConfig.processDataFromFile);
    },

    // count instances of procedure values and set to keys
    separateProcedureKeysFromValues: function(dataSource){
        var instanceOfProcedureKeys = {};
        for (var i=0; i<dataSource.objects.length; i++){
            var keyCount = dataSource.objects[i];
            instanceOfProcedureKeys[keyCount.drgdefinition] = (instanceOfProcedureKeys[keyCount.drgdefinition] || 0) + 1;
        }
        return instanceOfProcedureKeys;
    },

    // count instances of hospital values and set to keys
    separateHospitalKeysFromValues: function(dataSource){
        var instanceOfHospitalKeys = {};
        for (var i=0; i<dataSource.objects.length; i++){
            var keyCount = dataSource.objects[i];
            instanceOfHospitalKeys[keyCount.providername] = (instanceOfHospitalKeys[keyCount.providername] || 0) + 1;
        }
        return instanceOfHospitalKeys;
    },

    // abstract function to create a select menu from an array
    configureSelectMenuFromData: function(arrayToCreateSelect, idTargetForSelect){
        var selectList;

        for (var i=0; i<arrayToCreateSelect.length;i++) {
            selectList += "<option value='" + arrayToCreateSelect[i] + "'>" +
                arrayToCreateSelect[i] + "</option>";
        }

        jqueryNoConflict(idTargetForSelect).append(selectList);
    },

    comparisonDataObject: {},

    processDataFromFile: function(data){

        // separate the keys from the values and place into array
        var procedureKeys = Object.keys(dataConfig.separateProcedureKeysFromValues(data));
        var hospitalKeys = Object.keys(dataConfig.separateHospitalKeysFromValues(data));

        // create select menus
        dataConfig.configureSelectMenuFromData(procedureKeys, '#procedure-comparison');
        dataConfig.configureSelectMenuFromData(hospitalKeys, '#hospital-comparison-left');
        dataConfig.configureSelectMenuFromData(hospitalKeys, '#hospital-comparison-right');

        console.log(dataConfig.comparisonDataObject);

        jqueryNoConflict('#procedure-comparison').change(function () {
            dataConfig.comparisonDataObject.procedure = jqueryNoConflict('#procedure-comparison :selected').val();
            jqueryNoConflict('#hospital-div-left').removeClass('hidden');
            jqueryNoConflict('#hospital-div-right').removeClass('hidden');
            dataConfig.compareSelectWithData(data);
        });

        jqueryNoConflict('#hospital-comparison-left').change(function () {
            dataConfig.comparisonDataObject.hospitalLeft = jqueryNoConflict('#hospital-comparison-left :selected').val();
            dataConfig.compareSelectWithData(data);
        });

        jqueryNoConflict('#hospital-comparison-right').change(function () {
            dataConfig.comparisonDataObject.hospitalRight = jqueryNoConflict('#hospital-comparison-right :selected').val();
            dataConfig.compareSelectWithData(data);
        });







    },

    compareSelectWithData: function(data){

        console.log(data);

        // retrieve dataConfig.comparisonDataObject which has the procedure and two hospital values
        console.log(dataConfig.comparisonDataObject);

        // for each of the hospital values create a new object

        // check each new hospital object to see if it has a value that matches the procedure

        // if it does, display the data

        // if it doesn't, display no data found for that procedure

/*
        console.log(data);
        console.log(dataConfig.comparisonDataObject);
        console.log(dataConfig.comparisonDataObject.procedure);
        console.log(dataConfig.comparisonDataObject.hospitalLeft);
        console.log(dataConfig.comparisonDataObject.hospitalRight);


        for (var i=0; i<data.objects.length; i++){

            // how to handle if the procedure is not present?
            // perhaps its setting the data to key on a hospital and the procdures they have

            if (dataConfig.comparisonDataObject.procedure === undefined ||
                dataConfig.comparisonDataObject.procedure === null){
                jqueryNoConflict('#hospital-left').html('Choose a procedure');
                jqueryNoConflict('#hospital-right').html('Choose a procedure');
            }

            if (dataConfig.comparisonDataObject.hospitalLeft === undefined || dataConfig.comparisonDataObject.hospitalLeft === null){
                jqueryNoConflict('#hospital-left').html('Choose a hospital to compare');
            }

            if (dataConfig.comparisonDataObject.hospitalRight === undefined || dataConfig.comparisonDataObject.hospitalRight === null){
                jqueryNoConflict('#hospital-right').html('Choose a hospital to compare');
            }

            if (dataConfig.comparisonDataObject.procedure === data.objects[i].drgdefinition && dataConfig.comparisonDataObject.hospitalLeft === data.objects[i].providername){
                    jqueryNoConflict('#hospital-left').html(
                    '<h4>' + data.objects[i].providername + '</h4>' +
                    '<p>Procedure: ' + data.objects[i].drgdefinition + '</p>' +
                    '<p>Discharges: ' + data.objects[i].totaldischarges + '</p>' +
                    '<p>Covered Charges: ' + data.objects[i].averagecoveredcharges + '</p>' +
                    '<p>Average Total Payments:' + data.objects[i].averagetotalpayments + '</p>');
            }

            if (dataConfig.comparisonDataObject.procedure === data.objects[i].drgdefinition && dataConfig.comparisonDataObject.hospitalRight === data.objects[i].providername){
                    jqueryNoConflict('#hospital-right').html(
                    '<h4>' + data.objects[i].providername + '</h4>' +
                    '<p>Procedure : ' + data.objects[i].drgdefinition + '</p>' +
                    '<p>Discharges : ' + data.objects[i].totaldischarges + '</p>' +
                    '<p>Covered Charges : ' + data.objects[i].averagecoveredcharges + '</p>' +
                    '<p>Average Total Payments :' + data.objects[i].averagetotalpayments + '</p>');
            }
        }
*/

    }
};
// end data configuration object