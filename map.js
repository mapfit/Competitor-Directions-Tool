$(document).ready(function() {
    
    var geofiKey = "d2ab3ecab8d443e3b9871a6cc1ee616e";
    
    //prevent pin to zoom
    document.addEventListener('mousewheel', function(e) {
      if(e.deltaY % 1 !== 0) {
        e.preventDefault();
      }
    });
    
    mapboxgl.accessToken = 'pk.eyJ1IjoicGFya291cm1ldGhvZCIsImEiOiI5Y2JmOGJhMDYzZDgyODBhYzQ3OTFkZWE3NGFiMmUzYiJ9.kp_5LMwcR79TKOERpkilAQ';
    var googleAPI = 'AIzaSyALB5yXEHcbkr51lCbrPeCdVf60SbWENtU';
    var bingAPI = 'Aks14rX10AqP9GDWoreX8d-Mw-lD1d13TkKKLvgXIGEvr8Ke4Iuni6w5wRUxaKj1';
    
    // Set bounds to DMV
    var bounds = [
        [-77.247255, 38.764495], // Southwest coordinates
        [-76.851141, 39.032550]  // Northeast coordinates
    ];
    
    var currentAddress;
    
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/parkourmethod/civtu956m000b2kmx6k62naro',
        center: [-77.043132, 38.902705],
        zoom: 16,
        minZoom: 4,
        attributionControl: false
    });
    
    //altentrance points
    var altJson;
    
    //store all geofi route names
    var geofiRoute = [];

    //prevent rotation
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
        
    var defLoc = "cities";
    
    //mobile OS detection and setup    
    if(detectmob()){        
        document.getElementById('zoom').hidden = true;
        
        //address search
        $(".search-form").css("width", "100%");
        $(".search-form input").css("width", "74%");
        $(".search-form button").css("width", "19%");
//        $(".search-directions").css("top", "auto");
//        $(".search-directions").css("left", "auto");
//        $(".search-directions").css("right", "1%");
//        $(".search-directions").css("bottom", "50px");
        $(".search-directions").css("width", "50%");
        $(".search-directions button").css("width", "95%");
        
        //cities
        $(".options").css("top", "75px");
        $(".options").css("right", "10px");
        $(".options").css("width", "50px");
        
        //buttons
        $(".direction").css("top", "75px");
        $(".sat").css("top", "75px");
        $(".pin").css("top", "75px");
        
        //directions menu
        $(".menu").css("width", "100%");
        $(".menu").css("margin-left", "-100%");
        $(".directions-form").css("width", "80%");
        $(".directions-form input").css("width", "100%");
    }
    
    function detectmob() { 
        if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i)
           || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)
           || navigator.userAgent.match(/Windows Phone/i)
          ){
            return true;
        } else {
            return false;
        }
    }
    
    //initial button focus
    document.getElementById("cities").focus();
    
    //initialize car for transit
    var transitType = "driving";
    var entranceType = "all-pedestrian";
    document.getElementById("car").style.backgroundColor = "#FC0D1B";
    document.getElementById("entrance").style.backgroundColor = "#FC0D1B";
        
    //toggle pins
    var pinsOn = true;
    $('.toggle-pin').on('click', function(e) {
        
        if(pinsOn){
            pinsOn = false;
            $('.toggle-pin').css("color", "#1F363D");
            $('.toggle-pin').css("background", "#fff");
            $('.toggle-pin').css("border-color", "#1F363D");
            
            map.setLayoutProperty("dec01-2016-9d1lc5", 'visibility', 'visible');
        }else{
            pinsOn = true;
            $('.toggle-pin').css("color", "#fff");
            $('.toggle-pin').css("background", "#1F363D");
            $('.toggle-pin').css("border-color", "#fff");
            
            map.setLayoutProperty("dec01-2016-9d1lc5", 'visibility', 'none');
        }
    });
    
    //fly to cities
    var citiesOut = false;
    $('.cities').on('click', function(e) {
        defLoc = "cities";
         var $this = $(this);
        
        if(citiesOut){
            citiesOut = false;
            $this.html('<img src="light-travel.png">');
            $this.css("background", "#1F363D");
            $this.css("border-color", "#fff");
            document.getElementById('DC').hidden = true;
            document.getElementById('NYC').hidden = true;
            document.getElementById('SF').hidden = true;
            document.getElementById('PA').hidden = true;
            document.getElementById('SM').hidden = true;
            document.getElementById('CHI').hidden = true;
            document.getElementById('SEA').hidden = true;
            document.getElementById('BOS').hidden = true;
        }else{
            citiesOut = true;
            $this.html('<img src="dark-travel.png">');
            $this.css("background", "#fff");
            $this.css("border-color", "#1F363D");
            document.getElementById('DC').hidden = false;
            document.getElementById('NYC').hidden = false;
            document.getElementById('SF').hidden = false;
            document.getElementById('PA').hidden = false;
            document.getElementById('SM').hidden = false;
            document.getElementById('CHI').hidden = false;
            document.getElementById('SEA').hidden = false;
            document.getElementById('BOS').hidden = false;
        }
    });
    
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
    
    $('.SEA').on('click', function() {
        map.flyTo({
            center: [-122.332067, 47.606928],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "SEA";
    });
    
    $('.BOS').on('click', function() {
        map.flyTo({
            center: [-71.058835, 42.360162],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "BOS";
    });
    
    map.on('load', function(){
        if(detectmob){
            map.on('mousedown', mouseDown, true); 
        }
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
    
        //coordinate search/right click
     map.on('contextmenu', function(e) {         
         var ll = e.lngLat;
         revGeocode(ll);         
     });
    
    function revGeocode(coords){
        var xhttp = new XMLHttpRequest();
                  
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var myArr = JSON.parse(xhttp.response);
               console.log(JSON.stringify(myArr));
               
               if(xhttp.readyState == 4 && xhttp.status == 200){
                   var myArr = JSON.parse(xhttp.responseText);

                   console.log(xhttp.responseText);

                   if(myArr[0]){
                       readLocation(myArr);

                       //setup additional searches
                       googleSearch(coords.lat + ","+ coords.lng);
                       openSearch(coords.lng + ","+ coords.lat);
                       bingSearch(coords.lat + ","+ coords.lng);
                   }else{
                       console.log("no data found");
                       alert("No Matching Address found. Please try another address.");
                   }
               }else if(xhttp.readyState == 4){
                   alert('API Server is being updated -- please try again later');
               }
           }
         };

         xhttp.open('GET', "https://api.geofi.io/coordinate?lat=" + ll.lat + "\&lon="+ ll.lng + "\&radius=35" + "\&api_key=" + geofiKey, true);

         xhttp.send();
    }
    
    //zoom buttons
    $('.IN').on('click', function(e) {
        var zoom = map.getZoom();        
        map.setZoom(zoom + 1);
    });
    
    $('.OUT').on('click', function(e) {
        var zoom = map.getZoom();        
        map.setZoom(zoom - 1);
    });
    
    //long press detection for mobile

    var delay = 1000;
    var downTime;
    var upTime;
    var pressTimer;

    function mouseDown(e) {  
        var coords = e.lngLat;

        pressTimer = window.setTimeout(function() {revGeocode(coords)},1000);
        return false; 
    }

    function onUp(e) {
        clearTimeout(pressTimer);
        // Clear timeout
        return false;
    }
    
    //demo stuff
    var compareRoutes = false;
    
    $('.compareRoutes').on('click', function(e) {
        var $this = $(this);
        
        if(compareRoutes){
            $this.text('Compare Routes');
            compareRoutes = false;
            
            map.setLayoutProperty("gRoute", 'visibility', 'none');
            map.setLayoutProperty("gStart", 'visibility', 'none');
            map.setLayoutProperty("gEnd", 'visibility', 'none');
            map.setLayoutProperty("googleStart", 'visibility', 'none');
            map.setLayoutProperty("googleEnd", 'visibility', 'none');

            map.setLayoutProperty("openRoute", 'visibility', 'none');
            map.setLayoutProperty("openStart", 'visibility', 'none');
            map.setLayoutProperty("openEnd", 'visibility', 'none');
            map.setLayoutProperty("openRouteStart", 'visibility', 'none');
            map.setLayoutProperty("openRouteEnd", 'visibility', 'none');

            map.setLayoutProperty("bingRoute", 'visibility', 'none');
            map.setLayoutProperty("bingStart", 'visibility', 'none');
            map.setLayoutProperty("bingEnd", 'visibility', 'none');
            map.setLayoutProperty("bingStartRoute", 'visibility', 'none');
            map.setLayoutProperty("bingEndRoute", 'visibility', 'none');
            
            $('#gTime').text(" ");
        }else{
            $this.text('Hide Routes');
            compareRoutes = true;
            
            map.setLayoutProperty("gRoute", 'visibility', 'visible');
            map.setLayoutProperty("gStart", 'visibility', 'visible');
            map.setLayoutProperty("gEnd", 'visibility', 'visible');
            map.setLayoutProperty("googleStart", 'visibility', 'visible');
            map.setLayoutProperty("googleEnd", 'visibility', 'visible');
            map.setLayoutProperty("routeStart", 'visibility', 'visible');
            map.setLayoutProperty("routeEnd", 'visibility', 'visible');

            map.setLayoutProperty("openRoute", 'visibility', 'visible');
            map.setLayoutProperty("openStart", 'visibility', 'visible');
            map.setLayoutProperty("openEnd", 'visibility', 'visible');
            map.setLayoutProperty("openRouteStart", 'visibility', 'visible');
            map.setLayoutProperty("openRouteEnd", 'visibility', 'visible');

            map.setLayoutProperty("bingRoute", 'visibility', 'visible');
            map.setLayoutProperty("bingStart", 'visibility', 'visible');
            map.setLayoutProperty("bingEnd", 'visibility', 'visible');
            map.setLayoutProperty("bingStartRoute", 'visibility', 'visible');
            map.setLayoutProperty("bingEndRoute", 'visibility', 'visible');
            
            calcDurationDifference();
        }
    });
    
    function calcDurationDifference(){
        var diff = gDuration - geofiDuration;
        
        console.log("time diff = " + diff);
        
        if(Math.sign(diff) > 0){
            var time = secondsToHms(diff);
                
            $('#gTime').text("You save " + time + " with our route!");
        }
    }
    
    //search
    $('.address-search').on('click', function(e) {
         var query = document.getElementById('address-query').value;
        var cityState = document.getElementById('city-state').value;
                
        if(query == ""){
            alert("No address provided. Please enter an address to search.");
            return;
        }
        
        if(cityState == ""){
            coordSearch(query);
        }else{
            if(cityState.indexOf(",") == -1){
                alert("Make sure there is a comma between city and state.");
                return;
            }
            
            stateSearch(query, cityState);
        }
        
    });
    
    function stateSearch(thisQuery, cityState){
        var xhttp = new XMLHttpRequest();
        
        //split address
        var splitQuery = cityState.split(",");
        
        var city = splitQuery[0].replace(/ +$/, "");
        var state = splitQuery[1].replace(/\s/g, '');
        
        var center = map.getCenter();
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var myArr = JSON.parse(xhttp.responseText);
               
               console.log(xhttp.responseText);

               if(myArr[0]){
                   readLocation(myArr);
                   
                   //setup additional searches
                   googleSearch(thisQuery + " " + cityState);
                   openSearch(thisQuery + " " + cityState);
                   bingSearch(thisQuery + " " + cityState);
               }else{
                   console.log("no data found");
                   alert("No Matching Address found. Please try another address.");
               }
           }else if(xhttp.readyState == 4){
               alert('API Server is being updated -- please try again later');
           }
             
         };
                        
        xhttp.open('GET', "https://api.geofi.io/address?address=" + thisQuery + "\&city="+ city +"\&state=" + state + "\&type=" + "all" + "\&api_key=" + geofiKey, true);
        
         xhttp.send();
    }
    
    function coordSearch(thisQuery){
        var xhttp = new XMLHttpRequest();
        
        var center = map.getCenter();
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var myArr = JSON.parse(xhttp.responseText);

               console.log(xhttp.responseText);
               
               if(myArr[0]){
                   readLocation(myArr);
               }else{
                   console.log("no data found");
                   alert("No Matching Address found. Please try another address.");
               }
           }else if(xhttp.readyState == 4){
               alert('API Server is being updated -- please try again later');
           }
         };

         xhttp.open('GET', "https://api.geofi.io/address?address=" + thisQuery + "\&lat=" + center.lat +"\&lon=" + center.lng + "\&type=" + "all" + "\&api_key=" + geofiKey, true);
        
         xhttp.send();
    }
    
    function googleSearch(thisQuery){
        
        for(var i = 0; i < thisQuery.length; i++) {
         thisQuery = thisQuery.replace(" ", "+");
        }
        
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
               
               //get start point
                var result = response.results;
                var thisLoc = result[0].geometry.location;

               dropGoogle(thisLoc);
           }  
         };
        
        xhttp.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?address=" + thisQuery + "&key=" + googleAPI, true);
        
        xhttp.send();
    }
    
    function openSearch(thisQuery){
        
        for(var i = 0; i < thisQuery.length; i++) {
            thisQuery = thisQuery.replace(" ", "+");
        }
        
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
                              
                var features = response.features;
                var center = features[0].center;

               dropOpen(center);
           }  
         };
        
        xhttp.open('GET', "https://api.mapbox.com/geocoding/v5/mapbox.places/" + thisQuery + ".json?access_token=" + mapboxgl.accessToken, true);
        
        xhttp.send();
    }
    
    function readLocation(arr){
        
        var altEntrances = map.getSource('altEntrances')
        altJson = [];
        
        if(altEntrances){
            map.removeSource('altEntrances');
            map.removeLayer('altEntrances');
        }
        
        for(var i = 0; i < arr.length; i++){            
            if(arr[i].entrance_type == "pedestrian-primary" || arr[i]["place-type"] == "interpolated point"){
                dropMarker(arr[i]);
                var lat = arr[i].lat;
                var lon = arr[i].lon;
                
                map.setCenter([lon, lat]);
                map.setZoom(18);
                currentAddress = {"lat": lat, "lon": lon};
            }else{
                dropAltEntrance(arr[i]);
            }
        }
        
        //show directions button
        document.getElementById('search-directions').hidden = false;
        
        
        turnOnPointUI(arr);
     }
    
    //alt entrances and competitor points
    function turnOnPointUI(arr){
        var altEntrances = map.getSource('altEntrances')

        if(altEntrances){
            map.setLayoutProperty("altEntrances", 'visibility', 'none');
        }
        
        document.getElementById('extra-data').hidden = false;
        document.getElementById('comp-points').hidden = false;
        
        if(arr.length > 1){
            document.getElementById('alt-entrances').hidden = false;
        }
    }
    
    var altShowing = false;
    $('.alt-entrances').on('click', function(e) {        
        if(altShowing){
            altShowing = false;
            map.setLayoutProperty("altEntrances", 'visibility', 'none');
        }else{
            altShowing = true;
            map.setLayoutProperty("altEntrances", 'visibility', 'visible');
        }
    });
    
    var compShowing = false;
    $('.comp-points').on('click', function(e) {        
        if(compShowing){
            compShowing = false;
            map.setLayoutProperty("gAddress", 'visibility', 'none');
            map.setLayoutProperty("gDist", 'visibility', 'none');
            map.setLayoutProperty("bingAddress", 'visibility', 'none');
            map.setLayoutProperty("bingDist", 'visibility', 'none');
            map.setLayoutProperty("openAddress", 'visibility', 'none');
            map.setLayoutProperty("openDist", 'visibility', 'none');
        }else{
            compShowing = true;
            map.setLayoutProperty("gAddress", 'visibility', 'visible');
            map.setLayoutProperty("gDist", 'visibility', 'visible');
            map.setLayoutProperty("bingAddress", 'visibility', 'visible');
            map.setLayoutProperty("bingDist", 'visibility', 'visible');
            map.setLayoutProperty("openAddress", 'visibility', 'visible');
            map.setLayoutProperty("openDist", 'visibility', 'visible');
        }
    });
    
    //drop marker
    var currentMarkerAddress;
    var currentMarkerCityState;
    function dropMarker(data){
        var thisAddJsonArray = new Array;
        
        var thisJSON = {"type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    data.lon,
                    data.lat
                  ]
                },
                "properties": {
                  "description": data.address,
                  "address" : data.address,
                  "city" : data.city,
                  "state" : data.state,
                  "zip" : data.zip,
                  "placeType" : data["place-type"],
                  "icon" : "circle",
                  "color" : '#09B529'
                }};

            thisAddJsonArray.push(thisJSON);
    
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }

        var addresses = map.getSource('addresses')

        if(addresses){
            map.removeSource('addresses');
            map.removeLayer('addresses');
        }

        map.addSource('addresses',{
            type: 'geojson',
            data: geoJson
        });

        map.addLayer({
            id: 'addresses',
            source: 'addresses',
            type: 'symbol',
            "layout": {
                "icon-image": "geofi-marker",
                "icon-allow-overlap": true,
                "text-field": "GeoFi\n" + data.address,
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 11,
                "text-letter-spacing": 0.05,
                "text-offset": [0, 3]
            },
            paint: {
              "text-color": "#09B529"
            }
        });
        
        //fill in address bar
        currentMarkerAddress = data.address;
        currentMarkerCityState = data.city + ", " + data.state;
    }
    
    function dropAltEntrance(data){
        var thisAddJsonArray = new Array;
        
        var placeType = data.entrance_type;
        
        if(placeType == "pedestrian-secondary"){
            placeType = "PED-S";
        }else if(placeType == "parking"){
            placeType = "PARK";
        }else if(placeType == "loading"){
            placeType = "LOAD";
        }else if(placeType == "service"){
            placeType = "SERV";
        }
        
        var thisJSON = {"type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    data.lon,
                    data.lat
                  ]
                },
                "properties": {
                  "description": placeType,
                  "address" : data.address,
                  "city" : data.city,
                  "state" : data.state,
                  "zip" : data.zip,
                  "placeType" : placeType,
                  "icon" : "circle",
                  "color" : '#09B529'
                }};

        var altEntrances = map.getSource('altEntrances')

        if(altEntrances){
            altJson.features.push(thisJSON);
            map.getSource('altEntrances').setData(altJson);
        }else{
            thisAddJsonArray.push(thisJSON);
        
            altJson = {
                "type": "FeatureCollection",       
                "features": thisAddJsonArray
            }

            map.addSource('altEntrances',{
                type: 'geojson',
                data: altJson
            });

            map.addLayer({
                id: 'altEntrances',
                source: 'altEntrances',
                type: 'symbol',
                "layout": {
                    "icon-image": "geofi-marker",
                    "icon-allow-overlap": true,
                    "text-field": '{description}',
                    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                    "text-size": 11,
                    "text-letter-spacing": 0.05,
                    "text-offset": [0, 3]
                },
                paint: {
                  "text-color": "#09B529"
                }
            });
        }
        

    }
    
    //drop google point
    function dropGoogle(location){
        var thisAddJsonArray = new Array;

        var thisJSON = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                location.lng,
                location.lat
              ]
            }
        }
        
        thisAddJsonArray.push(thisJSON);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }
        
        var gAdd = map.getSource('gAddress')

        if(gAdd){
            map.removeLayer('gAddress');
            map.removeSource('gAddress');
        }
            map.addSource('gAddress',{
                type: 'geojson',
                data: geoJson
            });

            map.addLayer({
                id: 'gAddress',
                source: 'gAddress',
                type: 'symbol',
                "layout": {
                    "icon-image": "google-marker",
                    "icon-allow-overlap": true,
                    "text-field": "BigCo 3\n" + calcDist(location.lat, location.lng, currentAddress.lat, currentAddress.lon) + "m",
                    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                    "text-size": 11,
                    "text-letter-spacing": 0.05,
                    "text-offset": [0, 2]
                },
                paint: {
                  "text-color": "#D10F0F"
                }
            });
