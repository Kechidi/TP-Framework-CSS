/**
 * Brightcove.js is a video API integration for the Brightcove media cloud
 */

 window.addEventListener('DOMContentLoaded', function(){
    const brightcoveElement = document.querySelector('[data-brightcove-playlist]');

    if (brightcoveElement) {
        const brightcoveModal = document.getElementById('videoModal');

        const brightcove = new Vue({
            el: '#brightcove',
            data: {
                videos: '',
            },
            mounted: function() {
                this.$nextTick(function (){
                    this.initBrightcove(this);
                });
            },
            methods: {
                /**
                 * @description This function will run the Vue instance functionality
                 * @param {Vue} brightcoveVue the vue element $el property
                 */
                initBrightcove: function(brightcoveVue) {
                    if (brightcoveVue.offsetParent !== null) { // if the element or any of it's parent are set to display: none;
                        this.getBrightcoveVideos(brightcoveVue.$el.dataset.brightcovePlaylist, brightcoveVue.$el.dataset.brightcoveLimit, function(response){
                            brightcoveVue._data.videos = response.videos;
                        });
                    }
                },
                /**
                 * @description This function queries the Brightcove API for video content
                 * @param {object} playlistId
                 * @param {callback} callback
                 */
                getBrightcoveVideos: function(playlistId, limit, callback) {
                    const request = new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (request.readyState == XMLHttpRequest.DONE) {
                            callback(request.response);
                        }
                    }

                    request.open('GET', BRIGHTCOVE_VARS.api_url + BRIGHTCOVE_VARS.account_id + '/playlists/' + playlistId + '?limit=' + limit, true);
                    request.responseType = 'json';

                    try {
                        request.setRequestHeader('Content-type', 'application/json');
                        request.setRequestHeader('BCOV-Policy', BRIGHTCOVE_VARS.policy_key);
                        request.send();
                    } catch (error) {
                        console.dir('BAD REQUEST (400): Error retrieving data');
                        console.dir(error);
                    }
                },
                containerClass: function(count) {
                    // if (count === 0) {
                    //     return 'post-list--highlight pb-2 post-list';
                    // }
                    return 'post-list--vertical post-list';
                },
                descriptionClass: function(count) {
                    if (count === 0) {
                        return 'pt-1 post-list__description';
                    }
                    return 'post-list__description--vertical post-list__description ';
                },
                formatDateTime: function(datetime, type) {
                    const formats = {
                        date: {
                            'year': 'numeric',
                            'month': 'short',
                            'day': 'numeric',
                        },
                        time: {
                            'hour': 'numeric',
                            'minute': 'numeric',
                        },
                    };

                    let date = datetime.replace(/-/g, ':');
                    date = date.replace('T', ':');
                    date = date.split(':');

                    // [0] = Year, [1] = Month, [2] = Day, [3] = Hour, [4] = Minute
                    const UTCDate = new Date(Date.UTC(date[0], date[1] - 1, date[2], date[3], date[4]));
                    datetime = new Intl.DateTimeFormat('en-GB', formats[type]).format(UTCDate);

                    // Handle ordinal numbers for dates example ("23rd")
                    const suffixes = ['th', 'st', 'nd', 'rd'];
                    datetime = datetime.split(' ');
                    day = datetime[0] % 100;
                    datetime[0] = day + (suffixes[(day - 20) % 10] || suffixes[day] || suffixes[0]);

                    return datetime.join(' ');
                },
            },
        });
    }
 });
