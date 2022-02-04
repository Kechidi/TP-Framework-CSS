$(function(){
    liveVideoModal(); // Bind video modal to click
    var playlistId = $('[data-match-videos]').data('video-playlist');

    $('[data-tab="video"]').one('click', function(){
        $.ajax({
            type: 'GET',
            url:  '//wpapi.soticservers.net/tools/youtube.php',
            data: {
                'username': 'sixnationsrugby',
                'id': playlistId,
                'maxResults': 50,
                'type': 'json',
                'source': 'playlist'
            },
            mimeType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                let playlistVideos = {'videos' : []};
                data = data.items;

                for (i = 0; i < data.length; i++) {
                    if (data[i].snippet.title !== 'Private video') {
                        let video = {
                            'id': data[i].contentDetails.videoId,
                            'headline': data[i].snippet.title,
                            'thumbnail': data[i].snippet.thumbnails.standard.url
                        }

                        playlistVideos.videos.push(video);
                    }
                }

                $.get(WP_VARS.template_url + '/assets/mst/match-video.mst', function(template){
                    let rendered = Mustache.render(template, playlistVideos);
                    $('[data-match-videos]').append(rendered);
                }).always(function(){
                    $('[data-loader="video"]').remove();
                });
            }
        });
    });
});

function liveVideoModal() {
    $(document).on('click', '[data-video-item]', function(e) {
        let src = $(this).attr('data-src');
        let height = 480;
        let width = 728;

        if ($(window).width() < 1039) {
            height = 320;
            width = 360;
        }

        $('[data-video-modal] iframe').attr({
            'src': src,
            'height': height,
            'width': width,
            'allowfullscreen': 1
        });
    });

    $('[data-video-modal]').on('hidden.bs.modal', function(){
        $(this).find('iframe').html('');
        $(this).find('iframe').attr('src', '');
    });
}