//        }
        
        drawGLine(location);
    }
    
    function drawGLine(location){
        
        var locationArray = [[location.lng, location.lat], [currentAddress.lon, currentAddress.lat]];
        
        var gDist = map.getSource('gDist');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(gDist){
            map.getSource('gDist').setData(locData);
            map.setLayoutProperty("gDist", 'visibility', 'visible');
        }else{
            map.addSource('gDist',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "gDist",
                "type": "line",
                "source": "gDist",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#D10F0F",
                    "line-width": 3,
                    "line-dasharray": [.5, 1.5]
                }
            }, 'addresses', 'gAddress');
        }
        
        map.setLayoutProperty("gAddress", 'visibility', 'none');
        map.setLayoutProperty("gDist", 'visibility', 'none');
    }
    
    //drop OPEN point
    function dropOpen(location){
        var thisAddJsonArray = new Array;

        var thisJSON = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                location[0],
                location[1]
              ]
            }
        }
        
        thisAddJsonArray.push(thisJSON);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }
        
        var openAdd = map.getSource('openAddress')

        if(openAdd){
            map.removeLayer('openAddress');
            map.removeSource('openAddress');
        }
        
        map.addSource('openAddress',{
            type: 'geojson',
            data: geoJson
        });

        map.addLayer({
            id: 'openAddress',
            source: 'openAddress',
            type: 'symbol',
            "layout": {
                "icon-image": "open-marker",
                "icon-allow-overlap": true,
                "text-field": "BigCo 1\n" + calcDist(location[1], location[0], currentAddress.lat, currentAddress.lon) + "m",
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 11,
                "text-letter-spacing": 0.05,
                "text-offset": [0, 2]
            },
            paint: {
              'text-color': '#E864DD',
            },
        });
        
        drawOPENLine(location);
    }
    
    function drawOPENLine(location){
        
        var locationArray = [[location[0], location[1]], [currentAddress.lon, currentAddress.lat]];
        
        var openDist = map.getSource('openDist');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(openDist){
            map.getSource('openDist').setData(locData);
            map.setLayoutProperty("openDist", 'visibility', 'visible');
        }else{
            map.addSource('openDist',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "openDist",
                "type": "line",
                "source": "openDist",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#E864DD",
                    "line-width": 3,
                    "line-dasharray": [.5, 1.5]
                }
            }, 'addresses', 'openAddress');
        }
        
        map.setLayoutProperty("openAddress", 'visibility', 'none');
        map.setLayoutProperty("openDist", 'visibility', 'none');
    }
    
    //distance calculation
    function calcDist(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return Math.round( (d*1000) * 10 ) / 10;
    }
    
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
    
    //marker click detection
    map.on('click', function(e) {
          
    });
    
    //***********************Bing Geocoding****************************************
    
    function bingSearch(thisQuery){
        
        for(var i = 0; i < thisQuery.length; i++) {
            thisQuery = thisQuery.replace(" ", "+");
        }
        
        var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations?query=" + encodeURI(thisQuery) + "&output=json&jsonp=geocodeCallback&suppressStatus=true&key=" + bingAPI;
        
        callRestService(geocodeRequest);
    }
    
    function callRestService(request){
       var script = document.createElement("script");
       script.setAttribute("type", "text/javascript");
       script.setAttribute("src", request);
       document.body.appendChild(script);
    }
    
    geocodeCallback = function(result){   
        var resources = result.resourceSets[0].resources[0];
        var point = resources.point.coordinates;
        dropBing(point);
    }
    
    function dropBing(coords){
        var thisBingJsonArray = new Array;

        var thisJSON = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                coords[1],
                coords[0]
              ]
            }
        }
        
        thisBingJsonArray.push(thisJSON);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisBingJsonArray
        }
        
        var bingAddress = map.getSource('bingAddress')

        if(bingAddress){
            map.removeLayer('bingAddress');
            map.removeSource('bingAddress');
        }
            
        map.addSource('bingAddress',{
            type: 'geojson',
            data: geoJson
        });

        map.addLayer({
            id: 'bingAddress',
            source: 'bingAddress',
            type: 'symbol',
            "layout": {
                "icon-image": "bing-marker",
                "icon-allow-overlap": true,
                "text-field": "BigCo 2\n" + calcDist(coords[0], coords[1], currentAddress.lat, currentAddress.lon) + "m",
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 11,
                "text-letter-spacing": 0.05,
                "text-offset": [0, 2]
            },
            paint: {
              "text-color": "#FFA500"
            }
        }, 'addresses');
        
        drawBingLine(coords);
    }
    
    function drawBingLine(location){
        
        var locationArray = [[location[1], location[0]], [currentAddress.lon, currentAddress.lat]];
        
        var bingDist = map.getSource('bingDist');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(bingDist){
            map.getSource('bingDist').setData(locData);
            map.setLayoutProperty("bingDist", 'visibility', 'visible');
        }else{
            map.addSource('bingDist',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "bingDist",
                "type": "line",
                "source": "bingDist",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#FFA500",
                    "line-width": 3,
                    "line-dasharray": [.5, 1.5]
                }
            }, 'addresses', 'bingAddress');
        }
        
        map.setLayoutProperty("bingAddress", 'visibility', 'none');
        map.setLayoutProperty("bingDist", 'visibility', 'none');
    }
        
    //***********************DIRECTIONS*********************************************
    
    $('.call-search-directions').on('click', function(e) {
        var query = document.getElementById('address-query').value;
        var cityState = document.getElementById('city-state').value;
            
        document.getElementById('search-directions').hidden = true;
        document.getElementById('extra-data').hidden = true;
        document.getElementById('comp-points').hidden = true;
        document.getElementById('alt-entrances').hidden = true;
        
        $('.end-address').val(currentMarkerAddress);
        $('.end-city-state').val(currentMarkerCityState);        
        $('.open-Directions').click();
    });
    
    //directions button
    var directionOut = false;
    $('.open-Directions').on('click', function(e) {
        document.getElementById("menu").style.marginLeft = "0px";
        
        var addresses = map.getSource('addresses')

        if(addresses){
            map.setLayoutProperty("addresses", 'visibility', 'none');
            map.setLayoutProperty("openAddress", 'visibility', 'none');
            map.setLayoutProperty("gAddress", 'visibility', 'none');
            map.setLayoutProperty("gDist", 'visibility', 'none');
            map.setLayoutProperty("openDist", 'visibility', 'none');
            map.setLayoutProperty("bingAddress", 'visibility', 'none');
            map.setLayoutProperty("bingDist", 'visibility', 'none');
            map.setLayoutProperty("altEntrances", 'visibility', 'none');
            document.getElementById('extra-data').hidden = true;
            document.getElementById('comp-points').hidden = true;
            document.getElementById('alt-entrances').hidden = true;
        }
        
        if(directionOut){
            directionOut = false;
            $('.open-Directions').css("color", "#fff");
            $('.open-Directions').css("background", "#0F0C27");
            
            //close directions menu
            $('.close').click();
        }else{
            directionOut = true;
            $('.open-Directions').css("color", "#0F0C27");
            $('.open-Directions').css("background", "#fff");
        }
    });
    
    $('.close').on('click', function(e) {
        
        if(directionOut){            
            directionOut = false;
            $('.open-Directions').css("color", "#fff");
            $('.open-Directions').css("background", "#0F0C27");
            $('.menu').css("margin-left", "-100%");
        }else{
            document.getElementById("menu").style.marginLeft = "-387px";
        }
        
        //hide buttons if out
        document.getElementById('on-map').hidden = true;
        $('.on-map-sim').text('Compare Us');
        document.getElementById('search-directions').hidden = true;
        
        map.setLayoutProperty("gRoute", 'visibility', 'none');
        map.setLayoutProperty("gStart", 'visibility', 'none');
        map.setLayoutProperty("gEnd", 'visibility', 'none');
        map.setLayoutProperty("googleStart", 'visibility', 'none');
        map.setLayoutProperty("googleEnd", 'visibility', 'none');
        map.setLayoutProperty("routeStart", 'visibility', 'none');
        map.setLayoutProperty("routeEnd", 'visibility', 'none');
        
        map.setLayoutProperty("openRoute", 'visibility', 'none');
        map.setLayoutProperty("openStart", 'visibility', 'none');
        map.setLayoutProperty("openEnd", 'visibility', 'none');
        map.setLayoutProperty("openRouteStart", 'visibility', 'none');
        map.setLayoutProperty("openRouteEnd", 'visibility', 'none');
        
        map.setLayoutProperty("bingRoute", 'visibility', 'none');
        map.setLayoutProperty("bingStart", 'visibility', 'none');
        map.setLayoutProperty("bingEnd", 'visibility', 'none');
        map.setLayoutProperty("bingStartRoute", 'visibility', 'none');
        map.setLayoutProperty("bingEndRoute", 'visibility', 'none');
        
        //change camera zoom/pitch/bearing
        map.setZoom(15);
        map.setPitch(0);
        map.setBearing(0);
        
        //clear old route
        for(var a = 0; a < geofiRoute.length; a++){
            var thisRoute = map.getSource(geofiRoute[a]);
            
            if(thisRoute){
                map.removeLayer(geofiRoute[a]);
                map.removeSource(geofiRoute[a]);
            }
        }
        
        geofiRoute = [];
    });
    
    $('.swap').on('click', function(e) {        
        var startAddress = $('#start-address').val();
        var startCityState = $('#start-city-state').val();
        var endAddress = $('#end-address').val();
        var endCityState = $('#end-city-state').val();
                
        $('#end-address').val(startAddress);
        $('#start-address').val(endAddress);
        $('#start-city-state').val(endCityState);
        $('#end-city-state').val(startCityState);
    });
    
    $('#car').on('click', function(e){
        transitType = "driving";
        document.getElementById("car").style.backgroundColor = "#FC0D1B";
        document.getElementById("walk").style.backgroundColor = "#FFFFFF";
        document.getElementById("bike").style.backgroundColor = "#FFFFFF";
    });
    
    $('#walk').on('click', function(e){
        transitType = "walking";
        document.getElementById("walk").style.backgroundColor = "#FC0D1B";
        document.getElementById("car").style.backgroundColor = "#FFFFFF";
        document.getElementById("bike").style.backgroundColor = "#FFFFFF";
    });
    
    $('#bike').on('click', function(e){
        transitType = "cycling";
        document.getElementById("bike").style.backgroundColor = "#FC0D1B";
        document.getElementById("walk").style.backgroundColor = "#FFFFFF";
        document.getElementById("car").style.backgroundColor = "#FFFFFF";
    });
    
    $('#entrance').on('click', function(e){
        entranceType = "all-pedestrian";
        document.getElementById("entrance").style.backgroundColor = "#FC0D1B";
        document.getElementById("parking").style.backgroundColor = "#FFFFFF";
        document.getElementById("loading").style.backgroundColor = "#FFFFFF";
    });
    
    $('#parking').on('click', function(e){
        entranceType = "all-parking";
        document.getElementById("parking").style.backgroundColor = "#FC0D1B";
        document.getElementById("entrance").style.backgroundColor = "#FFFFFF";
        document.getElementById("loading").style.backgroundColor = "#FFFFFF";
    });
    
    $('#loading').on('click', function(e){
        entranceType = "all-loading";
        document.getElementById("loading").style.backgroundColor = "#FC0D1B";
        document.getElementById("parking").style.backgroundColor = "#FFFFFF";
        document.getElementById("entrance").style.backgroundColor = "#FFFFFF";
    });
    
    //settings button stuff
    var gearOut = false;
    
    $('.open-gear').on('click', function(e) {
        
        if(gearOut){
            gearOut = false;
            var elem = document.getElementById("direction-butt");
            var elem2 = document.getElementById("toggle-sat");
            var pos = 40;
            var id = setInterval(frame, 5);
            function frame() {
                if (pos == 0) {
                    clearInterval(id);
                } else {
                    pos--;
                    elem.style.bottom = 2 * pos + 'px';
                    elem.style.left = .5 * pos + 'px';

                    elem2.style.bottom = .5 * pos + 'px';
                    elem2.style.left = 2 * pos + 'px';
                }
            }
        }else{
            gearOut = true;
            var elem = document.getElementById("direction-butt");
            var elem2 = document.getElementById("toggle-sat");
            var pos = 0;
            var id = setInterval(frame, 5);
            function frame() {
                if (pos == 40) {
                    clearInterval(id);
                } else {
                    pos++;
                    elem.style.bottom = 2 * pos + 'px';
                    elem.style.left = .5 * pos + 'px';

                    elem2.style.bottom = .5 * pos + 'px';
                    elem2.style.left = 2 * pos + 'px';
                }
            }
        }
    });
    
    //sat button toggle
    var satOn = false;
    
    $('.toggle-sat').on('click', function(e) {
        if(satOn){
            satOn = false;
            map.setLayoutProperty("mapbox-mapbox-satellite", 'visibility', 'none');
            
            $('.toggle-sat').css("background", "url(satMap.png) no-repeat");
            $('.toggle-sat').css("background-size", "50px 50px");
            $('.toggle-sat').css("border-color", "#fff");
        }else{
            satOn = true;
            map.setLayoutProperty("mapbox-mapbox-satellite", 'visibility', 'visible');
            
            $('.toggle-sat').css("background", "url(normMap.png) no-repeat");
            $('.toggle-sat').css("background-size", "50px 50px");
            $('.toggle-sat').css("border-color", "#1F363D");
        }
    });
        
    $('.get-directions').on('click', function(e) {        
        console.log("get " + transitType + " directions");
        
        //reset comparison
        compareRoutes = false;
        $('.compareRoutes').text('Compare Routes');
        $('#gTime').text(" ");
        
        //get query parts
        var startAddress = document.getElementById('start-address').value;
        var startCityState = document.getElementById('start-city-state').value;
        var endAddress = document.getElementById('end-address').value;
        var endCityState = document.getElementById('end-city-state').value;
        
        if(startCityState.indexOf(",") == -1){
            alert("Your start address is missing a comma between city and state");
            return;
        }
        
        if(endCityState.indexOf(",") == -1){
            alert("Your destination is missing a comma between city and state");
            return;
        }
        
        if(detectmob()){
            document.getElementById('search-directions').hidden = true;
            $('.menu').css("margin-left", "-100%");

            directionOut = false;
            $('.open-Directions').css("color", "#fff");
            $('.open-Directions').css("background", "#0F0C27");
            
            document.getElementById('on-map').hidden = false;
        }
        
        callDirections(startAddress, startCityState, endAddress, endCityState);
        googleDirections(startAddress, startCityState, endAddress, endCityState);
        openStart(startAddress, startCityState, endAddress, endCityState);
        bingStart(startAddress, startCityState, endAddress, endCityState);
    });
    
    function callDirections(startAddress, startCityState, endAddress, endCityState){
        var xhttp = new XMLHttpRequest();
        
        //split address
        var splitQuery = startCityState.split(",");
        var city = splitQuery[0];
        var state = splitQuery[1].replace(/\s/g, '');
        
        var splitQuery2 = endCityState.split(",");
        var city2 = splitQuery2[0];
        var state2 = splitQuery2[1].replace(/\s/g, '');
        
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
               
               readDirections(response);
           }else if(xhttp.status == 500){
               alert("There was an error. Please try your request again");
           }
         };

        var dicString = "{\"sourceAddress\" : {\"address\":\"" + startAddress + "\",\"city\" :\"" + city + "\", \"state\" : \"" + state +"\", \"type\" : \"" + entranceType + "\"}, \"destinationAddress\" : {\"address\":\"" + endAddress + "\",\"city\" : \"" + city2 + "\", \"state\" : \"" + state2 + "\", \"type\" : \"" + entranceType + "\"}, \"type\": \"" + transitType + "\"}";
        var bytes = [];

        for(var i = 0; i < dicString.length; ++i){
            bytes.push(dicString.charCodeAt(i));
        }
                
        xhttp.open('POST', "https://api.geofi.io/directions?api_key=" + geofiKey, true);
        xhttp.setRequestHeader("Content-Type","application/json");
        xhttp.setRequestHeader("Accept","application/json");
        xhttp.send(dicString);
    }
    
    function googleDirections(startAddress, startCityState, endAddress, endCityState){
        
        //split address
        var splitQuery = startCityState.split(",");
        var city = splitQuery[0];
        var state = splitQuery[1].replace(/\s/g, '');
        
        var splitQuery2 = endCityState.split(",");
        var city2 = splitQuery2[0];
        var state2 = splitQuery2[1].replace(/\s/g, '');
        
        var start = startAddress+ " " + city + " " + state;
        var end = endAddress + " " + city2 + " " + state2;
        
        //convert addresses
        for(var i = 0; i < start.length; i++) {
         start = start.replace(" ", "+");
        }
        
        for(var e = 0; e < end.length; e++) {
         end = end.replace(" ", "+");
        }
        
        var gTransit = "DRIVING";
        
        if(transitType.valueOf() == "cycling"){
            gTransit = "BICYCLING";
        }else if(transitType.valueOf() == "walking"){
            gTransit = "WALKING";
        }
        
        //google js api
        var directionsService = new google.maps.DirectionsService;
        directionsService.route({
          origin: start,
          destination: end,
          travelMode: gTransit
        }, function(response, status) {
          if (status === 'OK') {
            googleGeocode(start, end, response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }
    
    //google geocode
    function googleGeocode(start, end, directions){
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);

               googleGeocode2(response, end, directions);
           }  
         };
        
        xhttp.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?address=" + start + "&key=" + googleAPI, true);
        
        xhttp.send();
    }
    
    function googleGeocode2(startResponse, end, directions){
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
            
               readGoogleDirections(directions, startResponse, response);
           }  
         };
        
        xhttp.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?address=" + end + "&key=" + googleAPI, true);
        
        xhttp.send();
    }
    
    function readDirections(response){
        console.log(geofiRoute);
        
        //clear old route
        for(var a = 0; a < geofiRoute.length; a++){
            var thisRoute = map.getSource(geofiRoute[a]);
            
            if(thisRoute){
                map.removeLayer(geofiRoute[a]);
                map.removeSource(geofiRoute[a]);
            }
        }
        
        geofiRoute = [];
        
        var routes = response.routes;
        var duration = routes[0].duration;
        var distance = routes[0].distance;
        var polyline = routes[0].geometry;
        
        //format start and stop coordinates
        var startLoc = response.sourceLocation;
        var endLoc = response.destinationLocation;

        //get location points for route
        var locationArray = [];
        var geometryArray = [];
        var steps = routes[0].legs[0].steps;
        
        //add first location
        locationArray.push(startLoc);
        
        //multiple polylines
        var polylineArray = [];
        for(var i = 0; i < steps.length; i++){
            var thisStep = steps[i];
            var thisPoly = decode(thisStep.geometry, 5);
            
            if(i == 0){
                thisPoly.unshift(startLoc);
            }else if(i == steps.length-1){
                thisPoly.push(endLoc);
            }
            
            drawRoute(thisPoly, i);
        }
        
        fillInDetails(distance, duration);
        
        //drop end marker
        routeEnd(endLoc);
        routeStart(startLoc);
        
        map.setCenter(endLoc);
        map.setZoom(18);
        
        ourRoute = polylineArray;
    }
    
    var gDuration;
    function readGoogleDirections(directions, startResponse, endResponse){
        var routes = directions.routes;
        var bounds = routes[0].bounds;
        var polyline = routes[0]["overview_polyline"];
        
        //get google time
        gDuration = routes[0].legs[0].duration.value;
        
        //get start point
        var startResult = startResponse.results;
        var startLoc = startResult[0].geometry.location;
        var startPoint = [];
        startPoint.push(startLoc.lng);
        startPoint.push(startLoc.lat);
        
        //get start point
        var endResult = endResponse.results;
        var endLoc = endResult[0].geometry.location;
        var endPoint = [];
        endPoint.push(endLoc.lng);
        endPoint.push(endLoc.lat);
                
        var googleArray = decode(polyline, 5);
        
        drawGoogle(googleArray);
        drawGoogleEnds(googleArray, startPoint, endPoint);
        
        googleEnd(endPoint);
        googleStart(startPoint);
    }
    
    function drawRoute(locationArray, count){
        var routeLabel = "route" + count;
        geofiRoute.push(routeLabel);
        
        var route = map.getSource(routeLabel);
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(route){
            map.getSource(routeLabel).setData(locData);
            map.setLayoutProperty(routeLabel, 'visibility', 'visible');
        }else{
            map.addSource(routeLabel,{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": routeLabel,
                "type": "line",
                "source": routeLabel,
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#09B529",
                    "line-width": 4
                }
            });
        }
    }
    
    function drawGoogle(locationArray){
        
        var gRoute = map.getSource('gRoute');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(gRoute){
            map.getSource('gRoute').setData(locData);
            map.setLayoutProperty("gRoute", 'visibility', 'visible');
        }else{
            map.addSource('gRoute',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "gRoute",
                "type": "line",
                "source": "gRoute",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#D10F0F",
                    "line-width": 6,
                }
            }, 'route');
        }
        
        map.setLayoutProperty("gRoute", 'visibility', 'none');
    }
    
    function drawGoogleEnds(locationArray, start, end){
        //start line
        var gStart = map.getSource('gStart');
        var startLocData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [start, locationArray[0]]
                }
        }

        if(gStart){
            map.getSource('gStart').setData(startLocData);
            map.setLayoutProperty("gStart", 'visibility', 'visible');
        }else{
            map.addSource('gStart',{
                type: 'geojson',
                data: startLocData
            });
            
            map.addLayer({
                "id": "gStart",
                "type": "line",
                "source": "gStart",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#D10F0F",
                    "line-width": 5,
                    "line-dasharray": [.25, 1.5]
                }
            }, 'route');
        }
        
        //end line
        var gEnd = map.getSource('gEnd');
        var endLocData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [locationArray[locationArray.length -1 ], end]
                }
        }

        if(gEnd){
            map.getSource('gEnd').setData(endLocData);
            map.setLayoutProperty("gEnd", 'visibility', 'visible');
        }else{
            map.addSource('gEnd',{
                type: 'geojson',
                data: endLocData
            });
            
            map.addLayer({
                "id": "gEnd",
                "type": "line",
                "source": "gEnd",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#D10F0F",
                    "line-width": 5,
                    "line-dasharray": [.25, 1.5]
                }
            }, 'route');
        }
        
        map.setLayoutProperty("gStart", 'visibility', 'none');
        map.setLayoutProperty("gEnd", 'visibility', 'none');
    }
    
    var geofiDuration;
    function fillInDetails(meters, seconds){
        geofiDuration = seconds;
        var miles = meters*0.000621371192;
        var time = secondsToHms(seconds);
                
        $('#distance').text("Distance:  " + miles.toFixed(1) + " miles");
        $('#duration').text("Duration:  " + time);
    }
    
    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return ((h > 0 ? h + " h " + (m < 10 ? "0" : "") : "") + m + " min"); 
    }
    
    //decode polyline
    function decode(str, precision) {        
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {

            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;
                        
            var theseCoords = [];
            theseCoords.push(lng / factor);
            theseCoords.push(lat/factor);

            coordinates.push(theseCoords);
        }

        return coordinates;
    };
    
    //drop our end point
    function routeEnd(location){
        var thisAddJsonArray = new Array;
        
        var thisJSON = {"type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": location
                }
            }
                        
            thisAddJsonArray.push(thisJSON);
    
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }

        var addresses = map.getSource('routeEnd')

        if(addresses){
            map.removeSource('routeEnd');
            map.removeLayer('routeEnd');
        }
            map.addSource('routeEnd',{
                type: 'geojson',
                data: geoJson
            });

            map.addLayer({
                id: 'routeEnd',
                source: 'routeEnd',
                type: 'symbol',
                "layout": {
                    "icon-image": "geofi-marker",
                },
                paint: {
                  "text-color": "#09B529"
                }
            });
    }
    
    function googleEnd(location){
        var thisAddJsonArray = new Array;
        
        var thisJSON = {"type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": location
                }
            }
                        
            thisAddJsonArray.push(thisJSON);
    
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }

        var addresses = map.getSource('googleEnd')

        if(addresses){
            map.removeSource('googleEnd');
            map.removeLayer('googleEnd');
        }
            map.addSource('googleEnd',{
                type: 'geojson',
                data: geoJson
            });

            map.addLayer({
                id: 'googleEnd',
                source: 'googleEnd',
                type: 'symbol',
                "layout": {
                    "icon-image": "google-marker",
                },
                paint: {
                  "text-color": "#4DD10F"
                }
            });
        
        map.setLayoutProperty("googleEnd", 'visibility', 'none');
    }
    
    function routeStart(location){
        var thisAddJsonArray = new Array;
        
        var thisJSON = {"type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": location
                }
            }
                        
            thisAddJsonArray.push(thisJSON);
    
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }

        var addresses = map.getSource('routeStart')

        if(addresses){
            map.removeSource('routeStart');
            map.removeLayer('routeStart');
        }
            map.addSource('routeStart',{
                type: 'geojson',
                data: geoJson
            });

            map.addLayer({
                id: 'routeStart',
                source: 'routeStart',
                type: 'symbol',
                "layout": {
                    "icon-image": "geofi-marker",
                },
                paint: {
                  "text-color": "#09B529"
                }
            });
    }
    
    function googleStart(location){
        var thisAddJsonArray = new Array;
        
        var thisJSON = {"type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": location
                }
            }
                        
            thisAddJsonArray.push(thisJSON);
    
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }

        var addresses = map.getSource('googleStart')

        if(addresses){
            map.removeSource('googleStart');
            map.removeLayer('googleStart');
        }

        map.addSource('googleStart',{
            type: 'geojson',
            data: geoJson
        });

        map.addLayer({
            id: 'googleStart',
            source: 'googleStart',
            type: 'symbol',
            "layout": {
                "icon-image": "google-marker",
            },
            paint: {
              "text-color": "#4DD10F"
            }
        });
        
        map.setLayoutProperty("googleStart", 'visibility', 'none');
    }
    
    //*****************************Open Street Map Directions *************************//
    
    function openStart(startAddress, startCityState, endAddress, endCityState){
        
        var thisQuery = startAddress + " " + startCityState;
        
        for(var i = 0; i < thisQuery.length; i++) {
            thisQuery = thisQuery.replace(" ", "+");
        }
        
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
                              
                var features = response.features;
                var center = features[0].center;

               openEnd(center, endAddress, endCityState);
           }  
         };
        
        xhttp.open('GET', "https://api.mapbox.com/geocoding/v5/mapbox.places/" + thisQuery + ".json?access_token=" + mapboxgl.accessToken, true);
        
        xhttp.send();
    }
    
    function openEnd(startPoint, endAddress, endCityState){
        
        var thisQuery = endAddress + " " + endCityState;
        
        for(var i = 0; i < thisQuery.length; i++) {
            thisQuery = thisQuery.replace(" ", "+");
        }
        
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
                              
                var features = response.features;
                var center = features[0].center;

               openDirections(startPoint, center);
           }  
         };
        
        xhttp.open('GET', "https://api.mapbox.com/geocoding/v5/mapbox.places/" + thisQuery + ".json?access_token=" + mapboxgl.accessToken, true);
        
        xhttp.send();
    }
    
    function openDirections(startResult, endResult){
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
               
               readOpenDirections(response, startResult, endResult);
           }  
         };
        
        xhttp.open('GET', "https://api.mapbox.com/directions/v5/mapbox/" + transitType + "/" + startResult + ";" + endResult + "?steps=true&access_token=" + mapboxgl.accessToken, true);
        
         xhttp.send();
    }
    
    function readOpenDirections(directions, startPoint, endPoint){
        
        var routes = directions.routes;
        var polyline = routes[0].geometry;        

        var steps = routes[0].legs[0].steps;

        var polylineArray = decode(polyline, 5);
                
        drawOpenRoute(polylineArray);
        dropOpenEnds(startPoint, endPoint);
        
        drawOpenEndsRoutes(polylineArray, startPoint, endPoint);
    }
    
    function drawOpenRoute(polylineArray){
        var openRoute = map.getSource('openRoute');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": polylineArray
                }
        }

        if(openRoute){
            map.getSource('openRoute').setData(locData);
            map.setLayoutProperty("openRoute", 'visibility', 'visible');
        }else{
            map.addSource('openRoute',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "openRoute",
                "type": "line",
                "source": "openRoute",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#E864DD",
                    "line-width": 8
                }
            }, 'route');
        }
        
        map.setLayoutProperty("openRoute", 'visibility', 'none');
    }
    
    function dropOpenEnds(start, end){
        
        var thisStartJsonArray = new Array;

        var startJson = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                start[0],
                start[1]
              ]
            }
        }
        
        thisStartJsonArray.push(startJson);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisStartJsonArray
        }
        
        var openStart = map.getSource('openStart')

        if(openStart){
            map.removeLayer('openStart');
            map.removeSource('openStart');
        }
        
        map.addSource('openStart',{
            type: 'geojson',
            data: geoJson
        });

        map.addLayer({
            id: 'openStart',
            source: 'openStart',
            type: 'symbol',
            "layout": {
                "icon-image": "open-marker",
            }
        });
        
        var thisEndJsonArray = new Array;

        var endJson = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                end[0],
                end[1]
              ]
            }
        }
        
        thisEndJsonArray.push(endJson);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisEndJsonArray
        }
        
        var openEnd = map.getSource('openEnd')

        if(openEnd){
            map.removeLayer('openEnd');
            map.removeSource('openEnd');
        }
        
        map.addSource('openEnd',{
            type: 'geojson',
            data: geoJson
        });

        map.addLayer({
            id: 'openEnd',
            source: 'openEnd',
            type: 'symbol',
            "layout": {
                "icon-image": "open-marker",
            }
        });
        
        map.setLayoutProperty("openStart", 'visibility', 'none');
        map.setLayoutProperty("openEnd", 'visibility', 'none');
    }
    
    function drawOpenEndsRoutes(points, start, end){
        console.log("points");
        
        //start line
        var openRouteStart = map.getSource('openRouteStart');
        var startLocData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [start, points[0]]
                }
        }

        if(openRouteStart){
            map.getSource('openRouteStart').setData(startLocData);
            map.setLayoutProperty("openRouteStart", 'visibility', 'visible');
        }else{
            map.addSource('openRouteStart',{
                type: 'geojson',
                data: startLocData
            });
            
            map.addLayer({
                "id": "openRouteStart",
                "type": "line",
                "source": "openRouteStart",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#E864DD",
                    "line-width": 5,
                    "line-dasharray": [.25, 1.5]
                }
            }, 'route');
        }
        
        //end line
        var openRouteEnd = map.getSource('openRouteEnd');
        var endLocData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [points[points.length -1 ], end]
                }
        }

        if(openRouteEnd){
            map.getSource('openRouteEnd').setData(endLocData);
            map.setLayoutProperty("openRouteEnd", 'visibility', 'visible');
        }else{
            map.addSource('openRouteEnd',{
                type: 'geojson',
                data: endLocData
            });
            
            map.addLayer({
                "id": "openRouteEnd",
                "type": "line",
                "source": "openRouteEnd",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#E864DD",
                    "line-width": 5,
                    "line-dasharray": [.25, 1.5]
                }
            }, 'route');
        }
        
        map.setLayoutProperty("openRouteStart", 'visibility', 'none');
        map.setLayoutProperty("openRouteEnd", 'visibility', 'none');
    }
    
    ///******************************* BING Directions ***************************///
    
    function bingStart(startAddress, startCityState, endAddress, endCityState){
        
        var start = startAddress + " " + startCityState;
        var end = endAddress + " " + endCityState;
        
        for(var i = 0; i < start.length; i++) {
            start = start.replace(" ", "+");
        }
        
        for(var i = 0; i < end.length; i++) {
            end = end.replace(" ", "+");
        }
        
        var sentTransit = transitType;
        
        if(transitType == "cycling"){
            sentTransit = "walking";
        }
        
        var directionsRequest = "http://dev.virtualearth.net/REST/V1/Routes/"+ sentTransit +"?wp.0="+ encodeURI(start) +"&wp.1=" + encodeURI(end) + "&output=json&jsonp=directionsCallback&suppressStatus=true&routeAttributes=routePath&key=" + bingAPI;
        
        directionsRestService(directionsRequest);
    }
    
    function directionsRestService(request){
       var script = document.createElement("script");
       script.setAttribute("type", "text/javascript");
       script.setAttribute("src", request);
       document.body.appendChild(script);
    }
    
    directionsCallback = function(result){   
        var resources = result.resourceSets[0].resources[0];
        
        //get main route
        var coords = resources["routePath"].line.coordinates;
        var revCoords = reverseCoords(coords);
        drawBingRoute(revCoords);
        
        //get endpoints
        var routeLegs = resources["routeLegs"][0];
        var endLocation = routeLegs["endLocation"].point.coordinates;
        var startLocation = routeLegs["startLocation"].point.coordinates;
        
        drawBingStart(startLocation, revCoords[0]);
        drawBingEnd(endLocation, revCoords[revCoords.length-1]);
    }
    
    function reverseCoords(coords){
        
        var revCoords = [];
        
        for(var i = 0; i < coords.length; i++){
            var thisCoord = coords[i];
            var newCoord = [thisCoord[1], thisCoord[0]];
            
            revCoords.push(newCoord);
        }
        
        return revCoords;
    }
    
    function drawBingRoute(polylineArray){
        var bingRoute = map.getSource('bingRoute');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": polylineArray
                }
        }

        if(bingRoute){
            map.getSource('bingRoute').setData(locData);
            map.setLayoutProperty("bingRoute", 'visibility', 'visible');
        }else{
            map.addSource('bingRoute',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "bingRoute",
                "type": "line",
                "source": "bingRoute",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#FFA500",
                    "line-width": 8
                }
            }, 'route');
        }
        
        map.setLayoutProperty("bingRoute", 'visibility', 'none');
    }
    
    function drawBingStart(startPoint, routeStart){
        
        //draw start point
        var thisBingJsonArray = new Array;

        var thisJSON = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                startPoint[1],
                startPoint[0]
              ]
            }
        }
        
        thisBingJsonArray.push(thisJSON);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisBingJsonArray
        }
        
        var bingStart = map.getSource('bingStart')

        if(bingStart){
            map.removeLayer('bingStart');
            map.removeSource('bingStart');
        }
            
        map.addSource('bingStart',{
            type: 'geojson',
            data: geoJson
        });

        map.addLayer({
            id: 'bingStart',
            source: 'bingStart',
            type: 'symbol',
            "layout": {
                "icon-image": "bing-marker",
            }
        }, 'route');
        
        //bing start route
        var bingStartRoute = map.getSource('bingStartRoute');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [startPoint[1], startPoint[0]],
                        [routeStart[0], routeStart[1]]
                    ]
                }
        }

        if(bingStartRoute){
            map.getSource('bingStartRoute').setData(locData);
            map.setLayoutProperty("bingStartRoute", 'visibility', 'visible');
        }else{
            map.addSource('bingStartRoute',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "bingStartRoute",
                "type": "line",
                "source": "bingStartRoute",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#FFA500",
                    "line-width": 5,
                    "line-dasharray": [.25, 1.5]
                }
            }, 'route');
        }
        
        map.setLayoutProperty("bingStart", 'visibility', 'none');
        map.setLayoutProperty("bingStartRoute", 'visibility', 'none');
    }
    
    function drawBingEnd(endPoint, routeEnd){
        //draw end point
        var thisBingJsonArray = new Array;

        var thisJSON = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                endPoint[1],
                endPoint[0]
              ]
            }
        }
        
        thisBingJsonArray.push(thisJSON);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisBingJsonArray
        }
        
        var bingEnd = map.getSource('bingEnd')

        if(bingEnd){
            map.removeLayer('bingEnd');
            map.removeSource('bingEnd');
        }
            
        map.addSource('bingEnd',{
            type: 'geojson',
            data: geoJson
        });

        map.addLayer({
            id: 'bingEnd',
            source: 'bingEnd',
            type: 'symbol',
            "layout": {
                "icon-image": "bing-marker",
            }
        }, 'route');
        
        //bing start route
        var bingEndRoute = map.getSource('bingEndRoute');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [endPoint[1], endPoint[0]],
                        [routeEnd[0], routeEnd[1]]
                    ]
                }
        }

        if(bingEndRoute){
            map.getSource('bingEndRoute').setData(locData);
            map.setLayoutProperty("bingEndRoute", 'visibility', 'visible');
        }else{
            map.addSource('bingEndRoute',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "bingEndRoute",
                "type": "line",
                "source": "bingEndRoute",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#FFA500",
                    "line-width": 5,
                    "line-dasharray": [.25, 1.5]
                }
            }, 'route');
        }
        
        map.setLayoutProperty("bingEnd", 'visibility', 'none');
        map.setLayoutProperty("bingEndRoute", 'visibility', 'none');
    }
    
    ///******************************* Nav Simulator ***************************///    
    var navCounter = 0;
    var ourRoute = [];
    
    function setupSimulation(){
        navCounter = 1;
        
        map.setPitch(80);

        var nav = map.getSource('navPoint');
        
        var navPoint = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": ourRoute[0]
                }
            }]
        };
        
        //transit
        var navIcon = "car_icon@3x.png";
        
        if(transitType == "driving"){
            navIcon = "car_icon@3x.png";
        }else if(transitType == "walking"){
            navIcon = "run_icon@3x.png";
        }else if(transitType == "cycling"){
            navIcon = "bike_icon@3x.png";
        }
        
        document.getElementById('demo-icon').hidden = false;
        document.getElementById('demo-icon').src = navIcon;
