var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.constructCapitolWordsQuery('&phrase=obamacare');
    fn.retrievePhraseToQuery();
});

// begin data configuration object
var fn = {

    retrievePhraseToQuery: function(){
        jqueryNoConflict('#phrase-list a').click(function(){
            var phrase = jqueryNoConflict(this).attr('id').replace('_', '+');
            fn.constructCapitolWordsQuery('&phrase=' + phrase);
        });
    },

    // construct the url to query for data
    constructCapitolWordsQuery: function(phrase){
        var urlPrefix = 'http://capitolwords.org/api/1/text.json?apikey=b717252e9bc44d4ea57321c49e7dd5e8';
        var urlStartDate = '&start_date=2013-08-01';
        var urlEndDate = '&end_date=2013-10-30';
        var urlState = '&state=CA';
        var urlPhrase = phrase;
        var urlCallback = '&callback=?';
        var targetUrl = urlPrefix + urlStartDate + urlEndDate + urlState + urlPhrase + urlCallback;
        fn.retriveCapitolWordsData(targetUrl);
    },

    retriveCapitolWordsData: function(targetUrl){
        jqueryNoConflict.getJSON(targetUrl, fn.processCapitolWordsData);
    },

    processCapitolWordsData: function(data){

        var handlebarsData = {
            objects: data.results
        };

        Handlebars.registerHelper('dateFormat', function(context, block) {
            if (window.moment) {
                return fn.takeTime(context);
            }else{
                return context;
            };
        });

        renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);
    },

    takeTime: function(dateInput) {
        var dateFormat = 'MMM. D, 2013';
        var dateOutput = moment(dateInput).format(dateFormat);
        return dateOutput;
    },

};
// end data configuration object