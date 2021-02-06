/* eslint-disable */
// get location data of the tour that we are currently trying to display
// which will take in the array of locations
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWFuc3VuIiwiYSI6ImNrangxNWRhOTBvMjkyb2xjamN3NjlrbTIifQ.8O7B-NQvK7gX_-GBt4fvRg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/aansun/ckjx26wl41dg017phv97q3wcv',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 9,
    // interactive: false,
    // keyboard: true,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend Map bounds to include the current location
    bounds.extend(loc.coordinates);

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 130,
        left: 100,
        right: 100,
      },
    });
  });
};

// Again, index.js is more for getting data from the user interface (website), and then delegating some actions into these other modules
