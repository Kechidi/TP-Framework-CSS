$(function(){
	var liveGalleryLoaded = false;
	$('[data-tab="gallery"]').on("click", function(){ // Load images on click (saves initial load bulk)
		if($(".nanoDAMGallery").length > 0 && liveGalleryLoaded == false) {
			$(".nanoDAMGallery").nanogallery2({
				itemsBaseUrl: "",
				thumbnailWidth: "auto",
				thumbnailHeight: "200",
				colorScheme: {
					thumbnail: {
						background: "transparent",
						borderColor: "transparent",
					}
				},
				thumbnailDisplayInterval: 0,
				thumbnailLabel: {
					position: "overImageOnTop",
		    		titleMultiLine: true,
		    		display: false,
		    		displayDescription: true,
		    		descriptionMultiLine: true
		  		},
				viewerTools: {
					topRight: "shareButton, closeButton"
				}
			});
			$(".nGY2Gallery").css("opacity", "1");
			$('.nGY2TnImg').css('opacity', '1');
		}
		$("[data-loader='gallery']").remove(); // Remove loading gif from gallery div				
		$(window).scroll(); // I "think" this fixes the issue of nano galleries disappearing when its contained in a tab
		liveGalleryLoaded = true; // We've run this, let's not run it again
	});
});