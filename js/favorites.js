var map, places, infoWindow, place_list;
var search_markers;
var Autocomplete;
var hostnameRegexp = new RegExp('^https?://.+?/');
var countries;
var sub_hover = 0;

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
        //$("#list1-1_input").val(place_list.title);
        if(sub_hover == 1){
            addElementLi("favor_subject1");
        }else if(sub_hover == 2){
            addElementLi("favor_subject2");
        }else if(sub_hover == 3){
            addElementLi("favor_subject3");
        }else{
            alert("Please select one item.")
        }

    });

    $("#favor_subject1").hover(function () {
        $(this).css("background","#f2dc38");
        $("#favor_subject2").css("background","#e8ffdb");
        $("#favor_subject3").css("background","#d9e8ff");
        $("#sub1_title_img").css("opacity","1");
        $("#sub2_title_img").css("opacity","0.5");
        $("#sub3_title_img").css("opacity","0.5");
        sub_hover = 1;
    });
    $(".sub1_focus").focus(function () {
        $("#sub1_title").css({
            "border-color":"black",
            "color":"#d94600"
        });
        $("#sub1_title_img").css("opacity","1");
        $(".list1_img").css("opacity","1");
        $(this).css("border-color","black");
    });
    $(".sub1_focus").blur(function () {
        $("#sub1_title").css({
            "border-color":"#9d9d9d",
            "color":"#9d9d9d"
        });
        $("#sub1_title_img").css("opacity","0.5");
        $(".list1_img").css("opacity","0.5");
        $(this).css("border-color","#9d9d9d");
    });
    $(".sub2_focus").focus(function () {
        $("#sub2_title").css({
            "border-color":"black",
            "color":"#d94600"
        });
        $("#sub2_title_img").css("opacity","1");
        $(".list2_img").css("opacity","1");
        $(this).css("border-color","black");
    });
    $(".sub2_focus").blur(function () {
        $("#sub2_title").css({
            "border-color":"#9d9d9d",
            "color":"#9d9d9d"
        });
        $("#sub2_title_img").css("opacity","0.5");
        $(".list2_img").css("opacity","0.5");
        $(this).css("border-color","#9d9d9d");
    });
    $(".sub3_focus").focus(function () {
        $("#sub3_title").css({
            "border-color":"black",
            "color":"#d94600"
        });
        $("#sub3_title_img").css("opacity","1");
        $(".list3_img").css("opacity","1");
        $(this).css("border-color","black");
    });
    $(".sub3_focus").blur(function () {
        $("#sub3_title").css({
            "border-color":"#9d9d9d",
            "color":"#9d9d9d"
        });
        $("#sub3_title_img").css("opacity","0.5");
        $(".list3_img").css("opacity","0.5");
        $(this).css("border-color","#9d9d9d");
    });

    $("#favor_subject2").hover(function () {
        $(this).css("background", "#47cf57");
        $("#favor_subject1").css("background", "#f8ffc2");
        $("#favor_subject3").css("background", "#d9e8ff");
        $("#sub2_title_img").css("opacity","1");
        $("#sub1_title_img").css("opacity","0.5");
        $("#sub3_title_img").css("opacity","0.5");
        sub_hover = 2;
    });
    $("#favor_subject3").hover(function () {
        $(this).css("background","#3188c4");
        $("#favor_subject2").css("background", "#e8ffdb");
        $("#favor_subject1").css("background", "#f8ffc2");
        $("#sub3_title_img").css("opacity","1");
        $("#sub1_title_img").css("opacity","0.5");
        $("#sub2_title_img").css("opacity","0.5");
        sub_hover = 3;
    });

    $("#autocomplete").focus(function () {
        $("#map_search").css("opacity","1");
    });
    $("#autocomplete").blur(function () {
        $("#map_search").css("opacity","0.5");
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
function addElementLi(obj) {
    var ul = document.getElementById(obj);
    //var i=0;
    //添加 li
    var li = document.createElement("li");
    var img = document.createElement("img");
    var input = document.createElement("input");

    if(obj == "favor_subject1"){
        //设置 li 属性，如 id
        //li.setAttribute("id", "list"+num+"-"+i);
        li.setAttribute("class","list list1");
        img.setAttribute("class","list1_img");
        img.setAttribute("src",place_list.placeResult.icon);
        img.setAttribute("alt","miss");
        input.setAttribute("class","sub1_focus");
        input.setAttribute("type","text");
        input.setAttribute("value",place_list.title);
    }else if(obj == "favor_subject2"){
        //设置 li 属性，如 id
        //li.setAttribute("id", "list"+num+"-"+i);
        li.setAttribute("class","list list2");
        img.setAttribute("class","list2_img");
        img.setAttribute("src",place_list.placeResult.icon);
        img.setAttribute("alt","miss");
        input.setAttribute("class","sub2_focus");
        input.setAttribute("type","text");
        input.setAttribute("value",place_list.title);
    }else if(obj == "favor_subject3"){
        //设置 li 属性，如 id
        //li.setAttribute("id", "list"+num+"-"+i);
        li.setAttribute("class","list list3");
        img.setAttribute("class","list3_img");
        img.setAttribute("src",place_list.placeResult.icon);
        img.setAttribute("alt","miss");
        input.setAttribute("class","sub3_focus");
        input.setAttribute("type","text");
        input.setAttribute("value",place_list.title);
    }


    //li.innerHTML = "js 动态添加li"+i;
    ul.appendChild(li);
    li.appendChild(img);
    li.appendChild(input);
}