var $jsonp = (function(){
  var that = {};

  that.send = function(src, options) {
    var callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function(){},
      on_timeout = options.onTimeout || function(){},
      timeout = options.timeout || 10;

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
  console.log(json)
	outputSubMenu('taps', json.taps)
	outputSubMenu('bottles', json.bottles)
  outputCocktails(json.cocktails)
  outputWines(json.wines)
  outputEvents(json.events)
};

function outputEvents(data) {
  var eventsUl = document.getElementById("content_events");

  for(var i = 0; i < data.length; i++) {
    eventsUl.insertAdjacentHTML('beforeend', (function(data) {
      return "<div class='col-md-4'>"+
          "<h3 class='menu-header-4 padding-small'><strong>"+data.title+"</strong></h3><div>"+data.event_start_date+" - "+data.event_start_time+"</div>"+
              "<div class='menu-text'>"+data.description+"</div>"+
      "</div>"
    })(data[i]))
  }
}

function outputWines(data) {
  var WhitesUlElement = document.getElementById("content_whites");
  var RedsUlElement = document.getElementById("content_reds");

  outputLi = function(data) {
    return "<li>"+data.name+" - "+data.type_name+"</li>";
  }

  for (var i = 0; i < data.length; i++) {
    if(data[i].category_name === "White") {
      WhitesUlElement.insertAdjacentHTML('beforeend', outputLi(data[i]))
    }
    else if(data[i].category_name === "Red") {
      RedsUlElement.insertAdjacentHTML('beforeend', outputLi(data[i]))
    }
  }
}

function outputCocktails(data) {
  var cocktailUlElement = document.getElementById("content_cocktails");

  for (var i = 0; i < data.length; i++) {
    cocktailUlElement.insertAdjacentHTML('beforeend', function(data) {
      return "<li><p class='drink-name'>"+data.name+"</p>"+data.ingredients.string+"</li>"
    }(data[i]))
  }
}

function outputSubMenu(drinkType, drinkList){
	var columnsNeeded = 4;
	var nextItemToOutput = 0;
	var lastUpdated = '';

	if(drinkList.length < 8) { columnsNeeded = 1 };

	var itemsPerColumn = Math.floor(drinkList.length / columnsNeeded);
	var remainder = drinkList.length % columnsNeeded

	for (var columnNumber = 0; columnNumber <= columnsNeeded && nextItemToOutput < drinkList.length; columnNumber++){
		var itemsInThisColumn = itemsPerColumn;

		if(remainder > 0) {
			itemsInThisColumn++
			remainder--
		}

    function outputColumnDiv(drinkType, columnNumber) {
    	return '<div id='+drinkType+'-col-'+columnNumber+' class="col-md-3"></div>'
    }
    function outputUlElement(drinkType, columnNumber) {
    	return 'beforeend', '<ul id="'+drinkType+'-ul-'+columnNumber+'"></ul>'
    }

		var div = document.getElementById(drinkType)
		div.insertAdjacentHTML('beforeend', outputColumnDiv(drinkType, columnNumber))


		var bootstrapDiv = document.getElementById(drinkType+'-col-'+columnNumber)
		bootstrapDiv.insertAdjacentHTML('beforeend', outputUlElement(drinkType, columnNumber))


		var ul = document.getElementById(drinkType+'-ul-'+columnNumber)

		for (var j = 0; j < itemsInThisColumn && nextItemToOutput < drinkList.length; j++){
			if(drinkType === 'taps') {
				ul.insertAdjacentHTML('beforeend', outputTapsLiElement(drinkList, nextItemToOutput))
			}
			else {
				ul.insertAdjacentHTML('beforeend', outputBeerLiElement(drinkList, nextItemToOutput))
			}

			if (drinkList[nextItemToOutput].date_added_timestamp > lastUpdated) {
				lastUpdated = drinkList[nextItemToOutput].date_added_timestamp
			}

			nextItemToOutput++
		}
	}

	var myDate = new Date(lastUpdated*1000);
	var lastUpdatedDate = myDate.toLocaleString();

	var lastUpdatedDiv = document.getElementById(drinkType+'-lastupdated')
	lastUpdatedDiv.insertAdjacentHTML('beforeend',  '<div>Last updated on: <span class="gold">'+lastUpdatedDate+' MST</span></div>')
}

function outputBeerLiElement(drinkList, nextItemToOutput) {
	var beer = drinkList[nextItemToOutput].beer
	var brewery = drinkList[nextItemToOutput].brewery
	return 'beforeend', '<li class="menu-item"><strong>'+beer.name+'</strong><small>'+" - "+paintThatShitGold(brewery.state)+'</small></li>'
}

function outputTapsLiElement(drinkList, nextItemToOutput) {
	var beer = drinkList[nextItemToOutput].beer
	var brewery = drinkList[nextItemToOutput].brewery

	return 'beforeend', '<li class="menu-item"><strong>'+beer.name+'</strong></br><small>'+" ("+beer.abv+"% / "+beer.ibu+" IBU"+
	") - "+paintThatShitGold(brewery.state)+'</small></li>'
}

function paintThatShitGold(state) {
	if (state === "AZ") {
		return '<span class="gold">'+state+'</span>'
	}
	else {
		return state;
	}
}

$jsonp.send('https://www.taphunter.com/widgets/location/v3/6729532695642112.jsonp?callback=handleCallback', {
    callbackName: 'handleCallback',
    onSuccess: function(json){
    	//DEBUG - console.log('successfully retrieved taphunter data!', json);
    	data = json;
        populatePage(json);
    },
    onTimeout: function(){
        console.log('timeout!');
    },
    timeout: 5
});
