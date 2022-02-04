$(function(){
	if($("[data-liveblog]").length) {
		// var liveBlogLoaded = false;
		let liveBlog = $('[data-liveblog="live"]');
		var liveBlogProId = $(liveBlog).data("liveblog-id");
		$(liveBlog).html("<div id='liveblogpro'> </div>"); // Add ID that live blog JS targets

		$('[data-tab="live"]').one("click", function(){ // Load images on click (saves initial load bulk)
			// if(liveBlogLoaded == false) { // Run live blog script on first click of tab
				liveblogpro.load({"id": liveBlogProId,"at":"0fc30898b333c2247b951734"}); // Init live blog
				// liveBlogLoaded = true;
			// }
		});

		// Activate live blog if default tab
		if($("[data-tab='live']").hasClass("tab-nav-active")) {
			$("[data-tab='live']").trigger("click");
		}
	}
});