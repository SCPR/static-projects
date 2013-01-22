jQuery(document).ready(function($) {


/*	##############################################################################################################
FIRE UP GOOGLE ANALYTICS EVENT TRACKING
	############################################################################################################## */
   eventTracking = new EventTracking(); 
   $.scrollDepth({
     elements: ['section.event'], // Track DOM elements
     percentage: false // Don't track depth percentage
   });

/*	##############################################################################################################
	CERTAIN LINKS OPEN IN NEW WINDOWS
	############################################################################################################## */

    $(".afterword .credits a,.event a,.promo-map a,.masthead a,.school-meta a").click( function() {
        window.open( $(this).attr("href") );
        return false;
    });





/*	##############################################################################################################
	PREVENT STUPID TAP DELAYS
	############################################################################################################## */

//	document.addEventListener("touchstart", function() {},false);
//	...okay, this is borking IE8, and thus causing all subsequent scripts to fail.





/*	##############################################################################################################
	BRAIN INFOGRAPHIC
	############################################################################################################## */

	var thisTab;
	var curSlide;

    $(".infographic h3").click(function(){

		thisTab = $(this).index(".infographic h3");
		curSlide = $(".infographic figure.selected").index(".infographic figure");

		if(thisTab == curSlide) {
			// calm down, you're already on the desired slide
		} else {
			$(".infographic figure.selected,.infographic h3.selected").removeClass("selected");
			$(".infographic figure").eq(thisTab).addClass("selected");
			$(".infographic h3").eq(thisTab).addClass("selected");
		}

	});







/*	##############################################################################################################
	MARKUP FIDDLING
	############################################################################################################## */
	
	$(".school").last().addClass("school-last");





/*	##############################################################################################################
	REACTIVE GLOBAL NAV
	############################################################################################################## */

	$("#wayfinder").waypoint("sticky", {
		offset: 50
	});





/*	##############################################################################################################
	PHOTO SLIDESHOWS
	############################################################################################################## */

	$("#gallery-01,#gallery-02,#gallery-03,#gallery-04,#gallery-05,#gallery-06,#gallery-07,#gallery-08,#gallery-09,#gallery-10").rsfSlideshow({
		data_container: 'ol.slides',
		slide_data_container: 'li',
		slide_data_selectors: {
			url: {selector: 'a', attr: 'href'},
			caption: {selector: 'a', attr: 'title'}
		},
		autostart: false,
		transition: 0,// Used to be 300. Tweaking in the interest of addressing IE8's ineptitude. Might revisit later.
		effect: 'fade',
		controls: {
			playPause: {auto: false},
			previousSlide: {auto: true},
			nextSlide: {auto: true},
			index: {auto: false}
		}
	});






/*	##############################################################################################################
	VIDEO
	############################################################################################################## */

	$(".video").click(function() {	
		var videoHeight = $(this).height();
		var videoSrc = $(this).data("href");
		$(this).height(videoHeight).load(videoSrc);
	});








/*	##############################################################################################################
	AUDIO
	############################################################################################################## */

	function js_audioPlayer(file,location) {
		jQuery("#jquery_jplayer_" + location).jPlayer( {
			ready: function () {
				jQuery(this).jPlayer("setMedia", {
					m4a: file
			});
		},
		cssSelectorAncestor: "#jp_container_" + location,
		swfPath: "static/js",
		supplied: "m4a",
		preload: "none"
	})
	.bind($.jPlayer.event.play, function() { // pause other instances of player when current one play
		$(this).jPlayer("pauseOthers");
	});
	return;
	}


	js_audioPlayer("media/audio/collage-semillas.m4a",1);
	js_audioPlayer("media/audio/collage-eastrio.m4a",2);
	js_audioPlayer("media/audio/collage-elmarino.m4a",3);
	js_audioPlayer("media/audio/collage-belltower.m4a",4);
	js_audioPlayer("media/audio/collage-ceci.m4a",5);
	js_audioPlayer("media/audio/collage-newcity.m4a",6);
	js_audioPlayer("media/audio/collage-leadership.m4a",7);
	js_audioPlayer("media/audio/collage-franklin.m4a",8);





});