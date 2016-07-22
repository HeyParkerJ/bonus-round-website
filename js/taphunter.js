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
    }, timeout * 5000);

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
	// START HERE -- This doesn't hit because we outofindexarray way below on the previous calls
	outputSubMenu('taps', json.taps)
	outputSubMenu('bottles', json.bottles)
};

function outputSubMenu(drinkType, drinkList){
	var columnsNeeded = 4;
	var nextItemToOutput = 0;

	if(drinkList.length < 8) { columnsNeeded = 1 };

	var itemsPerColumn = Math.floor(drinkList.length / columnsNeeded);
	var remainder = drinkList.length % columnsNeeded

	for (var columnNumber = 0; columnNumber <= columnsNeeded && nextItemToOutput < drinkList.length; columnNumber++){ //for every column
		var itemsInThisColumn = itemsPerColumn;

		if(remainder > 0) {
			itemsInThisColumn++
			remainder--
		}

		var div = document.getElementById(drinkType)
		div.insertAdjacentHTML('beforeend', outputColumnDiv(drinkType, columnNumber))


		var bootstrapDiv = document.getElementById(drinkType+'-col-'+columnNumber)
		bootstrapDiv.insertAdjacentHTML('beforeend', outputUlElement(drinkType, columnNumber))


		var ul = document.getElementById(drinkType+'-ul-'+columnNumber)
		
		for (var j = 0; j < itemsInThisColumn && nextItemToOutput < drinkList.length; j++){

			ul.insertAdjacentHTML('beforeend', outputLiElement(drinkList, nextItemToOutput))
			nextItemToOutput++
		}
	}
}

/*
Temporarily using a static wine list
function outputWineSubMenu(drinkList) {
	var redWinesUl = document.getElementById('wines-red-ul')
	var whiteWinesUl = document.getElementById('wines-white-ul')

	for (var w = 0; w < drinkList.length; w++) {
		if(drinkList[w].category_name == "Red") {
			redWinesUl.insertAdjacentHTML('beforeend', '<li class="menu-item">'+drinkList[w].name+'</li>')
		}
		else if (drinkList[w].category_name == "White") {
			whiteWinesUl.insertAdjacentHTML('beforeend', '<li class="menu-item">'+drinkList[w].name+'</li>')
		}
	}
}*/


function outputColumnDiv(drinkType, columnNumber) {
	return '<div id='+drinkType+'-col-'+columnNumber+' class="col-md-3"></div>'
}

function outputUlElement(drinkType, columnNumber) {
	return 'beforeend', '<ul id="'+drinkType+'-ul-'+columnNumber+'"></ul>'
}

function outputLiElement(drinkList, nextItemToOutput) {
	return 'beforeend', '<li class="menu-item">'+drinkList[nextItemToOutput].beer.name+'</li>'
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