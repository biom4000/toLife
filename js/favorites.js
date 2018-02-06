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
        var mylatlng = '24.774968, 121.027227';
        var latlngStr = mylatlng.split(',', 2);
        var lat = parseFloat(latlngStr[0]);
        var lng = parseFloat(latlngStr[1]);
        navigator.geolocation.getCurrentPosition(function (position) {
            $('#map').tinyMap({
                center: {x: lat, y:lng},//center: {x: position.coords.latitude, y:position.coords.longitude},
                zoom: 10,
                marker: [{addr: mylatlng, text: 'Test'}]
            });
        });
    }


    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        // Set the position of the marker using the place ID and location.
        marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
        });
        marker.setVisible(true);

        document.getElementById('place-name').textContent = place.name;
        document.getElementById('place-id').textContent = place.place_id;
        document.getElementById('place-address').textContent =
            place.formatted_address;
        infowindow.setContent(document.getElementById('infowindow-content'));
        infowindow.open(map, marker);
    });
}