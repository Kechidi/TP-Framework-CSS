window.addEventListener('DOMContentLoaded', function(){
  const matchBreakdown = document.getElementById('match-breakdown');
  if (matchBreakdown) {
      const matchBreakdownVue = new Vue({
          el: '#match-breakdown',
          data: {
              matchBreakdown: {},
          },
          mounted: function() {
              const apiQuery = getAPIData(matchBreakdown.dataset.soticStatsUrl, function(error, response){ // getAPIData is in base.js
                  if (!error) {
                      const property = matchBreakdown.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                      matchBreakdownVue._data[property] = response.data;
                  }
              });
          },
          mixins: [matchVueMethods],
      });
  }
});
