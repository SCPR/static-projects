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
        jqueryNoConflict.getJSON(dataSource, fn.processDataFromFile);
    },

    // holding container for values from the procedure select menu
    comparisonDataObject: {},

    filteredHospitalObject: {},

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

        // create the category select menu
        var categoryKeys = Object.keys(separateCategoryKeysFromValues(data));
        configureSelectMenuFromData('Choose a major category', categoryKeys, '#category-comparison');

        // get value of category grouping select menu
        jqueryNoConflict('#category-comparison').change(function () {
            fn.comparisonDataObject.category = jqueryNoConflict('#category-comparison :selected').val();
            fn.compareCategorySelectValueAgainstProcedures(data);
        });

    },

    // function to run comparisons
    compareCategorySelectValueAgainstProcedures: function(data){

        // array to hold our filtered procedures
        var arrayFilteredProcedures = [];
        arrayFilteredProcedures.length = 0;

        // retrieve fn.comparisonDataObject which has the major category
        var categoryToMatch = fn.comparisonDataObject.category;

        // loop through our data
        for (var i=0; i<data.objects.length; i++){

            // find procedures that match the select category
            if (data.objects[i].majordiagnosticcategory === categoryToMatch){

                // for each of the hospital that has the procedure create a new object
                var filteredProcedureObject = {
                    majordiagnosticcategory: data.objects[i].majordiagnosticcategory,
                    drgdefinition: data.objects[i].drgdefinition
                };

                // push filteredProcedureObject to arrayFilteredProcedures
                arrayFilteredProcedures.push(filteredProcedureObject);
            }
        }
        // end loop

        var proceduresObjects = {
            objects: arrayFilteredProcedures
        };

        // empty the procedure select menu
        jqueryNoConflict('#procedure-comparison').empty();

        // create array of filtered procedure keys
        var procedureKeys = Object.keys(separateProcedureKeysFromValues(proceduresObjects));

        // create procedure select menu
        configureSelectMenuFromData('Choose a procedure', procedureKeys, '#procedure-comparison');

        // display the procedure select menu
        jqueryNoConflict('#procedure-list-middle').removeClass('hidden');

        // get value of procedure select menu
        jqueryNoConflict('#procedure-comparison').change(function () {
            fn.comparisonDataObject.procedure = jqueryNoConflict('#procedure-comparison :selected').val();
            jqueryNoConflict('#hospital-left').html('No data available for this procedure<br />Choose a new hospital');
            jqueryNoConflict('#hospital-right').html('No data available for this procedure<br />Choose a new hospital');
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

        jqueryNoConflict('#hospital-comparison-left').change(function () {
            fn.comparisonDataObject.hospitalLeft = jqueryNoConflict('#hospital-comparison-left :selected').val();
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

        jqueryNoConflict('#hospital-comparison-right').change(function () {
            fn.comparisonDataObject.hospitalRight = jqueryNoConflict('#hospital-comparison-right :selected').val();
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

    },

    // function to run comparisons
    compareProcedureSelectValueAgainstHospitals: function(data){

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
                    averagecoveredcharges: convertCurrencyToInt(data.objects[i].averagecoveredcharges),
                    averagetotalpayments: convertCurrencyToInt(data.objects[i].averagetotalpayments),
                    drgdefinition: data.objects[i].drgdefinition,
                    hospitalreferralregiondescription: data.objects[i].hospitalreferralregiondescription,
                    majordiagnosticcategory: data.objects[i].majordiagnosticcategory,
                    providercity: data.objects[i].providercity,
                    providerid: data.objects[i].providerid,
                    providername: data.objects[i].providername,
                    providerstate: data.objects[i].providerstate,
                    providerstreetaddress: data.objects[i].providerstreetaddress,
                    providerzipcode: data.objects[i].providerzipcode,
                    totaldischarges: data.objects[i].totaldischarges
                };

                // push filteredHospitalObject to arrayFilteredHospitalObjects
                arrayFilteredHospitalObjects.push(filteredHospitalObject);

                // push average charges to array for calculations
                arrayProcedureCosts.push(filteredHospitalObject);
            }
        }
        // end loop


        fn.filteredHospitalObject.objects = arrayFilteredHospitalObjects;

        // function to calculate statewide averages
        fn.performCalculationsOnStatewideData();


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

        // separate the procedure keys from the values and place into array
        var hospitalKeys = Object.keys(separateHospitalKeysFromValues(fn.filteredHospitalObject));
        fn.displayConstructedHospitalMenus(hospitalKeys.sort());

        // check each hospital in the array of objects to grab
        // those that match the left and right hospital values
        var filteredHospitals = arrayFilteredHospitalObjects;

        var hospitalLeftValueForDifference;
        var hospitalRightValueForDifference;

        for (var x=0; x<filteredHospitals.length; x++){
            if (fn.comparisonDataObject.hospitalLeft === undefined || fn.comparisonDataObject.hospitalLeft === null){
                jqueryNoConflict('#hospital-left').html('Compare a local hospital');
            };

            if (fn.comparisonDataObject.hospitalRight === undefined || fn.comparisonDataObject.hospitalRight === null){
                jqueryNoConflict('#hospital-right').html('Compare a local hospital');
            };

            // display the data
            if (fn.comparisonDataObject.hospitalLeft === filteredHospitals[x].providername){
                hospitalLeftValueForDifference = filteredHospitals[x].averagecoveredcharges;

                jqueryNoConflict('#hospital-left').html(
                    '<h4>' + filteredHospitals[x].providername + compareHospitalToAverage(filteredHospitals[x].averagecoveredcharges, fn.comparisonDataObject.averageCost) + '</h4>' +
                    '<p>' + filteredHospitals[x].providercity + ', ' +
                    filteredHospitals[x].providerstate + '</p>' +
                    '<p>Procedure: ' + filteredHospitals[x].drgdefinition + '</p>' +
                    '<p>Discharges: ' + filteredHospitals[x].totaldischarges + '</p>' +
                    '<p>Average cost for procedure: <strong>' + convertIntToCurrency(filteredHospitals[x].averagecoveredcharges) + '</strong></p>' +
                    '<p>Average reimbursment: <strong>' + convertIntToCurrency(filteredHospitals[x].averagetotalpayments) + '</strong></p>');
            }

            // display the data
            if (fn.comparisonDataObject.hospitalRight === filteredHospitals[x].providername){
                hospitalRightValueForDifference = filteredHospitals[x].averagecoveredcharges;

                jqueryNoConflict('#hospital-right').html(
                    '<h4>' + filteredHospitals[x].providername + compareHospitalToAverage(filteredHospitals[x].averagecoveredcharges, fn.comparisonDataObject.averageCost) + '</h4>' +
                    '<p>' + filteredHospitals[x].providercity + ', ' +
                    filteredHospitals[x].providerstate + '</p>' +
                    '<p>Procedure: ' + filteredHospitals[x].drgdefinition + '</p>' +
                    '<p>Discharges: ' + filteredHospitals[x].totaldischarges + '</p>' +
                    '<p>Average cost for procedure: <strong>' + convertIntToCurrency(filteredHospitals[x].averagecoveredcharges) + '</strong></p>' +
                    '<p>Average reimbursment: <strong>' + convertIntToCurrency(filteredHospitals[x].averagetotalpayments) + '</strong></p>');
            }

            jqueryNoConflict('#hospital-calculation').html(calcaulateDifferenceBetweenHospitals(hospitalLeftValueForDifference, hospitalRightValueForDifference));
        }
    },

    // display calculated averages for the whole data set
    displayConstructedHospitalMenus: function(hospitalKeys){

        // show the hospitals select menu
        jqueryNoConflict('#hospital-div-left').removeClass('hidden');
        jqueryNoConflict('#hospital-div-middle').removeClass('hidden');
        jqueryNoConflict('#hospital-div-right').removeClass('hidden');

        // empty the hospitals select menu
        jqueryNoConflict('#hospital-comparison-right').empty();
        jqueryNoConflict('#hospital-comparison-left').empty();

        // create the new select menu based on options
        configureSelectMenuFromData('Find your local hospital', hospitalKeys, '#hospital-comparison-right');
        configureSelectMenuFromData('Find your local hospital', hospitalKeys, '#hospital-comparison-left');
    },

    performCalculationsOnStatewideData: function(){

        console.log(fn.filteredHospitalObject.objects);

        // pull lowest average cost
        var lowestAverageCostToDisplay = _.min(fn.filteredHospitalObject.objects, function(item){
            return item.averagecoveredcharges;
        });

        // pull average of all costs
        var arrayOfCosts = _.pluck(fn.filteredHospitalObject.objects, 'averagecoveredcharges')
        var averageCostToDisplay = _.reduce(arrayOfCosts, function(memo, num){
            return memo + num / fn.filteredHospitalObject.objects.length;
        }, 0);

        // pull highest average cost
        var highestAverageCostToDisplay = _.max(fn.filteredHospitalObject.objects, function(item){
            return item.averagecoveredcharges;
        });

        // calculate the difference between highest and lowest
        var differenceInCost = calcaulateDifferenceInAverage(highestAverageCostToDisplay.averagecoveredcharges, lowestAverageCostToDisplay.averagecoveredcharges)

        // add key/value for average cost to comparison object
        fn.comparisonDataObject.averageCost = averageCostToDisplay;

        jqueryNoConflict('#procedure-glance').removeClass('hidden');

        jqueryNoConflict('#procedure-glance-left').html(
            '<h5 class="centered red">Lowest average cost at a California hospital</h5>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(lowestAverageCostToDisplay.averagecoveredcharges) +
            '</strong><br />' + lowestAverageCostToDisplay.providername +
            ' (' + lowestAverageCostToDisplay.providercity + ')<br/>' +
            '<strong>No. of discharged patients</strong>: ' +
            lowestAverageCostToDisplay.totaldischarges + '</p>');

        jqueryNoConflict('#procedure-glance-middle').html(
            '<h5 class="centered red">Average cost in California</h5>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(averageCostToDisplay) +
            '</strong></p>' +
            '<h5 class="centered red">Difference</h5>' +
            '<p class="centered"><strong>' + convertIntToCurrency(differenceInCost) + '</strong></p>');

        jqueryNoConflict('#procedure-glance-right').html(
            '<h5 class="centered red">Highest average cost at a California hospital</h5>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(highestAverageCostToDisplay.averagecoveredcharges) +
            '</strong><br />' + highestAverageCostToDisplay.providername +
            ' (' + highestAverageCostToDisplay.providercity + ')<br/>' +
            '<strong>No. of discharged patients</strong>: ' +
            highestAverageCostToDisplay.totaldischarges + '</p>');

    }

};
// end data configuration object

// count instances of category values and set to keys
function separateCategoryKeysFromValues(dataSource){
    var instanceOfCategoryKeys = {};
    for (var i=0; i<dataSource.objects.length; i++){
        var keyCount = dataSource.objects[i];
        instanceOfCategoryKeys[keyCount.majordiagnosticcategory] = (instanceOfCategoryKeys[keyCount.majordiagnosticcategory] || 0) + 1;
    }
    return instanceOfCategoryKeys;
}

// count instances of procedure values and set to keys
function separateProcedureKeysFromValues(dataSource){
    var instanceOfProcedureKeys = {};
    for (var i=0; i<dataSource.objects.length; i++){
        var keyCount = dataSource.objects[i];
        instanceOfProcedureKeys[keyCount.drgdefinition] = (instanceOfProcedureKeys[keyCount.drgdefinition] || 0) + 1;
    }
    return instanceOfProcedureKeys;
}

// count instances of hospital values and set to keys
function separateHospitalKeysFromValues(dataSource){
    var instanceOfHospitalKeys = {};
    for (var i=0; i<dataSource.objects.length; i++){
        var keyCount = dataSource.objects[i];
        instanceOfHospitalKeys[keyCount.providername] = (instanceOfHospitalKeys[keyCount.providername] || 0) + 1;
    }
    return instanceOfHospitalKeys;
}

// function to create a select menu from an array
function configureSelectMenuFromData(optionMessage, arrayToCreateSelect, idTargetForSelect){
    var selectList;
    selectList += "<option>" + optionMessage + "</option>";
    for (var i=0; i<arrayToCreateSelect.length;i++) {
        selectList += "<option value='" + arrayToCreateSelect[i] + "'>" +
            arrayToCreateSelect[i] + "</option>";
    }
    jqueryNoConflict(idTargetForSelect).append(selectList);
}

// add commas to data
function addCommas(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';

    var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
    return x1 + x2;
}

// calculate average, add commas, round off
function calculateAverageCost(arrayOfTotals){
    var total = 0;
    for (var z=0; z<arrayOfTotals.length; z++){
        total = total + arrayOfTotals[z];
    }
    total = total/arrayOfTotals.length;
    return total;
}

// calculate lowest instance, add commas, round off
function calcaulateDifferenceInAverage(highestAverage, lowestAverage){
    var total = highestAverage - lowestAverage;
    return total;
}

// take string of dollar amount and convert to int
function convertCurrencyToInt(currency){
    var value = currency.replace('$', '').replace(',', '');
    value = parseInt(value);
    return value;
}

// take int of dollar amount and convert to currency
function convertIntToCurrency(integer){
    var value = '$' + addCommas(integer.toFixed(0));
    return value;
}

// calculate lowest instance, add commas, round off
function calcaulateDifferenceBetweenHospitals(hospitalLeft, hospitalRight){
    var value;
    if (hospitalLeft > hospitalRight){
        value = hospitalLeft - hospitalRight;
        value = '<h4 class="centered">Cheaper Bill By About ---><br />' +
        '<strong>' + convertIntToCurrency(value) + '</strong></h4>';

    } else if (hospitalLeft < hospitalRight){
        value = hospitalRight - hospitalLeft;
        value = '<h4 class="centered"><--- Cheaper Bill By About<br />' +
        '<strong>' + convertIntToCurrency(value) + '</strong></h4>';
    }
    return value;
}

// compare a hospital's average to the datasets average
function compareHospitalToAverage(hospitalCost, averageCost){
    if (hospitalCost < averageCost){
        value = ' &#8595; ';
    } else {
        value = ' &#8593; ';
    }
    return value;
}