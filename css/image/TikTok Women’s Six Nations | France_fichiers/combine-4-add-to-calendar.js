/**
* 	@name ADD TO CALENDAR
*	@description This javascript uses specific data attributes in site elements to add "add to calendar" functionality.
*	@author - Daniel Drave, Sotic LTD
*	@version - 1.0
*	@notes
*	Examples of required mark up are as follows where "element" can me any HTML element.
*	<element href="" class="calendar-link"
		data-platform=""
		data-summary="{$summary|urlencode}"
		data-description="{$description|urlencode}"
		data-location="{$location|urlencode}"
		data-timestamp="{$fixture->FixStartUTC}"
		data-calendar-link
	>
	TEXT HERE 
	</element>
*
*/

$(window).on('widget-load-all', function(){
	var platform = window.navigator.platform; // THIS IS SUPPLIED BY ALL BROWSERS
	var platforms = {
		"iPhone":"ios", // Apple iPhone(s)
		"MacIntel":"ios", // MacBooks (Intel Core)
		"Win32":"outlook", // Chrome, Edge, IE on Windows
		"Win64":"outlook", // Firefox on windows
		"Linux armv7l":"google" // Android devices
	};
	var calendarUrl = "";
	var count = 0;

	$("[data-calendar-link]").data('platform', platforms[platform]); // ASSIGN PLATFORM SLUG (WHICH MATCHES THE CALENDAR SERVICE URL) TO ALL CALENDAR LINKS IN THE FIXTURE LIST

	$.each($("[data-calendar-link]"), function(){
		var element = this;
		$.each($(element).data(), function(key, value){
			if(count == 0) {
				var prefix = "?";
			}
			else {
				var prefix = "&";
			}
			if(value) {
				calendarUrl += prefix + key + "=" + value;
			}
			count++;
		});
		$(element).attr("href", "http://rhinos.dan.dev.soticcloud.net/calendar/calendar.php" + calendarUrl); // AMEND HREF WITH ALL DATA ATTRIBUTES OF THE CALENDAR ELEMENT AND LINK TO CALENDAR.PHP SERVICE
		calendarUrl = ""; // RESET CALENDAR LINK
		count = 0; // RESET COUNT
	});
});