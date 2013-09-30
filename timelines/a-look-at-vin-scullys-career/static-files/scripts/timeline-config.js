// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/timelines/moments-in-giants-dodgers-rivalry/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"700px\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};

$(document).ready(function() {

    $('#data-visuals').verticalTimeline({

        // spreadsheet key
        key: 'https://docs.google.com/spreadsheet/pub?key=0Aq8qwSArzKP9dHM2ZUhPaVVqaV9RYnZxV1R2Qy1jTEE&output=html',

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

/*
    $.getJSON('static-files/data/moments-in-giants-godgers-rivalry_timeline.json', function(data) {
        $('#data-visuals').verticalTimeline({

            data: data,

            // newest or oldest
            defaultDirection: 'oldest',

            // collapsed or expanded
            defaultExpansion: 'expanded',

            // groupSegmentByYear or groupSegmentByDecade
            groupFunction: 'groupSegmentByDecade',

            // adjust timeline width
            width: '75%'

        });
    });
*/

});