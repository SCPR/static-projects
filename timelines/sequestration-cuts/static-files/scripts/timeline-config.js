$(document).ready(function() {

    $('#data-visuals').verticalTimeline({

        // spreadsheet key
        key: 'https://docs.google.com/spreadsheet/pub?key=0ApI9xmBd0kPzdHRycHZvcjlBbFQ1LWc5YTQzVnR4cEE&output=html',

        // name of sheet on spreadsheet
        sheetName: 'Posts',

        // newest or oldest
        defaultDirection: 'newest',

        // collapsed or expanded
        defaultExpansion: 'expanded',

        // groupSegmentByYear or groupSegmentByDecade
        groupFunction: 'groupSegmentByYear',

        // adjust timeline width
        width: '65%'
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