/* globals $, Mustache */
$(function() {
    // Loop through the aggregator elements and initate
    $.each($('[data-aggregator]'), function(i, val){
        soticAggregatorInit(val, "[data-aggregator-item]", "[data-aggregator-categories]");
    });

    $('.aggregatorFilter').click(function(e){
        $('[data-aggregator-categories]').toggleClass('open');
        $('.aggregatorFilter i').toggleClass('hidden');
    });
});

/**
 * Produces a multimedia news list onto a page.
 * @param aggregator
 * @param category
 */
function soticAggregator(aggregator, category, reloadPosts) {
    $('.agg-error').remove(); // clear all error messages that may or may not be in our aggregator

    let settings = $(aggregator).data(); // Grab all the data we need from the DOM into an object

    if (typeof(WP_VARS) !== "undefined") {
        settings.template = WP_VARS.template_url;
        settings.siteurl = WP_VARS.base_url;
    }

    let count = 0;
    let content = { "items" : [] };
    let load = { "attributes" : {title: settings.template + '/assets/img/widget-load.svg', selector: aggregator} };

    // A series of checks to ensure the aggregator behaves
    if (typeof(category) !== "undefined") {
        settings.categories = category; // Category is what was selected from the filters. This can also be supplied by the lazy load function as well.
    }
    if (typeof(settings.endpoint) === "undefined") { // Check endpoint and fail gracefully.
        settings.endpoint = "feed";
    }
    if (typeof(settings.guid) === "undefined") {
        settings.guid = "";
    }
    if (typeof(settings.search) === "undefined") {
        settings.search = "";
    }
    if (typeof(settings.posttype) === "undefined") {
        settings.posttype = "";
    }
    if (typeof(settings.language) === "undefined") {
        settings.language = "en";
    }
    if (typeof(reloadPosts) !== "undefined") {
        settings.originalposts = reloadPosts;
    }

    // Add a spinner on load
    if (settings.offset === 0) {
        let mainSpinner = '<div class="widget-loader-agg ta-centre"><img class="loader-aggregator" title="Loading" alt="This icon indicates loading" src="' + settings.template + '/assets/img/widget-load.svg"></div>';
        $(aggregator).append(mainSpinner);

        // Remove spinner on load complete
        $(window).on('aggregator-load-complete', function(){
            $('.widget-loader-agg').remove();
        });
    }

    // Check if load more button is present in the mark up and if not render

    if (settings.hideloadmore === '') {
        let loadMoreCount = $(aggregator).parent().find('.news-section__more-news'); // check for the existence of the load more button in our aggregator

        if (loadMoreCount.length === 0) { // if one doesn't already exist
            $.get(settings.template + '/assets/mst/load-more.mst', function(template) {
                let button = Mustache.render(template, load);
                $(aggregator).parent().append(button);
            });
        }
    }

    $.ajax({
        type: 'GET',
        url: settings.siteurl + "/wp-json/wp/v2/" + settings.endpoint,
        data: {
            "posts_per_page": settings.originalposts,
            "layout": settings.layout,
            "language": settings.language,
            "categories": settings.categories,
            "search": settings.search,
            "post_type": settings.posttype,
            "guid": settings.guid,
            "exclude": settings.exclude,
            "offset": settings.offset,
            "orderby": "date",
            "order": "desc"
        },
        mimeType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            if (typeof(data[0].error) === "undefined") {
                for (let i = 0; i < data.length; i++) {
                    // Build categories
                    let catList = { "categories": [] };
                    $.each(data[i].category_list, function(key, value) {
                        let singleCat = {};
                        singleCat.name = value.name;
                        singleCat.slug = value.slug;
                        catList.categories.push(singleCat);
                    });

                    // Set thumbnail and layout default and modify if necessary
                    let layout = false;
                    let typeLabel = data[i].type;
                    let icon = false;

                    let type = data[i].type;

                    if (type === "video") {
                        icon = true;
                    }

                    let item = {
                        "id": data[i].id,
                        "title": data[i].title,
                        "excerpt": data[i].excerpt,
                        "type": type,
                        "href": data[i].link,
                        "date": data[i].date,
                        "timeago": data[i].timeago,
                        "tags": data[i].tags,
                        "tagClass": data[i].tagClass,
                        "fixguid": data[i].fixguid,
                        "videoId": data[i].video_id,
                        "thumbnail": data[i].thumbnail,
                        "srcset": data[i].srcset_large,
                        "categories": catList,
                        "layout": layout,
                        "typeLabel": typeLabel,
                        "icon": icon,
                        "sponsored": data[i].sponsored
                    };
                    content.items.push(item);
                    count++;
                }

                if (["list", "player", "related"].indexOf(settings.layout.toLowerCase()) > -1) {
                    // render each WP post item 'card' with the same template
                    let rendered = '';
                    $.get(settings.template + '/assets/mst/' + soticAggregatorLayoutConfig(settings.layout), function(template) {
                        $.when( Mustache.render(template, content) ).done(function(rendered) {
                            let renderedElement = $(rendered);
                            $(aggregator).append(renderedElement);
                        }).done( soticAggregatorFinishedFetch(aggregator, count, settings) ) ;

                    });

                } else {
                    // render individual post items
                    // https://stackoverflow.com/a/10004137 - jQuery Promises
                    let promiseGetPosts = [];
                    let renderedPosts = [];
                    content.items.forEach(function (cardItem, cardIndex) {
                        promiseGetPosts[cardIndex] = (
                            $.get(settings.template + '/assets/mst/' + soticAggregatorCardLayout(cardIndex, aggregator), function (template) {
                                let cardContent = {"items": [cardItem]}; // mustache is expecting this layout - sry.
                                $.when( Mustache.render(template, cardContent)).done( function(rendered) {
                                    renderedPosts[cardIndex] = rendered;
                                });
                            })
                        );
                    });

                    $.when.apply($, promiseGetPosts).done(function() {
                        $.when(renderedPosts.forEach( function(rendered,i) {
                            let renderedElement = $(rendered);
                            $(aggregator).append(renderedElement);settings.hideloadmore
                        })).then(soticAggregatorFinishedFetch(aggregator, count, settings))
                    });
                }
            } else {
                // If our ajax request has failed
                $('.widget-loader-agg').remove(); // remove the spinner
                $('.news-section__more-news').remove(); // remove the load more

                let errorBtn = '<p class="agg-error ta-centre col-xs-12 p-0">'+data[0].error+'</p>'; // put the error message in a centred <p>
                $(aggregator).append(errorBtn); //append to the aggregator
            }
        }, error: function(data) {
	        console.dir(data);
        }
    });
}

