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