var jqueryNoConflict = jQuery;
var map;
var trafficInfo;

// begin function
function createMap(){
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("content-map-canvas"));
        map.setMapType(G_NORMAL_MAP);
        map.setCenter(new GLatLng(34.078219,-118.265183), 10);
        map.setUIToDefault();
        var trafficOptions = {incidents:true};
        trafficInfo = new GTrafficOverlay(trafficOptions);
        map.addOverlay(trafficInfo);
    }
};