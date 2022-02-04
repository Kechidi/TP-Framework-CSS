$(window).on('live-tab-active', function () {
    liveTweets();
    setInterval(liveTweets, 30000); // Re-run live tweets every x seconds (in this case 10)
});

$(function () {
    $("[data-tab='live']").on("click", function () {
        if ($("[data-match-tweets]").length) {
            $(window).trigger("live-tab-active");
        }
    });

    if ($("[data-tab='live']").hasClass("tab-nav-active")) {
        if ($("[data-match-tweets]").length) {
            $(window).trigger("live-tab-active");
        }
    }
});

function liveTweets() {
    var settings = $("[data-match-tweets]").data();
    var tweets = {
        "tweets": []
    };

    $.ajax({
        type: 'GET',
        url: "//wpapi.soticservers.net/tools/social-api/social-feed.php",
        data: {
            "twitter": settings.username,
            "hashtag": settings.hashtag,
            "numposts": settings.numposts
        },
        mimeType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                let tweetObj = data[i];
                let tweet = {};
                for (let prop in tweetObj) { // Loop through key value pairs of tweet object
                    tweet[prop] = tweetObj[prop]; // Add key / value pair to tweet object
                }
                tweet.text = addLinksToText(tweet.text); // Add links to our text item
                tweets.tweets.push(tweet); // Push tweets to global array
            }

            $.get(WP_VARS.template_url + '/assets/mst/match-tweets.mst', function (template) {
                $("[data-match-tweets]").empty();
                let rendered = Mustache.render(template, tweets);
                $("[data-match-tweets]").append(rendered);
            }).always(function () {
                // Might not be needed
            });
        }
    });
}

/**
 * Replaces raw html markup with links to twitter / facebook / etc
 * @param $text - a textual field in one of the social objects returned in the JSON
 */
function addLinksToText(text) {
    //Add link to all https:// links within posts
    text = text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function (url) {
        return '<a href="' + url + '"  target="_blank" title="Click here for more information" alt="Click for external content">' + url + '</a>';
    });
    //Add link to @usernames used within tweets
    text = text.replace(/\B@([_a-z0-9]+)/ig, function (reply) {
        return '<a href="https://twitter.com/' + reply.substring(1) + '" target="_blank" title="' + reply.substring(1) + '" alt="' + reply.substring(1) + '">' + reply.charAt(0) + reply.substring(1) + '</a>';
    });
    //Add link to #hashtags used within posts
    text = text.replace(/\B#([_a-z0-9]+)/ig, function (reply) {
        return '<a href="https://twitter.com/search?q=' + reply.substring(1) + '" target="_blank" title="' + reply.substring(1) + '" alt="' + reply.substring(1) + '">' + reply.charAt(0) + reply.substring(1) + '</a>';
    });
    return text;
}