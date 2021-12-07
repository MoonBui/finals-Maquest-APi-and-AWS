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
        console.log(data);
        if (data.info.statuscode != 0) {
            $("#result").html("Error occured:" + data.info.messages[0]);
            return;
        }

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
        console.log(error);
        $("#result").html("Error occured:" + error.message);
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

        if (data.info.statuscode != 0) {
            $("#result").html("Error occured:" + data.info.messages[0]);
            return;
        }

        var results = data.results;
        var minLength = (results.length <= maxResult) ? results.length : maxResult;


        // Append 
        $("#thead-history").append("<tr><td>No.</td><td>Date & Time</td><td>From</td><td>To</td><td>Number of maneuvers</td><td></td></tr>");
        for (let i = 0; i < minLength; i++) {
            var value = JSON.parse(results[i].value);
            var maneuvers = value.maneuvers;

            $("#table-body").append("<tr><td>" + (i + 1) + "</td><td class='center'>" + results[i].date + "</td><td>" +
                value.from + "</td><td>" + value.to + "</td><td class='center'>" +
                value.length + "</td><td><button class='btn btn-primary' type='button' data-toggle='collapse' data-target='#collapse" +
                i + "' aria-expanded='true' + aria-controls='collapse" + i + "'> Details </button></td>" + "</tr>");

            $("#table-body").append("<td colspan='6'><div id='collapse" + i + "' class='collapse show accordion-body'></div>")
            var resultTable = "<table id='dtable' class='border'><thead class='thead'><tr>" + "<td>Narratives</td>" +
                "<td>Distance</td>" + "<td>Time</td>" + "<td>Thumbnail</td></tr></thead><tbody>";

            for (let j = 0; j < maneuvers.length; j++) {
                resultTable += "<tr><td>" + maneuvers[j].narrative + "</td><td class='center'>" + maneuvers[j].distance +
                    "</td><td class='center'>" + maneuvers[j].time + "</td><td class='img-box'>" + "<img class='img-result img-box' src='" +
                    maneuvers[j].mapUrl + "'width='250' height='auto'>" + "</td></tr>";
            }

            resultTable += "</tbody></table></td>";
            resultTable += "<br> <h1 class='elevation-chart'>Elevation Chart</h1>";
            resultTable += "<img class='accordion-body collapse show' id='chart' src='" + value.chart + "' width='400' height='300'></div>";
            $("#collapse" + i).append(resultTable);
        }

        // // Overview of search results
        // $("#result").html("");
        // resultTable += "<br> <div style='overflow-x:auto'><table id='table-history'><thead class='thead' id='thead-history'><tr>" + "<td>No.</td>" +
        //     "<td>Date & Time</td>" + "<td>From</td>" + "<td>To</td>" +
        //     "<td>Number of maneuvers</td>" + "<td></td>" + "</tr></thead><tbody>";

        // for (let i = 0; i < minLength; i++) {
        //     var value = JSON.parse(results[i].value);
        //     var maneuvers = value.maneuvers;

        //     // Overview line
        //     resultTable += "<tr><td>" + (i + 1) + "</td><td class='center'>" + results[i].date + "</td><td>" +
        //         value.from + "</td><td>" + value.to + "</td><td class='center'>" +
        //         value.length + "</td><td><button class='details accordion-toggle' type='button' data-toggle='collapse' data-target='#collapse" +
        //         i + "' aria-expanded='true'> Details </button></td>" + "</tr>";

        //     // Table that can collapse and show details when clicking button
        //     resultTable += "<div id='collapse" + i + "' class='collapse show accordion-body'>";
        //     resultTable += "<br> <table class='border accordion-body'><thead class='thead'><tr id='collapse" + i + "'class='accordion-body collapse show' >" + "<td>Narratives</td>" +
        //         "<td>Distance</td>" + "<td>Time</td>" +
        //         "<td>Thumbnail</td></tr></thead><tbody>";

        //     for (let j = 0; j < maneuvers.length - 1; j++) {
        //         resultTable += "<tr id='collapse" + i + "'class='accordion-body collapse show'><td> " + maneuvers[j].narrative + "</td><td class='center'>" +
        //             maneuvers[j].distance + "</td><td class='center'>" + maneuvers[j].time + "</td><td>" +
        //             "<img class='img-result' src='" + maneuvers[j].mapUrl + "'width='250' height='auto'>" + "</td></tr>";
        //     }

        //     //Detail table
        //     resultTable += "<tr id='collapse" + i + "'class='accordion-body collapse show'><td>" + maneuvers[maneuvers.length - 1].narrative + "</td></tr>" + "</tbody></table>";
        //     resultTable += "<br> <h1 class='elevation-chart'>Elevation Chart</h1>";
        //     resultTable += "<img class='accordion-body collapse show' id='chart' src='" + value.chart + "' width='400' height='300'></div>";
        //     $("#result").append(resultTable);
        // }
        // //resultTable += "</tbody></table></div>";

        // // Append ending for overview table of results
        // //$("#result").append(resultTable);
        // $("#result").append("</tbody></table></div>");



    }).fail(function(error) {
        console.log(error);
        $("#error").html(error.message);
    });


}