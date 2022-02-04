window.addEventListener('DOMContentLoaded', function(){
    const leagueTable = document.getElementById('league-table');
    const leagueTableCtrl = document.getElementById('league-table-controls');

    if (leagueTable) {
        const leagueVue = new Vue({
            el: '#league-table',
            data: {
                leagueTable: {}
            },
            created: function() {
                const apiQuery = getAPIData(leagueTable.dataset.soticStatsUrl, function(error, response){ // getAPIData is in base.js
                    if (!error) {
                        const property = leagueTable.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                        leagueVue._data[property] = response.data;
                    }
                });
            },
            mounted: function() {
                this.$nextTick(function() {
                    setInterval(function() {
                        const apiQuery = getAPIData(leagueVue.$el.dataset.soticStatsUrl, function(error, response) {
                            if (!error) {
                                const property = leagueVue.$el.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                                leagueVue._data[property] = response.data;
                            }
                        });
                    }, 5000);
                });
            },
            mixins: [matchVueMethods],
        });

        if (leagueTableCtrl) {
            const leagueTableCtrlVue = new Vue({
                el: '#league-table-controls',
                data: {
                    Seasons: [],
                    currentSeason: leagueTableCtrl.dataset.soticStatsCurrentSeason,
                },
                mounted: function(){
                    this.$nextTick(function() {
                        const apiQuery = getAPIData(leagueTableCtrl.dataset.soticStatsUrl, function(error, response) { // getAPIData is in base.js
                            if (!error) {
                                const property = leagueTableCtrl.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                                leagueTableCtrlVue._data[property] = response[property].reverse();
                            }
                        });
                    });
                },
                methods: {
                    isCurrentSeason: function(season) {
                        if (season === this._data.currentSeason) {
                            return 'selected';
                        }
                        return '';
                    },
                    getLeagueSeason: function(event) {
                        const apiRequestUrl = 'custom/tableEndpoint/season/' + event.target.value + '?lang=' + WP_VARS.locale;
                        const apiQuery = getAPIData(apiRequestUrl, function(error, response) {
                            if (!error) {
                                const property = leagueVue.$el.dataset.soticStatsProperty;
                                leagueVue._data[property] = response[property];
                                leagueVue.$el.dataset.soticStatsUrl = apiRequestUrl; // Update the data property for refresh
                            }
                        });
                    }
                }
            });
        }
    }
});
