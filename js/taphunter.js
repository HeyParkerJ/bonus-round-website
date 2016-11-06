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
  outputColumnedList({
    data: json.taps,
    menuType: 'cms_taps',
    min_items_for_multicolumn: 8,
    columnsNeeded: 4,
    enableLastUpdated: true,
    outputMenu: function(data, param) {
      return 'beforeend', '<li><div<strong>'+data.beer.name+'</strong></br><small>'+" ("+data.beer.abv+"% / "+data.beer.ibu+" IBU) - "+paintThatShitGold(data.brewery.state)+'</small></li>'
    }
  })
	outputColumnedList({
    data: json.bottles,
    menuType: 'cms_bottles',
    min_items_for_multicolumn: 8,
    columnsNeeded: 4,
    enableLastUpdated: true,
    outputMenu: function(data, param){
      return 'beforeend', '<li><strong>'+data.beer.name+'</strong><small>'+" - "+paintThatShitGold(data.brewery.state)+'</small></li>'
    }
  })
  outputEvents({
    data: json.events,
    menuType: 'cms_events',
    min_items_for_multicolumn: 3,
    columnsNeeded: 3,
    enableLastUpdated: false,
    outputMenu: function(data, param) {
      var description = data.description.length > 200 ? data.description.substring(0,300).concat("...") : data.description;
      return "<div class='card'><div class='card-header'><h3 class='card-title'>"+data.title+"</h3><div class='card-flavor'>"+data.event_start_date+" - "+data.event_start_time+"</div></div>"+
              "<div class='card-content'>"+description+"</div><div class='card-footer'><a class='link' href="+data.link+">Read on Facebook</a></div>"
    }
  })
  outputCocktails(json.cocktails)
  outputWines(json.wines)
};

function paintThatShitGold(state) {
  return state === "AZ" ? '<span class="gold">'+state+'</span>' : '<span>'+state+'</span>';
}

function outputWines(data) {
  var WhitesUlElement = document.getElementById("content_whites");
  var RedsUlElement = document.getElementById("content_reds");

  outputLi = function(data) {
    return "<div>"+data.name+"</div>";
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
      return "<li><p class='menu-header-minor'>"+data.name+"</p>"+data.ingredients.string+"</li>"
    }(data[i]))
  }
}

function outputEvents(displayObject) {
  var itemList, menuType, min_items_for_multicolumn, columnsNeeded, nextItemToOutput, lastUpdated

  itemList = displayObject.data
  menuType = displayObject.menuType
  min_items_for_multicolumn = displayObject.min_items_for_multicolumn
  columnsNeeded = displayObject.columnsNeeded;
	nextItemToOutput = 0;

  if(itemList.length < min_items_for_multicolumn) { columnsNeeded = 1 };

	var itemsPerColumn = Math.floor(itemList.length / columnsNeeded);
	var remainder = itemList.length % columnsNeeded

	for (var columnNumber = 0; columnNumber <= columnsNeeded && nextItemToOutput < itemList.length; columnNumber++){
		var itemsInThisColumn = itemsPerColumn;

		if(remainder > 0) {
			itemsInThisColumn++
			remainder--
		}

    document.getElementById(menuType).insertAdjacentHTML('beforeend', (function(){
      return '<div id='+menuType+'-col-'+columnNumber+' class="col-md-4"></div>'
    })())

    document.getElementById(menuType+'-col-'+columnNumber).insertAdjacentHTML('beforeend', (function(){
      return 'beforeend', '<div id="'+menuType+'-div-'+columnNumber+'></div>'
    })())

    var div = document.getElementById(menuType+'-col-'+columnNumber)

		for (var j = 0; j < itemsInThisColumn && nextItemToOutput < itemList.length; j++){
      var data = itemList[nextItemToOutput]
			div.insertAdjacentHTML('beforeend', displayObject.outputMenu(data))

			nextItemToOutput++
		}
  }
}

function outputColumnedList(displayObject){
  var itemList, menuType, min_items_for_multicolumn, columnsNeeded, nextItemToOutput, lastUpdated

  itemList = displayObject.data
  menuType = displayObject.menuType
  min_items_for_multicolumn = displayObject.min_items_for_multicolumn
  columnsNeeded = displayObject.columnsNeeded;
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

		document.getElementById(menuType).insertAdjacentHTML('beforeend', (function(){
      return '<div id='+menuType+'-col-'+columnNumber+' class="col-md-3"></div>'
    })())

		document.getElementById(menuType+'-col-'+columnNumber).insertAdjacentHTML('beforeend', (function(){
      return 'beforeend', '<ul id="'+menuType+'-ul-'+columnNumber+'"></ul>'
    })())

		var ul = document.getElementById(menuType+'-ul-'+columnNumber)

		for (var j = 0; j < itemsInThisColumn && nextItemToOutput < itemList.length; j++){
      var data = itemList[nextItemToOutput]
			ul.insertAdjacentHTML('beforeend', displayObject.outputMenu(data, nextItemToOutput))

			if (displayObject.enableLastUpdated && itemList[nextItemToOutput].date_added_timestamp > lastUpdated) {
				lastUpdated = itemList[nextItemToOutput].date_added_timestamp
			}
			nextItemToOutput++
		}
	}

  if(displayObject.enableLastUpdated) {
    var myDate = new Date(lastUpdated*1000);
    var lastUpdatedDate = myDate.toLocaleString();
    document.getElementById(menuType+'-lastupdated').insertAdjacentHTML('beforeend',  '<div class="menu-flavor-minor">Last updated on: <span class="gold">'+lastUpdatedDate+' MST</span></div>')
  }
}

$jsonp.send('https://www.taphunter.com/widgets/location/v3/6729532695642112.jsonp?callback=handleCallback', {
    callbackName: 'handleCallback',
    onSuccess: function(json){
    	// DEBUG - console.log('successfully retrieved taphunter data!', json);
    	// This will expose the data to whole page:
        data = json;
        populatePage(json);
    },
    onTimeout: function(){
        console.log('timeout!');
    },
    timeout: 5
});
