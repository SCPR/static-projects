
mapboxgl.accessToken = 'pk.eyJ1Ijoia3BjY2RhdGFkZXNrIiwiYSI6ImNqbmFsZ2YwNzF4engzcW1zand5aHJjdWwifQ.kormZpU5hXqeeLIokiRHlg';
const map = new mapboxgl.Map({
  container: "revenue-map",
  style: "mapbox://styles/mapbox/light-v9",
  zoom: 5,
  center: [-119.44944,37.16611]
});

const controls = new mapboxgl.NavigationControl();
map.addControl(controls,'bottom-left');

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();


map.on('load', function() {

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
      });

      map.addSource('counties', { type: 'geojson', data: 'counties.geojson' });

      map.addLayer({
        id: "counties",
        type: "fill",
        source: 'counties',
        layout: {
          visibility: 'visible',
        },
        'paint': {
            'fill-opacity': 0.75,
            'fill-outline-color': '#fff',
            'fill-color': '#a27299',
            // 'fill-color': [
            //     'interpolate',
            //     ['linear'],
            //     ['get', 'estimatedRevenue'],
            //     100,'#fff6cd',
            //     300, '#f6e0b1',
            //     500, '#a27299',
            //     700, '#794c8a',
            //     900, '#271642',
            //     1000, '#212121'
            // ],
        },
    });


    map.addLayer({
      id: "countiesHighlighted",
      type: "fill",
      source: 'counties',
      "paint": {
        "fill-outline-color": "#212121",
        "fill-color": "#797979",
        "fill-opacity": 0.75
      },
      "filter": ["in", "CA_counties_GEOID", ""]
    });


    map.on('click', 'counties', function (e) {
      const feature = e.features[0];
      let html = `

          <strong>${feature.properties.CA_counties_NAMELSAD}</strong><br/>
          Estimated revenue gains per capita: <strong>$${feature.properties.estimatedRevenue}</strong>

      `;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(html)
            .addTo(map);

      // set bbox as 5px reactangle area around clicked point
      var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      var features = map.queryRenderedFeatures(bbox, { layers: ['counties'] });

      // Run through the selected features and set a filter
      // to match features in order to activate
      // the `countiesHighlighted` layer.
      var filter = features.reduce(function(memo, feature) {
          memo.push(feature.CA_counties_GEOID);
          return memo;
      }, ['in', 'CA_counties_GEOID']);

      map.setFilter("countiesHighlighted", filter);
    });

    // Change the cursor to a pointer when the mouse is over the counties layer.
    map.on('mouseenter', 'counties', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'counties', function () {
        map.getCanvas().style.cursor = '';
    });

});