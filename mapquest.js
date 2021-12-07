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
        var resultTable = "";

        $("#result").html("");

        resultTable += "<br> <table class='border'><thead class='thead'><tr>" + "<td>Narratives</td>" +
            "<td>Distance</td>" + "<td>Time</td>" +
            "<td>Thumbnail</td></tr></thead><tbody>";

        for (let i = 0; i < maneuvers.length - 1; i++) {

            resultTable += "<tr><td> " + maneuvers[i].narrative + "</td><td class='center'>" +
                maneuvers[i].distance + "</td><td class='center'>" + maneuvers[i].time + "</td><td>" +
                "<img class='img-result' src='" + maneuvers[i].mapUrl + "'width='250' height='auto'>" + "</td></tr>";
        }


        resultTable += "<tr><td>" + maneuvers[maneuvers.length - 1].narrative + "</td></tr>" + "</tbody></table>";
        $("#result").append(resultTable);

        var LatLng = route.boundingBox.lr.lat + "," + route.boundingBox.lr.lng + "," + route.boundingBox.ul.lat + "," + route.boundingBox.ul.lng;
        var chart = chartURL + key + "&shapeFormat=raw&width=425&height=350&latLngCollection=" + LatLng;

        $("#result").append("<br> <h1 class='elevation-chart'>Elevation Chart</h1>");
        $("#result").append("<img id='chart' src='" + chart + "' width='400' height='300'>");

        console.log(data);


        // object to send to db
        var objectToSend = {
            from: from.value,
            to: to.value,
            length: maneuvers.length,
            maneuvers: maneuvers,
            chart: chart
        };

        // Call method to send to db
        sendToRest(objectToSend);


    }).fail(function(error) {
        $("#result").html("Error occured");
    });

}

// Method to send to db
function sendToRest(x) {
    a = $.ajax({
        url: "http://buinm.aws.csi.miamioh.edu/final.php",
        method: "POST",
        data: {
            method: "setLookup",
            location: "45056",
            sensor: "web",
            value: JSON.stringify(x)
        }
    }).done(function(data) {

    }).fail(function(error) {

    });
}

//Method to get results from db
function requestData() {
    var date = document.getElementById("date");
    var maxResult = document.getElementById("lines").value;

    a = $.ajax({
        url: "http://buinm.aws.csi.miamioh.edu/final.php",
        method: "GET",
        data: {
            method: "getLookup",
            date: date.value
        }
    }).done(function(data) {
        // Check results in log
        console.log(date.value);
        console.log(data);

        var results = data.results;
        var minLength = (results.length <= maxResult) ? results.length : maxResult;
        var resultTable = "";

        // Overview of search results
        $("#result").html("");
        resultTable += "<br> <div style='overflow-x:auto'></div><table id='table-history'><thead class='thead' id='thead-history'><tr>" + "<td>No.</td>" +
            "<td>Date & Time</td>" + "<td>From</td>" + "<td>To</td>" +
            "<td>Number of maneuvers</td>" + "<td></td>" + "</tr></thead><tbody>";

        for (let i = 0; i < minLength; i++) {
            var value = JSON.parse(results[i].value);
            var maneuvers = value.maneuvers;

            // Overview line
            resultTable += "<tr><td>" + (i + 1) + "</td><td class='center'>" + results[i].date + "</td><td>" +
                value.from + "</td><td>" + value.to + "</td><td class='center'>" +
                value.length + "</td><td><button class='details' type='button' data-toggle='collapse' data-target='#collapse" +
                i + "' aria-expanded='true' aria-controls='collapse" + i + "'> Details </button></td>" + "</tr>";




            // Table that can collapse and show details when clicking button
            resultTable += "<div id='collapseOne" + i + "' class='collapse show'>";
            resultTable += "<table class='border'><thead class='thead'><tr>" + "<td>Narratives</td>" +
                "<td>Distance</td>" + "<td>Time</td>" +
                "<td>Thumbnail</td></tr></thead><tbody>";

            for (let i = 0; i < maneuvers.length - 1; i++) {
                resultTable += "<tr><td> " + maneuvers[i].narrative + "</td><td class='center'>" +
                    maneuvers[i].distance + "</td><td class='center'>" + maneuvers[i].time + "</td><td>" +
                    "<img class='img-result' src='" + maneuvers[i].mapUrl + "'width='250' height='auto'>" + "</td></tr>";
            }

            // Detail table
            resultTable += "<tr><td>" + maneuvers[maneuvers.length - 1].narrative + "</td></tr>" + "</tbody></table>";
            resultTable += "<br> <h1 class='elevation-chart'>Elevation Chart</h1>";
            resultTable += "<img id='chart' src='" + value.chart + "' width='400' height='300'></div>";

        }
        resultTable += "</tbody></table>";

        // Append ending for overview table of results
        $("#result").append(resultTable);



    }).fail(function(error) {

    });


}