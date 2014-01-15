var jqueryNoConflict = jQuery;
var kpccApiDisplay = kpccApiDisplay || {};

// begin main function
jqueryNoConflict(document).ready(function(){
    kpccApiDisplay.constructQueryUrl();
});

// begin kpccApiDisplay
var kpccApiDisplay = {

    // construct the url to query for data
    constructQueryUrl: function(){
        var urlPrefix = 'http://www.scpr.org/api/v2/content/?';
        var urlTypes = 'types=' + kpccApiDisplay.replaceQuerySpacesWith(kpccApiConfig.types, '');
        var urlQuery = '&query=' + kpccApiDisplay.replaceQuerySpacesWith(kpccApiConfig.query, '+');
        var urlLimit = '&limit=' + kpccApiConfig.limit;
        var urlPage = '&page=' + kpccApiConfig.page;
        var targetUrl = urlPrefix + urlTypes + urlQuery + urlLimit + urlPage;
        kpccApiDisplay.retrieveApiData(targetUrl);
    },

    retrieveApiData: function(targetUrl){
        jqueryNoConflict.getJSON(targetUrl, kpccApiDisplay.createArrayFrom);
    },

    replaceQuerySpacesWith: function(string, character){
        var output = string.replace(/\s/g, character);
        return output;
    },

    createArrayFrom: function(data){

        // begin loop
        for (var i = 0; i < data.length; i++) {
            var full_image = data[i].assets[0]['full']['url']
            var large_image = data[i].assets[0]['large']['url']
            var small_image = data[i].assets[0]['small']['url']
            var body = data[i].body;
            var byline = data[i].byline;
            var id = data[i].id;
            var permalink = data[i].permalink;
            var public_url = data[i].public_url;
            var published_at = data[i].published_at;
            var short_title = data[i].short_title;
            var teaser = data[i].teaser;
            var thumbnail = data[i].thumbnail;
            var title = title;

            // write data to div
            jqueryNoConflict(kpccApiConfig.contentContainer).append(
                '<section class="cbase offlead">' +
                    '<div class="row-fluid">' +
                        '<div class="span7">' +
                            '<div id="article-list-image" class="contentasset"><img src="' + full_image + '" /></div>' +
                        '</div>' +
                        '<div class="span17">' +
                            '<div id="article-list-headline">' +
                                '<a href=\"' + permalink + '\">' + title + '</a> (<em>' + byline + '</em>)<br />' +
                                '<p>' + teaser + '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</section>');
        }
       // end loop
    }
};
// end kpccApiDisplay