var vcp = vcp || {};

vcp.estimate = (function($){
    "use strict";

    if(location.search.indexOf('bookingConfirmation') >= 0) {
        document.querySelector('.booking-confirmation').classList.remove('hidden');
    }

    var BACKEND_API_RIDE = 'https://trp.cleverapps.io/rides';

    var placeIdOrigin, placeIdDestination, lastBookOptions;

    var yourRideBloc = document.querySelectorAll('.your-ride');
    var yourRideDistance = document.getElementById('your-ride-distance');
    var yourRideDuration = document.getElementById('your-ride-duration');
    var yourRideBerlineDayPrice = document.getElementById('price-berline-day');
    var yourRideBerlineNightPrice = document.getElementById('price-berline-night');
    var yourRideVanDayPrice = document.getElementById('price-van-day');
    var yourRideVanNightPrice = document.getElementById('price-van-night');

    var formatPrice = function(priceInCentimes) {
        return Math.round(priceInCentimes / 100) + ' €';
    };


    var check = function() {
       if((!placeIdOrigin || !placeIdDestination)) {

           yourRideBloc.forEach(function(item) {
                item.classList.add('hidden');
           });
           return false;

       }
       return true;
    };

    var estimate = function() {
        if(check()) {
            var data = {
                originPlaceId: placeIdOrigin,
                destinationPlaceId: placeIdDestination
            };
            $.post(BACKEND_API_RIDE, data)
            .done(function(result) {

                localStorage.setItem("lastBookOptions", JSON.stringify(result));

                // pricing ok
                yourRideDistance.innerText = result.BERLINE.DAY.distanceHumanReadable;
                yourRideDuration.innerText = result.BERLINE.DAY.durationHumanReadable;
                yourRideBerlineDayPrice.innerText = formatPrice(result.BERLINE.DAY.price);
                yourRideBerlineNightPrice.innerText = formatPrice(result.BERLINE.NIGHT.price);
                yourRideVanDayPrice.innerText = formatPrice(result.VAN.DAY.price);
                yourRideVanNightPrice.innerText = formatPrice(result.VAN.NIGHT.price);

                yourRideBloc.forEach(function(item) {
                    item.classList.remove('hidden');
                });

            })
            .fail(function(error){
                    console.log('ko', error)

            });
        }
    };

    var inputIds = ['origin', 'destination'];

    inputIds
        .map(function(i, index) {
            var input = document.getElementById(i);
            input.addEventListener('change', function(){
                if(index === 0) {
                    placeIdOrigin = null;
                }

                if (index === 1) {
                    placeIdDestination = null;
                }
                check();
            });
            return input;
        })
        .map(function(input) {
            return new google.maps.places.Autocomplete(input)
        })
        .forEach(function(autocomplete, index) {
            autocomplete.addListener('place_changed', function() {

                var placeId = this.getPlace().place_id;

                if(index === 0) {
                    placeIdOrigin = placeId;
                    localStorage.setItem('place_origin', JSON.stringify(this.getPlace()))
                }

                if (index === 1) {
                    placeIdDestination = placeId;
                    localStorage.setItem('place_destination', JSON.stringify(this.getPlace()))
                }

                estimate();

            })
        });

    var goToBookPage = function(choice) {
        localStorage.setItem("car-choice", choice);
        location.href='reservation.html';
    };

   document.getElementById('reserver-van').addEventListener('click', function (ev) {
       ev.preventDefault();
       goToBookPage('VAN')
   });

    document.getElementById('reserver-berline').addEventListener('click', function (ev) {
        ev.preventDefault();
        goToBookPage('BERLINE');
    });




})(window.jQuery);