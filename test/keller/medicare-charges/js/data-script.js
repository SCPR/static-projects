var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.retrieveDataFromFile();
});

// begin data configuration object
var fn = {

    // pull the data from the flat file
    retrieveDataFromFile: function() {
        jqueryNoConflict.getJSON(dataSource, fn.configureCategorySelectMenu);
    },

    // holding container for values that we compare
    objectOfComparisonData: {},

    // holding container of our filtered hospitals
    objectOfFilteredHospitals: {
        objects: []
    },

    // holding container to build select menus
    objectOfSelectMenuArrays: {
        categorySelectMenu: [],
        procedureSelectMenu: [],
        hospitalSelectMenu: []
    },

    configureCategorySelectMenu: function(data) {

        fn.objectOfSelectMenuArrays.categorySelectMenu.length = 0;

        for (var i=0; i<data.objects.length; i++) {
            fn.objectOfSelectMenuArrays.categorySelectMenu.push(data.objects[i].majordiagnosticcategory);
        }

        fn.displayCategorySelectMenu(data);
    },

    // display category select menu
    displayCategorySelectMenu: function(data) {

        // create category select menu
        configureSelectMenuFromData('Choose from a medical specialty area, i.e., Circulatory System ', fn.objectOfSelectMenuArrays.categorySelectMenu, '#category-comparison');

        // get value of category grouping select menu
        jqueryNoConflict('#category-comparison').change(function () {
            fn.objectOfComparisonData.category = jqueryNoConflict('#category-comparison :selected').val();
            jqueryNoConflict('#hospital-left').html('Choose a new hospital to compare');
            jqueryNoConflict('#hospital-right').html('Choose a new hospital to compare');
            fn.compareCategorySelectValueAgainstProcedures(data);
        });
    },

    // function to run comparisons
    compareCategorySelectValueAgainstProcedures: function(data) {

        fn.objectOfSelectMenuArrays.procedureSelectMenu.length = 0;

        for (var i=0; i<data.objects.length; i++) {

            // find procedures that match the select category
            if (data.objects[i].majordiagnosticcategory === fn.objectOfComparisonData.category) {
                fn.objectOfSelectMenuArrays.procedureSelectMenu.push(data.objects[i].drgdefinition);
            }
        }
        fn.displayProcedureSelectMenu(data);
    },

    // display procedures select menu
    displayProcedureSelectMenu: function(data) {

        // empty the procedure select menu
        emptyUxElement('#procedure-comparison');

        // create procedure select menu
        configureSelectMenuFromData('Choose a diagnosis associated with this specialty area', fn.objectOfSelectMenuArrays.procedureSelectMenu, '#procedure-comparison');

        // display the procedure select menu
        jqueryNoConflict('#procedure-list-middle').removeClass('hidden');

        // get value of procedure select menu
        jqueryNoConflict('#procedure-comparison').change(function () {
            fn.objectOfComparisonData.procedure = jqueryNoConflict('#procedure-comparison :selected').val();
            jqueryNoConflict('#hospital-left').html('Choose a new hospital to compare.');
            jqueryNoConflict('#hospital-right').html('Choose a new hospital to compare.');
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

        jqueryNoConflict('#hospital-comparison-left').change(function () {
            fn.objectOfComparisonData.hospitalLeft = jqueryNoConflict('#hospital-comparison-left :selected').val();
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

        jqueryNoConflict('#hospital-comparison-right').change(function () {
            fn.objectOfComparisonData.hospitalRight = jqueryNoConflict('#hospital-comparison-right :selected').val();
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

    },

    // function to run comparisons
    compareProcedureSelectValueAgainstHospitals: function(data) {

        fn.objectOfSelectMenuArrays.hospitalSelectMenu.length = 0;
        fn.objectOfFilteredHospitals.objects.length = 0;

        for (var i=0; i<data.objects.length; i++) {

            // find procedures that match the select category
            if (data.objects[i].drgdefinition === fn.objectOfComparisonData.procedure) {

                fn.objectOfSelectMenuArrays.hospitalSelectMenu.push(data.objects[i].providername);

                // for each of the hospital that has the procedure create a new object
                var instanceOfFilteredHospital = {
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

                fn.objectOfFilteredHospitals.objects.push(instanceOfFilteredHospital);
            }

        }

        // function to calculate statewide averages
        fn.performCalculationsOnStatewideData(data);

        // display the hospital select menu
        fn.displayHospitalSelectMenu(data);

        // display individual hospital data
        fn.compareHospitalSelectValueAgainstData(data);

    },

    // find relevant hospital data and display it for user
    compareHospitalSelectValueAgainstData: function(data) {

        var hospitalLeftValueForDifference;
        var hospitalRightValueForDifference;

        for (var x=0; x<fn.objectOfFilteredHospitals.objects.length; x++) {

            var displayOutput = '<p><strong>' + fn.objectOfFilteredHospitals.objects[x].providername + '</strong> in ' + fn.objectOfFilteredHospitals.objects[x].providercity +
                compareHospitalToAverage(fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges, fn.objectOfComparisonData.averageCost) +
                ' based on ' + fn.objectOfFilteredHospitals.objects[x].totaldischarges + ' discharges.</p>' +

                /*
                '<p class="centered">' + fn.objectOfFilteredHospitals.objects[x].providerstreetaddress +
                '<br />' + fn.objectOfFilteredHospitals.objects[x].providercity +
                ', ' + fn.objectOfFilteredHospitals.objects[x].providerstate +
                ' ' + fn.objectOfFilteredHospitals.objects[x].providerzipcode +
                '</p>' +
                '<p>Procedure: ' + fn.objectOfFilteredHospitals.objects[x].drgdefinition + '</p>' +
                */

                '<p>The average bill for this procedure is <strong>' +
                convertIntToCurrency(fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges) +
                '</strong>.</p>' +

/*
                '<p>The average bill for this procedure is <strong>' +
                convertIntToCurrency(fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges) +
                '</strong>, which is ' + convertIntToCurrency(calcaulateDifferenceInAverage(fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges, fn.objectOfComparisonData.averageCost)) + ' than the state average.</p>' +
*/


                '<p>The average reimbursment for this procedure is <strong>' +
                convertIntToCurrency(fn.objectOfFilteredHospitals.objects[x].averagetotalpayments) + '</strong>.</p>';

/*
                '<p>The average reimbursment for this procedure is <strong>' +
                convertIntToCurrency(fn.objectOfFilteredHospitals.objects[x].averagetotalpayments) + '</strong>, which is ' + convertIntToCurrency(calcaulateDifferenceInAverage(fn.objectOfFilteredHospitals.objects[x].averagetotalpayments, fn.objectOfComparisonData.averageReimbursement)) + ' than the state average.</p>';
*/

            if (fn.objectOfComparisonData.hospitalLeft === undefined || fn.objectOfComparisonData.hospitalLeft === null) {
                jqueryNoConflict('#hospital-left').html('');
            };

            if (fn.objectOfComparisonData.hospitalRight === undefined || fn.objectOfComparisonData.hospitalRight === null) {
                jqueryNoConflict('#hospital-right').html('');
            };

            // display the data
            if (fn.objectOfComparisonData.hospitalLeft === fn.objectOfFilteredHospitals.objects[x].providername) {
                hospitalLeftValueForDifference = fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges;
                jqueryNoConflict('#hospital-left').html(displayOutput);

            }

            // display the data
            if (fn.objectOfComparisonData.hospitalRight === fn.objectOfFilteredHospitals.objects[x].providername) {
                hospitalRightValueForDifference = fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges;

                jqueryNoConflict('#hospital-right').html(displayOutput);
            }

            jqueryNoConflict('#hospital-calculation').html(calcaulateDifferenceBetweenHospitals(hospitalLeftValueForDifference, hospitalRightValueForDifference));

        }

    },

    performCalculationsOnStatewideData: function(data) {

        // pull lowest average cost
        var lowestAverageCostToDisplay = _.min(fn.objectOfFilteredHospitals.objects, function(item) {
            return item.averagecoveredcharges;
        });

        // pull lowest average reimbursement
        var lowestAverageReimbursmentToDisplay = _.min(fn.objectOfFilteredHospitals.objects, function(item) {
            return item.averagetotalpayments;
        });

        // pull average of all costs
        var averageCostToDisplay = _.reduce(_.pluck(fn.objectOfFilteredHospitals.objects, 'averagecoveredcharges'), function(memo, num) {
            return memo + num / fn.objectOfFilteredHospitals.objects.length;
        }, 0);

        // pull average of all reimbursements
        var averageReimbursmentsToDisplay = _.reduce(_.pluck(fn.objectOfFilteredHospitals.objects, 'averagetotalpayments'), function(memo, num) {
            return memo + num / fn.objectOfFilteredHospitals.objects.length;
        }, 0);

        // pull highest average cost
        var highestAverageCostToDisplay = _.max(fn.objectOfFilteredHospitals.objects, function(item) {
            return item.averagecoveredcharges;
        });

        // pull highest average reimbursement
        var highestAverageReimbursmentToDisplay = _.max(fn.objectOfFilteredHospitals.objects, function(item) {
            return item.averagetotalpayments;
        });

        // calculate the difference between highest and lowest cost
        var differenceInCost = calcaulateDifferenceInAverage(highestAverageCostToDisplay.averagecoveredcharges, lowestAverageCostToDisplay.averagecoveredcharges);

        // calculate the difference between highest and lowest reimbursement
        var differenceInReimbursment = calcaulateDifferenceInAverage(highestAverageReimbursmentToDisplay.averagetotalpayments, lowestAverageReimbursmentToDisplay.averagetotalpayments);

        // add key/value for average cost to comparison object
        fn.objectOfComparisonData.averageCost = averageCostToDisplay;

        // add key/value for average reimbursement to comparison object
        fn.objectOfComparisonData.averageReimbursement = averageReimbursmentsToDisplay;

        jqueryNoConflict('.procedure-cost').removeClass('hidden').animate({height:'auto'}, 1050000000);

        // average costs
        jqueryNoConflict('#procedure-cost-average').html(
            '<h4>Average charge in California: ' + convertIntToCurrency(averageCostToDisplay) + '</h4>');

        jqueryNoConflict('#procedure-cost-left').html(
            '<p>The lowest average bill for this procedure is about <strong>' + convertIntToCurrency(lowestAverageCostToDisplay.averagecoveredcharges) + '</strong> at <strong>' + lowestAverageCostToDisplay.providername + '</strong> in ' + lowestAverageCostToDisplay.providercity + ', based on '+ lowestAverageCostToDisplay.totaldischarges + ' discharges.</p>');

        jqueryNoConflict('#procedure-cost-right').html(
            '<p>The highest average bill for this procedure is about <strong>' + convertIntToCurrency(highestAverageCostToDisplay.averagecoveredcharges) + '</strong> at <strong>' + highestAverageCostToDisplay.providername + '</strong> in ' + highestAverageCostToDisplay.providercity + ', based on  '+ highestAverageCostToDisplay.totaldischarges + ' discharges.</p>');

        jqueryNoConflict('#procedure-cost-middle').html(
            '<p>The difference in average bills between these hospitals is about <strong>' + convertIntToCurrency(differenceInCost) + '</strong></p>');

        // average reimbursements
        jqueryNoConflict('.procedure-reimbursement').removeClass('hidden');

        jqueryNoConflict('#procedure-reimbursement-average').html(
            '<h4>Average reimbursment in California: ' + convertIntToCurrency(averageReimbursmentsToDisplay) + '</h4>');

        jqueryNoConflict('#procedure-reimbursement-left').html(
            '<p>The lowest average reimbursment for this procedure is about <strong>' + convertIntToCurrency(lowestAverageReimbursmentToDisplay.averagetotalpayments) + '</strong> at <strong>' + lowestAverageReimbursmentToDisplay.providername + '</strong> in ' + lowestAverageReimbursmentToDisplay.providercity + ' based on '+ lowestAverageReimbursmentToDisplay.totaldischarges + ' discharges.</p>');

        jqueryNoConflict('#procedure-reimbursement-right').html(
            '<p>The lowest average reimbursment for this procedure is about <strong>' + convertIntToCurrency(highestAverageReimbursmentToDisplay.averagetotalpayments) + '</strong> at <strong>' + highestAverageReimbursmentToDisplay.providername + '</strong> in ' + highestAverageReimbursmentToDisplay.providercity + ' based on '+ highestAverageReimbursmentToDisplay.totaldischarges + ' discharges.</p>');

        jqueryNoConflict('#procedure-reimbursement-middle').html(
            '<p>The difference in average reimbursment between these hospitals is about <strong>' + convertIntToCurrency(differenceInReimbursment) + '</strong></p>');
    },

    // display calculated averages for the whole data set
    displayHospitalSelectMenu: function(data) {

        // show the hospitals select menu
        jqueryNoConflict('#hospital-div-left').removeClass('hidden');
        jqueryNoConflict('#hospital-div-middle').removeClass('hidden');
        jqueryNoConflict('#hospital-div-right').removeClass('hidden');

        // empty the hospitals select menu
        emptyUxElement('#hospital-comparison-left');
        emptyUxElement('#hospital-comparison-right');

        // create the new select menu based on options
        configureSelectMenuFromData('Choose a hospital', fn.objectOfSelectMenuArrays.hospitalSelectMenu, '#hospital-comparison-right');
        configureSelectMenuFromData('Choose a hospital', fn.objectOfSelectMenuArrays.hospitalSelectMenu, '#hospital-comparison-left');
    }

};
// end data configuration object

// function to create a select menu from an array
function configureSelectMenuFromData(optionMessage, arrayToCreateSelect, idTargetForSelect) {
    var filteredArrayForSelect = _.uniq(arrayToCreateSelect).sort()
    var selectList;
    selectList += "<option>" + optionMessage + "</option>";
    for (var i=0; i<filteredArrayForSelect.length;i++) {
        selectList += "<option value='" + filteredArrayForSelect[i] + "'>" +
            filteredArrayForSelect[i] + "</option>";
    }
    jqueryNoConflict(idTargetForSelect).append(selectList);
}

// empty a display element
function emptyUxElement(elementId) {
    jqueryNoConflict(elementId).empty();
}

// add commas to data
function addCommas(nStr) {
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
function calculateAverageCost(arrayOfTotals) {
    var total = 0;
    for (var z=0; z<arrayOfTotals.length; z++) {
        total = total + arrayOfTotals[z];
    }
    total = total/arrayOfTotals.length;
    return total;
}

// calculate lowest instance, add commas, round off
function calcaulateDifferenceInAverage(highestAverage, lowestAverage) {
    var total = highestAverage - lowestAverage;
    return total;
}

// take string of dollar amount and convert to int
function convertCurrencyToInt(currency) {
    var value = currency.replace('$', '').replace(',', '');
    value = parseInt(value);
    return value;
}

// take int of dollar amount and convert to currency
function convertIntToCurrency(integer) {
    var value = '$' + addCommas(integer.toFixed(0));
    return value;
}

// calculate lowest instance, add commas, round off
function calcaulateDifferenceBetweenHospitals(hospitalLeft, hospitalRight) {
    var value;
    if (hospitalLeft > hospitalRight) {
        value = hospitalLeft - hospitalRight;
        value = '<h4 class="centered">Lower average bill by ' + convertIntToCurrency(value) + ' &#8594; </h4>';

    } else if (hospitalLeft < hospitalRight) {
        value = hospitalRight - hospitalLeft;
        value = '<h4 class="centered">&#8592; Lower average bill by ' + convertIntToCurrency(value) + '</h4>';
    }
    return value;
}

// compare a hospital's average to the datasets average
function compareHospitalToAverage(hospitalCost, averageCost) {
    if (hospitalCost < averageCost) {
        value = ' charges less than the state average for this procedure, ';
    } else {
        value = ' charges more than the state average for this procedure, ';
    }
    return value;
}