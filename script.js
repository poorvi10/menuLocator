/* Locate me Setion */

// Get current location
$("#locateMe").click(function() {
    showLocation();
    // if(navigator.geolocation){
    //     navigator.geolocation.getCurrentPosition(showLocation);
    // }else{ 
    //     $('#location').html('Geolocation is not supported by this browser.');
    // }

    // Get logitude and latitude and send it to php
    function showLocation(position){
       // var latitude = position.coords.latitude;
       // var longitude = position.coords.longitude;

        var latitude = '10.0158605';
        var longitude = '76.3418666';

        $("#mySidenav").html('');
        $("#showMenu").html('');

        var action = 'locateMe';
        doAjax(latitude, longitude, action);
    }
});

/* Search option Setion */

// Atocomplete search to get locality, logitude and latitude
function initialize() {
    var address = (document.getElementById('my-address'));
    var autocomplete = new google.maps.places.Autocomplete(address);
    autocomplete.setTypes(['geocode']);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

    var address = '';
    if (place.address_components) {
        address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
    }
    });
}

var menuItems = {};

// Autocomplete search to get locality, logitude and latitude and to handle the response
function codeAddress() {
    $("#showLocation").html("");
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById("my-address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            $("#menuSection").css("display","block");
            $("#mySidenav").html('');
            $("#showMenu").html('');

            $("#showLocation").html(
                "Latitude: "+latitude+
                " , " + "Longitude: "+longitude+
                " , " + "Address:" + address)
            .slideDown("slow");

            var action = 'search';
            doAjax(latitude, longitude, action);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
google.maps.event.addDomListener(window, 'load', initialize);

// Get Menu
function getMenu(cat) {
    var output = '';

    // Display menu items
    $.each( menuItems[cat], function( key, value ) {
        if (value[0]) {
            var is_veg = '<span class="veg"></span>';
        } else {
            var is_veg = '<span class="nonveg"></span>';
        }
        var divHtml = '<div class="product"><h4 class="productName">'+key+'</h4>'+is_veg+
            '<p class="productPrice"> &#x20B9;'+value[1]+'</p></div>';

        output += divHtml;
    });
    $('#showMenu').html(output);
}

// Render menu
function doAjax(latitude, longitude, action) {
    $.ajax({
        type:'POST',
        url:'getLocation.php',
        data: 'latitude='+latitude+'&longitude='+longitude+'&action='+action,
        success:function(data){
            $("#menuSection").css("display","block");

            // Success handler
            if (data) {
                var obj = jQuery.parseJSON(data);
                menuItems = obj[0];
                $("#mySidenav").html(obj[1]);

                // Show location 
                if (obj['location']) {
                    $("#showLocation").html(
                        "Latitude: "+latitude+
                        " , " + "Longitude: "+longitude+
                        " , " + "Address:" + obj['location'])
                    .slideDown("slow");
                }
            }
        }
    });
}