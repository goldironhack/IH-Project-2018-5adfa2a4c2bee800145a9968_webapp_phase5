const API_KEY ="AIzaSyAOiREIj7OlVojdyYlEHSZXG5M28Z5WN64";
const DEATHS_URL ="https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=json";
const NEIGHBORHOODS_NAMES="https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const HOUSES_NY="https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
const CRIMES_URL="https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000";
var map;
var ny_coordinates={lat: 40.7291, lng: -73.9965};
var bro_coordinates;
var ny_marker;
var bro_marker;
var directionsService;
var directionsRenderer;

//esa mierda dataset no tiene ni sentido

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: ny_coordinates,
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

/*var polygon = new google.maps.Polygon({
  paths: [
    { lat: 41.78500, lng: -87.75133 },
    { lat: 41.77681, lng: -87.87836 },
    { lat: 41.80138, lng: -87.92780 },
    { lat: 41.77988, lng: -87.95527 },
    { lat: 41.83208, lng: -87.95801 },
    { lat: 41.83208, lng: -87.94154 },
    { lat: 41.81673, lng: -87.88866 },
    { lat: 41.81417, lng: -87.78773 },
    { lat: 41.87607, lng: -87.77056 },
    { lat: 41.78500, lng: -87.75133 }
  ],
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35
});*/


/*new google.maps.Marker({
  position: polygon.getBoundingBox().getCenter(),
  map: map
});*/

        // When the user clicks, set 'isColorful', changing the color of the letters.
      /*  map.data.addListener('click', function(event) {

          event.feature.setProperty('isColorful', true);
        });*/

        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(polygon) {
             var coordinatesArray = polygon.overlay.getPath().getArray();
            console.log(coordinatesArray);
        });

      /*  google.maps.Polygon.prototype.getBoundingBox = function() {
              var bounds = new google.maps.LatLngBounds();


              this.getPath().forEach(function(element,index) {
                bounds.extend(element)
              });


              return(bounds);
            };*/
/*
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
var dataRowC=[];
var CalcCoords=[];
var coords;
setTimeout(function(){


  console.log(dataRowC);
  for(var i=0; i<infoRows.length;i++){
    for (var j = 0; j < infoRows[j][1][0].length; j++) {
      CalcCoords=infoRows[i][1][0][j];

      //console.log(CalcCoords);

  //  coords = [{lat:CalcCoords[0],lng:CalcCoords[1]}];
  }/*
  console.log(coords);
  console.log(i);*/
  }
  /*
    var testPolygon = new google.maps.Polygon({
        paths: coords

      });
      var aux1=dataRowC.split("");
      var coordsS=[{lat:}]
      for (var i = 0; i < dataRowC.length; i++) {
        google.maps.geometry.poly.containsLocation(dataRowC[i][2], testPolygon)
      }*/





},5000);

function getDataCrimes(){


  $.ajax({
    url:CRIMES_URL,
    type: "GET",
    data:{
      "$limit" : 5000,

    }

  })
    .done(function(data){


        for (var i = 0; i < data.length; i++) {
            if (data[i].lat_lon != null){
                var Borr= data[i].boro_nm;
                var distr = 0;
                if (Borr=="Bronx"){
                    distr = 2
                }else if(Borr=="Brooklyn"){
                    distr = 3
                }else if(Borr=="Queens"){
                    distr = 4
                }else if(Borr=="Staten Island"){
                    distr = 5
                }else if(Borr=="Manhattan"){
                    distr = 1
                }
                var point = data[i].lat_lon.coordinates;

                dataRowC.push([Borr,distr,point]);
            }
    }
    console.log(dataRowC);
  });
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

    //  console.log(json.features/*[2].geometry.rings*/);
        var dataRow = json.features;
      for (var i = 0; i < dataRow.length; i++) {
        var boro=dataRow[i].attributes.BoroCD;
        var coordData=dataRow[i].geometry.rings;
        infoRowsData.push(boro,coordData);
        //console.log(infoRowsData);

        infoRows.push(infoRowsData);
        infoRowsData=[];
        }
        var poligonos=[];
        var arrayAux=[];
        var coordsAux=[];
        console.log(infoRows);
        for(var t=0;t<infoRows.length;t++){
            if(infoRows[t][1].length==1){
                coordsAux.push(infoRows[t][1]);

            }else{
              coordsAux[0]=[];
                coordsAux[0][0]=[];
                for(var g=0;g<infoRows[t][1].length;g++){

                 coordsAux[0][0]=coordsAux[0][0].concat(infoRows[t][1][g]);
                }
            }
            poligonos.push(coordsAux);
            coordsAux=[];
        }
        console.log(poligonos);
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
  //  console.log(dataRowH);
    for(var u=0;u<dataRowH.length;u++){
        // dataRowH[u][31];
        if(dataRowH[u][31]!=0){
          infoRowsH.push([dataRowH[u][31],dataRowH[u][9],dataRowH[u][14],dataRowH[u][15],dataRowH[u][23],dataRowH[u][24],dataRowH[u][19]]);
        }

    }
    infoRowsH.sort(function(a,b){return a[0][0]-b[0][0]})
    //console.log(infoRowsH);
      var aux=0;

var housingSorted =[];
    //  for(var y=0;y<10;y++){/*
       for(var i=1;i<infoRowsH.length;i++){
            for(var j=0;j<(infoRowsH.length-i);j++){
              if(parseInt(infoRowsH[j][0])<parseInt(infoRowsH[j+1][0]))
              {
                k=infoRowsH[j+1];
                infoRowsH[j+1]=infoRowsH[j];
                infoRowsH[j]=k;
            }
            }
       }
      /*  console.log(aux);
        housingSorted.push(infoRows[aux]);
        delete infoRows[l];*/
      //}
    //  console.log(infoRowsH);
      //  console.log(housingSorted);
      var tableReference= $("#tableHousing")[0]
      var housingRow, housingNumber,housingDistrict, housingDistrictName;
      var districtSplit=[];
      for(var i=0;i<10;i++){
        districtSplit=infoRowsH[i][6].split("-");
        console.log(districtSplit);
        switch (districtSplit[0]) {
          case "BK":
            districtSplit[0]="Brooklyn";
            break;
          case "QN":
            districtSplit[0]="Queens";
            break;
          case "MN":
            districtSplit[0]="Manhattan";
            break;
          case "BX":
            districtSplit[0]="Bronx";
            break;
          case "SI":
            districtSplit[0]="Staten Island";
            break;
          default:
            districtSplit[0]="New York";
            break;
        }
        housingRow = tableReference.insertRow(tableReference.rows.length);
        housingNumber = housingRow.insertCell();
        housingDistrict = housingRow.insertCell();
        housingDistrictName = housingRow.insertCell();
        housingNumber.innerHTML = i+1;
        housingDistrict.innerHTML = districtSplit[0];
        housingDistrictName.innerHTML = districtSplit[1];
      }
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

  //console.log(infoRowsN);
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