/**
 * Triggers the sotic aggregator function (new offset defined in function)
 * @param $aggregator - the aggregator in which to activate the lazy load
 */
function soticAggregatorLazyLoad(aggregator) {
    $(document).on("click", "a button.news-section__more-news", function(e) {
        e.preventDefault();
        $('.load-spinner').addClass('show-spin');
        $('.load-spin').toggleClass("rotated");
    });

    $(window).on('aggregator-load-complete', function(){
        $('.load-spinner').removeClass('show-spin');
    });

    $(document).on("click", "a[data-selector^='"+aggregator+"']", function(e) {
        e.preventDefault();
        let category = $(aggregator).data('categories'); // CHECK IF A CATEGORY HAS BEEN SET BY THE FILTERS
        $(aggregator).data('moreloaded', 'loaded');
        let reloadPosts = $(aggregator).data('originalposts') - 1;

        if (category) {
            soticAggregator(aggregator, category, reloadPosts);
        }
        else {
            soticAggregator(aggregator, '', reloadPosts);
        }
    });
}

/**
 * Uses the media filters on the media page (page-media) to limit the post types queried on the endpoint
 * @param $mediagrid - the media grid element
 * @param $item - the unique class of the elements within the media grid
 * @param $filters - the parent class of <ul> elements
 */
