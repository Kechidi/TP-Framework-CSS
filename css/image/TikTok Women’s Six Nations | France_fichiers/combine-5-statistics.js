window.addEventListener('DOMContentLoaded', function(){
    const leadingPerformers = document.getElementById('leading-performers');
    const fullBreakdownPlayer = document.getElementById('full-breakdown-player');
    const fullBreakdownTeam = document.getElementById('full-breakdown-team');
    const fixtureResult = document.getElementById('fixtureResult');

    if (leadingPerformers) {
        const leadingPerformersVue = new Vue({
            el: '#leading-performers',
            data: {
                leadingPerformers: {},
            },
            mounted: function() {
                const apiQuery = getAPIData(leadingPerformers.dataset.soticStatsUrl, function(error, response) { // getAPIData is in base.js
                    if (!error) {
                        const property = leadingPerformers.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                        leadingPerformersVue._data[property] = response.data;

                        let perfData = response.data;
                        const dataKeyArr = Object.keys(perfData);

                        for (let i = 0; i < dataKeyArr.length; i++) {
                            perfData[dataKeyArr[i]].push({performersShown: 5});
                        }
                    }
                });
            },
            mixins: [matchVueMethods],
            methods: {
                loadMore: function(e) {
                    const thead = e.currentTarget.parentElement.parentElement.previousElementSibling;
                    const statTitle = thead.querySelector('th').innerHTML.trim();
                    const performersKeys = Object.keys(this.leadingPerformers);

                    for (let i = 0; i < performersKeys.length; i++) {
                        if (performersKeys[i] === statTitle) {
                            const value = this.leadingPerformers[performersKeys[i]];

                            if (value[value.length-1].performersShown < 10) {
                                value[value.length-1].performersShown *= 2;
                                e.target.innerHTML = 'Less';
                            } else {
                                value[value.length-1].performersShown /= 2;
                                e.target.innerHTML = 'More';
                            }
                        }
                    }

                    e.target.classList.toggle('open');
                    e.target.classList.toggle('closed');
                },
            },
        });
    }

    if (fullBreakdownPlayer) {
        const fullBreakdownPlayerVue = new Vue({
            el: '#full-breakdown-player',
            data: {
                fullBreakdownPlayer: {},
            },
            mounted: function() {
                const apiQuery = getAPIData(fullBreakdownPlayer.dataset.soticStatsUrl, function(error, response){ // getAPIData is in base.js
                    if (!error) {
                        const property = fullBreakdownPlayer.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                        fullBreakdownPlayerVue._data[property] = response.data;
                    }
                });
            },
            mixins: [matchVueMethods],
        });
    }

    if (fullBreakdownTeam) {
        const fullBreakdownTeamVue = new Vue({
            el: '#full-breakdown-team',
            data: {
                fullBreakdownTeam: {},
            },
            mounted: function() {
                const apiQuery = getAPIData(fullBreakdownTeam.dataset.soticStatsUrl, function(error, response){ // getAPIData is in base.js
                    if (!error) {
                        const property = fullBreakdownTeam.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                        fullBreakdownTeamVue._data[property] = response.data;
                    }
                });
            },
            mixins: [matchVueMethods],
        });
    }

    if (fixtureResult) {
        const fixtureResultVue = new Vue({
            el: '#fixtureResult',
            data: {
                fixtureResult: {},
                rounds: [1,2,3,4,5],
                positionSelected: 0,
                roundData: []
            },
            mounted: function() {
                let vm = this;
                const apiQuery = getAPIData(fixtureResult.dataset.soticStatsUrl, function(error, response){ // getAPIData is in base.js
                    if (!error) {
                        const property = fixtureResult.dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                        fixtureResultVue._data[property] = response.data;
                        // Set initial round data for round 1
                        for (let fixture of vm.fixtureResult) {
                            if (fixture.round.toString() === '1') {
                                // Handle underlining of round numbers - default is 1
                                vm.handleUnderlining(1, vm);
                                // Determine locale
                                fixture = vm.determineReportFromLocale(fixture);
                                vm.roundData.push(fixture);
                                // Format date
                                vm.roundData[vm.roundData.length - 1].datetime = vm.formatDateTime(vm.roundData[vm.roundData.length - 1].datetime);
                            }
                        }
                    }
                });
            },
            methods: {
                formatDateTime: function(datetime) {
                    let date = new Date(datetime);
                    let month = date.getMonth()+1;
                    let day = date.getDate();
                    
                    if (day < 10) {
                        day = '0' + day;
                    }
                    let dayStr = date.toString().split(' ')[0];
                    if (month < 10) {
                        month = '0' + month;
                    }
                    month = date.toLocaleString('default', { month: 'short' });
                    
                    date = dayStr + ' ' + day + ' ' + month;
                    return date;
                },
                determineReportFromLocale: function(fixture) {
                    if (fixture.fixtureLinks.report) {
                        for (let reportObj of fixture.fixtureLinks.report) {
                            if (reportObj.language === WP_VARS.locale) {
                                fixture.fixtureLinks.report['reportInLocale'] = reportObj;
                                console.log(reportObj);
                                break;
                            }
                        }
                    }
                    return fixture;
                },
                handleUnderlining: function(which, vm) {
                    let rounds;
                    if (vm) {
                        rounds = vm.rounds;
                    } else {
                        rounds = this.rounds;
                    }
                    for (let round of rounds) {
                        if (round.toString() !== which.toString()) {
                            console.log('clearing');
                            // Clearing previous underlining from old selection
                            let roundH = document.getElementById('round' + round);
                            roundH.setAttribute("style", "text-decoration: none;");
                        } else {
                            console.log('setting');
                            // Implementing new underlining from current selection
                            let roundH = document.getElementById('round'+round);
                            roundH.setAttribute("style", "text-decoration: underline; text-decoration-color: #003976;");
                        }
                    }
                },
                handleRoundClick : function(which) {
                    this.positionSelected = which;
                    // Highlight round int clicked
                    this.handleUnderlining(which);
                    // Clear of previous
                    this.roundData = [];
                    // Gather each matching fixture by round int
                    for (let fixture of this.fixtureResult) {
                        if (fixture.round.toString() === which.toString()) {
                            // Determine locale
                            fixture = this.determineReportFromLocale(fixture);
                            this.roundData.push(fixture);
                            // Format date
                            this.roundData[this.roundData.length - 1].datetime = this.formatDateTime(this.roundData[this.roundData.length - 1].datetime);
                        }
                    }
                }
            },
            mixins: [matchVueMethods],
        });
    }
});
