var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    handlebarsFormatDateForDisplay();
    initializeTemplates.renderStaticTemplates();
});

// application configuration object
var appConfig = {

    // project text open by default?
    openAboutThis: false,

    // embedding settings
    embed_this: false,
    embed_url_root: null,

    // use flat-file or spreadsheet
    dataSource: null,

    // enter path to the data source below
    spreadsheetKey: null,
    flatFile: null
};

// data configuration object
var fn = {

    retriveData: function(){
        var currentTime = new Date();
        var agency_name = jqueryNoConflict('#agency_name').val();
        var street_address = jqueryNoConflict('#street_address').val();
        var city = jqueryNoConflict('#city').val();
        var state = jqueryNoConflict('#state').val();
        var zip_code = jqueryNoConflict('#zip_code').val();
        var data_request = jqueryNoConflict('#data_request').val();
        data_request = "<p>" + data_request.replace(/\r?\n/g, "<br />") + "</p>";
        var reporter_signature = jqueryNoConflict('#reporter_signature').val();

        var objectData = {"objects": [{
            date: currentTime,
            agency_name: agency_name,
            street_address: street_address,
            city: city,
            state: state,
            zip_code: zip_code,
            data_request: data_request,
            reporter_signature: reporter_signature}]
        };

        renderHandlebarsTemplate('templates/data-visuals.handlebars', '.data-visuals', objectData);

    }
};

// begin dateFormatFunction
function handlebarsFormatDateForDisplay(){
    Handlebars.registerHelper('dateFormat', function(context, block) {
        if (window.moment) {
            return takeTime(context);
        }else{
            return context;
        };
    });
};

// format date/time
function takeTime(dateInput) {
    var dateFormat = 'MMMM Do, YYYY';
    //var dateFormat = 'ddd., MMM., D, YYYY, h:mm a';
    var dateOutput = moment(dateInput).format(dateFormat);
    return dateOutput;
};

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = 'http://projects.scpr.org/static-files/v3-dependencies/templates/';
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');
        renderHandlebarsTemplate('templates/data-share.handlebars', '.data-share');
        renderHandlebarsTemplate('templates/data-details.handlebars', '.data-details');

        var checkExist = setInterval(function() {

            if (jqueryNoConflict('.header-links').length) {
                clearInterval(checkExist);
                initializeTemplates.hideEmbedBox();
            }

            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);
    },

    hideEmbedBox: function(){
        if (appConfig.embed_this === false){
            jqueryNoConflict('li.projects-embed').addClass('hidden');
        };
    },

    renderEmbedBox: function(){
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page. You may need to adjust the height parameter. <br /><br /> &lt;iframe src=\"'+ appConfig.embed_url_root +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){

        if (appConfig.openAboutThis === true){
            jqueryNoConflict('.text').collapse('show');
        };

        jqueryNoConflict('.text').on('shown.bs.collapse', function(){
            jqueryNoConflict('span.text').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.text').on('hidden.bs.collapse', function(){
            jqueryNoConflict('span.text').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.about').on('shown.bs.collapse', function(){
            jqueryNoConflict('span.about').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.about').on('hidden.bs.collapse', function(){
            jqueryNoConflict('span.about').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
    }
};