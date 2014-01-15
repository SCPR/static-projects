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

        console.log(targetUrl);
        jqueryNoConflict.getJSON(targetUrl, fn.createObjectsFrom);
    },

    replaceQuerySpacesWith: function(string, character){
        var output = string.replace(/\s/g, character);
        return output;
    },

    createObjectsFrom: function(data){
        var arrayOfContentIds = [];

        for (var i = 0; i < data.length; i++) {
            var contentId = data[i].id;
            arrayOfContentIds.push(contentId);
        }

       //console.log(arrayOfContentIds);
       //console.log(kpccApiConfig.ignore);


       var test = kpccApiConfig.ignore.concat(arrayOfContentIds)
       console.log(test);

        var uniqueNames = [];
        jqueryNoConflict.each(test, function(i, el){
            if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });

        console.log(uniqueNames);

    },



};
// end fn