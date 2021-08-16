
function LoadTerrain() {
    var styledMapType = new google.maps.StyledMapType([
  {
      "elementType": "geometry",
      "stylers": [
        {
            "color": "#f5f5f5"
        }
      ]
  },
  {
      "elementType": "labels.icon",
      "stylers": [
        {
            "visibility": "off"
        }
      ]
  },
  {
      "elementType": "labels.text.fill",
      "stylers": [
        {
            "color": "#616161"
        }
      ]
  },
  {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
            "color": "#f5f5f5"
        }
      ]
  },
  {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
            "color": "#bdbdbd"
        }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
            "color": "#eeeeee"
        }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
            "color": "#757575"
        }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
            "color": "#e5e5e5"
        }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
            "color": "#9e9e9e"
        }
      ]
  },
  {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
            "color": "#ffffff"
        }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
            "color": "#757575"
        }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
            "color": "#dadada"
        }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
            "color": "#616161"
        }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
            "color": "#9e9e9e"
        }
      ]
  },
  {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
            "color": "#e5e5e5"
        }
      ]
  },
  {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
            "color": "#eeeeee"
        }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
            "color": "#c9c9c9"
        }
      ]
  },
  {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
            "color": "#9e9e9e"
        }
      ]
  }
    ]
        );
    return styledMapType;
}

function initMap() {
    var styledMapType = LoadTerrain();

    var $obj = $(document.getElementsByClassName("google-maps")[0]);
    var latitude = $obj.data("latitude") != undefined ? $obj.data("latitude") : "";
    var longitude = $obj.data("longitude") != undefined ? $obj.data("longitude") : "";
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        zoom: 15,
        center: myLatlng,
        scrollwheel: false
    }
    var map = new google.maps.Map(document.getElementsByClassName("google-maps")[0], mapOptions);

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    var icon = {
        url: "/Images/Icons/Pin.png"
    };

    var marker = new google.maps.Marker({
        position: myLatlng,
        map,
        title: 'Ascent Canmore',
        icon: icon,
    });

    google.maps.event.addListener(marker, 'click', function () {
        $('<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + latitude + ',' + longitude + '"></a>')[0].click();
    });

    google.maps.event.addDomListener(window, 'resize', function () {
        map.setCenter(map.geometry.location)
    });
}

if (document.getElementsByClassName("google-maps") !== undefined && document.getElementsByClassName("google-maps").length > 0) {
    var s = document.createElement('script');
    var src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDVS6E67RsUgPvtpo22zLy9EEL554f7bIA&callback=initMap&libraries=places";
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
}


function addPin(map, lng, lat, pName, srvcode, zIndex = 1) {
    var imgurl = srvcode;
    var width = 0;
    var hight = 0;
    var cw, ch = 0;
    if (imgurl == "../Images/Icons/Pin.png") {
        width = 131;
        hight = 167;
        cw = 65; ch = 167;
    }
    else {
        width = 45;
        hight = 68;
        cw = 22; ch = 68;
    }
    var image = new google.maps.MarkerImage(imgurl,
        new google.maps.Size(width, hight),
        new google.maps.Point(0, 0),
        new google.maps.Point(cw, ch));

    var myLatLng = new google.maps.LatLng(lng, lat);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        shadow: null,
        icon: image,
        shape: null,
        title: pName,
        zIndex: zIndex
    });

    var infowindow = new google.maps.InfoWindow({
        content: pName
    });
    google.maps.event.addListener(marker, 'click', function () {
        //infowindow.open(map, marker);
        $('<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + marker.getPosition().lat() + ',' + marker.getPosition().lng() + '"></a>')[0].click();
    });
}

function initPinGoogleMap() {
    var map;
    var latlng = new google.maps.LatLng(53.398609, -113.543245);
    var myOptions = {
        zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        scrollwheel: false,
        styles: [{ "stylers": [{ "saturation": -100 }, { "gamma": 1 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.place_of_worship", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.place_of_worship", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "water", "stylers": [{ "visibility": "on" }, { "saturation": 50 }, { "gamma": 0 }, { "hue": "#50a5d1" }] }, { "featureType": "administrative.neighborhood", "elementType": "labels.text.fill", "stylers": [{ "color": "#333333" }] }, { "featureType": "road.local", "elementType": "labels.text", "stylers": [{ "weight": 0.5 }, { "color": "#333333" }] }, { "featureType": "transit.station", "elementType": "labels.icon", "stylers": [{ "gamma": 1 }, { "saturation": 50 }] }]
    };
    google.maps.event.addDomListener(window, 'resize', function () {
        map.setCenter(map.geometry.location)
    });
    map = new google.maps.Map(document.getElementById("pin-google-maps"), myOptions);
        
    addPin(map, 53.398609, -113.543245, "Slate", '../Images/Icons/Pin.png', 2);
    addPin(map, 53.4076071, -113.5721067, "Banks", '../Images/Neighbourhood/Markers/Banks-Pin.png');
    addPin(map, 53.4047481, -113.5665277, "Banks", '../Images/Neighbourhood/Markers/Banks-Pin.png');
    addPin(map, 53.4047481, -113.5665277, "Banks", '../Images/Neighbourhood/Markers/Banks-Pin.png');
    addPin(map, 53.502649, -113.579261, "Fitness", '../Images/Neighbourhood/Markers/Fitness-Pin.png');
    addPin(map, 53.4042573, -113.5636542, "Resturant", '../Images/Neighbourhood/Markers/Restaurant-Pin.png');
    addPin(map, 53.4102518, -113.5664502, "Resturant", '../Images/Neighbourhood/Markers/Restaurant-Pin.png');
    addPin(map, 53.4102518, -113.5664502, "Resturant", '../Images/Neighbourhood/Markers/Restaurant-Pin.png');
    addPin(map, 53.4065018, -113.5420602, "Resturant", '../Images/Neighbourhood/Markers/Restaurant-Pin.png');
    addPin(map, 53.4065018, -113.5420602, "Resturant", '../Images/Neighbourhood/Markers/Restaurant-Pin.png');
    addPin(map, 53.4073328, -113.5359116, "Resturant", '../Images/Neighbourhood/Markers/Restaurant-Pin.png');
    addPin(map, 53.3978596, -113.556633, "Schools", '../Images/Neighbourhood/Markers/Schools-Pin.png');
    addPin(map, 53.4052205, -113.5640941, "Schools", '../Images/Neighbourhood/Markers/Schools-Pin.png');
    addPin(map, 53.4011925, -113.5429611, "Schools", '../Images/Neighbourhood/Markers/Schools-Pin.png');
    addPin(map, 53.4069348, -113.5764499, "Shoppings", '../Images/Neighbourhood/Markers/Shoppings-Pin.png');
    addPin(map, 53.4069348, -113.5764499, "Shoppings", '../Images/Neighbourhood/Markers/Shoppings-Pin.png');
    addPin(map, 53.4075665, -113.540147, "Shoppings", '../Images/Neighbourhood/Markers/Shoppings-Pin.png');
}

if (document.getElementsByClassName("pin-google-maps") !== undefined && document.getElementsByClassName("pin-google-maps").length > 0) {
    var s = document.createElement('script');
    var src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDVS6E67RsUgPvtpo22zLy9EEL554f7bIA&callback=initPinGoogleMap";
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
}