var URL="http://www.mapquestapi.com/directions/v2/route";
var key="6wGZkKsmoHlB0C42ujYQGAD2EKtYWyBA";

// var from = { "location": {"street": "301 East High St", "city" : "Oxford", "state": "OH"} };
// var to = { "location": {"street": "601 Maple St", "city" : "Oxford", "state": "OH"} };
var locations = { "locations": [ document.getElementById("location"), document.getElementById("destination") ], "options": {
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

function submitDirections(){
	a=$.ajax({
	url: URL,
	method: "POST",
	dataType: 'json',
	contentType: 'json',
	data: JSON.stringify(locations),

	success: function(data) {
	$("#result").append(data);
	log(data);
  },
	error: function(data) {
	$("#result").append("error " + data);
	log("error " + data);
  }

  });
}


