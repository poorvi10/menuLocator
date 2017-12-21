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
        $.ajax({
            type:'POST',
            url:'getLocation.php',
            data:'latitude='+latitude+'&longitude='+longitude,
            success:function(address){
                if(address){
                    $("#location").html(address+ ' '+ 'Latitude: '+ latitude + '  Longitude: ' +longitude) 
                    .slideDown("slow");
                }else{
                    $("#location").html('Not Available')
                    .slideDown("slow");
                }
            }
        });
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

            $("#showLocation").html(
                "Latitude: "+latitude+
                " , " + "Longitude: "+longitude+
                " , " + "Address:" + address)
            .slideDown("slow");
            
            var data = {
                "lat" :  latitude,
                "lgt" : longitude,
                "address" : address
            }
            $.ajax({
                type:'POST',
                url:'getLocation.php',
                data: data,
                success:function(data){

                    //Display categories
                    if (data) {
                        menuItems = jQuery.parseJSON(data)[0];
                        $("#mySidenav").html(jQuery.parseJSON(data)[1]);
                    }
                }
            });
        
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
google.maps.event.addDomListener(window, 'load', initialize);

// Function to get menus
function getMenu(cat) {
    var output = '';
    console.log(cat);
    console.log(menuItems);
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