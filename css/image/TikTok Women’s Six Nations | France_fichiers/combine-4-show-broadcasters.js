$(window).on('widget-load stats-api-data-ready', function(){
    if($("[data-broadcaster]").length) {
        getGeoLocation(function(location) {
            renderBroadcasters(location, $("[data-broadcaster]"));
        });
    }
});

function getGeoLocation(callback) {
    let request = new XMLHttpRequest();
    request.open('GET', document.location, true);
    request.send(null); // No need for request body as we're using GET
    request.onreadystatechange = function(){ // When we've completed our request for headers
        if(request.status == 200) {
            let headers = request.getAllResponseHeaders().toLowerCase();
            headers = headers.split(/\n|\r|\r\n/g).reduce(function(a, b) { // Convert into an object
                if (b.length) {
                    let key = b.split(': ')[0];
                    let value = b.split(': ')[1];
                    a[key] = value;
                }
                return a;
            }, {});
            callback({"code": request.status, "geo": headers.geo});
        } else {
            callback({"code": request.status, "geo": false});
        }
    }
}

/**
* @name:           Render Broadcasters
* @description:    Assigns CSS to broadcasters with a matching country code to the passed parameter
* @param:          (string) location - a unqiue country / country code to query mark up.
* @param:          selector - the HTML elements to spider for broadcaster data
*/
function renderBroadcasters(location, selector) {
    if (location.geo !== false) {
        var broadcasterRegions = [];
        $(selector).each(function(){
            let broadcaster = $(this).data('broadcaster-country');
            if (broadcaster) {
                broadcaster = broadcaster.toLowerCase();
                if (broadcasterRegions.indexOf(broadcaster) > -1 != true) { // We don't dupes when multiple widgets fire `widget-load`
                    broadcasterRegions.push(broadcaster);
                }
            }
        });

        if (broadcasterRegions.indexOf(location.geo) > -1 == true) {
            const broadcasterCountry = $("[data-broadcaster-country='" + location.geo.toUpperCase() + "']");
            broadcasterCountry.css('display', 'inline-block');
            broadcasterCountry.parent().addClass('has-broadcaster');
        }

        // If no broadcasters registered to country, show YouTube
        const youtube = document.querySelectorAll(`[data-broadcaster="youtube"]`);
        if (location.geo !== `gb`) {
            youtube.forEach(element => {
                element.classList.add(`active`);
            });
        }

    }
}
