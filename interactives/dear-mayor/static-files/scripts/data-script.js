var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'static-files/data/dear_mayor_master_data_sheet-handlebars.json';
    jqueryNoConflict.getJSON(dataSource, renderHandlebarsDataOnTemplate);
};

// render data visuals template
function renderHandlebarsDataOnTemplate(data){
    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details', data);
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', data);
    checkBoxToggle();
    evaluateTopics(data)
};

// begin
function evaluateTopics(data){

    var numOfCrime = 0;
    var numOfEducation = 0;
    var numOfEnvironment = 0;
    var numOfPublicHealth = 0;
    var numOfOther = 0;
    var numOfPolitics = 0;
    var numOfTaxes = 0;
    var numOfTransportation = 0;

    var arrayOfTopics = [];

    for (var i=0; i<data.objects.length; i++){
        arrayOfTopics.push(data.objects[i].responsesf6d5d1c2d738)

        if (data.objects[i].responsesf6d5d1c2d738 === "Crime")
            numOfCrime++;

        if (data.objects[i].responsesf6d5d1c2d738 === "Education")
            numOfEducation++;

        if (data.objects[i].responsesf6d5d1c2d738 === "Environment")
            numOfEnvironment++;

        if (data.objects[i].responsesf6d5d1c2d738 === "Politics")
            numOfPolitics++;

        if (data.objects[i].responsesf6d5d1c2d738 === "Public Health")
            numOfPublicHealth++;

        if (data.objects[i].responsesf6d5d1c2d738 === "Other")
            numOfOther++;

        if (data.objects[i].responsesf6d5d1c2d738 === "Taxes")
            numOfTaxes++;

        if (data.objects[i].responsesf6d5d1c2d738 === "Transportation")
            numOfTransportation++;

    }

    jqueryNoConflict('#crime-results').html(' (' + numOfCrime + ') ');
    jqueryNoConflict('#education-results').html(' (' + numOfEducation + ') ');
    jqueryNoConflict('#environment-results').html(' (' + numOfEnvironment + ') ');
    jqueryNoConflict('#politics-results').html(' (' + numOfPolitics + ') ');
    jqueryNoConflict('#health-results').html(' (' + numOfPublicHealth + ') ');
    jqueryNoConflict('#other-results').html(' (' + numOfOther + ') ');
    jqueryNoConflict('#taxes-results').html(' (' + numOfTaxes + ') ');
    jqueryNoConflict('#transportation-results').html(' (' + numOfTransportation + ') ');
};





// begin checkbox toggle
function checkBoxToggle(){
    jqueryNoConflict('#data-legend-items :checkbox').click(function() {
        jqueryNoConflict('.dear-mayor-response').hide();
        jqueryNoConflict('#data-legend-items :checkbox:checked').each(function() {
            jqueryNoConflict('.' + jqueryNoConflict(this).val()).show();
        });
    });
}