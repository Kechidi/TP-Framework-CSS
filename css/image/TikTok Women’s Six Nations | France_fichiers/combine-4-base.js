const matchVueMethods = {
    filters: {
        capitalize: function(value) {
            if (!value) {
                return '';
            }
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        className: function(value) {
            if (!value) {
                return '';
            }
            return 'league-table__Tab' + value;
        },
        lowercase: function(value) {
            // value = value.replace(' ', '-');
            return value.toLowerCase();
        },
        createImgLink: function(value, mode) {
            if (!mode || mode === 'undefined') {
                mode = 'd';
            }
            const imgBaseUrl = '//cdn.soticservers.net/tools/images/teams/logos/RUGBY969513/' + mode;
            return imgBaseUrl + '/' + value + '.svg';
        },
        minSecs: function(value) {
            let mins = (Math.floor(value/60) === 0) ? '' : Math.floor(value/60) + 'm ';
            let secs = ((value % 60) < 10) ? '0' + Math.round(value % 60) : Math.round(value % 60);

            return mins + secs + 's';
        },
        chartId: function(value) {
            return (value === 0) ? 'possession' : 'territory';
        },
        showAccents: function(value) {
            return value !== null ? value.replace('Ã¨','ê').replace('Ã©','é') : null
        }
    },
    methods: {
        getOverviewLink: function(locale) {
            if (!locale || locale === 'undefined') {
                locale = 'en';
            }

            const overviewLinks = {
                'en': '/overview/',
                'fr': '/fr/detail/',
                'it': '/it/altro/',
            };

            return overviewLinks[locale];
        },

        getFixtureLink: function(fixLinks, postType, language) {
            for (let i = 0; i < fixLinks.length; i++) {
                if (fixLinks[i].language === language) {
                    let addLang = language !== 'en' ? `/${language}` : '';

                    return {
                        'slug': addLang + '/' + postType + '/' + fixLinks[i].slug,
                        'headline': fixLinks[i].headline,
                    };
                }
            }
            return false;
        },
        fixtureLink(fixture, language) {
            const addLang = language !== 'en' ? `/${language}` : '';
            let link = false;
            let postType = 'preview';
            if (fixture.fixtureLinks?.live_matches?.length && (fixture.status === 'Live' || (fixture.status === 'Res' && !fixture.fixtureLinks?.report?.length))) {
                link = fixture.fixtureLinks.live_matches.find(link => link.language === language);
                postType = 'live_matches';
            } else if (fixture.status === 'Res' && fixture.fixtureLinks?.report?.length) {
                link = fixture.fixtureLinks.report.find(link => link.language === language);
                console.log(link);
                postType = 'report';
            } else if (fixture.status === 'Fix' && fixture.fixtureLinks?.preview?.length) {
                link = fixture.fixtureLinks.preview.find(link => link.language === language);
                postType = 'preview';
            }

            return link ? {
                    'slug': addLang + '/' + postType + '/' + link.slug,
                    'headline': link.headline,
                }
                : false;
        },
        getFixStatus: function(currentStatus) {
            const fixStatus = {
                'Fix': 'Fixture',
                'Live': 'Live',
                'Res': 'Result',
                'Postponed': 'P-P',
                'Cancelled': 'C-C',
                'Suspended': 'S-S',
                'Delayed': 'D-D',
            };

            return fixStatus[currentStatus];
        },
        getName: function(person) {
            return person.firstName + ' ' + person.lastName;
        },
        trimTime: function(timeString, separator) {
            const newTime = timeString.split(separator);

            return newTime[0];
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
                dateWithDay: {
                    'year': 'numeric',
                    'month': 'short',
                    'day': 'numeric',
                    'weekday': 'short',
                },
            };

            let date = datetime.replace(/-/g, ':');
            date = date.replace('T', ':');
            date = date.split(':');

            // [0] = Year, [1] = Month, [2] = Day, [3] = Hour, [4] = Minute
            const UTCDate = new Date(Date.UTC(date[0], date[1] - 1, date[2], date[3], date[4]));
            datetime = new Intl.DateTimeFormat('en-GB', formats[type]).format(UTCDate);
            return datetime.replace(',', '');
        },
        statPercentage: function(stat) {

            let total = parseFloat(stat.statTeamA) + parseFloat(stat.statTeamB);
            let teamA = parseFloat(stat.statTeamA);
            let teamB = parseFloat(stat.statTeamB);


            if (total && total != 0) {
                let obj = {
                    teamA: (teamA / total) * 100,
                    teamADisplay: 'inline-block',
                    teamB: (teamB / total) * 100,
                    teamBDisplay: 'inline-block',
                    total: total,
                };

                if (teamA == 0) {
                    obj.teamADisplay = 'none';
                }
                if (teamB == 0) {
                    obj.teamBDisplay = 'none';
                }

                return obj;
            }
            else {
                return {
                    teamA: 50,
                    teamADisplay: 'inline-block',
                    teamB: 50,
                    teamBDisplay: 'inline-block',
                    total: total,
                };
            }
        },
        keyStatPercentage: function(stat) {

            let total = parseFloat(stat.teamA) + parseFloat(stat.teamB);
            let teamA = parseFloat(stat.teamA);
            let teamB = parseFloat(stat.teamB);


            if (total && total !== 0) {
                let obj = {
                    teamA: (teamA / total) * 100,
                    teamADisplay: 'inline-block',
                    teamB: (teamB / total) * 100,
                    teamBDisplay: 'inline-block',
                    total: total
                };

                if (teamA == 0) {
                    obj.teamADisplay = 'none';
                }
                if (teamB == 0) {
                    obj.teamBDisplay = 'none';
                }

                return obj;
            }
            else {
                return {
                    teamA: 50,
                    teamADisplay: 'inline-block',
                    teamB: 50,
                    teamBDisplay: 'inline-block',
                    total: total,
                };
            }
        },
        createChart: function(chartId) {
            let ctx = document.getElementById(chartId);
            if (document.body.contains(ctx)) {
                let data = {
                    type: ctx.getAttribute('data-chart'),
                    data: {
                        labels: ctx.getAttribute('data-chartlabels').split(','),
                        datasets: [{
                            data: ctx.getAttribute('data-chartvalues').split(','),
                            backgroundColor: ctx.getAttribute('data-chartcolours').split(','),
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        legend: {
                            display: false
                        },
                        cutoutPercentage: 70,
                        animation: {
                            duration: 0,
                        },
                    }
                };
                let myChart = new Chart(ctx, data);
            }
        },
        playerMultipleScores: function(event, eventIndex, eventsList) {
            // Check if player occurs again in this event type
            let html = '';
            let i = (eventIndex + 1)
            for (i; i < eventsList.length; i++) {
                if (eventsList[i].player.guid === event.player.guid) {
                    html += ' , (' + eventsList[i].rounded_minutes + '\')';
                }
            }
            return html;
        },
        playerAlreadyScored: function(event, eventIndex, eventsList) {
            // Check if player has already occurred in this event type
            let i = 0;
            for (i; i < eventIndex; i++) {
                if (eventsList[i].player.guid === event.player.guid) {
                    return true;
                }
            }
            return false;
        },
        imgFallback: function(e) {
            e.target.src = e.target.attributes.fallback.value;
        },
        getEvents: function(summary, eventType) {
            return summary.filter(function(event) {
                return event.type === eventType;
            });
        },
        getCardEvents: function(summary, eventType) {
            let comm = this.getEvents(summary, 'commentary');
            if(comm[0]) {
                let events = comm[0].events;
                return events.filter(function(event) {
                    desc = event.description;
                    return desc.includes(eventType);
                });
            }
            return false;
        },
        eventExists: function(eventType, card) {
            if(card === true) {
                return eventType.events.length > 0 ? true : false;
            }
            if(eventType.events.length > 0) {
                return eventType.events[0].events.length > 0 ? true : false;
            }
            return false;
        },
        eventsLoaded: function(summary) {
            if (summary) {

                for (let i = 0; i < this.eventTypes.length; i++) {
                    if (i < 5) {
                        this.eventTypes[i].events = this.getEvents(summary, this.eventTypes[i].key);
                    } else {
                        this.eventTypes[i].events = this.getCardEvents(summary, this.eventTypes[i].key);
                    }
                }
                return true;
            }
            return false;
        },
        getByKey: function(data, key) {
            // Returns a single object based on it's 'key' field
            let rtn = data.filter(function(item) {
                return item.key === key;
            });

            return rtn[0];
        },
        getTeamClass: function(event, teams) {
            if (event.team.guid === teams.teamA.guid) {
              return "teama";
            }
            return "teamb";
        },
        getScoreA: function(event, teams) {
            if (!this.isScore(event)) {
                return ' ';
            }
            if (this.isScore(event) && event.team.guid === teams.teamA.guid && event.score !== this.timelineTeamAScore ) {
              this.timelineTeamAScore = event.score;
            }
            return this.timelineTeamAScore;
        },
        getScoreB: function(event, teams) {
            if (!this.isScore(event)) {
                return ' ';
            }
            if (this.isScore(event) && event.team.guid === teams.teamB.guid && event.score !== this.timelineTeamBScore ) {
              this.timelineTeamBScore = event.score;
            }
            return this.timelineTeamBScore;
        },
        isScore: function(event) {
            return event.score > 0;
        },
        timelineCardEvent: function(event) {
            description = event.description;

            if(description) {
                if(description.indexOf(this.timelineCardEvents[0]) !== -1) {
                    return event.extra_translations.yellow_card;
                }
                if(description.indexOf(this.timelineCardEvents[1]) !== -1) {
                    return event.extra_translations.red_card;
                }
            }
            return false;
        },
        isReplacementEvent: function(event) {
            eventType = event.type;
            if(eventType) {
                if(this.replacementEvent === eventType) {
                    return true;
                }
            }
            return false;
        },
        getReplacementPlayer: function(index, events) {
            replacementIndex = index - 1;
            if (events[replacementIndex]) {
                replacementPlayer = events[replacementIndex].player;
                if (replacementPlayer) {
                    return replacementPlayer.firstName + ' ' + replacementPlayer.lastName;
                }
            }
            return '';
        },
        broadcasterCountry: function(broadcasterName) {
            let broadcasterKey = this.classify(broadcasterName);
            let broadcaster = this.getBroadcaster(broadcasterKey);
            if (broadcaster) {
                return broadcaster.country;
            }
        },
        broadcasterImage: function(broadcasterName) {
            let broadcasterKey = this.classify(broadcasterName);
            let broadcaster = this.getBroadcaster(broadcasterKey);
            if (broadcaster) {
                return broadcaster.logo;
            }
        },
        getBroadcaster: function(broadcasterKey) {
            let rtn = this.broadcasters.filter(function(item) {
                return item.broadcasterNames.includes(broadcasterKey);
            });
            return rtn[0];
        },
        classify: function(value) {
            let rtn = value.replace(' ', '');
            return rtn.toLowerCase();
        },
        yourTime (fixtureDateTime, format) {
            return moment.tz(fixtureDateTime, moment.tz.guess()).format(format);
        },
        toggleStatBlock(block) {
            document.querySelector(`[data-stat-block-name="${block}"]`).classList.toggle('open');
            document.querySelector(`[data-stat-block="${block}"]`).classList.toggle('active');
        },
        getTeamA(data) {
            return data.teams.teamA.name.replace(/ women/i, '');
        },
        getTeamB(data) {
            return data.teams.teamB.name.replace(/ women/i, '');
        },
        stripName(team) {
            return team.replace(/ women/i, '');
        }
    },
    data: function() {
        return {
            eventTypes: [
                {
                    key: 'Try',
                    summaryName: 'Tries'
                },
                {
                    key: 'Conversion-G',
                    summaryName: 'Conversions'
                },
                {
                    key: 'Pen Shot-G',
                    summaryName: 'Penalties'
                },
                {
                    key: 'Drop Goal-G',
                    summaryName: 'Drop Goals'
                },
                {
                    key: 'Penalty Try - 7 Points',
                    summaryName: 'Penalty Tries'
                },
                {
                    key: 'yellow carded',
                    summaryName: 'Yellow Cards'
                },
                {
                    key: 'sent from the field',
                    summaryName: 'Red Cards'
                }
            ],
            timelineEventTypes: ['Try', 'Conversion-G', 'Pen Shot-G', 'Drop Goal-G', 'Penalty Try - 7 Points'],
            timelineCardEvents: ['yellow carded', 'sent from the field'],
            replacementEvent: 'Substitution-In',
            liveTeamsStatKeys: {
                'en_GB': ['TM', 'CA', 'PM', 'M', ],
                'fr_FR': ['TM', 'Transf. E', 'PM', 'M',],
                'it_IT': ['TM', 'CA', 'PM', 'MG', ],
            },
            broadcasters: [
                {
                    name: 'BBC Alba',
                    country: 'GB',
                    broadcasterNames: ['bbcalba', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/BBC_Alba.svg',
                },
                {
                    name: 'BBC Cymru',
                    country: 'GB',
                    broadcasterNames: ['bbcwales', 'bbccymru', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/BBC_Cymru.svg',
                },
                {
                    name: 'BBC Two Wales',
                    country: 'GB',
                    broadcasterNames: ['bbc2wales'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/BBC2_Wales.svg',
                },
                {
                    name: 'BBC iPlayer',
                    country: 'GB',
                    broadcasterNames: ['bbciplayer'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/bbciplayer.svg'
                },
                {
                    name: 'BBC 2 Scotland',
                    country: 'GB',
                    broadcasterNames: ['bbc2scotland'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/bbc2scotland.svg',
                },
                {
                    name: 'BBC Two NI',
                    country: 'GB',
                    broadcasterNames: ['bbc2ni', 'bbctwo ni'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/BBCTwoNI.svg',
                },
                {
                    name: 'BBC Sport',
                    country: 'GB',
                    broadcasterNames: ['bbc', 'bbcone', 'bbctwo', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/bbcsport.svg',
                },
                {
                    name: 'BBC Two',
                    country: 'GB',
                    broadcasterNames: ['bbc2'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/bbc2.svg',
                },
                {
                    name: 'ITV Sport',
                    country: 'GB',
                    broadcasterNames: ['itv', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/itv_sport.svg',
                },
                {
                    name: 'Eurosport Italia',
                    country: 'IT',
                    broadcasterNames: ['eurosportitalia', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/Eurosport.svg',
                },
                {
                    name: 'France2HD',
                    country: 'FR',
                    broadcasterNames: ['fr2', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/France2HD.svg',
                },
                {
                    name: 'France4HD',
                    country: 'FR',
                    broadcasterNames: ['fr4', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/France4HD.svg',
                },
                {
                    name: 'FRTV',
                    country: 'FR',
                    broadcasterNames: ['frtv', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/France2HD.svg',
                },
                {
                    name: 'DMAX',
                    country: 'IT',
                    broadcasterNames: ['dmax', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/dmax.svg',
                },
                {
                    name: 'NBC Sports',
                    country: 'US',
                    broadcasterNames: ['nbc', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/NBCSports.svg',
                },
                {
                    name: 'S4C',
                    country: 'GB',
                    broadcasterNames: ['s4c', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/s4c.svg',
                },
                {
                    name: 'S4C Clic',
                    country: 'GB',
                    broadcasterNames: ['s4cclic'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/S4C_Clic.svg',
                },
                {
                    name: 'Sky Sports',
                    country: 'GB',
                    broadcasterNames: ['sky', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/sky_sports.svg',
                },
                {
                    name: 'Sky Sports Italia',
                    country: 'IT',
                    broadcasterNames: ['skysport italia'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/Sky_Sport_Italia.svg'
                },
                {
                    name: 'RTE Player',
                    country: 'IE',
                    broadcasterNames: ['rteplayer'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/rteplayer.svg',
                },
                {
                    name: 'RTE Sport',
                    country: 'IE',
                    broadcasterNames: ['rte', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/RTE-sport.svg',
                },
                {
                    name: 'RTE One',
                    country: 'IE',
                    broadcasterNames: ['rte1'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/RTE_ONE.svg',
                },
                {
                    name: 'RTE 2',
                    country: 'IE',
                    broadcasterNames: ['rte2'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/rte2.svg',
                },
                {
                    name: 'TV3',
                    country: 'IE',
                    broadcasterNames: ['tv3', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/tv3.svg',
                },
                {
                    name: 'Virgin Media',
                    country: 'IE',
                    broadcasterNames: ['virginmedia', ],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/virgin_media.svg',
                },
                {
                    name: 'Virgin Media Two',
                    country: 'IE',
                    broadcasterNames: ['vm2', 'virginmediatwo', 'virginmedia two'],
                    logo: '//cdn.soticservers.net/tools/images/broadcasters/VirginMediaTwo.svg',
                },
                {
                    name: 'Live Stream',
                    country: 'IT',
                    broadcasterNames: ['stream-it', ],
                    logo: '',
                },
                {
                    name: 'Live Stream',
                    country: 'IE',
                    broadcasterNames: ['stream-ie', ],
                    logo: '',
                },
                {
                    name: 'Live Stream',
                    country: 'FR',
                    broadcasterNames: ['stream-fr', ],
                    logo: '',
                },
                {
                    name: 'Live Stream - England',
                    country: 'GB',
                    broadcasterNames: ['stream-eng', ],
                    logo: '',
                },
                {
                    name: 'Live Stream - Scotland',
                    country: 'GB',
                    broadcasterNames: ['stream-sco', ],
                    logo: '',
                },
                {
                    name: 'Live Stream - Wales',
                    country: 'GB',
                    broadcasterNames: ['stream-wal', ],
                    logo: '',
                },
            ],
        };
    },
    created: function() {
        this.timelineTeamAScore = 0;
        this.timelineTeamBScore = 0;
    },
};

/**
 * @description Get API Data will make a request to the Stats API for JSON data based on the URL given and query parameters
 * @param {String} endpoint - the API endpoint
 * @param {function} callback - the callback function used to process the API response
 */
function getAPIData(endpoint, callback) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
            callback(null, request.response);
        }
    }
    request.open('GET', STATS_API_VARS.base_url + endpoint, true);
    request.responseType = 'json';

    try {
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send();
    } catch (error) {
        callback(true);
    }
}
