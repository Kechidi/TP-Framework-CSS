$(function() {
    if ($('[data-videos]')[0]) {
        initVideoModal(); // Initiate the modal ready to receive video
        let playlistId = $('[data-videos]').data('video-playlist');
        let numberVideos = $('[data-videos]').data('video-number');
        if (playlistId) {
            requestVideos('sixnationsrugby', playlistId, numberVideos);
        }
    }
});

/**
 * @description:    Iterates through an array of videos, models the data and supplies to the mustache file for front-end rendering
 * @param:          {string} $username - the unique username of the YouTube channel
 * @param:          {string} $playlistId - the ID of the YouTube playlist
 * @param:          {int}    $max - the number of results to return
 * @return:         {array}  $videos - an MVC'd array of video data from the YouTube API
 */
function requestVideos(username, playlistId, max) {
    let videos = [];
    let count = 0;
    $.ajax({
        type: 'GET',
        url: '//wpapi.soticservers.net/tools/youtube.php',
        data: {
            'username': username,
            'id': playlistId,
            'maxResults': max,
            'type': 'json',
            'source': 'playlist',
        },
        mimeType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            var data = data.items;
            for (i = 0; i < data.length; i++) {
                if (data[i].snippet.title != 'Private video') {

                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

                    let formattedDate = new Date(data[i].snippet.publishedAt);
                    let day = date_suffix(formattedDate);
                    let month = monthNames[formattedDate.getMonth()];
                    let year = formattedDate.getFullYear();

                    let desc = data[i].snippet.description;
                    let description = desc.split('.');

                    let video = {
                        'id': data[i].contentDetails.videoId,
                        'headline': data[i].snippet.title,
                        'date': day + ' ' + month + ' ' + year,
                        'description': description[0],
                        'thumbnail': data[i].snippet.thumbnails.high.url,
                        'thumbnail-initial': data[i].snippet.thumbnails.default.url,
                        'containerClass': 'post-list--vertical post-list post-list--video',
                        'descriptionClass': 'post-list__description--vertical post-list__description',
                        'count': count,
                    };

                    videos.push(video); // Push video to videos array

                    if (typeof $('.news-section__list').data('video-index') !== 'undefined') {
                        if (count === 0) { // If the very first post
                            video['containerClass'] = 'post-list--highlight pb-2 post-list';
                            video['descriptionClass'] = 'pt-1 post-list__description';
                        }
                    }
                }

                count++;
            }

            let allVideo = {'videos': chunkVideos(videos, 0, data.length)}; // We use data.length here to get the max array size

            renderVideos(allVideo, '[data-video-list]', 'video.mst');
            $(window).trigger('video-load-complete');
        },
        error: function() {
            console.log('Error: unable to get data from endpoint');
        }
    });
}

/**
 * @name:           Date Suffix
 * @description:    Add Suffix to Day of Date
 * @param:          {formattedDate} - the date the video was published
 * @return:         Correct suffix (e.g 'st', 'th' etc)
*/

function date_suffix(formattedDate) {
    return formattedDate.getDate() + (formattedDate.getDate() % 10 == 1 && formattedDate.getDate() != 11 ? 'st' :
        (formattedDate.getDate() % 10 == 2 && formattedDate.getDate() != 12 ? 'nd' :
            (formattedDate.getDate() % 10 == 3 && formattedDate.getDate() != 13 ? 'rd' : 'th')));
}

/**
 * @name:           Render Videos
 * @description:    Supplies MVC'd video data to the mustache file for front-end rendering
 * @param:          {videos} $videos - the array of videos from YouTube API
 * @param:          {string} $element - the DOM element in which to render the data
 * @param:          {string} $template - the mustache file in which to use (must have the .mst extension)
 * @return:         N/A
*/
function renderVideos(videos, element, template) {
    if (!$.trim($(element).html()).length) { // Only do this if the $element is empty
        $.get(WP_VARS.template_url + '/assets/mst/' + template, function(template) {
            let rendered = Mustache.render(template, videos); // Load $template with $video data
            $(element).append(rendered); // Append to $element
        });
    }
    else {
        console.log('The element : ' + element + ' already has content');
    }
}

/**
 * @name            Chunks Videos
 * @description     Gets a numerical set of videos from global array
 * @param           {array} $array - the array of videos from YouTube API
 * @param           {int} $start - which index to begin at in the array
 * @param           {int} $end - which index to end at in the array
 */
function chunkVideos(videos, start, end) {
    if (typeof (start) == 'undefined' || typeof (end) == 'undefined') {
        console.log('Error! You must supply a start and an end index value to use this function');
        return;
    }
    return JSON.parse(JSON.stringify(videos.slice(start, end)));
}

/**
*   @name:          Initiate video modal
*   @description:   Binds a click event to the [data-video-modal] element allowing it to receive YouTube video data
*   @param:         N/A
*   @return:        N/A
*/
function initVideoModal() {
    $(document).on('click', '[data-video-modal]', function(e) {
        let src = $(this).attr('data-src');
        let height = 480;
        let width = 728;

        if ($(window).width() < 1025) { // Mobile sizes
            height = 320;
            width = 360;
        }

        $('[data-video-modal-pane] iframe').attr({
            'src': src,
            'height': height,
            'width': width,
            'allowfullscreen': 1
        });
    });

    $('[data-video-modal-pane]').on('hidden.bs.modal', function() {
        $(this).find('iframe').html('');
        $(this).find('iframe').attr('src', '');
    });
}
