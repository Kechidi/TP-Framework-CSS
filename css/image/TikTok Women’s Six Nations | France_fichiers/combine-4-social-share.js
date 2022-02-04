function socialShare() {
    // TWITTER SHARE
    $('.content__social-icon').on('click', '.twitter', function(e){
        e.preventDefault();
        e.stopPropagation();
        var loc = $(this).attr('href');
        var title = escape($(this).attr('title'));
        window.open('//twitter.com/share?url=' + loc + '&text=' + title + ' via @SixNationsRugby' + '&', 'twitterwindow', 'height=600, width=750, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    });

    // FACEBOOK SHARE
    $('.content__social-icon').on('click', '.facebook', function(e){
        e.preventDefault();
        e.stopPropagation();
        window.open("//www.facebook.com/sharer/sharer.php?u="+escape(window.location.href)+"&t="+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        return false;
    });

    // GOOGLE+ SHARE
    $('.content__social-icon').on('click', '.google', function(e){
        e.preventDefault();
        e.stopPropagation();
        var loc = $(this).attr('href');
        window.open("//plus.google.com/share?url="+escape(loc),'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        return false;
    });
    
    // Linkedin SHARE
    $('.content__social-icon').on('click', '.linkedin', function(e){
        e.preventDefault();
        e.stopPropagation();
        var loc = $(this).attr('href') + window.location.hash;
        var title = escape($(this).attr('title'));
        window.open("//www.linkedin.com/shareArticle?mini=true&url="+ loc + "&title="+ title);
    });
    
    // WHATSAPP SHARE
    $('.content__social-icon').on('click', '.whatsapp', function(e){
        e.preventDefault();
        e.stopPropagation();
        var text = "Check out this latest item from the Six Nations Rugby";
        var loc = $(this).attr('href');
        var msg = encodeURIComponent(text) + " - " + encodeURIComponent(loc);
        var whatsapp_url = "whatsapp://send?text=" + msg;
        window.location.href = whatsapp_url;
        return false;
    });


    // EMAIL SHARE
    $('.content__social-icon').on('click', '.email', function(e){
        e.preventDefault();
        e.stopPropagation();

        const loc = $(this).attr('href');
        document.addEventListener('copy', function(e) {
            e.clipboardData.setData('text/plain', loc);
            e.preventDefault();
        }, true);
        document.execCommand('copy');  
        return false;
    });
}

$(function(){
    if ($('.content__social-icon')[0]){
        socialShare();
    }
});
