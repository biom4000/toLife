var map, places, infoWindow, place_list;
var search_markers;
var Autocomplete;
var hostnameRegexp = new RegExp('^https?://.+?/');
var countries;

$(document).ready(function(){
    $(".menu").click(function () {
        setTimeout(function(){
            //map_search_callback();  // 延遲一秒之後顯示 2
            map_updata();            // 延遲一秒之後呼叫 b 來顯示 3
        },200);
    });
    $(".gallery_nav_lock").click(function () {
        setTimeout(function(){
            //map_search_callback();  // 延遲一秒之後顯示 2
            map_updata();            // 延遲一秒之後呼叫 b 來顯示 3
        },200);
    });
    $(".gallery_nav_open").click(function () {
        setTimeout(function(){
            //map_search_callback();  // 延遲一秒之後顯示 2
            map_updata();            // 延遲一秒之後呼叫 b 來顯示 3
        },200);
    });
    $("#iw-add").click(function () {
        $("#list1-1_input").val(place_list.title);
    });
    $("#list1-1_input").focus(function () {
        $("#list1-1_input").css("background","red");
    });
});

function map_updata() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: countries['tw'].zoom,
        center: countries['tw'].center,
        mapTypeControl: false,
        panControl: false
    });
    //onPlaceChanged();
}

function initMap() {
    navigator.geolocation.getCurrentPosition(function (position) {
        countries = {
            'tw':{
                center: {lat: position.coords.latitude, lng: position.coords.longitude},
                zoom: 12
            }
        };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: countries['tw'].zoom,
            center: countries['tw'].center,
            mapTypeControl: false,
            panControl: false
        });
        infoWindow = new google.maps.InfoWindow({
            content: document.getElementById('info-content')
        });

        input = document.getElementById('autocomplete');
        searchBox = new google.maps.places.SearchBox(input);
        //map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        markers = [];

        places = new google.maps.places.PlacesService(map);
        searchBox.addListener('places_changed', search_callback);
        //Autocomplete.addListener('place_changed', onPlaceChanged);
    });
}
// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
    var place = Autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(17);
        search();
    } else {
        document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
}

// Search for hotels in the selected city, within the viewport of the map.
function search(){
    var place = Autocomplete.getPlace();
    clearResults();
    clearMarkers();
    search_markers = new google.maps.Marker({
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
    });
    search_markers.placeResult = place;
    google.maps.event.addListener(search_markers, 'click', showInfoWindow);
    setTimeout(dropMarker(), 0 * 100);
    addResult(place,0);
}

function addResult(result,i) {
    var results = document.getElementById('results');
    var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
    var markerIcon = MARKER_PATH + markerLetter + '.png';

    var tr = document.createElement('tr');
    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function() {
        google.maps.event.trigger(markers[i], 'click');
    };

    var iconTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var icon = document.createElement('img');
    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    icon.setAttribute('className', 'placeIcon');
    var name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
}

function clearMarkers() {
    if (search_markers) {
        search_markers.setMap(null);
    }
    search_markers = null;
}

function dropMarker() {
    search_markers.setMap(map);
}

function clearResults() {
    var results = document.getElementById('results');
    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
    var marker = this;
    place_list = marker;
    places.getDetails({placeId: marker.placeResult.place_id},
        function(place, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
            }
            infoWindow.open(map, marker);
            buildIWContent(place);
        });
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
   // document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
     //   'src="' + place.icon + '"/>';
   // document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
    //    '">' + place.name + '</a></b>';
    document.getElementById('iw-url').innerHTML = '<b><p>' + place.name + '</p></b>';
    document.getElementById('iw-address').textContent = place.vicinity;

    if (place.formatted_phone_number) {
        document.getElementById('iw-phone').style.display = '';
        document.getElementById('iw-phone').textContent =
            place.formatted_phone_number;
    } else {
        document.getElementById('iw-phone').style.display = 'none';
    }

    // Assign a five-star rating to the hotel, using a black star ('&#10029;')
    // to indicate the rating the hotel has earned, and a white star ('&#10025;')
    // for the rating points not achieved.
    if (place.rating) {
        var ratingHtml = '';
        for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
                ratingHtml += '&#10025;';
            } else {
                ratingHtml += '&#10029;';
            }
            document.getElementById('iw-rating').style.display = '';
            document.getElementById('iw-rating').innerHTML = ratingHtml;
        }
    } else {
        document.getElementById('iw-rating').style.display = 'none';
    }

    // The regexp isolates the first part of the URL (domain plus subdomain)
    // to give a short URL for displaying in the info window.
    if (place.website) {
        var fullUrl = place.website;
        var website = hostnameRegexp.exec(place.website);
        if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
        }
        document.getElementById('iw-website').style.display = '';
        document.getElementById('iw-website').textContent = website;
    } else {
        document.getElementById('iw-website').style.display = 'none';
    }
}

function search_callback() {
    var places = searchBox.getPlaces();
    var cont=0;

    if (places.length == 0) {
        return;
    }
    clearResults();
    // Clear out the old markers.
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location
        }));

        markers[cont].placeResult = place;
        google.maps.event.addListener(markers[cont], 'click', showInfoWindow);


        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        //addResult(place,cont);
        cont++;
    });
    cont=0;
    map.fitBounds(bounds);
}

function addResultList(result) {
    //var object = document.getElementById('#list1-1_input')
    //var name = result.name;
    $("#list1-1_input").val(result.name);
}