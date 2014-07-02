// begin main function
$(document).ready(function() {
    createMap();
});

// create the map
function createMap(){
    var map = L.map('map').setView([37.853742, -121.028776], 6);
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/evieliu.ihdmd273/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);

    combineDataWithShapeFeatures(map);

}

function combineDataWithShapeFeatures(map){
    for (var i = 0; i<ca_county.features.length; i++){
        console.log(ca_county.features[i].properties);
        ca_county.features[i].properties.cases_2011 = 43;
    };




    //L.geoJson(ca_county, {
        //style: style
    //}).addTo(map);

    //console.log(ca_county.features[0].properties.name);

    //getData();

}

function style(feature) {
    return {
        //fillColor: getColor(feature.properties.data_OneRate),
        fillColor: '',
        weight: 0.3,
        opacity: 1,
        color: 'black',
        //dashArray: '3',
        fillOpacity: 0
    };
}

// get cough data
function getWhoopingCoughData(){
    $.getJSON("data/data.json", returnWhoopingCoughData);
}

function returnWhoopingCoughData(data){
    console.log(data);
    return data;
}
