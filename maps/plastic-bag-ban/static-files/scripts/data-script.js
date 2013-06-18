var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.writeMapToCanvas();
});

// begin data configuration object
var fn = {

    // pull the data from the flat file
    writeMapToCanvas: function(){
        var map = L.mapbox.map('map', 'kpccdatadesk.map-h4s7073q',{
            center: [34.201,-118.305],
            zoom: 10,
            minZoom: 9,
            maxZoom: 12,
        });
    }
};
// end data configuration object