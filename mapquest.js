var URL="http://www.mapquestapi.com/directions/v2/route?key=";
var key="6wGZkKsmoHlB0C42ujYQGAD2EKtYWyBA";

// submitDirections();

function submitDirections(){
var from = document.getElementById("location");
var to = document.getElementById("destination");
        var locations = { "from": document.getElementById("location").value, "to": document.getElementById("destination").value }
	console.log(JSON.stringify(locations));
	a=$.ajax({
	url: `${URL}${key}&from=${encodeURIComponent(from.value)}&to=${encodeURIComponent(to.value)}`,
	method: "GET",
	// data: JSON.stringify(locations)
	}).done(function(data) {
		$("#result").append(locations);
		$("#result").append(data);
	 	console.log(locations);
		console.log(data);

		var route = data.route;
		var legs = route.legs;
    }).fail(function(error) {
		$("#result").append("error");
    });
}


