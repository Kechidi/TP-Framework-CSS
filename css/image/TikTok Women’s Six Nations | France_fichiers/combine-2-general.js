function fitVideos() {
    $('[data-video="true"]').fitVids();
}

$(function() {
    if ($('[data-button="filter"]')[0]) {
        $("[data-button='filter']").on('click', function() {
            let currentHTML = $(this).html();
            let swapContent = $(this).data('swap-content');
            let targetDisplay = $(this).data('button-target');

            $(this).data('swap-content', currentHTML).html(swapContent);
            $(this).toggleClass('btn-active');
            $(targetDisplay).toggleClass('filter--open');
        });
    }

    /** MENU FILTER **/

    if ($('[data-button="menu"]')[0]) {
        $("[data-button='menu']").on('click', function() {
            $(this).toggleClass('open');
            $(this).parent().find('[data-menu]').toggleClass('open');
        });

        $("[data-menu] > span").on('click', function() {
            $(this).parent().toggleClass('open');
        });
    }

    /** RUN FITVIDS **/

    if ($('[data-video="true"]')[0]) {
        fitVideos();
    }

    /** RUN ANIMATION **/

    /* //github.com/michalsnik/aos */
    if ($('[data-aos]')[0]) {
        AOS.init({
            duration: 1200,
        });
    }

});

$(window).on('widget-load-all data-tab-swap', function() {
    /** HISTORICAL STATS **/
    if ($('.historic-player-stats')[0]) {
        $('[data-stats-expand]').on('click', function() {

            var close = $(this).parent().attr('data-close');
            var open = $(this).parent().attr('data-open');

            $(this).toggleClass('open').toggleClass('closed');
        });
    }

    /** SORTABLE TABLES **/
    if ($('.sortable')[0]) {
        $('.sortable').tablesorter();
    }

    /** FIX BAR ON AWS STATS **/

    let stickyHeight = $("header").outerHeight() + $('.match__information').outerHeight() + $('.match__return-button').outerHeight() + $('.match-navigation').outerHeight();

    $(window).on("scroll", function(e) {

        if ($(this).scrollTop() >= stickyHeight) {
            $('[data-container="fixed"]').addClass('fixed');
        }
        else {
            $('[data-container="fixed"]').removeClass('fixed');
        }
    });


});

$(window).on('load resize', function() {

    // Custom Article Page Height
    if ($('.article__header')) {
        let headerHeight = $('header').outerHeight();
        $('.article__header').css({'height': 'calc(100vh - ' + headerHeight + 'px)'});
    }

});

$(window).on('data-tab-swap', function() {
    /* close all dropdown menus */
    if ($('[data-button="menu"]')[0]) {
        $('[data-button="menu"]').each(function(ind, obj) {
            $(obj).parent().find('[data-menu]').removeClass('open');
        });
    }
});

/** IMAGE LAZY LOADING **/
var theLazyLoad = new LazyLoad({
    elements_selector: "img",
    threshold: 0,
    callback_set: function(e) {
        e.classList.remove("loading");
        e.classList.remove("unloaded");
    }
});

$(window).on('aggregator-load-complete data-tab-swap match-article-load', function() {
    theLazyLoad.update();
});

document.addEventListener('click', dropdownHandler);

function dropdownHandler(e) {
    if (window.innerWidth < 768 && e.target.classList.contains('dropdown-heading')) {
        const dropdown = e.target.parentNode;
        const dropdownChildren = dropdown.children;

        for (let i = 1; i < dropdownChildren.length; i++) {
            dropdownChildren[i].classList.toggle('d-none');
            dropdown.classList.toggle('open');
        }
    }
}

$(window).one('load widget-load-all', function() {
    window.scrollTo(0, 0);
});

// TOURNAMENT SWITCHER
const tournamentToggle = document.querySelector('.header__tournament--mobile li.active .arrowToggle');
const dropdownOptions = document.querySelectorAll('.header__tournament--mobile .otherOptions');
const arrowIcon = document.querySelector('.header__tournament--mobile li.active .arrowToggle i');

if (tournamentToggle) {

    dropdownOptions.forEach((button) => {
        tournamentToggle.addEventListener('click', () => {
            button.classList.toggle('open');

            if ( arrowIcon.classList.contains('icon-down-arrow') ) {
                arrowIcon.classList.remove('icon-down-arrow');
                arrowIcon.classList.toggle('icon-up-arrow');
            } else if ( arrowIcon.classList.contains('icon-up-arrow') ) {
                arrowIcon.classList.remove('icon-up-arrow');
                arrowIcon.classList.toggle('icon-down-arrow');
            }
        });
    });

}