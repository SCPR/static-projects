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
    configureSelectMenuFromData: function(optionMessage, arrayToCreateSelect, idTargetForSelect){
        var selectList;
        selectList += "<option>" + optionMessage + "</option>";
        for (var i=0; i<arrayToCreateSelect.length;i++) {
            selectList += "<option value='" + arrayToCreateSelect[i] + "'>" +
                arrayToCreateSelect[i] + "</option>";
        }
        jqueryNoConflict(idTargetForSelect).append(selectList);
    },

    comparisonDataObject: {},

    processDataFromFile: function(data){

        // separate the procedure keys from the values and place into array
        var procedureKeys = Object.keys(dataConfig.separateProcedureKeysFromValues(data));

        // create the procedure select menu
        dataConfig.configureSelectMenuFromData('Choose a procedure', procedureKeys, '#procedure-comparison');
        console.log(dataConfig.comparisonDataObject);

        jqueryNoConflict('#procedure-comparison').change(function () {
            dataConfig.comparisonDataObject.procedure = jqueryNoConflict('#procedure-comparison :selected').val();
            jqueryNoConflict('#hospital-left').html('Choose a hospital to compare');
            jqueryNoConflict('#hospital-right').html('Choose a hospital to compare');
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

        // array to hold our target hospitals
        var testHoldingArray = [];

        // retrieve dataConfig.comparisonDataObject which has the procedure
        var procedureToQuery = dataConfig.comparisonDataObject.procedure

        // check to see which hospitals have the procedure
        for (var i=0; i<data.objects.length; i++){

            if (data.objects[i].drgdefinition === procedureToQuery){

                // for each of the hospital that has the procedure create a new object
                var testTargetHospitalObject = {
                    providername: data.objects[i].providername,
                    drgdefinition: data.objects[i].drgdefinition,
                    totaldischarges: data.objects[i].totaldischarges,
                    averagecoveredcharges: data.objects[i].averagecoveredcharges,
                    averagetotalpayments: data.objects[i].averagetotalpayments
                };

                // push to our holding array
                testHoldingArray.push(testTargetHospitalObject);

            } else {

                console.log('no match');
            }

        }
        // end loop

        console.log(testHoldingArray);

        var hospitalsObjectToBuildSelect = {
            objects: testHoldingArray
        };

        jqueryNoConflict('#hospital-div-left').removeClass('hidden');
        jqueryNoConflict('#hospital-div-right').removeClass('hidden');

        // separate the procedure keys from the values and place into array
        var hospitalKeys = Object.keys(dataConfig.separateHospitalKeysFromValues(hospitalsObjectToBuildSelect));

        // empty the hospitals select menu
        jqueryNoConflict('#hospital-comparison-right').empty();
        jqueryNoConflict('#hospital-comparison-left').empty();

        // create the new select menu based on options
        dataConfig.configureSelectMenuFromData('Choose a hospital', hospitalKeys, '#hospital-comparison-right');
        dataConfig.configureSelectMenuFromData('Choose a hospital', hospitalKeys, '#hospital-comparison-left');

        // check each hospital in the array of objects to grab
        //those that match the left and right hospital values
        for (var x=0; x<testHoldingArray.length; x++){
            if (dataConfig.comparisonDataObject.hospitalLeft === undefined || dataConfig.comparisonDataObject.hospitalLeft === null){
                jqueryNoConflict('#hospital-left').html('Choose a hospital to compare');
            };

            if (dataConfig.comparisonDataObject.hospitalRight === undefined || dataConfig.comparisonDataObject.hospitalRight === null){
                jqueryNoConflict('#hospital-right').html('Choose a hospital to compare');
            };

            // display the data
            if (dataConfig.comparisonDataObject.hospitalLeft === testHoldingArray[x].providername){
                jqueryNoConflict('#hospital-left').html(
                '<h4>' + testHoldingArray[x].providername + '</h4>' +
                '<p>Procedure: ' + testHoldingArray[x].drgdefinition + '</p>' +
                '<p>Discharges: ' + testHoldingArray[x].totaldischarges + '</p>' +
                '<p>Covered Charges: ' + testHoldingArray[x].averagecoveredcharges + '</p>' +
                '<p>Average Total Payments:' + testHoldingArray[x].averagetotalpayments + '</p>');
            }

            if (dataConfig.comparisonDataObject.hospitalRight === testHoldingArray[x].providername){
                jqueryNoConflict('#hospital-right').html(
                '<h4>' + testHoldingArray[x].providername + '</h4>' +
                '<p>Procedure: ' + testHoldingArray[x].drgdefinition + '</p>' +
                '<p>Discharges: ' + testHoldingArray[x].totaldischarges + '</p>' +
                '<p>Covered Charges: ' + testHoldingArray[x].averagecoveredcharges + '</p>' +
                '<p>Average Total Payments:' + testHoldingArray[x].averagetotalpayments + '</p>');
            }


        }

    }
};
// end data configuration object