// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var map;
var infowindow;
var countries;
var autocomplete;
var countryRestrict = {'country': 'tw'};
var markers = [];
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
function initMap() {
    if (navigator.geolocation)
    {
        // HTML5 定位抓取
        navigator.geolocation.getCurrentPosition(function (position) {
            countries = {
                'tw':{
                    center: {lat: position.coords.latitude, lng: position.coords.longitude},
                    zoom: 9
                }
            };
            map = new google.maps.Map(document.getElementById('map'), {
                center: countries['tw'].center,
                zoom: countries['tw'].zoom
            });
        });
        autocomplete = new google.maps.places.Autocomplete(
            (
                document.getElementById('autocomplete')), {
                types: ['establishment'],
                componentRestrictions: countryRestrict
            });

        autocomplete.addListener('place_changed', onPlaceChanged);

    }
}
function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(17);
        //search();
        clearMarkers();
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (0 % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.

        markers[0] = new google.maps.Marker({
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: markerIcon
        });

        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        //google.maps.event.addListener(markers[0], 'click', showInfoWindow);
        setTimeout(dropMarker(0), 0 * 100);
    } else {
        document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
}
function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}
function dropMarker(i) {
    return function() {
        markers[i].setMap(map);
    };
}