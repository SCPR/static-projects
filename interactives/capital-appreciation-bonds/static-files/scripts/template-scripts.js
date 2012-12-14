var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    renderStaticTemplates();
});
// end

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
}
//end

// render templates to page
function renderStaticTemplates(){
    renderKpccHeaderTemplate();
    renderDataDetailsTemplate();
    renderDebtTableTermsTemplate();
    renderDataFooterTemplate();
    renderKpccFooterTemplate();
};
// end

// prepare templates for page
function renderKpccHeaderTemplate(){
    getTemplateAjax('static-files/templates/kpcc-header.handlebars', function(template) {
        jqueryNoConflict('#kpcc-header').html(template());
    })
};

function renderDataDetailsTemplate(){
    getTemplateAjax('static-files/templates/data-details.handlebars', function(template) {
        jqueryNoConflict('#data-details').html(template());
    })
};

function renderDebtTableTermsTemplate(){
    var termsToKnow = {
        title: 'Terms to Know',
        year_issued: 'The year a district issued a Capital Appreciation Bond.',
        bond_principal: 'The amount of money a district borrowed by issuing a bond.',
        bond_interest: 'The amount of interest a district will pay on the bond when payments begin.',
        length_to_maturity: 'The number of years from the bond issue that a district has before it begins to make payments.',
        bond_payoff: 'The sum of bond principal and bond interest, this represents the cost of the bond to the district.',
        ratio_principal_payoff: 'The total debt service on a bond divided by the principal.'
    }

    getTemplateAjax('static-files/templates/debt-table-terms.handlebars', function(template) {
        jqueryNoConflict('#debt-table-terms').html(template(termsToKnow));
    })
};

function renderDataFooterTemplate(){
    getTemplateAjax('static-files/templates/data-footer.handlebars', function(template) {
        jqueryNoConflict('#data-footer').html(template());
    })
};

function renderKpccFooterTemplate(){
    getTemplateAjax('static-files/templates/kpcc-footer.handlebars', function(template) {
        jqueryNoConflict('#kpcc-footer').html(template());
    })
};