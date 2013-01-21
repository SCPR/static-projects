var jqueryNoConflict = jQuery;
var proxyPrefix = 'http://projects.scpr.org/static/static-files/templates/';

var termsToKnow = {
    title: 'Terms to Know',
    year_issued: 'The year a district issued a Capital Appreciation Bond.',
    bond_principal: 'The amount of money a district borrowed by issuing a bond.',
    bond_interest: 'The amount of interest a district will pay on the bond when payments begin.',
    length_to_maturity: 'The number of years from the bond issue that a district has before it begins to make payments.',
    bond_payoff: 'The sum of bond principal and bond interest, this represents the cost of the bond to the district.',
    ratio_principal_payoff: 'The total debt service on a bond divided by the principal.'
};

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
};

// function to compile handlebars template
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// render templates to page
function renderStaticTemplates(){
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '#kpcc-header');
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '#kpcc-footer');
    renderHandlebarsTemplate('static-files/templates/data-share.handlebars', '#data-share');
    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details');
    renderHandlebarsTemplate('static-files/templates/debt-table-terms.handlebars', '#debt-table-terms',termsToKnow);
    renderHandlebarsTemplate('static-files/templates/data-footer.handlebars', '#data-footer');
};