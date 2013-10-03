// open congress url
// http://congress.api.sunlightfoundation.com/legislators?apikey=b717252e9bc44d4ea57321c49e7dd5e8&bioguide_id=G000559&all_legislators=true

var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.constructCapitolWordsQuery('obamacare');
    fn.retrievePhraseToQuery();
});

// begin data configuration object
var fn = {

    retrievePhraseToQuery: function(){
        jqueryNoConflict('#phrase-list a').click(function(){
            var phrase = jqueryNoConflict(this).attr('id').replace('_', '+');
            fn.constructCapitolWordsQuery(phrase);
        });
    },

    // construct the url to query for data
    constructCapitolWordsQuery: function(phrase){
        var urlPrefix = 'http://capitolwords.org/api/1/text.json?apikey=b717252e9bc44d4ea57321c49e7dd5e8';
        var urlStartDate = '&start_date=2013-08-01';
        var urlEndDate = '&end_date=2013-10-30';
        var urlState = '&state=CA';
        var urlPhrase = '&phrase=' + phrase;
        var urlCallback = '&callback=?';
        var targetUrl = urlPrefix + urlStartDate + urlEndDate + urlState + urlPhrase + urlCallback;
        fn.retriveCapitolWordsData(targetUrl);
        fn.displayPhraseHeadline(phrase);
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

    displayPhraseHeadline: function(phrase) {
        var adjustedPhrase = phrase.replace('+', ' ');
        jqueryNoConflict('#phrase-headline').html('<h2>What they\'re saying about ' + fn.toTitleCase(adjustedPhrase) + '</h2>');
    },

    takeTime: function(dateInput) {
        var dateFormat = 'MMM. D, 2013';
        var dateOutput = moment(dateInput).format(dateFormat);
        return dateOutput;
    },

    toTitleCase: function(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

};
// end data configuration object