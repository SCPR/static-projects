var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function(){
    fn.constructQueryUrl();
});

// begin fn
var fn = {

    // construct the url to query for data
    constructQueryUrl: function(){
        var urlPrefix = 'http://www.scpr.org/api/v2/content/?';
        var urlTypes = 'types=' + fn.replaceQuerySpacesWith(kpccApiConfig.types, '');
        var urlQuery = '&query=' + fn.replaceQuerySpacesWith(kpccApiConfig.query, '+');
        var urlLimit = '&limit=' + kpccApiConfig.limit;
        var urlPage = '&page=' + kpccApiConfig.page;
        var targetUrl = urlPrefix + urlTypes + urlQuery + urlLimit + urlPage;
        fn.retrieveApiData(targetUrl);
    },

    retrieveApiData: function(targetUrl){
        jqueryNoConflict.getJSON(targetUrl, fn.createArrayFrom);
    },

    replaceQuerySpacesWith: function(string, character){
        var output = string.replace(/\s/g, character);
        return output;
    },

    createArrayFrom: function(data){
        for (var i = 0; i < data.length; i++) {
            var contentObject = {
                full_image: data[i].assets[0]['full']['url'],
                large_image: data[i].assets[0]['large']['url'],
                small_image: data[i].assets[0]['small']['url'],
                body: data[i].body,
                byline: data[i].byline,
                id: data[i].id,
                permalink: data[i].permalink,
                public_url: data[i].public_url,
                published_at: data[i].published_at,
                short_title: data[i].short_title,
                teaser: data[i].teaser,
                thumbnail: data[i].thumbnail,
                title: data[i].title,
            };
            jqueryNoConflict(kpccApiConfig.contentContainer).append(_.template(kpccApiConfig.contentTemplate, contentObject));
        }
    }
}
// end fn