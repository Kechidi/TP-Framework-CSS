$(function(){	
	accordionSet(".accordion-header", ".accordion-content", ".accordion-decoration");
});

function accordionSet(heading, content, icon) {
	if (icon === undefined) { icon = '.accordion-decoration'; }
	
	//make the first heading appear
	$(heading).first().addClass(heading.substring(1)+'-active');
	$(content).first().addClass(content.substring(1)+'-show');
	$(icon).first().text('-');
	
	$(heading).click(function () {
		//if accordion-header-active
		if ($(this).is(heading+'-active')) {
			console.log('Active: '+$.trim($(this).text()));
			//remove active class
			$(this).removeClass(heading.substring(1)+'-active');
			$(this).next(content).removeClass(content.substring(1)+'-show');
			$(this).find(icon).text('+');
		} else {
			console.log('Not active: '+$.trim($(this).text()));
			$(this).addClass(heading.substring(1)+'-active');
			$(this).next(content).addClass(content.substring(1)+'-show');
			$(this).find(icon).text('-');
		}		
	});
}