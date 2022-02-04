$(function(){
    if ($('.archive__year')[0]){
    	var archiveTab = $('.archive__year');
        
    	if(archiveTab.length){
    		archiveTab.off('click').on('click', function(){
    			var archiveRow = $(this).parent(),
    			    archiveContent = $(this).parent().find('.archive__dropdown');

    			    archiveContent.stop().slideToggle('2500', function() {
    					archiveRow.toggleClass('open', archiveContent.is(':visible'));
    				});
    		});
    		
    	}
    }
});