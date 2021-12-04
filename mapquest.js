var URL="http://www.mapquestapi.com/directions/v2/route?key=";
var key="6wGZkKsmoHlB0C42ujYQGAD2EKtYWyBA";

var from = { "location": {"street": "301 East High St", "city" : "Oxford", "state": "OH"} };
var to = { "location": {"street": "601 Maple St", "city" : "Oxford", "state": "OH"} };
function directions(){
	a=$.ajax({
	url: URL + key,
	method: "GET",
	dataType: 'json',
	contentType: 'json',
	data: JSON.stringify(from, to)
  }).done(function(response) {
//	$("#result").append(response);
	log(response);
  });
}


