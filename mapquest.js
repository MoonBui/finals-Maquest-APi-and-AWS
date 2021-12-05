var mapURL = "http://www.mapquestapi.com/directions/v2/route?key=";
var chartURL = "http://open.mapquestapi.com/elevation/v1/chart?key=";
var key = "6wGZkKsmoHlB0C42ujYQGAD2EKtYWyBA";

// submitDirections();

function submitDirections() {
    var from = document.getElementById("location");
    var to = document.getElementById("destination");
    a = $.ajax({
        url: `${mapURL}${key}&from=${encodeURIComponent(from.value)}&to=${encodeURIComponent(to.value)}`,
        method: "GET",
        // data: JSON.stringify(locations)
    }).done(function(data) {
        var route = data.route;
        var legs = route.legs;

        var route = data.route;
        var legs = route.legs;

        var leg = legs[0];
        var time = leg.time;
        var maneuvers = leg.maneuvers;

        $("#result").html("");
        $("#result").append("<br> <thead><tr>" + "<th class='col'>Narratives</th>" +
            "<th class='col'>Distance</th>" + "<th class='col'>Time</th>" +
            "<th class='col'>Thumbnail</th></tr></thead><tbody>")

        for (let i = 0; i < maneuvers.length - 1; i++) {
            $("#result").append("<tr><td> " + maneuvers[i].narrative + "</td><td>" +
                maneuvers[i].distance + "</td><td>" + maneuvers[i].time + "</td><td>" +
                "<img class='img-result' src='" + maneuvers[i].mapURL + "'width='250' height='auto'>" + "</td></tr>");
        }

        $("#result").append("<tr><td>" + maneuvers[maneuvers.length - 1].narrative + "</td></tr></tbody>");

        var LatLng = route.boundingBox.lr.lat + "," + route.boundingBox.lr.lng + "," + route.boundingBox.ul.lat + "," + route.boundingBox.ul.lng;
        var chart = chartURL + key + "&shapeFormat=raw&width=425&height=350&latLngCollection=" + LatLng;

        $("#result").append("<br> <h1 class='elevation-chart'>Elevation Chart</h1>");
        $("#result").append("<img src='" + chart + "' width='400' height='300'>");

        console.log(data);

    }).fail(function(error) {
        $("#result").html("Error occured");
    });
}