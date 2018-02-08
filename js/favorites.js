var map;
var infowindow;
var countries;
var autocomplete;
var countryRestrict = {'country': 'tw'};
var markers = [];
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
/*
$(document).ready(function(){
    $("#f_menu").click(function () {
        setTimeout(function(){
            map_search_callback();  // 延遲一秒之後顯示 2
            initMap();            // 延遲一秒之後呼叫 b 來顯示 3
        },300);
    });
});
*/
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
        infowindow = new google.maps.InfoWindow({
            content: document.getElementById('info-content')
        });
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
        //setTimeout(dropMarker(0), 0 * 100);
        markers[0].setMap(map);
        document.getElementById('autocomplete').value = '';
    } else {
        document.getElementById('autocomplete').placeholder = 'Search...';
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