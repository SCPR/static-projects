var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var embed_url_root = 'http://projects.scpr.org/static/charts/congressional-speeches-on-government-shutdown/';

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
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
        jqueryNoConflict.getJSON('data/ca_congressional_lookup_handlebars.json', function(data){
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
        jqueryNoConflict('.data-legend a').click(function(){
            var phrase = jqueryNoConflict(this).attr('id').replace('_', '+');
            jqueryNoConflict('.data-visuals').html(
                '<div id="data-loading" class="progress progress-striped active">' +
                    '<div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>' +
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
        jqueryNoConflict.getJSON(targetInstancesUrl, fn.processCapitolInstancesData);
    },

    processCapitolInstancesData: function(data){
        var demsTotal;
        var gopTotal;
        var overallInstances;
        jqueryNoConflict('#total-overall-instances').empty();
        jqueryNoConflict('#total-democrat-instances').empty();
        jqueryNoConflict('#total-republican-instances').empty();

        if (data.results.length === 2){
            for(var y=0; y<data.results.length; y++){
                if (data.results[y].party === 'D'){
                    demsTotal = data.results[y].count;
                    jqueryNoConflict('#total-democrat-instances').html(
                        'Spoken ' + demsTotal + ' times by California Democrats. ');
                } else {
                    gopTotal = data.results[y].count;
                    jqueryNoConflict('#total-republican-instances').html(
                        'Spoken ' + gopTotal + ' times by California Republicans.');
                }
            }
            overallInstances = demsTotal + gopTotal;

        } else {

            for(var y=0; y<data.results.length; y++){
                if (data.results[y].party === 'D'){
                    demsTotal = data.results[y].count;
                    jqueryNoConflict('#total-democrat-instances').html(
                        'Spoken ' + demsTotal + ' times by California Democrats. ');
                }
            }

            jqueryNoConflict('#total-republican-instances').html(
                'Spoken 0 times by California Republicans.');

            overallInstances = demsTotal + 0;
        }

        jqueryNoConflict('#total-overall-instances').html(
            'Found ' + overallInstances + ' instances. ');
    },

    processCapitolPhrasesData: function(data){

        // clear the container
        fn.objectOfLegislators.objects = [];

        // build an object
        for(var x=0; x<data.results.length; x++){

            var instanceOfLegislatorSpeaking = {
                number: data.results[x].number,
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

        renderHandlebarsTemplate('templates/content-action-bar.handlebars', '#content-action-bar', handlebarsData);
        renderHandlebarsTemplate('templates/data-visuals.handlebars', '.data-visuals', handlebarsData);

        jqueryNoConflict('.speech-text').waitUntilExists(function(){
            var phraseToHighlight = jqueryNoConflict('#display-phrase').text();
            jqueryNoConflict('.speech-text p').highlight(phraseToHighlight);
        });

    },

    displayPhraseHeadline: function(phrase) {
        var adjustedPhrase = phrase.replace('+', ' ');
        jqueryNoConflict('#phrase-headline').html('<h2 class="centered"><span id="display-phrase">' + fn.toTitleCase(adjustedPhrase) + '</span></h2>');
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

}
// end data configuration object

// scroll into view function
function scrollToRep(){
    jqueryNoConflict('div').removeClass('content-scroll-to');
    var congressionalMember = jqueryNoConflict('#search-congressional-delegation').val();
    jqueryNoConflict(congressionalMember).addClass('content-scroll-to');
    jqueryNoConflict.scrollTo(congressionalMember)
};

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = 'http://projects.scpr.org/static/static-files/v3-dependencies/templates/';
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');
        renderHandlebarsTemplate('templates/data-share.handlebars', '.data-share');
        renderHandlebarsTemplate('templates/data-details.handlebars', '.data-details');

        var checkExist = setInterval(function() {
            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);

    },

    renderEmbedBox: function(){
        var embed_url = embed_url_root + '/iframe.html';
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){
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
}
// end template rendering object