// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/timelines/calderon-timeline/index.html/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};

$(document).ready(function() {

    $('#data-visuals').verticalTimeline({

        // spreadsheet key
        key: 'https://docs.google.com/spreadsheet/pub?key=0AjsyCVrBXivzdEtIckFjR25QNXZhOC1LdjI4bGJSZFE&output=html',

        // name of sheet on spreadsheet
        sheetName: 'sheet',

        // newest or oldest
        defaultDirection: 'newest',

        // collapsed or expanded
        defaultExpansion: 'expanded',

        // groupSegmentByYear or groupSegmentByDecade
        groupFunction: 'groupSegmentByYear',

        // adjust timeline width
        width: '75%'
    });

/*
    $.getJSON('static-files/data/dorner_display_sheet_timeline.json', function(data) {
        $('#data-visuals').verticalTimeline({

            data: data,

            // newest or oldest
            defaultDirection: 'newest',

            // collapsed or expanded
            defaultExpansion: 'expanded',

            // groupSegmentByYear or groupSegmentByDecade
            groupFunction: 'groupSegmentByYear',

            // adjust timeline width
            width: '65%'

        });
    });
*/

});