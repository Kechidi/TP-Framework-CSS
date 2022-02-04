$(function(){
	/** PARTNERS SLIDER **/
	$('.partnerSlide-main').slick({
		slidesToShow: 1,
		arrows: false,
		fade: true,
		autoplay: true,
		autoplaySpeed: 3000,
		infinite: true,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 1232,
				settings: "unslick"
			},
		],
	});

	/* FOOTER PARTNERS SLIDER */
	$footerPartnersSlider = $('.partnersSlider');
	$sliderSettings = {
		slidesToShow: 2.5,
		slidesToScroll: 2.5,
		arrows: false,
		autoplay: true,
		infinite: true,
		variableWidth: true,
	}
	mobileSlickSlider( $footerPartnersSlider, $sliderSettings);
  
	function mobileSlickSlider(slider, settings){
	  $(window).on('load resize', function() {
		if ($(window).width() > 768) {
		  if (slider.hasClass('slick-initialized')) {
			slider.slick('unslick');
		  }
		  return
		}
		if (!slider.hasClass('slick-initialized')) {
		  return slider.slick(settings);
		}
	  });
	};
});
