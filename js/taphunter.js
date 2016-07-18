var $jsonp = (function(){
  var that = {};

  that.send = function(src, options) {
    var callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function(){},
      on_timeout = options.onTimeout || function(){},
      timeout = options.timeout || 10; // sec

    var timeout_trigger = window.setTimeout(function(){
      window[callback_name] = function(){};
      on_timeout();
    }, timeout * 1000);

    window[callback_name] = function(data){
      window.clearTimeout(timeout_trigger);
      on_success(data);
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  return that;
})(); 

function populatePage(json) {
	outputSubMenu('bottles', json.bottles)
};

function outputSubMenu(drinkType, drinkList){
	var columnsNeeded = 4;
	var nextItemToOutput = 0;

	if(drinkList.length < 8) { columnsNeeded = 1 };

	var itemsPerColumn = Math.floor(drinkList.length / columnsNeeded);
	var remainder = drinkList.length % columnsNeeded

	for (var columnNumber = 0; columnNumber < columnsNeeded; columnNumber++){ //for every column we need
		console.log("STARTING NEW COLUMN. COLUMN NUMBER IS : " + columnNumber)
		var itemsInThisColumn = itemsPerColumn;

		if(remainder > 0) {
			console.log("MODIFYING REMAINDER, OLD REMAINDER: "+remainder+" OLD itemsInThisColumn: "+itemsInThisColumn)
			itemsInThisColumn++
			remainder--
			console.log("NEW itemsInThisColumn: "+itemsInThisColumn+" NEW remainder: "+remainder)
		}

		var div = document.getElementById(drinkType)
		div.insertAdjacentHTML('beforeend', outputColumnDiv(drinkType, columnNumber))


		var bootstrapDiv = document.getElementById(drinkType+'-col-'+columnNumber)
		bootstrapDiv.insertAdjacentHTML('beforeend', outputUlElement(drinkType, columnNumber))


		var ul = document.getElementById(drinkType+'-ul-'+columnNumber) // Grab the UL and start dropping li's in with the beer at value drinkList[nextItemToOutput]
		
		for (var j = 0; j <= itemsInThisColumn; j++){
			console.log("ITEMS IN COLUMN " + columnNumber+ " : "+ itemsInThisColumn)
			// CASE statement on drinkType where we grab beer.name or cocktail.name, etc
			ul.insertAdjacentHTML('beforeend', outputLiElement(drinkList, nextItemToOutput))
			nextItemToOutput++
			//Items in this column is 12 not 13
		}
	}
}


function outputColumnDiv(drinkType, columnNumber) {
	return '<div id='+drinkType+'-col-'+columnNumber+' class="col-md-3"></div>'
}

function outputUlElement(drinkType, columnNumber) {
	return 'beforeend', '<ul id="'+drinkType+'-ul-'+columnNumber+'"></ul>'
}

function outputLiElement(drinkList, nextItemToOutput) {
	return 'beforeend', '<li>'+drinkList[nextItemToOutput].beer.name+'</li>'
}

//Please remove this before production, goofass
var data;

$jsonp.send('https://www.taphunter.com/widgets/location/v3/6729532695642112.jsonp?callback=handleCallback', {
    callbackName: 'handleCallback',
    onSuccess: function(json){
    	console.log('successfully retrieved taphunter data!', json);
    	data = json;
        populatePage(json);
    },
    onTimeout: function(){
        console.log('timeout!');
    },
    timeout: 5
});