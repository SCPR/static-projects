var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.retrieveLegislatorLocalDetails();
    fn.constructCapitolWordsQuery('government+shutdown');
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
            jqueryNoConflict('#data-visuals').html(
                '<div id="data-loading">' +
                    '<span><img src="static-files/images/loader.gif" width="100%" /></span>' +
                '</div>');
            fn.constructCapitolWordsQuery(phrase);
        });
    },

    // construct the url to query for data
    constructCapitolWordsQuery: function(phrase){
        var urlPhrasesPrefix = 'http://capitolwords.org/api/1/text.json?apikey=b717252e9bc44d4ea57321c49e7dd5e8';
        var urlInstancesPrefix = 'http://capitolwords.org/api/1/phrases/party.json?apikey=b717252e9bc44d4ea57321c49e7dd5e8';
        var urlStartDate = '&start_date=2013-08-01';
        var urlEndDate = '&end_date=2013-10-30';
        var urlState = '&state=CA';
        var urlPhrase = '&phrase=' + phrase;
        var urlCallback = '&callback=?';
        var targetPhrasesUrl = urlPhrasesPrefix + urlStartDate + urlEndDate + urlState + urlPhrase + urlCallback;
        var targetInstancesUrl = urlInstancesPrefix + urlStartDate + urlEndDate + urlState + urlPhrase + urlCallback;
        fn.retriveCapitolWordsData(targetPhrasesUrl, targetInstancesUrl);
        fn.displayPhraseHeadline(phrase);
    },

    retriveCapitolWordsData: function(targetPhrasesUrl, targetInstancesUrl){
        jqueryNoConflict.getJSON(targetPhrasesUrl, fn.processCapitolPhrasesData);
        //jqueryNoConflict.getJSON(targetInstancesUrl, fn.processCapitolInstancesData);
    },

    processCapitolInstancesData: function(data){

        console.log(data.results[0]);

        for(var y=0; y<data.results.length; y++){
            if (data.results[y].party === 'D'){
                var demsTotal = data.results[y].count;
                jqueryNoConflict('#total-democrat-instances').html(data.results[y].count);
            } else if (data.results[y].party === 'R'){
                var gopTotal = data.results[y].count;
                jqueryNoConflict('#total-republican-instances').html(data.results[y].count);
            }
        }

    },

    processCapitolPhrasesData: function(data){

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

        var sortedObjectOfLegislators = _.chain(fn.objectOfLegislators.objects)
            .map(fn.to_date)
            .sortBy(fn.desc_start_time)
            .value();

        var handlebarsData = {
            objects: sortedObjectOfLegislators
        };

        Handlebars.registerHelper('dateFormat', function(context, block) {
            if (window.moment) {
                return fn.takeTime(context);
            } else {
                return context;
            };
        });

        renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);

        jqueryNoConflict('.speech-text').waitUntilExists(function(){
            var phraseToHighlight = jqueryNoConflict('#display-phrase').text();
            jqueryNoConflict('.speech-text p').highlight(phraseToHighlight);
        });

    },

    displayPhraseHeadline: function(phrase) {
        var adjustedPhrase = phrase.replace('+', ' ');
        jqueryNoConflict('#phrase-headline').html('<h3>... to read what the California Congressional delegation has said about <span id="display-phrase">' + fn.toTitleCase(adjustedPhrase) + '</span></h3>');
    },

    takeTime: function(dateInput) {
        var dateFormat = 'MMM. D, 2013';
        var dateOutput = moment(dateInput).format(dateFormat);
        return dateOutput;
    },

    toTitleCase: function(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },

    to_date: function(o) {
        var parts = o.date.split('-');
        o.date = new Date(parts[0], parts[1] - 1, parts[2]);
        return o;
    },

    desc_start_time: function(o) {
        return -o.date.getTime();
    }

};
// end data configuration object