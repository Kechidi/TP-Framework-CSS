function runCountdown() {
    if ($('[data-countdown-clock]')[0]) {
        $('[data-countdown-clock]').each(function() {

            var datetime = $(this).data('datetime');

            var countLocale = 'en_GB'; //use English as the default language

            //override locale if it exists
            if (typeof $(this).parents('.countdown__main').data('locale') !== undefined) {
                countLocale = $(this).parents('.countdown__main').data('locale')
            }

            $(this).countdown(datetime, function(event) {
                $(this).html(event.strftime(
                    '<div class="countdown__block d-inline-block px-0-4 f-trade-gothic ta-centre countdown__block--days"><span class="countdown-value">%D</span><span class="countdown-label f-system d-block ts-0-75">' + getCountdownLabel('days', countLocale) + '</span></div>' +
                    '<div class="countdown__block d-inline-block px-0-4 f-trade-gothic ta-centre countdown__block--hours"><span class="countdown-value">%H</span><span class="countdown-label f-system d-block ts-0-75">' + getCountdownLabel('hours', countLocale) + '</span></div>' +
                    '<div class="countdown__block d-inline-block f-trade-gothic ta-centre px-0-4 countdown__block--mins"><span class="countdown-value">%M</span><span class="countdown-label f-system d-block ts-0-75">' + getCountdownLabel('mins', countLocale) + '</span></div>' +
                    '<div class="countdown__block d-inline-block f-trade-gothic ta-centre pl-0-4 countdown__block--secs"><span class="countdown-value">%S</span><span class="countdown-label f-system d-block ts-0-75">' + getCountdownLabel('secs', countLocale) + '</span></div>'));
            });
        });
    }
}

/**
* @name: Get Countdown Label
* @description: Returns an appropriate countdown label for a given, valid locale
*/
function getCountdownLabel(label, locale) {
    var labels = {
        'days': {
            'en': 'Days',
            'fr': 'J',
            'it': 'G',
        },
        'hours': {
            'en': 'Hrs',
            'fr': 'H',
            'it': 'O',
        },
        'mins': {
            'en': 'Mins',
            'fr': 'M',
            'it': 'M',
        },
        'secs': {
            'en': 'Secs',
            'fr': 'S',
            'it': 'S',
        },
    };

    return labels[label][locale];
}

$(window).on('load widget-load', function() {
    runCountdown();
});

document.addEventListener('yourtime-updated', runCountdown);
