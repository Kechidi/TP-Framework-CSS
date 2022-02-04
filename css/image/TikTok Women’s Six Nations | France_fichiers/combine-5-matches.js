
/****************************************************
 * CHART CREATION AND SETUP
 ***************************************************/

/*******************
 * CHART - DRAW CENTRE TEXT, THEN REVERT FONT STYLES
 ******************/

 function drawText(text, chart, xVal, yVal, colour, align) {
    chart.ctx.font = '15px trade-gothic-next';
    chart.ctx.textBaseline = 'middle';
    chart.ctx.fillStyle = colour;
    chart.ctx.textAlign = align;

    chart.ctx.fillText(text, xVal, yVal);

    /* Draw dividing line */
    chart.ctx.beginPath();
    chart.ctx.moveTo(40, 112.5);
    chart.ctx.lineTo(187.5, 112.5);
    chart.ctx.strokeStyle = '#ddd';
    chart.ctx.stroke();

    chart.ctx.restore();
};

/*******************
 * CHART - CREATE CUSTOM CHART WITH TEXT INSIDE
 ******************/


class CustomDoughnut extends Chart.controllers.doughnut {
    draw(ease) {
        Chart.controllers.doughnut.prototype.draw.apply(this, arguments);

        const dataset = this.chart.data.datasets[0].data;
        const labels = this.chart.data.labels;
        const type = this.chart.canvas.dataset.chartType;
        for (let i = 0; i < dataset.length; i++) {
            const label = labels[i].toUpperCase();
            let value = parseFloat(dataset[i]);

            if (type === 'time') {
                const mins = (Math.floor(value/60) === 0) ? '' : Math.floor(value/60) + 'm ';
                const secs = ((value % 60) < 10) ? '0' + Math.round(value % 60) : Math.round(value % 60);
                value = `${mins}${secs}s`
            } else if (type === 'percentage') {
                value = `${Math.round((value + Number.EPSILON) * 10) / 10}%`; // Limit to 1 decimal point
            }

            const xValLabel = 40;
            const xValValue = 187.5;
            const yVal = i === 0 ? 95 : 132.5;
            const colour = i === 0 ? '#003976' : '#7a7a7a';

            drawText(label, this.chart, xValLabel, yVal, colour, 'left');
            drawText(value, this.chart, xValValue, yVal, colour, 'end');
        }
    }
};

/*******************
 * CHART - REGISTER CHART
 ******************/

CustomDoughnut.id = 'DoughnutTextInside';
CustomDoughnut.defaults =  Chart.controllers.doughnut.defaults;
Chart.defaults.plugins.legend.display = false;
Chart.register(CustomDoughnut);


document.addEventListener('DOMContentLoaded', function(){
    if (document.body.contains(document.querySelector('[data-live-match]'))) {

        const tabClickEvent = document.createEvent('Event');
        tabClickEvent.initEvent('stats-api-data-tab', true, true);

        // Initilisation of fixture information which isn't in a tab
        const fixInfo = document.getElementById('fix-info');
        initMatchComponents(fixInfo.id);

        // Load active tab components
        if (window.location.hash) {
            const initialTab = window.location.hash.replace('#', '');
            initMatchComponents(initialTab);
        } else {
            let initialTab = document.querySelector('[data-tab-nav="match-page"] [data-tab].tab-nav-active');
            if (!initialTab) {
                initialTab = document.querySelectorAll('[data-tab-nav="match-page"] [data-tab]')[0];
            }
            initMatchComponents(initialTab.dataset.tab);
        }

        // Bind click event to all other components in non-active tabs
        const tabs = document.querySelectorAll('[data-tab-nav="match-page"] [data-tab]');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function(e){
                if (!tabs[i].classList.contains('tab-nav-active')) {
                    document.dispatchEvent(tabClickEvent);
                    initMatchComponents(e.target.dataset.tab);
                }
            });
        }
    }
});

/**
 * @description This function will select all of the components within a given parent and activate their functionality
 * @param {DOMElement} componentParent - the content element which is the parent of the comoponents
 */
