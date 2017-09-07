window.appConfig = {

    // general configs
    open_about_this: false,
    comments: false,
    is_mobile: null,
    project_root: "https://projects.scpr.org/internal/tools/static-map-generator/",
    embed_this: false,
    is_embedded: null,
    embed_width: "100%",
    embed_height: "1650px",
    twitter_share_text: "Map: View a county-by-county breakdown of whooping cough cases in California so far in 2014",

    mapOptions: {
        // map configs
        mapType: null,
        selectedColor: "",
        colorButtons: {},
        initial_map_zoom: 10,
        map_center_los_angeles: new google.maps.LatLng(34.0204989,-118.4117325),
        map_center_lat: parseFloat(34.0204989),
        map_center_lng: parseFloat(-118.4117325),
        colors: ["#FF0000", "#0000FF", "#00FF00", "#ffffff", "#000000"],
        sizeParams: "640x400",
        route: "initial",
        container: ".content-map-data",
        mapDiv: "content-map-canvas",
        mapLayerId: "ROADMAP",
    }
};
