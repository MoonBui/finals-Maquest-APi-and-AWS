var URL="http://www.mapquestapi.com/directions/v2/route?key=KEY";
//var key="6wGZkKsmoHlB0C42ujYQGAD2EKtYWyBA";

// var from = { "location": {"street": "301 East High St", "city" : "Oxford", "state": "OH"} };
// var to = { "location": {"street": "601 Maple St", "city" : "Oxford", "state": "OH"} };
var locations = { "locations": ["501 e high street oxford ohio 45056", "7847 VOA Park Dr, West Chester Township, OH 45069"], "options": {
        "avoids": [],
        "avoidTimedConditions": false,
        "doReverseGeocode": true,
        "shapeFormat": "raw",
        "generalize": 0,
        "routeType": "fastest",
        "timeType": 1,
        "locale": "en_US",
        "unit": "m",
        "enhancedNarrative": false,
        "drivingStyle": 2,
        "highwayEfficiency": 21.0
    }
}
function directions(){
	a=$.ajax({
	url: URL,
	method: "POST",
	dataType: 'json',
	contentType: 'json',
	data: JSON.stringify(locations)
  }).done(function(response) {
	$("#result").append(response);
	log(response);
  });
}


