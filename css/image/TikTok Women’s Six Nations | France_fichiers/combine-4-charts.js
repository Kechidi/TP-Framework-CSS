$(function() {
	function chart_init(c){
		//validate the chart type
		var chartTypes = ['pie', 'doughnut', 'line', 'bar', 'radar', 'polarArea', 'bubble'];

		if ($.inArray($(c).data('chart'), chartTypes) > -1 ) {
			$(c).sotic_chart();
		} else {
			//print a list of the valid ones here
		}
	}

	$.fn.sotic_chart = function() {

		//make master copies of $(this) variables to make life easier
		var master = $(this);
		var masterData = $(this).data();

		//get the data attributes we need to make a basic chart
		//check if they are arrays
		if (masterData['chartvalues'].indexOf('/') == -1) {
			var masterValues = masterData['chartvalues'].replace(/\s/g,'').split(',');
		} else {
			masterValuesTemp = masterData['chartvalues'].replace(/\s/g,'').split('/');
			//split each sub array by comma
			$.each(masterValuesTemp, function(k,i){
				masterValuesTemp[k] = masterValuesTemp[k].replace(/\s/g,'').split(',');
			})

			var masterValues = masterValuesTemp.reduce(function(acc, cur, i) {
			  acc[i] = cur;
			  return acc;
			}, {});

		}

		if (masterData['chartlabels'].indexOf('/') == -1) {
			var masterLabels = masterData['chartlabels'].replace(/\s/g,'').split(',');
		} else {
			var masterLabels = masterData['chartlabels'].replace(/\s/g,'').split('/');
		}

		if (masterData['chartcolours'].indexOf('/') == -1) {
			var masterColours = masterData['chartcolours'].replace(/\s/g,'').split(',');
		} else {
			var masterColours = masterData['chartcolours'].replace(/\s/g,'').split('/');
		}

		var masterBorderColour = '#ffffff';
		var masterBorderWidth = '2px';
		var masterVariant = null;

		if (masterData['chartbordercolour']) {
			var masterBorderColour = masterData['chartbordercolour'];
		}

		if(typeof masterData['chartborderwidth'] !== "undefined") {
			masterBorderWidth = String(masterData['chartborderwidth']);
		}

		if (typeof masterData['chartvariant'] !== "undefined") {
			masterVariant = masterData['chartvariant'];
		}

		//convert values to integers
		if (masterValues instanceof Array) {
			masterValues = masterValues.map(function (x) {
			    return parseInt(x, 10);
			});
		}

		//this makes the pie charts look like they're in the 'right' order
		if (( masterData['chart'] == 'doughnut') || ( masterData['chart'] == 'pie')) {
			masterValues.reverse();
			masterLabels.reverse();
			masterColours.reverse();
		}

		//set up the empty masterOptions for extending
			//(we're extending so we don't create a new object every time and wipe our other stuff)
		var masterOptions = {};

		//default options
		if ((masterData['chart'] == 'bar') || (masterData['chart'] == 'line')) {
			$().extend (masterOptions, {
			    scales: {
			        yAxes: [{
			            ticks: {
			                beginAtZero: true //charts start from the lowest value, rather than zero. DUMB, RIGHT?
			            }
			        }],
			    },
			});
		}

		if ((masterData['chart'] == 'doughnut') || (masterData['chart'] == 'pie')) {
			$().extend(masterOptions, {
				legend: {
					reverse: true //since we reversed the labels for the chart, we should reverse them back for the legend
				}
			});
		}

		//if chart options have been passed from the element
		if (typeof(masterData['chartoptions']) !== 'undefined' ) {
			//add them to the master options
			$().extend(masterOptions, eval("(" + masterData['chartoptions'] + ")"));
		}
		//(this is after the default options so user set options take priority)

		//set up our data object
		var data = {
			labels: masterLabels,
			datasets: [{
				data: masterValues,
				backgroundColor: masterColours,
				borderColor: masterBorderColour,
				borderWidth: masterBorderWidth
			}]
		};

		if ((masterData['chart'] == 'line')) {
			data['datasets'][0]['fill'] = false;
			if (typeof(masterData['chartlinecolour']) !== 'undefined') {
				data['datasets'][0]['borderColor'] = masterData['chartlinecolour'];
			}
		}

		//set up our variants that effect
		if (masterData['chart'] == 'line') {
			if (typeof(masterData['chartvariant']) !== undefined ) {
				if (masterData['chartvariant'] == 'area') {
					data['datasets'][0]['fill'] = true;
				}
			}
		}

		if (typeof(masterData['chartfillcolour']) !== 'undefined') {
			data['datasets'][0]['backgroundColor'] = masterData['chartfillcolour'];
		}

		var theChart = new Chart($(master), {
			type: masterData['chart'],
			data: data,
			options: masterOptions
		});

		$(this).attr('data-chart-init', 'true'); //set the chart to 'initialised'

	};

	//once all widgets have loaded, or when we swap tabs
	$(window).on('load widget-load, data-tab-swap, stats-api-data-ready', function () {
		$('[data-chart]:visible:not([data-chart-init])').each(function(t){ //run on each [data-tab-nav] that doesn't have [data-tab-init]
			chart_init($(this));
		});
	});

	document.addEventListener('stats-api-data-ready', function() {
		$('[data-chart]:visible:not([data-chart-init])').each(function(t){ //run on each [data-tab-nav] that doesn't have [data-tab-init]
			chart_init($(this));
		});
	});

	//only run visible charts - they have height 0 otherwise
	$.each($('[data-chart]:visible:not([data-chart-init])'), function() {
		chart_init($(this));
	});
});
