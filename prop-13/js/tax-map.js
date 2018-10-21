const addCommas = d3.format(',');


mapboxgl.accessToken = 'pk.eyJ1Ijoia3BjY2RhdGFkZXNrIiwiYSI6ImNqbmFsZ2YwNzF4engzcW1zand5aHJjdWwifQ.kormZpU5hXqeeLIokiRHlg';
const map = new mapboxgl.Map({
  container: "tax-map",
  style: "mapbox://styles/mapbox/light-v9",
  zoom: 9,
  center: [-122.27466,37.80341]
});

$('.zoom-btn[data-city="SF"]').click(function(){
   map.flyTo({center: [-122.27466,37.80341]});
});

$('.zoom-btn[data-city="LA"]').click(function(){
   map.flyTo({center: [-118.24363,34.24368]});
});

$('.zoom-btn[data-city="Sac"]').click(function(){
   map.flyTo({center: [-121.4944,38.58157]});
});

$('.zoom-btn[data-city="SD"]').click(function(){
   map.flyTo({center: [-117.15726,32.71533]});
});

const geocoder = new MapboxGeocoder({accessToken: mapboxgl.accessToken});

  if ($(window).width() > 800){
      map.addControl(geocoder, 'top-right');
  } else {
    map.addControl(geocoder, 'bottom-left');
  }


// map.addControl(new mapboxgl.NavigationControl({position: 'bottom-left'}));
const controls = new mapboxgl.NavigationControl();
map.addControl(controls,'bottom-left');

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();


map.on('load', function() {

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
      });

      map.addSource('tracts', { type: 'geojson', data: '../prop-13/data/filtered-tracts.json' });

      map.addLayer({
        id: "tracts",
        type: "fill",
        source: 'tracts',
        layout: {
          visibility: 'visible',
        },
        'paint': {
            'fill-opacity': 0.75,
            'fill-outline-color': '#fff',
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Prop13Savings'],
                -15000000,'#fff6cd',
                -10000000,'#ff0000',
                1000000, '#a27299',
                3000000, '#794c8a',
                6000000, '#271642',
                20000000, '#212121'
            ],
        },
    });


    map.addLayer({
      id: "tractsHighlighted",
      type: "fill",
      source: 'tracts',
      "paint": {
        "fill-outline-color": "#212121",
        "fill-color": "#797979",
        "fill-opacity": 0.75
      },
      "filter": ["in", "GEOID", ""]
    });

    // After the map style has loaded on the page, add a source layer and default
    // styling for a single point.
      map.addSource('single-point', {
          "type": "geojson",
          "data": {
              "type": "FeatureCollection",
              "features": []
          }
      });

      map.addLayer({
          "id": "point",
          "source": "single-point",
          "type": "circle",
          "paint": {
              "circle-radius": 10,
              "circle-color": "#007cbf"
          }
      });

      // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
      // makes a selection and add a symbol that matches the result.
      geocoder.on('result', function(ev) {
          map.getSource('single-point').setData(ev.result.geometry);
      });


    map.on('click', 'tracts', function (e) {
      const feature = e.features[0];
      let html = `


          Total tax savings/revenue lost under Prop. 13: <strong>$${addCommas(feature.properties.Prop13Savings)}</strong><br/>
          Tax savings/revenue lost per home: <strong>$${addCommas(feature.properties.SavingsPerUnit)}</strong><br/>

          Effective tax rate: <strong>${feature.properties.EffectiveTaxRate}%</strong><br/><br/>

          Census tract ${feature.properties.GEOID}<br/>
          Located in ${feature.properties.CountyName}<br/><br/>

          Avg. assessed value: <strong>$${addCommas(feature.properties.AverageAdjustedAssessedValue)}</strong><br/>
          Avg. market value: <strong>$${addCommas(feature.properties.AverageMarketValue)}</strong>
      `;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(html)
            .addTo(map);

      // set bbox as 5px reactangle area around clicked point
      var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      var features = map.queryRenderedFeatures(bbox, { layers: ['tracts'] });

      // Run through the selected features and set a filter
      // to match features with unique council district numbers to activate
      // the `tractsHighlighted` layer.
      var filter = features.reduce(function(memo, feature) {
          memo.push(feature.properties.TRACTCE);
          return memo;
      }, ['in', 'GEOID']);

      map.setFilter("tractsHighlighted", filter);
    });

    // Change the cursor to a pointer when the mouse is over the tracts layer.
    map.on('mouseenter', 'tracts', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'tracts', function () {
        map.getCanvas().style.cursor = '';
    });

});
