$(document).ready(function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoicGFya291cm1ldGhvZCIsImEiOiI5Y2JmOGJhMDYzZDgyODBhYzQ3OTFkZWE3NGFiMmUzYiJ9.kp_5LMwcR79TKOERpkilAQ';
    
    // Set bounds to DMV
    var bounds = [
        [-77.247255, 38.764495], // Southwest coordinates
        [-76.851141, 39.032550]  // Northeast coordinates
    ];

    
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/parkourmethod/cim5hb9c600jza0m473wrw6y6',
        center: [-77.043132, 38.902705],
        zoom: 16,
        minZoom: 4,
        attributionControl: false
    });

    map.dragRotate.disable();
    
    //zoom in from search to 18
    
    var defLoc = "DC";
    
    //initial button focus
    document.getElementById("DC").focus();
    
//    map.hideAttribution();
    
    //fly to cities
    $('.DC').on('click', function(e) {
        map.flyTo({
            center: [-77.043132, 38.902705],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "DC";
    });
    
    $('.NYC').on('click', function() {
        map.flyTo({
            center: [-73.998742, 40.725301],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "NYC";
    });
    
    $('.SF').on('click', function() {
        map.flyTo({
            center: [-122.410829, 37.785506],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "SF";
    });
    
    $('.PA').on('click', function() {
        map.flyTo({
            center: [-122.155012, 37.447295],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "PA";
    });
    
    $('.SM').on('click', function() {
        map.flyTo({
            center: [-118.480961, 34.001161],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "SM";
    });
    
    $('.CHI').on('click', function() {
        map.flyTo({
            center: [-87.628595, 41.881745],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "CHI";
    });
    
    //keep focus on the buttons so they stay highlighted
    map.on("click", function(){
       //keep focus on buttons
        document.getElementById(defLoc).focus();
    });
    
    map.on("dragend", function(){
       //keep focus on buttons
        document.getElementById(defLoc).focus();
    });
    
    map.on("dragstart", function(){
       //keep focus on buttons
        document.getElementById(defLoc).focus();
    });
    
    //zoom buttons
    $('.IN').on('click', function(e) {
        var zoom = map.getZoom();        
        map.setZoom(zoom + 1);
    });
    
    $('.OUT').on('click', function(e) {
        var zoom = map.getZoom();        
        map.setZoom(zoom - 1);
    });
    
    //search
    $('.address-search').on('click', function(e) {
         var query = document.getElementById('address-query').value;
        var cityState = document.getElementById('city-state').value;
        locAddressSearch(query, cityState);
    });
    
    function locAddressSearch(thisQuery, cityState){
        var xhttp = new XMLHttpRequest();
        
        //split address
        var splitQuery = cityState.split(",");
        
        var state = splitQuery[1].replace(/\s/g, '');
//        
//        var address = "";
//        
//        for(var i = 0; i < splitQuery.length - 2; i++){
//            address = address + splitQuery[i] + " ";
//        }
        
        var center = map.getCenter();
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var myArr = JSON.parse(xhttp.responseText);

                console.log("data - all: " + xhttp.responseText);

               if(myArr[0]){
                   readLocation(myArr);
               }else{
                   console.log("no data found");
               }
           }  
         };

//         xhttp.open('GET', "https://api.parkourmethod.com/address?address=" + thisQuery + "\&lat=" + center.lat +"\&lon=" + center.lng + "\&api_key=c628cf2156354f53b704bd7f491607a7", true);
        
        xhttp.open('GET', "https://api.parkourmethod.com/address?address=" + thisQuery + "\&city="+ splitQuery[0] +"\&state=" + state + "\&api_key=c628cf2156354f53b704bd7f491607a7", true);
        
         xhttp.send();
    }
    
    function readLocation(arr){
         var lat = arr[0].lat;
         var lon = arr[0].lon;
         console.log("data - lat: " + lat + ", lon: " + lon);

        map.flyTo({
            center: [lon, lat],
            zoom: 17,
            speed: 1.5
        });
     }   
});