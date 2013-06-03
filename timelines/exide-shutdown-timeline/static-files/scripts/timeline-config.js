// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/timelines/exide-shutdown-timeline/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"700px\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};

$(document).ready(function() {

/*
    $('#data-visuals').verticalTimeline({

        // spreadsheet key
        key: 'https://docs.google.com/spreadsheet/pub?key=0Aq8qwSArzKP9dEcyNW9TS3V3NVdCM3hOMFpYZHVhcmc&output=html',

        // name of sheet on spreadsheet
        sheetName: 'exide',

        // newest or oldest
        defaultDirection: 'newest',

        // collapsed or expanded
        defaultExpansion: 'expanded',

        // groupSegmentByYear or groupSegmentByDecade
        groupFunction: 'groupSegmentByYear',

        // adjust timeline width
        width: '75%'
    });
*/

    $.getJSON('static-files/data/exide_shutdown_timeline-timeline.json', function(data) {
        $('#data-visuals').verticalTimeline({

            data: data,

            // newest or oldest
            defaultDirection: 'newest',

            // collapsed or expanded
            defaultExpansion: 'expanded',

            // groupSegmentByYear or groupSegmentByDecade
            groupFunction: 'groupSegmentByYear',

            // adjust timeline width
            width: '75%'

        });
    });


});