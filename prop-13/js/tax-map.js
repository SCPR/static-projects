const addCommas = d3.format(',');


mapboxgl.accessToken = 'pk.eyJ1Ijoia3BjY2RhdGFkZXNrIiwiYSI6ImNqbmFsZ2YwNzF4engzcW1zand5aHJjdWwifQ.kormZpU5hXqeeLIokiRHlg';
const map = new mapboxgl.Map({
  container: "tax-map",
  style: "mapbox://styles/mapbox/light-v9",
  zoom: 9,
  center: [-122.27466,37.80341]
});


map.addControl(new mapboxgl.NavigationControl());
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

const geocoder = new MapboxGeocoder({accessToken: mapboxgl.accessToken});
map.addControl(geocoder, 'top-left');

// map.addControl(geocoder);

map.on('load', function() {

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

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
      });

      map.addSource('tracts', { type: 'geojson', data: '../data/filtered-tracts.json' });

      map.addLayer({
        id: "tracts",
        type: "fill",
        source: 'tracts',
        layout: {
          visibility: 'visible',
        },
        'paint': {
            'fill-opacity': 0.8,
            'fill-outline-color': '#fff',
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Prop13Savings'],
                -15000000,'#ffffe0',
                -10000000, '#ffd59b',
                -5000000, '#ffa474',
                5000000, '#f47461',
                10000000, '#db4551',
                20000000, '#8b0000'
            ],
            // 'fill-color': {
            //  property: 'Prop13Savings',
            //  stops: [[-15000000,"#ffffe0"],[-10000000,"#ffd59b"],[-5000000,"#ffa474"],[5000000,"#f47461"],[10000000,"#db4551"],[20000000,"#8b0000"]],
            // }
        },
    });


    map.addLayer({
      id: "tractsHighlighted",
      type: "fill",
      source: 'tracts',
      "paint": {
        "fill-outline-color": "#484896",
        "fill-color": "#6e599f",
        "fill-opacity": 0.75
      },
      "filter": ["in", "GEOID", ""]
    });


    map.on('click', 'tracts', function (e) {
      const feature = e.features[0];
      let html = `
          <strong>Census tract no. ${feature.properties.CensusTract}</strong><br/>
          Located in ${feature.properties.CountyName}<br/><br/>

          What homeowners paid under Prop 13: <strong>$${addCommas(feature.properties.TotalTaxesPaid)}</strong><br/><br/>

          Tax savings per home: <strong>$${addCommas(feature.properties.SavingsPerUnit)}</strong><br/>
          Total tax savings under Prop. 13: <strong>$${addCommas(feature.properties.Prop13Savings)}</strong><br/><br/>

          Avg. assessed value: <strong>$${addCommas(feature.properties.AverageAdjustedAssessedValue)}</strong><br/>
          Avg. market value: <strong>$${addCommas(feature.properties.AverageMarketValue)}</strong><br/><br/>

          Effective tax rate: <strong>${feature.properties.EffectiveTaxRate}</strong><br/>
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