function initMatchComponents(componentParent) {
    if (document.querySelector(`[data-content="${componentParent}"]`)) {
        const components = document.querySelectorAll(`[data-content="${componentParent}"] [data-sotic-stats-component]`);

        const statsEvent = document.createEvent('Event');
        statsEvent.initEvent('stats-api-data-ready', true, true);

        const matchVue = new Vue({
            el: `[data-content="${componentParent}"]`,
            data: {
                language: WP_VARS.locale,
                fixInfo: {},
                lastTime: {},
                lastThree: {},
                headToHead: {},
                seasonSoFar: {},
                preMatchLineups: {},
                summary: {},
                teamStats: {},
                playerStats: {},
                keyStats: {},
                liveTeams: {},
                timeline: {},
                miniCommentary: {},
                charts: [],
                chartsLoaded: false,
            },
            mounted: function() {
                this.$nextTick(function() {
                    setInterval(function() {
                        for (let i = 0; i < components.length; i++) {
                            if (components[i].dataset.soticStatsRefresh === '1') {
                                const property = components[i].dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
                                const apiQuery = getAPIData(components[i].dataset.soticStatsUrl, function(error, response) {
                                    if (!error) {
                                        matchVue._data[property] = response.data;
                                        document.dispatchEvent(statsEvent);
                                    }
                                });
                            }
                        }
                    }, 5000);
                });
            },
            watch: {
                teamStats: function() {
                    if (this.charts.length > 1) { // If both charts are loaded, just update them
                        for (const chart of this.charts) {
                            // Get the stat key from the chart container
                            const container = chart.canvas.parentNode;
                            const name =  container.getAttribute('data-key');
                            // Get the stat data based on the key
                            const stat = this.teamStats['possession_territory'].find(chartStat => chartStat.statName === name);
                            const chartValues = [stat.statTeamA, stat.statTeamB];
                            // Set chart data
                            chart.data.datasets[0].data = chartValues;
                            // Update chart
                            chart.update();
                        }
                    } else {
                        const chartAreas = document.querySelectorAll(`[data-chart]`);
                        for (const chartArea of chartAreas) {
                            this.createChart(chartArea.id);
                        }
                        this.chartsLoaded = true;
                    }
                },
            },
            updated: function() {
                this.timelineTeamAScore = 0;
                this.timelineTeamBScore = 0;
            },
            created: function() {
                this.timelineTeamAScore = 0;
                this.timelineTeamBScore = 0;
            },
            mixins: [matchVueMethods], // defined in base.js
            methods: {
                isSeniorMatch: function (teamA) {
                    const seniorTeams = [125, 126, 127, 128, 129, 130];
                    if (seniorTeams.includes(parseInt(teamA))) {
                        return true;
                    }
                    return false;
                },
                createChart(chartId) {
                    let ctx = document.getElementById(chartId);
                    if (document.body.contains(ctx)) {
                        let data = {
                            type: 'DoughnutTextInside',
                            data: {
                                labels: ctx.getAttribute('data-chartlabels').split(','),
                                datasets: [{
                                    data: ctx.getAttribute('data-chartvalues').split(','),
                                    backgroundColor: ['#003976', '#7a7a7a'],
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: true,
                                cutout: '92.5%',
                                animation: {
                                    duration: 2000,
                                },
                                elements: {
                                    arc: {
                                        borderWidth: 0,
                                    },
                                },
                                plugins: {
                                    tooltip: {
                                        enabled: false,
                                    }
                                }
                            },
                            containerId: ctx.id,
                        };
                        let myChart = new Chart(ctx, data);
                        this.charts.push(myChart);
                        ctx.height = 225;
                        ctx.width = 225;
                    }
                },
                getChartValues(stat) {
                    const statValues = this.getStat(this.teamStats, stat)
                    const statOutput = [
                        statValues.teamA,
                        statValues.teamB,
                    ];

                    return stat.display_as_percentage ? statOutput.map(value => this.getPercentage(value)) : statOutput;
                },
            },
        });

        // Initial request
        for (let i = 0; i < components.length; i++) {
            const property = components[i].dataset.soticStatsProperty; // Property is the name of the data:property in the Vue instance
            const apiQuery = getAPIData(components[i].dataset.soticStatsUrl, function(error, response){
                if (!error) {
                    matchVue._data[property] = response.data;
                    document.dispatchEvent(statsEvent);
                }
            });
        }
    }
}
