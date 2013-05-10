/*
mv - mechanical ventilator...
without mcc = without major complications
with cc - with complicaitons
*/

var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.retrieveDataFromFile();

});

// begin data configuration object
var fn = {

    // pull the data from the flat file
    retrieveDataFromFile: function(){
        var dataSource = 'static-files/data/medicare_charges_full-handlebars.json';
        jqueryNoConflict.getJSON(dataSource, fn.processDataFromFile);
    },

    // add commas to a string
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

    // calculate average, add commas, round off
    calculateAverageCost: function(arrayOfTotals){
        var total = 0;
        for (var z=0; z<arrayOfTotals.length; z++){
            total = total + arrayOfTotals[z];
        }

        total = total/arrayOfTotals.length;
        return total;
    },

    // calculate highest instance, add commas, round off
    calcaulateHighestCost: function(array){
        var total = Math.max.apply(Math, array);
        return total;
    },

    // calculate lowest instance, add commas, round off
    calcaulateLowestCost: function(array){
        var total = Math.min.apply(Math, array);
        return total;
    },

    // take string of dollar amount and convert to int
    convertCurrencyToInt: function(currency){
        var value = currency.replace('$', '').replace(',', '');
        value = parseInt(value);
        return value;
    },

    // take int of dollar amount and convert to currency
    convertIntToCurrency: function(integer){
        var value = '$' + fn.addCommas(integer.toFixed(0));
        return value;
    },

    // compare a hospital's average to the datasets average
    compareHospitalToAverage: function(hospitalCost, averageCost){
        if (hospitalCost < averageCost){
            value = ' &#8595; ';
            //console.log('hospital-lower');
        } else {
            //console.log('hospital-higher');
            value = ' &#8593; ';
        }
        return value;
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

    // holding container for values from the select menu
    comparisonDataObject: {},

    // holding container for values from the select menu
    processDataFromFile: function(data){

        // separate the procedure keys from the values and place into array
        // does not work on ie
        // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys

        if (!Object.keys) {
          Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                  'toString',
                  'toLocaleString',
                  'valueOf',
                  'hasOwnProperty',
                  'isPrototypeOf',
                  'propertyIsEnumerable',
                  'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
              if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

              var result = [];

              for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) result.push(prop);
              }

              if (hasDontEnumBug) {
                for (var i=0; i < dontEnumsLength; i++) {
                  if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                }
              }
              return result;
            }
          })()
        };

        var procedureKeys = Object.keys(fn.separateProcedureKeysFromValues(data));

        // create the procedure select menu
        fn.configureSelectMenuFromData('Choose a procedure', procedureKeys, '#procedure-comparison');
        //console.log(fn.comparisonDataObject);

        jqueryNoConflict('#procedure-comparison').change(function () {
            fn.comparisonDataObject.procedure = jqueryNoConflict('#procedure-comparison :selected').val();
            jqueryNoConflict('#hospital-left').html('Choose a hospital to compare');
            jqueryNoConflict('#hospital-right').html('Choose a hospital to compare');
            fn.compareSelectWithData(data);
        });

        jqueryNoConflict('#hospital-comparison-left').change(function () {
            fn.comparisonDataObject.hospitalLeft = jqueryNoConflict('#hospital-comparison-left :selected').val();
            fn.compareSelectWithData(data);
        });

        jqueryNoConflict('#hospital-comparison-right').change(function () {
            fn.comparisonDataObject.hospitalRight = jqueryNoConflict('#hospital-comparison-right :selected').val();
            fn.compareSelectWithData(data);
        });
    },

    // function to run comparisons
    compareSelectWithData: function(data){

        //console.log(data);

        // array to hold our target hospitals
        var arrayFilteredHospitalObjects = [];
        arrayFilteredHospitalObjects.length = 0;

        // holding container used to calulate averages
        var arrayProcedureCosts = [];
        arrayProcedureCosts.length = 0;

        // retrieve fn.comparisonDataObject which has the procedure
        var procedureToQuery = fn.comparisonDataObject.procedure

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
                    averagecoveredcharges: fn.convertCurrencyToInt(data.objects[i].averagecoveredcharges),
                    averagetotalpayments: fn.convertCurrencyToInt(data.objects[i].averagetotalpayments)
                };

                // push filteredHospitalObject to arrayFilteredHospitalObjects
                arrayFilteredHospitalObjects.push(filteredHospitalObject);

                // push average charges to array for calculations
                arrayProcedureCosts.push(fn.convertCurrencyToInt(data.objects[i].averagecoveredcharges));

                // calculate average costs for display
                var costAverageToDisplay = fn.calculateAverageCost(arrayProcedureCosts);
                var lowestAverageCostToDisplay = fn.calcaulateLowestCost(arrayProcedureCosts);
                var highestAverageCostToDisplay = fn.calcaulateHighestCost(arrayProcedureCosts);

                // add key/value for average cost to comparison object
                fn.comparisonDataObject.averageCost = costAverageToDisplay;

                // display the averages we've calculated
                jqueryNoConflict('#procedure').html(
                    '<h4 class="centered">Average cost at California hospital</h4>' +
                    '<p class="centered"><strong>' + fn.convertIntToCurrency(costAverageToDisplay) + '</strong></p>' +
                    '<h4 class="centered">Lowest average cost</h4>' +
                    '<p class="centered"><strong>' + fn.convertIntToCurrency(lowestAverageCostToDisplay) + '</strong></p>' +
                    '<h4 class="centered">Highest average cost</h4>' +
                    '<p class="centered"><strong>' + fn.convertIntToCurrency(highestAverageCostToDisplay) + '</strong></p>');

            } else {

                //console.log('no match');
            }
        }
        // end loop

        //console.log(fn.comparisonDataObject);

        // set our filtered array to an object
        var hospitalsObjectToBuildSelect = {
            objects: arrayFilteredHospitalObjects
        };

        // separate the procedure keys from the values and place into array
        var hospitalKeys = Object.keys(fn.separateHospitalKeysFromValues(hospitalsObjectToBuildSelect));

        fn.displayConstructedHospitalMenus(hospitalKeys);

        // check each hospital in the array of objects to grab
        // those that match the left and right hospital values
        var filteredHospitals = arrayFilteredHospitalObjects;

        for (var x=0; x<filteredHospitals.length; x++){
            if (fn.comparisonDataObject.hospitalLeft === undefined || fn.comparisonDataObject.hospitalLeft === null){
                jqueryNoConflict('#hospital-left').html('Choose a hospital for comparison');
            };

            if (fn.comparisonDataObject.hospitalRight === undefined || fn.comparisonDataObject.hospitalRight === null){
                jqueryNoConflict('#hospital-right').html('Choose a hospital for comparison');
            };

            // display the data
            if (fn.comparisonDataObject.hospitalLeft === filteredHospitals[x].providername){
                jqueryNoConflict('#hospital-left').html(
                    '<h4>' + filteredHospitals[x].providername + fn.compareHospitalToAverage(filteredHospitals[x].averagecoveredcharges, fn.comparisonDataObject.averageCost) + '</h4>' +
                    '<p>' + filteredHospitals[x].providercity + ', ' +
                    filteredHospitals[x].providerstate + '</p>' +
                    '<p>Procedure: ' + filteredHospitals[x].drgdefinition + '</p>' +
                    '<p>Discharges: ' + filteredHospitals[x].totaldischarges + '</p>' +
                    '<p>Average cost for procedure: <strong>' + fn.convertIntToCurrency(filteredHospitals[x].averagecoveredcharges) + '</strong></p>' +
                    '<p>Average reimbursment: <strong>' + fn.convertIntToCurrency(filteredHospitals[x].averagetotalpayments) + '</strong></p>');
            }

            // display the data
            if (fn.comparisonDataObject.hospitalRight === filteredHospitals[x].providername){
                jqueryNoConflict('#hospital-right').html(
                    '<h4>' + filteredHospitals[x].providername + fn.compareHospitalToAverage(filteredHospitals[x].averagecoveredcharges, fn.comparisonDataObject.averageCost) + '</h4>' +
                    '<p>' + filteredHospitals[x].providercity + ', ' +
                    filteredHospitals[x].providerstate + '</p>' +
                    '<p>Procedure: ' + filteredHospitals[x].drgdefinition + '</p>' +
                    '<p>Discharges: ' + filteredHospitals[x].totaldischarges + '</p>' +
                    '<p>Average cost for procedure: <strong>' + fn.convertIntToCurrency(filteredHospitals[x].averagecoveredcharges) + '</strong></p>' +
                    '<p>Average reimbursment: <strong>' + fn.convertIntToCurrency(filteredHospitals[x].averagetotalpayments) + '</strong></p>');
            }
        }
    },

    // display calculated averages for the whole data set
    displayConstructedHospitalMenus: function(hospitalKeys){

        // show the hospitals select menu
        jqueryNoConflict('#hospital-div-left').removeClass('hidden');
        jqueryNoConflict('#hospital-div-right').removeClass('hidden');

        // empty the hospitals select menu
        jqueryNoConflict('#hospital-comparison-right').empty();
        jqueryNoConflict('#hospital-comparison-left').empty();

        // create the new select menu based on options
        fn.configureSelectMenuFromData('Choose a hospital', hospitalKeys, '#hospital-comparison-right');
        fn.configureSelectMenuFromData('Choose a hospital', hospitalKeys, '#hospital-comparison-left');

    },

};
// end data configuration object