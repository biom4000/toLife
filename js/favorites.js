var map, places, infoWindow;
var search_markers;
var Autocomplete;
var countryRestrict = {'country': 'tw'};
var hostnameRegexp = new RegExp('^https?://.+?/');
var countries;

$(document).ready(function(){
    $("#f_menu").click(function () {
        setTimeout(function(){
            map_search_callback();  // 延遲一秒之後顯示 2
            map_updata();            // 延遲一秒之後呼叫 b 來顯示 3
        },300);
    });
});

function map_search_callback() {
    if($("#map_search").hasClass("open_map")){
        $("#map_search").animate({left:"52%"},"fast");
        $("#map_search").removeClass("open_map");
    }
    else{
        $("#map_search").animate({left:"45%"},"fast");
        $("#map_search").addClass("open_map");
    }
}
function map_updata() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: countries['tw'].zoom,
        center: countries['tw'].center,
    });

    onPlaceChanged();
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
        });
        infoWindow = new google.maps.InfoWindow({
            content: document.getElementById('info-content')
        });

        // Create the autocomplete object and associate it with the UI input control.
        // Restrict the search to the default country, and to place type "cities".
        Autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (
                document.getElementById('autocomplete')), {
                types: ['establishment'],
                componentRestrictions: countryRestrict
            });
        places = new google.maps.places.PlacesService(map);

        Autocomplete.addListener('place_changed', onPlaceChanged);
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
    addResult(place);
}

function addResult(result) {
    var results = document.getElementById('results');
    var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (0 % 26));
    var markerIcon = MARKER_PATH + markerLetter + '.png';

    var tr = document.createElement('tr');
    tr.style.backgroundColor = (0 % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function() {
        google.maps.event.trigger(search_markers, 'click');
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
    document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
        'src="' + place.icon + '"/>';
    document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
        '">' + place.name + '</a></b>';
    document.getElementById('iw-address').textContent = place.vicinity;

    if (place.formatted_phone_number) {
        document.getElementById('iw-phone-row').style.display = '';
        document.getElementById('iw-phone').textContent =
            place.formatted_phone_number;
    } else {
        document.getElementById('iw-phone-row').style.display = 'none';
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
            document.getElementById('iw-rating-row').style.display = '';
            document.getElementById('iw-rating').innerHTML = ratingHtml;
        }
    } else {
        document.getElementById('iw-rating-row').style.display = 'none';
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
        document.getElementById('iw-website-row').style.display = '';
        document.getElementById('iw-website').textContent = website;
    } else {
        document.getElementById('iw-website-row').style.display = 'none';
    }
}