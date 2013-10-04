// open congress url
// http://congress.api.sunlightfoundation.com/legislators?apikey=b717252e9bc44d4ea57321c49e7dd5e8&bioguide_id=G000559&all_legislators=true

var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.retrieveLegislatorLocalDetails();
    fn.constructCapitolWordsQuery('obamacare');
    fn.retrievePhraseToQuery();
});

// begin data configuration object
var fn = {

    objectOfLegislators: {
        objects: []
    },

    ArrayOfLegislatorLocalDetails: [],

    retrieveLegislatorLocalDetails: function() {
        jqueryNoConflict.getJSON('static-files/data/ca_congressional_lookup_handlebars.json', function(data){
            fn.ArrayOfLegislatorLocalDetails = data.objects;
        });
    },

    evaluateLocalDetailsForImage: function(bioguide_id){
        var imageUrl = _.where(fn.ArrayOfLegislatorLocalDetails, {bioguideid: bioguide_id});
        return imageUrl[0].imageurl;
    },

    evaluateLocalDetailsForReference: function(bioguide_id){
        var fullReference = _.where(fn.ArrayOfLegislatorLocalDetails, {bioguideid: bioguide_id});
        return fullReference[0].fullreference;
    },

    retrievePhraseToQuery: function(){
        jqueryNoConflict('#data-legend a').click(function(){
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

        console.log(data);

        // clear the container
        fn.objectOfLegislators.objects = [];

        // build an object
        for(var x=0; x<data.results.length; x++){

            var instanceOfLegislatorSpeaking = {
                bioguide_id: data.results[x].bioguide_id,
                speaker_first: data.results[x].speaker_first,
                speaker_last: data.results[x].speaker_last,
                speaker_party: data.results[x].speaker_party,
                title: fn.toTitleCase(data.results[x].title),
                origin_url: data.results[x].origin_url,
                date: data.results[x].date,
                chamber: data.results[x].chamber,
                speaker_image_url: fn.evaluateLocalDetailsForImage(data.results[x].bioguide_id),
                speaker_reference: fn.evaluateLocalDetailsForReference(data.results[x].bioguide_id),
                speaking: data.results[x].speaking
            };

            // add to container
            fn.objectOfLegislators.objects.push(instanceOfLegislatorSpeaking);
        }

        var handlebarsData = {
            objects: fn.objectOfLegislators.objects
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
        jqueryNoConflict('#phrase-headline').html('<h3>... to read what the California Congressional delegation has said about ' + fn.toTitleCase(adjustedPhrase) + '</h3>');
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