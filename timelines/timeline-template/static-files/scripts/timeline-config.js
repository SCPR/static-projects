var jqueryNoConflict = jQuery;
var fn = fn || {};

// choose spreadsheet or flat-file
var timelineDataSource = 'spreadsheet';

// example spreadsheet key
var timelineDataSourceKey = '0An8W63YKWOsxdEVHUDliRmZFMC1ZOWZhVUZFMEp6TUE';

// example path to file
var timelineDataSourceFile = 'static-files/data/template-timelines_timeline.json';

jqueryNoConflict(document).ready(function() {
    fn.displayTimelineFromData(timelineDataSource)
    fn.retrieveTabletopData();

    // handlebars helper to encode a url
    function handlebarsEncodeUrl(){
        Handlebars.registerHelper('encode', function(context, options) {
            var out = encodeURIComponent(context);
            return out;
        });
    };
});

// begin data configuration object
var fn = {

    displayTimelineFromData: function(source){
        if (source === 'spreadsheet'){
            fn.timelineFromSpreadsheet(timelineDataSourceKey);
        } else if (source === 'flat-file'){
            fn.timelineFromFlatfile(timelineDataSourceFile);
        } else {
            fn.timelineFromSpreadsheet();
        }
    },

    retrieveTabletopData: function(){
        Tabletop.init({
            key: timelineDataSourceKey,
            callback: fn.displayData,
            simpleSheet: false
        });
    },

    displayData: function(data, tabletop){

        var handlebarsData = {
            objects: data.MetaData.elements
        };

        fn.embedUrl.pathToTimeline = data.MetaData.elements[0].url;

        renderHandlebarsTemplate('static-files/templates/data-share.handlebars', '#data-share', handlebarsData);
        renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details', handlebarsData);
        renderHandlebarsTemplate('static-files/templates/data-footer.handlebars', '#data-footer', handlebarsData);
    },

    timelineFromSpreadsheet: function(timelineDataSourceKey){

        jqueryNoConflict('#data-visuals').verticalTimeline({

            // spreadsheet key
            key: timelineDataSourceKey,

            // name of sheet on spreadsheet
            sheetName: 'Posts',

            // newest or oldest
            defaultDirection: 'oldest',

            // collapsed or expanded
            defaultExpansion: 'expanded',

            // groupSegmentByYear or groupSegmentByDecade
            groupFunction: 'groupSegmentByYear',

            // adjust timeline width
            width: '75%'
        });
    },

    timelineFromFlatfile: function(timelineDataSourceFile){

        jqueryNoConflict.getJSON(timelineDataSourceFile, function(data) {
            $('#data-visuals').verticalTimeline({

                data: data,

                // newest or oldest
                defaultDirection: 'oldest',

                // collapsed or expanded
                defaultExpansion: 'expanded',

                // groupSegmentByYear or groupSegmentByDecade
                groupFunction: 'groupSegmentByYear',

                // adjust timeline width
                width: '75%'

            });
        });
    },

    embedUrl: {
        pathToTimeline: null
    },

    embedBox: function(){
        var embed_url = fn.embedUrl.pathToTimeline + 'iframe.html';
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    }
}