//        if(nav){
//            map.removeSource('navPoint');
//            map.removeLayer('navPoint');
//        }
//
//            map.addSource('navPoint', {
//                "type": "geojson",
//                "data": navPoint
//            });
//
//            map.addLayer({
//                "id": "navPoint",
//                "source": "navPoint",
//                "type": "symbol",
//                "layout": {
//                    "icon-image": navIcon,
//                }
//            });
        
        //second route
        var route = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": ourRoute
                }
            }]
        };
        
        var lineDistance = turf.lineDistance(route, 'kilometers');        
        var denserRoute = [];
        
        for (var i = 0.001; i < lineDistance; i=i+0.001) {
            var segment = turf.along(route.features[0], i, 'kilometers');
            denserRoute.push(segment.geometry.coordinates);
        }
        
        animate(denserRoute);
    }
        
    function animate(route){
         var point = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": route[navCounter]
                }
            }]
        };
        
//        map.getSource('navPoint').setData(point);

        map.setCenter(route[navCounter]);
        map.setZoom(18);
        
        if (navCounter !== route.length - 1 || navCounter !== -1) {
            setTimeout(function() {animate(route); }, 1);
            
            var point1 = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": route[navCounter]
                    }
                };
            
            var pt2Counter = navCounter + 10;
            
            var counterDiff = route.length - 1 - navCounter;
                        
            if(counterDiff < 10){
                pt2Counter = navCounter + 5;
            }
            
            if(counterDiff < 5){
                pt2Counter = navCounter + 1;
            }
            
            if(counterDiff == 0){
                //do nothing
            }else{
                var point2 = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": route[pt2Counter]
                    }
                };
            
                //change bearing
                var bearing = turf.bearing(point1, point2);
                map.setBearing(bearing);
            }
        }

        navCounter = navCounter + 1;
    }
    
    /// ON MAP CONTROLS
    $('.on-map-sim').on('click', function(e){
        $('.compareRoutes').click();
        
        var $this = $(this);
        
        if(demoRunning){
            $this.text('Stop Demo');
        }else{
            $this.text('Compare Us');
        }
    });

    $('.clear-route').on('click', function(e){
        //hide buttons
        document.getElementById('on-map').hidden = true;
        $('.on-map-sim').text('Compare Us');
        
//        map.setLayoutProperty("route", 'visibility', 'none');
        map.setLayoutProperty("gRoute", 'visibility', 'none');
        map.setLayoutProperty("gStart", 'visibility', 'none');
        map.setLayoutProperty("gEnd", 'visibility', 'none');
        map.setLayoutProperty("googleStart", 'visibility', 'none');
        map.setLayoutProperty("googleEnd", 'visibility', 'none');
        map.setLayoutProperty("routeStart", 'visibility', 'none');
        map.setLayoutProperty("routeEnd", 'visibility', 'none');
        
        map.setLayoutProperty("openRoute", 'visibility', 'none');
        map.setLayoutProperty("openStart", 'visibility', 'none');
        map.setLayoutProperty("openEnd", 'visibility', 'none');
        map.setLayoutProperty("openRouteStart", 'visibility', 'none');
        map.setLayoutProperty("openRouteEnd", 'visibility', 'none');
        
        map.setLayoutProperty("bingRoute", 'visibility', 'none');
        map.setLayoutProperty("bingStart", 'visibility', 'none');
        map.setLayoutProperty("bingEnd", 'visibility', 'none');
        map.setLayoutProperty("bingStartRoute", 'visibility', 'none');
        map.setLayoutProperty("bingEndRoute", 'visibility', 'none');
        
        //stop navigation
//        navCounter = -1;
//        map.setLayoutProperty("navPoint", 'visibility', 'none');
        
        //change camera zoom/pitch/bearing
        map.setZoom(15);
        map.setPitch(0);
        map.setBearing(0);
        
        //clear old route
        for(var a = 0; a < geofiRoute.length; a++){
            var thisRoute = map.getSource(geofiRoute[a]);
            
            if(thisRoute){
                map.removeLayer(geofiRoute[a]);
                map.removeSource(geofiRoute[a]);
            }
        }
        
        geofiRoute = [];
    });
});

