window.addEventListener('DOMContentLoaded', function() {
    const fixtureList = document.getElementById('fixture-list');
    const fixtureCtrls = document.getElementById('fixture-controls');

    if (fixtureList) {
      const statsEvent = document.createEvent('Event');
      statsEvent.initEvent('stats-api-data-ready', true, true);

      const fixtureListVue = new Vue({
        el: '#fixture-list',
        data: {
          language: WP_VARS.locale,
          fixtureList: [],
        },
        computed: {
          rounds () {
              if (this.fixtureList.length > 0) {
                  return this.fixtureList.map(fixture => fixture.round)
                      .reduce((prev, curr) => prev.concat(curr), [])
                      .filter((item, i, arr) => arr.indexOf(item) === i)
              }
              return [];
          }
        },
        mounted: function() {
          const apiQuery = getAPIData(fixtureList.dataset.soticStatsUrl, function(error, response) { // getAPIData is in base.js
            if (!error) {
              const property = fixtureList.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
              fixtureListVue._data[property] = response.data;
            }
          });
          this.$nextTick(function() {
            document.dispatchEvent(statsEvent);
            setInterval(function() {
              const apiQuery = getAPIData(fixtureListVue.$el.dataset.soticStatsUrl, function(error, response) {
                if (!error) {
                  const property = fixtureListVue.$el.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                  fixtureListVue._data[property] = response.data;
                  document.dispatchEvent(statsEvent);
                }
              });
            }, 5000);
          });
        },
        mixins: [matchVueMethods],
        methods: {
          getRoundStatus: function() {
            return 'Res';
          },
        },
      });

    // Fixture Controls (Season SplitBy)
    if (fixtureCtrls) {
      const fixtureCtrlVue = new Vue({
          el: '#fixture-controls',
          data: {
            Seasons: [],
            currentSeason: fixtureCtrls.dataset.soticStatsCurrentSeason,
            activeTeam: '',
            activeStatus: '',
          },
          mounted: function() {
            this.$nextTick(function() {
              if (fixtureCtrls.dataset.soticStatsUrl.length > 0) {
                const apiQuery = getAPIData(fixtureCtrls.dataset.soticStatsUrl, function(error, response) { // getAPIData is in base.js
                  if (!error) {
                    const property = fixtureCtrls.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                    fixtureCtrlVue._data[property] = response[property].reverse();
                  }
                });
              }
            });
          },
          methods: {
            isCurrentSeason(season) {
              if (season === this._data.currentSeason) {
                return 'selected';
              }
              return '';
            },
            getFixtureSeason(event) {
              const apiRequestUrl = 'custom/fixtureResult/season/' + event.target.value + '?lang=' + WP_VARS.locale;
              const apiQuery = getAPIData(apiRequestUrl, function(error, response) {
                if (!error) {
                  const property = fixtureListVue.$el.dataset.soticStatsProperty;
                  fixtureListVue._data[property] = response.data;
                  fixtureListVue.$el.dataset.soticStatsUrl = apiRequestUrl; // Update the data property for refresh
                }
              });

              // On Season change, reset other filters and show all
              this.clearFilters();
            },
            setStatus(event, status) {
              if (event.target.classList.contains('active')) {
                  // Display all
                  event.target.classList.remove('active');
                  fixtureCtrlVue._data.activeStatus = '';
              } else {
                  const buttons = document.querySelectorAll('[data-filter-fixture-type]');
                  for (const button of buttons) {
                      button.classList.remove('active');
                  }
                  fixtureCtrlVue._data.activeStatus = status;
                  event.target.classList.add('active');
              }
              this.setFilters();
            },
            setTeam(event) {
                const teamGuid = event.target.value;
                fixtureCtrlVue._data.activeTeam = teamGuid;
                this.setFilters();
            },
            setFilters() {
              /* Team and Status can be used together */
              const team = fixtureCtrlVue._data.activeTeam;
              const status = fixtureCtrlVue._data.activeStatus;
              const fixtures = document.querySelectorAll('[data-fixture]');
              this.displayFixtures(fixtures, 'block');

              if (status !== '' || team !== '') {
                  // Build a selector to remove all of the invalid fixtures
                  let selector = '[data-fixture]';
                  if (status !== '') {
                      selector = selector + '[data-fixture]:not([data-fixture="' + status + '"])';
                  }

                  if (team !== '' && team !== undefined) {
                      if (status !== '') {
                          selector = selector + ',';
                      }
                      selector = selector + '[data-fixture]:not([data-teama="' + this.stripTeam(team) + '"]):not([data-teamb="' + this.stripTeam(team) + '"])';
                  }

                  const invalidFixtures = document.querySelectorAll(selector);
                  this.displayFixtures(invalidFixtures, 'none');
              }

            },
            displayFixtures(fixtures, display) {
              for (let j = 0; j < fixtures.length; j++) {
                fixtures[j].style.display = display;
              }
            },
            clearFilters() {
              // Reset all filters except season
              document.querySelector('[data-filter-fixtures="team"]').selectedIndex = 0;
              const buttons = document.querySelectorAll('[data-filter-fixture-type]');
              const fixtures = document.querySelectorAll('[data-fixture]');

              for (const button of buttons) {
                  button.classList.remove('active');
              }
              fixtureCtrlVue._data.activeStatus = '';
              fixtureCtrlVue._data.activeTeam = '';
              this.displayFixtures(fixtures, 'block');
            },
            stripTeam(team) {
                return team.replace(/ U20s/i, '').replace(/ U20/i, '');
            },
          }
        });
      }
    }
  });
