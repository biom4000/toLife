// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {
    if (navigator.geolocation)
    {
        // HTML5 定位抓取
        navigator.geolocation.getCurrentPosition(function (position) {
            var mylatlng = position.coords.latitude+', '+position.coords.longitude;
            var latlngStr = mylatlng.split(',', 2);
            var lat = parseFloat(latlngStr[0]);
            var lng = parseFloat(latlngStr[1]);
            $('#map').tinyMap({
                center: {x: lat, y:lng},//center: {x: position.coords.latitude, y:position.coords.longitude},
                zoom: 18,
                marker: [{addr: mylatlng, text: 'Test'}]
            });
        });
    }
}
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}