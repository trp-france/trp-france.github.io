(function($){
    "use strict";


    var BACKEND_API_BOOK = 'https://trp.cleverapps.io/booking';

    var rides = JSON.parse(localStorage.getItem("lastBookOptions"));
    var carChoice = localStorage.getItem("car-choice");
    var carImages = {
        BERLINE : 'images/berline.png',
        VAN: 'images/van.png'
    };

    var formatPrice = function(priceInCentimes) {
        return Math.round(priceInCentimes / 100) + ' €';
    };

    var selectedRide = rides[carChoice];

    var placeOrigin  = JSON.parse(localStorage.getItem("place_origin"))
    var placeDestination  = JSON.parse(localStorage.getItem("place_destination"))

    document.getElementById('car-name').innerText = carChoice.toLowerCase();
    document.getElementById('car-image').setAttribute('src', carImages[carChoice]);
    document.getElementById('day-price').innerText = formatPrice(selectedRide.DAY.price);
    document.getElementById('night-price').innerText = formatPrice(selectedRide.NIGHT.price);

    var getV = function(attrName) {
        return document.querySelector('input[name="' + attrName + '"]').value
    };
    var getSelectV = function(attrName) {
        return document.querySelector('select[name="' + attrName + '"]').value
    };

    document.getElementById('btn-reserver').addEventListener('click', function(ev){
        if(document.getElementById("reserver-votre-course").checkValidity()) {
            ev.preventDefault();
            var data = {
                customer : {
                    name: getV("name"),
                    email:getV("email"),
                    phone : getV("phone")
                },
                pickupLocation : {
                    placeId: placeOrigin.place_id,
                    location: placeOrigin.formatted_address
                },
                destinationLocation : {
                    placeId: placeDestination.place_id,
                    location: placeDestination.formatted_address
                },
                pickupDateTime : getV("date") + 'T' + getSelectV('heure') + ':' + getSelectV('minute'),
                comment :document.querySelector('textarea[name="message"]').value,
                category : carChoice
            };

            $('.preloader').fadeIn(500);

            $.ajax(BACKEND_API_BOOK, {
                data : JSON.stringify(data),
                contentType : 'application/json',
                type : 'POST'
            })
                .done(function(){
                    location.href="index.html?bookingConfirmation";

                })
                .fail(function(error){
                    console.log('ko', error)

                })
                .always(function(){
                    $('.preloader').fadeOut(500);
                });
        }

    });

    $('#bookingDateTime').datepicker({ minDate: 0, maxDate: 60, dateFormat : 'yy-mm-dd'});

})(window.jQuery);