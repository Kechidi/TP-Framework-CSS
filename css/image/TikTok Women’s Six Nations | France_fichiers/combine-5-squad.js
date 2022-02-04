window.addEventListener('DOMContentLoaded', function(){
    const squad = document.querySelector('[data-component="squad"]');

    if (squad) {
        const leagueVue = new Vue({
            el: '[data-component="squad"]',
            data: {
                squad: {},
            },
            mounted: function() {
                const apiQuery = getAPIData(squad.dataset.soticStatsUrl, function(error, response){ // getAPIData is in base.js
                    if (!error) {
                        const property = squad.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                        leagueVue._data[property] = response.data;
                    }
                });
            },
            mixins: [matchVueMethods],
            methods: {
                fallback: function(e, team) {
                    if(team) {
                        e.target.src = '//cdn.soticservers.net/tools/images/teams/logos/RUGBY969513/d/' + team.guid + '.svg';
                    }
                },
            },
        });
    }
});