function soticAggregatorMediaControls(aggregator, item) {
    $("[data-media-control]").click(function(){
        let typeId = $(this).data('posttype');
        let catId = $(this).data('category');
        $(this).addClass("active");
        $(this).siblings().removeClass('active');
        $(aggregator).find(item).remove();
        $(aggregator).data('posttype', typeId); // Set post type on the aggregator
        $(aggregator).data('categories', catId);
        $(aggregator).data('offset', 0); // Set the offset back to 0 to get the latest result
        soticAggregator(aggregator);

    });
}

/**
 * In beta: activates show / hide technology on filters whose mark up is a select control
 * @param $filters the class name of the select control,
 * @param $aggregator the aggregator in which to activate the filter on
 * @param $item - the aggregator item block
 */
function soticAggregatorShowHide(filters, aggregator, item) {
    $(filters).change(function(){
        $(aggregator).find(item).remove();
        let categoryID = $(this).find('option:selected');
        categoryID = categoryID.val();
        if (categoryID === 'all') {
            soticAggregator(aggregator);
        }
        else {
            soticAggregator(aggregator, categoryID);
        }
    });
}

/**
 * Returns an appropriate layout path filename based on the agreed config below
 * @param $layout - the layout setting from the aggregator's data attribute layout
 * @return $layoutPath - a filename string
 */

function soticAggregatorLayoutConfig(layout) {
    let layoutPath = "";

    switch (layout.toLowerCase()) {
        case "list":
            layoutPath = "aggregator-list.mst";
            break;

        case "grid":
        case "tv":
            layoutPath = "aggregator.mst";
            break;

        case "player":
            layoutPath = "player.mst";
            break;

        case "related":
            layoutPath = "related.mst";
            break;

        default:
            layoutPath = "aggregator.mst";
            break;
    }

    return layoutPath;
}

/**
 * Returns the correct Mustache template for the WP Post item, based on its position in the page, i.e. 1st and 2nd.
 * @param {int} index  Index id of returned post
 * @returns {string}
 */
function soticAggregatorCardLayout(index, aggregator) {
    let mstCardToUse = "aggregator.mst";
    let loadMore = $(aggregator).data('moreloaded');

    if (index === 0 && loadMore === 0) {
        mstCardToUse = "aggregator-large.mst";
    }

    return mstCardToUse;
}

/**
 *
 * @param {object} aggregator _the_ aggregator
 * @param {int} count the number of posts returned in order to update the offset.
 * @param {object} settings setting values
 */
function soticAggregatorFinishedFetch(aggregator, count, settings) {
    $(aggregator).data('message', 'success'); // Set to success
    let newOffset = count + $(aggregator).data('offset'); // Calculate new offset based on the current offset data attribute + how many times we count++
    let newPosts = settings.posts;
    $(aggregator).data('offset', newOffset); // Set new offset
    $(aggregator).data('posts', newPosts);
    $(window).trigger('aggregator-load-complete');
}


/**
 * Creates an aggregator and activates subsequent functionality on aggregator components
 * @param $aggregator (the aggregator)
 * @param $item (the aggregator item class)
 * @param $filters - the filters for the aggregator be them a list, a dropdown and so on
 */
function soticAggregatorInit(aggregator, item, filters) {
    if ($(aggregator).length) {
        soticAggregatorLazyLoad(aggregator);
        soticAggregatorMediaControls(aggregator, item);
        soticAggregatorActivateFilters(aggregator, item, filters);
        soticAggregator(aggregator);
        $(window).trigger('aggregator-load', ['ID', aggregator]);
    }
}

/**
 * Only activates filters on divs where in filters data attribute matches the class of the aggregator param
 * @param $aggregator (the aggregator)
 * @param $item (the aggregator item class)
 * @param $filters - the filters for the aggregator be them a list, a dropdown and so on
 */
function soticAggregatorActivateFilters(aggregator, item, filters) {
    let agg = $(filters).data('aggregator-filters'); // this is unused
    soticAggregatorShowHide(aggregator, filters);
}
