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
  outputColumnedMenu({
    data: json.taps,
    menuType: 'cms_taps',
    min_items_for_multicolumn: 8,
    outputMenu: function(data) {
      return 'beforeend', '<li class="menu-item"><strong>'+data.beer.name+'</strong></br><small>'+" ("+data.beer.abv+"% / "+data.beer.ibu+" IBU) - "+paintThatShitGold(data.brewery.state)+'</small></li>'
    }
  })
	outputColumnedMenu({
    data: json.bottles,
    menuType: 'bottles',
    min_items_for_multicolumn: 8,
    outputMenu: function(data){
      return 'beforeend', '<li class="menu-item"><strong>'+data.beer.name+'</strong><small>'+" - "+paintThatShitGold(data.brewery.state)+'</small></li>'
    }
  })
  outputCocktails(json.cocktails)
  outputWines(json.wines)
  outputEvents(json.events)
};

function paintThatShitGold(state) {
  return state === "AZ" ? '<span class="gold">'+state+'</span>' : '<span>'+state+'</span>';
}

function outputEvents(data) {
  for(var i = 0; i < data.length; i++) {
    var description = data[i].description.length > 200 ? data[i].description.substring(0,300).concat("...") : data[i].description;
    document.getElementById("content_events").insertAdjacentHTML('beforeend', (function(data) {
      return "<div class='col-md-4'>"+
          "<h3 class='menu-header-4 padding-small'><strong>"+data.title+"</strong></h3><div>"+data.event_start_date+" - "+data.event_start_time+"</div>"+
              "<div class='menu-text'>"+description+"</div>"+
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

function outputColumnedMenu(displayObject){
  var itemList, menuType, min_items_for_multicolumn, columnsNeeded, nextItemToOutput, lastUpdated

  itemList = displayObject.data
  menuType = displayObject.menuType
  min_items_for_multicolumn = displayObject.min_items_for_multicolumn
  columnsNeeded = 4;
	nextItemToOutput = 0;
	lastUpdated = '';

	if(itemList.length < min_items_for_multicolumn) { columnsNeeded = 1 };

	var itemsPerColumn = Math.floor(itemList.length / columnsNeeded);
	var remainder = itemList.length % columnsNeeded

	for (var columnNumber = 0; columnNumber <= columnsNeeded && nextItemToOutput < itemList.length; columnNumber++){
		var itemsInThisColumn = itemsPerColumn;

		if(remainder > 0) {
			itemsInThisColumn++
			remainder--
		}

		document.getElementById(menuType).insertAdjacentHTML('beforeend', (function(menuType, columnNumber){
      return '<div id='+menuType+'-col-'+columnNumber+' class="col-md-3"></div>'
    })(menuType, columnNumber))

		document.getElementById(menuType+'-col-'+columnNumber).insertAdjacentHTML('beforeend', (function(menuType, columnNumber){
      return 'beforeend', '<ul id="'+menuType+'-ul-'+columnNumber+'"></ul>'
    })(menuType, columnNumber))

		var ul = document.getElementById(menuType+'-ul-'+columnNumber)

		for (var j = 0; j < itemsInThisColumn && nextItemToOutput < itemList.length; j++){
      var data = itemList[nextItemToOutput]
			ul.insertAdjacentHTML('beforeend', displayObject.outputMenu(data))

			if (itemList[nextItemToOutput].date_added_timestamp > lastUpdated) {
				lastUpdated = itemList[nextItemToOutput].date_added_timestamp
			}
			nextItemToOutput++
		}
	}

	var myDate = new Date(lastUpdated*1000);
	var lastUpdatedDate = myDate.toLocaleString();

	document.getElementById(menuType+'-lastupdated').insertAdjacentHTML('beforeend',  '<div>Last updated on: <span class="gold">'+lastUpdatedDate+' MST</span></div>')
}

$jsonp.send('https://www.taphunter.com/widgets/location/v3/6729532695642112.jsonp?callback=handleCallback', {
    callbackName: 'handleCallback',
    onSuccess: function(json){
    	// DEBUG - console.log('successfully retrieved taphunter data!', json);
    	// This will expose the data to whole page:
      // data = json;
        populatePage(json);
    },
    onTimeout: function(){
        console.log('timeout!');
    },
    timeout: 5
});
