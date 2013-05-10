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
        var dataSource = 'static-files/data/medicare_charges_full-handlebars.json';
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


    addCommas: function(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';

        var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
        return x1 + x2;
    },

    calculateAverageCost: function(arrayOfTotals){
        var total = 0;
        for (var z=0; z<arrayOfTotals.length; z++){
            total = total + arrayOfTotals[z];
        }

        total = total/arrayOfTotals.length;
        return '$' + dataConfig.addCommas(total.toFixed(0));
    },

    calcaulateHighestAverageCost: function(array){
        var total = Math.max.apply(Math, array);
        return dataConfig.addCommas(total.toFixed(0));
    },

    calcaulateLowestAverageCost: function(array){
        var total = Math.min.apply(Math, array);
        return dataConfig.addCommas(total.toFixed(0));
    },





    // take string of dollar amount and convert to int
    convertCurrencyToInt: function(currency){
        var value = currency.replace('$', '').replace(',', '');
        value = parseInt(value);
        return value;
    },





    arrayProcedureCosts: [],



    compareSelectWithData: function(data){

        console.log(data);

        // array to hold our target hospitals
        var arrayFilteredHospitalObjects = [];

        // retrieve dataConfig.comparisonDataObject which has the procedure
        var procedureToQuery = dataConfig.comparisonDataObject.procedure

        // check to see which hospitals have the procedure
        for (var i=0; i<data.objects.length; i++){

            if (data.objects[i].drgdefinition === procedureToQuery){

                // for each of the hospital that has the procedure create a new object
                var filteredHospitalObject = {
                    providername: data.objects[i].providername,
                    providercity: data.objects[i].providercity,
                    providerstate: data.objects[i].providerstate,
                    drgdefinition: data.objects[i].drgdefinition,
                    totaldischarges: data.objects[i].totaldischarges,
                    averagecoveredcharges: data.objects[i].averagecoveredcharges,
                    averagetotalpayments: data.objects[i].averagetotalpayments
                };

                // push filteredHospitalObject to arrayFilteredHospitalObjects
                arrayFilteredHospitalObjects.push(filteredHospitalObject);

                // push filteredHospitalObject to arrayFilteredHospitalObjects
                var testCosts = dataConfig.convertCurrencyToInt(data.objects[i].averagecoveredcharges);
                dataConfig.arrayProcedureCosts.push(testCosts);

                // calculate average costs for display
                var costAverageToDisplay = dataConfig.calculateAverageCost(dataConfig.arrayProcedureCosts);
                var lowestAverageCostToDisplay = dataConfig.calcaulateLowestAverageCost(dataConfig.arrayProcedureCosts);
                var highestAverageCostToDisplay = dataConfig.calcaulateHighestAverageCost(dataConfig.arrayProcedureCosts);

                jqueryNoConflict('#procedure').html(
                    '<p>The average cost for this procedure at a California hospital is <strong>' + costAverageToDisplay + '</strong>.</p>' +
                    '<p>The lowest average cost for this procedure at a California hospital is <strong>$' + lowestAverageCostToDisplay + '</strong>.</p>' +
                    '<p>The highest average cost for this procedure at a California hospital is <strong>$' + highestAverageCostToDisplay + '</strong>.</p>');

            } else {

                console.log('no match');
            }
        }
        // end loop

        // set our filtered array to an object
        var hospitalsObjectToBuildSelect = {
            objects: arrayFilteredHospitalObjects
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
        for (var x=0; x<arrayFilteredHospitalObjects.length; x++){
            if (dataConfig.comparisonDataObject.hospitalLeft === undefined || dataConfig.comparisonDataObject.hospitalLeft === null){
                jqueryNoConflict('#hospital-left').html('Choose a hospital for comparison');
            };

            if (dataConfig.comparisonDataObject.hospitalRight === undefined || dataConfig.comparisonDataObject.hospitalRight === null){
                jqueryNoConflict('#hospital-right').html('Choose a hospital for comparison');
            };

            // display the data
            if (dataConfig.comparisonDataObject.hospitalLeft === arrayFilteredHospitalObjects[x].providername){
                jqueryNoConflict('#hospital-left').html(
                '<h4>' + arrayFilteredHospitalObjects[x].providername + '</h4>' +
                '<p>' + arrayFilteredHospitalObjects[x].providercity + ', ' + arrayFilteredHospitalObjects[x].providerstate + '</p>' +
                '<p>Procedure: ' + arrayFilteredHospitalObjects[x].drgdefinition + '</p>' +
                '<p>Discharges: ' + arrayFilteredHospitalObjects[x].totaldischarges + '</p>' +
                '<p>Covered Charges: ' + arrayFilteredHospitalObjects[x].averagecoveredcharges + '</p>' +
                '<p>Average Total Payments:' + arrayFilteredHospitalObjects[x].averagetotalpayments + '</p>');
            }

            if (dataConfig.comparisonDataObject.hospitalRight === arrayFilteredHospitalObjects[x].providername){
                jqueryNoConflict('#hospital-right').html(
                '<h4>' + arrayFilteredHospitalObjects[x].providername + '</h4>' +
                '<p>' + arrayFilteredHospitalObjects[x].providercity + ', ' + arrayFilteredHospitalObjects[x].providerstate + '</p>' +
                '<p>Procedure: ' + arrayFilteredHospitalObjects[x].drgdefinition + '</p>' +
                '<p>Discharges: ' + arrayFilteredHospitalObjects[x].totaldischarges + '</p>' +
                '<p>Covered Charges: ' + arrayFilteredHospitalObjects[x].averagecoveredcharges + '</p>' +
                '<p>Average Total Payments:' + arrayFilteredHospitalObjects[x].averagetotalpayments + '</p>');
            }
        }
    }
};
// end data configuration object