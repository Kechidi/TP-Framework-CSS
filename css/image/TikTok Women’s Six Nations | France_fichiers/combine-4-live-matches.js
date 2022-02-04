/**
* Live Matches
* A few helper scripts to aid in user experience
*/

/**
* Scroll the active tab into view on mobile
*/
$(function(){
	if($(window).width() < 1039) {
		if ($('.tab-nav-active').length) {
			const position = $('.tab-nav-active').position().left;

			$('.matchNavigation-tabs').animate({scrollLeft: position, }, 0);
		}
	}
});
