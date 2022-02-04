$(function(){
    if($("[data-nano-gallery]").is(":hidden")) { // Match galleries
        $("[data-tab='images']").one('click', function(){
            soticNano("[data-nano-gallery]", "[data-nano-gallery-content]", WP_VARS.template_url + "/assets/mst/nanogallery.mst");
        });
    }
    else {
        if(nanoInView("[data-nano-gallery]") === true) {
            if($("[data-nano-gallery='historic']").length) { // Run for historic galleries only
                initNano("[data-nano-gallery]", "[data-nano-gallery-content]", "");
            }
            else {
                soticNano("[data-nano-gallery]", "[data-nano-gallery-content]", WP_VARS.template_url + "/assets/mst/nanogallery.mst");
            }
        }
        else {
            $(window).on('scroll', function(){
                if(nanoInView("[data-nano-gallery]") === true) { // We check again while scrolling
                    if($("[data-nano-gallery='historic']").length) { // Run for historic galleries only
                        initNano("[data-nano-gallery]", "[data-nano-gallery-content]", "");
                    }
                    else {
                        soticNano("[data-nano-gallery]", "[data-nano-gallery-content]", WP_VARS.template_url + "/assets/mst/nanogallery.mst");
                    }
                }
            });
        }
    }
});

function soticNano(container, element, layout) {
    $(window).off('scroll'); // We want to only run the scroll check once.
    queryNanoAPI($(container).data(), function(content){
        renderNanoAPI(content, layout, function(rendered){
            initNano(container, element, rendered);
        });
    });
}

function queryNanoAPI(settings, callback) {
    $.ajax({
        type: 'GET',
        mimeType: "application/json; charset=utf-8",
        dataType: "json",
        url: '//wpapi.soticservers.net/tools/dam/',
        data: {
            project: settings.project,
            taxonomy: settings.taxonomy,
            id: settings.id,
            max: settings.max
        },
        success: function(data) {
            var data = data.images;
            let content = {
                "settings" : settings,
                "images" : [],
                "error" : false
            };

            if(data) {
                for(let i = 0; i < data.length; i++) {
                    let image = {};
                    for(let key in data[i]) {
                        if(data[i].hasOwnProperty(key)) {
                            image[key] = data[i][key];
                        }
                    }
                    content.images.push(image);
                }
                callback(content);
            }
            else { // Send back empty "images" to be handled in MST file
                if($("[data-nano-gallery-loader]").length) {
                    $("[data-nano-gallery-loader]").remove();
                }
                content.error = true;
                content.errortext = $("[data-nano-gallery]").data('errortext');
                callback(content);
            }
        }
    });
}

function renderNanoAPI(images, layout, callback) {
    $.get(layout, function(template) {
        let rendered = Mustache.render(template, images);
        callback(rendered);
     });
}

function initNano(container, element, rendered) {
    $(container).append(rendered);
	$(element).nanoGallery({
		itemsBaseUrl: "",
		thumbnailWidth: "auto",
		thumbnailHeight: "200",
		thumbnailHoverEffect:'imageScaleIn80',
		colorScheme: {
			thumbnail: {
				background: "transparent",
				border: 0,
			}
		},
		colorSchemeViewer: {
            background: 'rgba(1, 1, 1, 0.9)',
            barBackground: '#343434',
            barColor: '#eee',
            barDescriptionColor: '#ffffff'
        },
		thumbnailDisplayInterval: 30,
		thumbnailLabel: {
			position: "overImageOnTop",
    		titleMultiLine: true,
    		display: false,
    		displayDescription: true,
    		descriptionMultiLine: true
  		},
		viewerTools: {
			topRight: "shareButton, closeButton"
        },
        fnInitGallery: function($elt, item) {
            if($("[data-nano-gallery-loader]").length) {
                $("[data-nano-gallery-loader]").remove();
            }
        }
	});
}

function nanoInView(element) {
    if($(element).length) {
        let elementTop = $(element).offset().top;
        let elementBottom = elementTop + $(element).outerHeight();

        let viewportTop = $(window).scrollTop();
        let viewportBottom = viewportTop + $(window).height();

        if(elementBottom > viewportTop && elementTop < viewportBottom) {
            return true;
        }
        return false;
    }
    return false;
}