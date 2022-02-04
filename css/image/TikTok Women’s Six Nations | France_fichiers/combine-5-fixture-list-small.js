window.addEventListener('DOMContentLoaded', function() {
    const fixtureList = document.getElementById('fixture-list-small');

    if (fixtureList) {
        const statsEvent = document.createEvent('Event');
        statsEvent.initEvent('stats-api-data-ready', true, true);

        const fixtureListVue = new Vue({
            el: '#fixture-list-small',
            data: {
                language: WP_VARS.locale,
                fixtureList: {},
            },
            mounted: function() {
                const apiQuery = getAPIData(fixtureList.dataset.soticStatsUrl, function(error, response) { // getAPIData is in base.js
                    if (!error) {
                        const property = fixtureList.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                        fixtureListVue._data[property] = response.data;
                    }
                });
                this.$nextTick(function() {
                    setInterval(function() {
                        const apiQuery = getAPIData(fixtureList.dataset.soticStatsUrl, function(error, response) {
                            if (!error) {
                                const property = fixtureList.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                                fixtureListVue._data[property] = response.data;
                                document.dispatchEvent(statsEvent);
                            }
                        });
                    }, 5000);
                });
            },
            mixins: [matchVueMethods],
            methods: {
                trimTime: function(timeString, separator) {
                    const newTime = timeString.split(separator);
                    return newTime[0];
                },
            },
        });
    }
});