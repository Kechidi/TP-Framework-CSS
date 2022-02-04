$(function(){
    $("[data-article-tab]").one("click", function() { // Change to `ONE`
        var articleTab = $(this).data('article-tab'); // Get clicked tab value
        var articleFixGuid = $("[data-article-type='" + articleTab + "']").data('article-fixguid'); // Get FixGuid attached to article mark up
        var articleType = $("[data-article-type='" + articleTab + "']").data('article-type');
        var articleLang = $("[data-article-type='" + articleTab + "']").data('article-lang');
        var articleImgSize = 'matchMain';
        var articles = {"articles" : []}

        $.ajax({
            type: 'GET',
            url:  WP_VARS.base_url + '/wp-json/wp/v2/matches',
            data: {
                "post_type": articleType,
                "guid": articleFixGuid,
                "imgsize": articleImgSize,
                "language": articleLang
            },
            mimeType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {

                let articleBody = {
                    "id": data[0].id,
                    "author": data[0].author,
                    "link": data[0].link,
                    "title": data[0].title,
                    "date": data[0].date,
                    "timeago": data[0].timeago,
                    "srcset": data[0].match_srcset,
                    "keypoints": data[0].key_points,
                    "excerpt": data[0].excerpt,
                    "content": data[0].content,
                    "tags": data[0].tags,
                    "tagClass": data[0].tagClass,
                    "type": articleType,
                }

                articles.articles.push(articleBody); // Push article content to article body

                $.get(WP_VARS.template_url + '/assets/mst/match-article.mst', function(template){
                    let rendered = Mustache.render(template, articles);
                    $("[data-article-type=" + articleType + "]").append(rendered);
                    
                }).always(function(){
                    $("[data-loader='" + articleType + "']").remove(); // Remove loading SVG from relevant tab
                    $(window).trigger('match-article-load');
                    
                    if ($('.content__social-icon')[0]){
                        socialShare(); // Run Social Share
                    }
                    
                    if ($('[data-video="true"]')[0]){
                        fitVideos(); // Run FitVids
                    }

                });
            }
        });
    });

    // Check if a report / preview has an active tab and trigger a click to load article
    var articleUrls = {preview: "preview", report: "report"};
    $.each(articleUrls, function(index, value){
        if($("[data-article-tab='" + value + "']").hasClass("tab-nav-active")) {
            $("[data-article-tab='" + value + "']").trigger("click");
        }
    });
});