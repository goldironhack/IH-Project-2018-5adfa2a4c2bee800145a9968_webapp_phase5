const API_KEY ="AIzaSyAOiREIj7OlVojdyYlEHSZXG5M28Z5WN64";
const DEATHS_URL ="https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=json";
const NEIGHBORHOODS_NAMES="https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const HOUSES_NY="https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
const CRIMES_URL="https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD";
var map;
var ny_coordinates={lat: 40.7291, lng: -73.9965};
var bro_coordinates;
var ny_marker;
var bro_marker;
var directionsService;
var directionsRenderer;



function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: ny_coordinates
        });
        map.data.loadGeoJson('https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
        map.data.setStyle(function(feature) {
          var color = 'gray';
          if (feature.getProperty('isColorful')) {
            color = feature.getProperty('color');
          }
          return /** @type {google.maps.Data.StyleOptions} */({
            fillColor: color,
            strokeColor: color,
            strokeWeight: 2
          });
        });
        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
          }
        });

        // When the user clicks, set 'isColorful', changing the color of the letters.
      /*  map.data.addListener('click', function(event) {

          event.feature.setProperty('isColorful', true);
        });*/

        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(polygon) {
             var coordinatesArray = polygon.overlay.getPath().getArray();
            console.log(coordinatesArray);
        });
      google.maps.event.addListener(map, "click", function (event) {
              var latitude = event.latLng.lat();
              var longitude = event.latLng.lng();
              bro_coordinates= {lat: latitude,lng: longitude};
              bro_marker=new google.maps.Marker({
                  position: bro_coordinates,
                  map: map
                });
              console.log(bro_coordinates);

              markerEvents(bro_marker);
              console.log(bro_marker);

        });/*
        map.data.addListener(map, "click", function (event) {
        if  (google.maps.geometry.poly.containsLocation(punto,polydistritos[CD][j]) == true){
                    distritos[CD][j][2][0] = parseInt((distritos[CD][j][2][0]+housing[i][3])/2);
               j = polydistritos[CD].length;
            }
}*/

        // When the user hovers, tempt them to click by outlining the letters.
        // Call revertStyle() to remove all overrides. This will use the style rules
        // defined in the function passed to setStyle()
        map.data.addListener('mouseover', function(event) {
          map.data.revertStyle();
          map.data.overrideStyle(event.feature, {strokeWeight: 8});
        });

        map.data.addListener('mouseout', function(event) {
          map.data.revertStyle();
        });
        ny_marker = new google.maps.Marker({
          position: ny_coordinates,
          map: map
        });


          directionsService = new google.maps.DirectionsService();
          directionsRenderer = new google.maps.DirectionsRenderer();


}

function markerEvents(marker){

    if(marker != "undefined"){

        marker.addListener("click", function(){
          getRoute();

        });

    }

}

function getRoute(){

    var request = {

        origin: ny_marker.position,
        destination: bro_marker.position,
        travelMode: 'DRIVING'

    }

    directionsRenderer.setMap(map);
    directionsService.route(request, function(result, status){

        if(status == "OK"){

            directionsRenderer.setDirections(result);

        }

    });

}


function drawPolygon(polygon,color){
         polygon = new google.maps.Polygon({
         paths: triangleCoords,
         strokeColor: color,
         strokeOpacity: 0.8,
         strokeWeight: 2,
         fillColor: color,
         fillOpacity: 0.35
       });
       polygon.setMap(map);
}

function getDataCrimes(){

  var data = $.ajax({
    url:CRIMES_URL,
    data:{
      "cmplnt_to_ft" : '2016-05-15T00:00:00.000'

    }

  })
    .done(function(data){
        console.log(data);
  })
}


var infoRows = [];
var infoRowsN = [];
var infoRowsData=[];
var cadena =[];
var coordA = [];
function getData(){

  var data = $.get(DEATHS_URL,function(){})
    .done(function(){
      var json = JSON.parse(data.responseText);

      console.log(json.features/*[2].geometry.rings*/);
        var dataRow = json.features;
      for (var i = 0; i < dataRow.length; i++) {
        var boro=dataRow[i].attributes.BoroCD;
        var coordData=dataRow[i].geometry.rings;
        infoRowsData.push(boro,coordData);
        //console.log(infoRowsData);

        infoRows.push(infoRowsData);
        infoRowsData=[];



        }

        console.log(infoRows);
    })
    .fail(function(error){

        console.log(error);

    })
}

var dataRowH = [];
var infoRowsH = [];
function getDataHousing(){
  var dataH = $.get(HOUSES_NY,function(){})
  .done(function(){


    var dataRowH = dataH.responseJSON.data;
    for(var u=0;u<dataRowH.length;u++){
        // dataRowH[u][31];
        if(dataRowH[u][31]!=0){
          infoRowsH.push([dataRowH[u][31],dataRowH[u][9],dataRowH[u][14],dataRowH[u][15],dataRowH[u][23],dataRowH[u][24]]);
        }

    }

    console.log(infoRowsH);

    })
    .fail(function(error){

        console.log(error);

    })

}


function getDataNeighborhoods(){
  var dataN = $.get(NEIGHBORHOODS_NAMES,function(){})
  .done(function(){
      //console.log(dataN.responseJSON.data);
      var dataRowN = dataN.responseJSON.data;

      for (var i = 0; i < dataRowN.length; i++) {
        //console.log(infoRowsN.i);
        infoRowsN.push([dataRowN[i][8],dataRowN[i][9],dataRowN[i][10],dataRowN[i][16]]);
      }

  console.log(infoRowsN);
      var tableReference= $("#tableBody")[0]
      var newRow,neighborhoodNumber,neighborhoodCoordinates,neighborhoodName,neighborhoodDistrict;
      for (var j = 0; j < infoRowsN.length; j++) {
        newRow = tableReference.insertRow(tableReference.rows.length);
        neighborhoodNumber = newRow.insertCell();
        neighborhoodName = newRow.insertCell();
        neighborhoodCoordinates = newRow.insertCell();
        neighborhoodDistrict = newRow.insertCell();
        neighborhoodNumber.innerHTML = infoRowsN[j][0];
        neighborhoodName.innerHTML = infoRowsN[j][1];
        neighborhoodCoordinates.innerHTML = infoRowsN[j][2];
        neighborhoodDistrict.innerHTML = infoRowsN[j][3];
      }
  })
  .fail(function(error){

      console.log(error);

  })
}
$("document").ready(function(){
  getDataNeighborhoods();
  getData();
  getDataCrimes();
  getDataHousing();
  $("#getDataNeighborhoods").on("click",getDataNeighborhoods)
  $("#getData").on("click",getData)
  $("#getDataCrimes").on("click",getDataCrimes)

  $("#exportData").click(function(){

    $("table").tableToCSV();

});


})
