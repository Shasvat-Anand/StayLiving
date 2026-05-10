
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [77.20, 28.61], // starting position [lng, lat]
    zoom: 9 // starting zoom
}); 