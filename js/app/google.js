var latLng = {lat: 33.509740, lng: -112.075713};
var map;
 function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
         center: latLng,
         zoom: 11,
         scrollwheel: false
     });

 var marker = new google.maps.Marker({
         position: latLng,
         map: map,
         title: 'Bonus Round!'
     });

   marker.addListener('click', function(e) {
     window.location.href="https://www.google.com/maps/place/Bonus+Round/@33.5098144,-112.0756731,15z/data=!4m2!3m1!1s0x0:0x32b5be42e5a158a6?sa=X&ved=0ahUKEwj7pu6nj7zOAhXD3SYKHaWEAwAQ_BIIdjAK"
   });
 }
