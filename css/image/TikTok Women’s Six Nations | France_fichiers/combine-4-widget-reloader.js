/* WIDGET PARAM OVERWRITER by Jonny Bull */

/*
    WHAT'S THIS NOW?

    When showing historic data, we have historically loaded every stat in history and filtered it out. This seems a bit much.

    So, rather than doing that, here's a way of loading the initial information and then, if the user so chooses, more slightly different information.

    At the moment, it just works on one drop down when there's one widget in the page. Sorry about that. Will expand at a later date.

    HOW TO USE:
    * set up a widget to have an overwritable parameter
    * create a drop down on your page
        * add 'data-paramchange' to the '<select>' tag
        * give it the value of the parameter you're going to change (i.e. CompSeason, TeamID, FixGuid)
    * populate all the '<option>' tags. Make sure the '<option value="' is the correct variable to send to the widget
    * congratulate yourself on nailing all of these steps
        * or give Jonny hell on Slack, when it breaks

    TO DO:
    * expand to work on other fields (text, check boxes)
    * expand to work when there's multiple widgets on a page
    * collate a param string from multiple instances of this malarkey (a good word, malarkey)

*/

$(function(){
    function paramUpdater(obj, stringToPass, containerName){
        var widgetParent = containerName + ' #' + $(obj).attr('id');
        var widgetParams = atob($(widgetParent).attr('data-widget-params'));
        var trimString = widgetParams;

        //remove duplicate entries
        if ( widgetParams.charAt(0) == '&') {
            trimString = widgetParams.substring(1);
        }

        var paramSplit = [];

        if (trimString.indexOf('&') !== -1) {
            paramSplit = trimString.split('&'); //split on the '&'
        } else {
            paramSplit.push(trimString);
        }

        var cleanParamSplit = [];

        paramSplit.forEach(function(val) {
            newVal = val.split('=');
            cleanParamSplit.push(newVal);
        });

        var newParamSplit = stringToPass.substring(1).split('='); //split the param on the '=' and remove the leading '&'

        // if there's a param in the passed string that matches an existing one in the array, remove it
        cleanParamSplit.forEach(function(val, ind) {
            if (val[0] == newParamSplit[0]) {
                cleanParamSplit.splice(ind,1);
            }
        });

        // convert all arrays in the array to 'param=value'
        var cleanWidgetParams = [];

        cleanParamSplit.forEach(function(val) {
            cleanWidgetParams.push( val.join('=') );
        })

        if (cleanWidgetParams.length > 0 ) {
            var newString = '&' + cleanWidgetParams.join('&') + stringToPass; //add new parameter string to our clean existing string to make the string to pass
        } else {
            var newString = '&' + stringToPass;
        }

        //get rid of any widget spinners
        $(widgetParent).parent().find('.widget-spinner').remove();
        $(widgetParent).parent().parent().find('.widget-spinner').remove();
        $(widgetParent).parent().append('<div class="widget-spinner" data-widget-loader="'+$(widgetParent).data('widgetId')+'"><img alt="A circular arrow, rotating clockwise to indicate loading is in progress" title="Loading" class="widget-load loader-player" src="'+WP_VARS.template_url+'/assets/img/widget-load.svg"></div>');
        $(widgetParent).attr('data-widget-params', btoa(newString));
        $(widgetParent).empty();
        
        jQuery(document).soticWidgets();
    }

    function selectReload(passVal) {
        
        var seasonString = $(passVal).val();
        var paramString = $(passVal).data('paramchange');
        var combineString = '&' + paramString + '=' + seasonString;

        if ($(passVal).data('paramcontainer') ) {
            var containerName = $(passVal).data('paramcontainer');

            $(containerName).find('.sotic-widget-content').each(function(k, o) {
                paramUpdater(o, combineString, containerName);
            });
        } else if ($(passVal).data('paramsingle') ) {
            //the ID of the widget
        } else {
            //update all widgets
            var widgetParent = '#' + $('.sotic-widget-content').attr('id');
            $(widgetParent).parent().find('.widget-spinner').remove();
            $(widgetParent).parent().parent().find('.widget-spinner').remove();
            $(widgetParent).parent().append('<div class="widget-spinner" data-widget-loader="'+$(widgetParent).data('widgetId')+'"><img class="widget-load loader-player mx-auto" src="'+WP_VARS.template_url+'/assets/img/widget-load.svg"></div>');
            $(widgetParent).attr('data-widget-params', btoa(combineString));
            $(widgetParent).empty();
        }
    }

    if ($('[data-paramchange]').length){
        $('[data-paramchange]').each( function(i, obj) {
            if ( $(this).attr('type') === 'text') {
                if ($(this).val() ) {
                    selectReload( $(this) );
                }
            } else {
                if ($(this)[0].selectedIndex > 0) {
                    selectReload( $(this) );
                }    
            }
        });
    }
    
    
    // check if the text field is longer than three characters
    function textCheck(textObj) {
        if ($(textObj).val().length > 3 ) {
            selectReload( $(textObj) );
        }
    }
    
    $(window).on('load widget-load', function(){
        // if we're using a text field, use keyup instead of change
        if ( $('[data-paramchange]').attr('type') === 'text') {                      
            let timer = null;
            
            $('[data-paramchange]').on('keyup',function() {
                clearTimeout(timer);    
                
                // very messy code but gets setTimeout working correctly
                // added to avoid hammering the widget cache - https://stackoverflow.com/questions/36421850/stop-jquery-keyup-from-triggering-with-delay
                timer = setTimeout( function() { textCheck(this) }.bind(this), 500);
            });
        } else {
            $('[data-paramchange]').off('change').on('change',function() {
                selectReload( $(this) );
            });
        
        }        
    });

    $(window).on('widget-load', function(i,obj) {
        $('[data-widget-loader="'+obj.widgetID+'"]').remove();
    });
});