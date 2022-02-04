$(function(){
    var navURL = window.location.hash.substring(1);
    if ($('[data-tab-nav]')) { //if there's a [data-tab-nav]
        $('[data-tab-nav]').each(function(t){ //run on each [data-tab-nav]
            tab_init($(this).data('tab-nav'));
        });
    }

    //once all widgets have loaded
    $(window).on('widget-load data-tab-swap resize', function () {
    if ($('[data-tab-display]')) { //if there's a [data-tab-nav] that doesn't have [data-tab-init]
        $('[data-tab-display]').each(function(t){ //run on each [data-tab-nav] that doesn't have [data-tab-init]
            tab_init($(this).data('tab-nav'));
        });
    }
    else if ($('[data-tab-nav]:not([data-tab-init])')) { //if there's a [data-tab-nav] that doesn't have [data-tab-init]
        $('[data-tab-nav]:not([data-tab-init])').each(function(t){ //run on each [data-tab-nav] that doesn't have [data-tab-init]
            tab_init($(this).data('tab-nav'));
        });
    }
});

//on clicking a data tab
$('body').on('click', '[data-tab]', function(t) {
    //console.log('click');
    var linkingID = $(this).closest('[data-tab-nav]').data('tab-nav'); //get the ID that links navigation and content
    var toggleEnabled = false; //set variable to determine if toggling is set or not
    var switcher = 'all'; //variable that determines what suffix the 'tab-nav-active' and 'tab-content-active' classes should have

    if ($('[data-tab-nav="'+linkingID+'"]').data('tab-primary') == true) {
        window.location.hash = $(this).data("tab");
        if (typeof(ga) !== 'undefined') {
            ga('send', 'pageview', {'page': location.pathname+location.search+location.hash});
        }
    }

    //detect whether we should toggle or not
    if ($(this).parent('[data-tab-nav="'+linkingID+'"]').attr('data-tab-toggle')) {
        var toggle = $(this).parent('[data-tab-nav="'+linkingID+'"]').data('tab-toggle');

        if (toggle == 'desktop' || toggle == 'mobile' || toggle == 'all') {
            var screenCheck = window_check();
            if (toggle == "true" || screenCheck == toggle) {
                toggleEnabled = true;
            }
        }
    }

    if (toggleEnabled == true) {
        //console.log('toggle time');
        //if this tab is already active
        if ($(this).hasClass('tab-nav-active')) {
            //console.log('toggle off');
            //turn it off
            $(this).removeClass('tab-nav-active');
            $('[data-tab-content="'+linkingID+'"]').children('[data-content="'+$(this).data('tab')+'"]').removeClass('tab-content-active');
        } else { //else
            //turn it on
            //console.log('toggle on');
            change_tab($(this), linkingID, switcher);
        }
    } else {
        //if we've haven't set 'toggle', we don't need to toggle
        if (typeof toggle === 'undefined') {
            change_tab($(this), linkingID, switcher);
        } else {
            //console.log(toggle);
            if (toggle === 'mobile') {
                change_tab($(this), linkingID, 'desktop');
            } else {
                change_tab($(this), linkingID, 'mobile');
            }
        }
    }
    
    $(window).trigger('data-tab-swap', ['ID', linkingID]);

    t.preventDefault();

    // Go to particular element on tab (for fixtures/table on homepage) 

    if($('[data-tab-nav="'+linkingID+'"]').data('tab-nav') === 'homepage') {
        go_to_element($(this));
    }
});


function window_check() {
    let viewSize;

    // using window.innerWidth because Microsoft Edge has a problem with $(window).width()

    if (window.innerWidth > 1039) {
        viewSize = "desktop";
    } else if (window.innerWidth > 999) {
        viewSize = "landscape-tablet";
    } else if (window.innerWidth > 767) {
        viewSize = "tablet";
    } else {
        viewSize = "mobile";
    }

    return viewSize;
}

function tab_override(t, active) {
    if (active == false) {
        // for every tab
        $('[data-tab-content="'+t+'"] > .data-tab').addClass('d-block');
    } else {
        $('[data-tab-content="'+t+'"] > .data-tab').removeClass('d-block');
    }
}

function has_active(tab_parent) {
    //console.log('active tab found');
    var activeNav = $('[data-tab-nav="'+tab_parent+'"]').find('[class*="tab-nav-active"]');
    //console.log(activeNav);

    //make sure there's an active tab related to it
    var activeTab = $(activeNav).data('tab');
    //console.log('active tab:' + activeTab);

    if ($('[data-tab-nav="'+tab_parent+'"]').data('tab-primary') == true) {
        if (navURL > '') {
            //check if that hash is the name of one of our tabs
            var navCheck = $('[data-tab-nav="'+tab_parent+'"]').find('[data-tab="'+navURL+'"]');

            // if it is
            if (navCheck.length > 0) {
                // remove the existing active class
                $('[data-tab-nav="'+tab_parent+'"] [class*="tab-nav-active"]').removeClass('tab-nav-active');
                //overwrite the variable
                activeTab = navURL;
                // add the active class to our new active tab
                $('[data-tab-nav="'+tab_parent+'"] [data-tab="'+activeTab+'"]').addClass('tab-nav-active');
            }
        }
        window.location.hash = activeTab;
    }

    $('[data-tab-content="'+tab_parent+'"] [data-content="'+activeTab+'"]').addClass('tab-content-active');
}

function find_active(tab_parent, viewport) {
    var activeNav = 'tab-nav-active';
    var activeContent = 'tab-content-active';

    var suffix = '';

    if (viewport !== 'all') {
        suffix = '-'+viewport;
    }

    //console.log($('[data-tab-nav="'+t+'"]').find('[class*="tab-nav-active"]'));
    var firstNav = $('[data-tab-nav="'+tab_parent+'"]').find('[data-tab]:visible'); //find the first one
    var firstTabName = $(firstNav[0]).attr('data-tab');
    //console.log(firstNav);
    //console.log('setting '+firstTabName+' as active tab');
    //console.dir($(firstTabName));

    //if there was a hash in the URL on page laod
    if (navURL > '') {
        //check if that hash is the name of one of our tabs
        var navCheck = $('[data-tab-nav="'+tab_parent+'"]').find('[data-tab="'+navURL+'"]');

        //if it is
        if (navCheck.length > 0) {
            //overwrite the variables
            firstNav = navCheck;
            firstTabName = navURL;
        }
    }

    $(firstNav[0]).addClass(activeNav+suffix); //set active nav

    $('[data-tab-content="'+tab_parent+'"]')
        .children('[data-content="'+firstTabName+'"]')
        .addClass(activeContent+suffix)
        .siblings('[data-tab]')
        .removeClass(activeContent+suffix); //set active tab

    if ($('[data-tab-nav="'+tab_parent+'"]').data('tab-primary') == true) {
        window.location.hash = $(firstNav[0]).data("tab");
    }
}

function swap_tab_class(tab, suffix) {
    $(tab)
        .addClass('tab-nav-active'+suffix)
        .siblings('[data-tab]')
        .removeClass('tab-nav-active'+suffix); //add the active class to this nav element, remove it from its siblings
}

function change_tab(tab, linker, viewport){
    var suffix = '';

    if (viewport !== 'all') {
        suffix = '-'+viewport;
    }

    if ( $('[data-tab-nav="'+linker+'"]').data('tabSubMenu') ) {
        let subMenuClass = $('[data-tab-nav="'+linker+'"]').data('tabSubMenu');

        if (tab.parent(subMenuClass).length > 0) {
            /* tab is part of a dropdown */

            $('[data-tab-nav="'+linker+'"]')
                .find('[data-tab]')
                .removeClass('tab-nav-active'+suffix); //add the active class to this nav element, remove it from its siblings;

            $(tab).addClass('tab-nav-active'+suffix);

            $(tab).parent(subMenuClass).parent().children(':first').addClass('tab-menu-highlight');

        } else {
            /* tab is not part of the dropdown */
            swap_tab_class(tab, suffix);
            //$(tab).parent(subMenuClass).parent().children(':first').removeClass('tab-menu-highlight');
            $(tab).siblings().find(subMenuClass).parent().children(':first').removeClass('tab-menu-highlight');
            $(tab).siblings().find(subMenuClass).children('[data-tab]').removeClass('tab-nav-active'+suffix);
        }
    } else {
        /** normal behaviour **/
        swap_tab_class(tab, suffix);
    }

    //console.log('Looking for a matching '+$(this).data('tab')+' in the '+linkingID+' tab set');
    //console.log($('[data-tab-content="'+linkingID+'"]'));
    $('[data-tab-content="'+linker+'"]')
        .children('[data-content="'+$(tab).data('tab')+'"]')
        .addClass('tab-content-active'+suffix)
        .siblings('[data-content]')
        .removeClass('tab-content-active'+suffix); //add the active class to the corresponding tab element, remove it from its siblings
}

function standard_init(t) {
    if ($('[data-tab-nav="'+t+'"]').find('[class*="tab-nav-active"]').length > 0) {
        has_active(t);
    }
    else {
        if ($('[data-tab-nav="'+t+'"]').attr('data-tab-toggle')) {
            var toggleSet = $('[data-tab-nav="'+t+'"').attr('data-tab-toggle');
            //if the tabs are viewport specific, we have work to do
            if (toggleSet !== 'all') {
                if (toggleSet == 'mobile') {
                    //mobile only
                    find_active(t, 'desktop'); //set desktop only tab active class
                } else {
                    //desktop only
                    find_active(t, 'mobile'); //set mobile only tab active class
                }
            }
        } else {
            //console.log('no active tab found for '+t);
            find_active(t, 'all');
        }
    }

    if ($('[data-tab-nav="'+t+'"]').find('[class*="tab-nav-active"]:visible').length > 0) {
        $('[data-tab-nav="'+t+'"]').attr('data-tab-init', 'true'); //set the tab set to 'initialised'
    }
}

//purpose of this function
//	- if there is no active tab set, make the first tab and content are both set to active
//	- if there is an active tab set, make sure the content and tab are both set to active
function tab_init(t){
    if ($('[data-tab-nav="'+t+'"]').attr('data-tab-display')) {
        var displaySet = $('[data-tab-nav="'+t+'"]').attr('data-tab-display');
        displayArr = displaySet.split(',');

        var theWindow = window_check();

        if ( ( displaySet.indexOf(theWindow) >= 0 ) )  {
            tab_override(t, true);
            standard_init(t);
        } else {
            tab_override(t, false);
        }
    } else {
        standard_init(t);
    }
}

/** 
* Go to element on a tab using [data-go-to]
*
* If two tab buttons go to the same tab-content but go to different elements,
* [data-go-to] must be set for both elements so that the below will work
* when that tab-content is already active
*/

function go_to_element(t) {
    var gotoId = t.data('go-to');
    if(gotoId !== undefined)  {
        window.location.hash = '#' + gotoId;
    }
}
});
