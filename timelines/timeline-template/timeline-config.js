var jqueryNoConflict = jQuery;

jqueryNoConflict(document).ready(function() {

    jqueryNoConflict('#timeline-title').html(
        '<h4 class="kicker">Curated Timeline</h4>' +
        '<h1>The search for Christopher Dorner</h1>');

    jqueryNoConflict('#data-visuals').verticalTimeline({

        // spreadsheet key
        key: 'https://docs.google.com/spreadsheet/pub?key=0An8W63YKWOsxdExVR0JPcENEaUJ4cGtWNXJNYkJ3MWc&output=html',

        // name of sheet on spreadsheet
        sheetName: 'breaking_display_sheet',

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
    jqueryNoConflict.getJSON('dorner_display_sheet_timeline.json', function(data) {
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