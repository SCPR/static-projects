// $ = jQuery

$(document).ready(function() {


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

	$("#gallery-01,#gallery-02,#gallery-03").rsfSlideshow({
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

  $(".video").one('click', function() {
		var videoHeight = $(this).height();
		var videoSrc = $(this).data("href");
		$(this).height(videoHeight).load(videoSrc);
  });


/*	##############################################################################################################
	AUDIO
	############################################################################################################## */

    function js_audioPlayer(file, location){
        $("#jquery_jplayer_" + location).jPlayer({
            ready: function (){
                $(this).jPlayer("setMedia", {
                    mp3: file
                });
            },
            cssSelectorAncestor: "#jp_container_" + location,
            solution:"flash, html",
            supplied: "mp3",
            swfPath: "static/js",
            preload: "none"
        }).bind($.jPlayer.event.play, function() {
        // pause other instances of player when current one play
            $(this).jPlayer("pauseOthers");
        });

        return;
    }

	// Despite appearances, Parts 1 and 2 are intentionally "flipped." The radio pieces aired in a different order than how the site is sequenced.
	js_audioPlayer("http://projects.scpr.org/prison-pregnancy/media/audio/collage_zodiacal.mp3", 1);
	js_audioPlayer("http://projects.scpr.org/prison-pregnancy/media/audio/collage_bray.mp3", 2);
	js_audioPlayer("http://projects.scpr.org/prison-pregnancy/media/audio/collage_bass.mp3", 3);
	js_audioPlayer("http://projects.scpr.org/prison-pregnancy/media/audio/pregnant-prisoners-full.mp3", 10);


  $(".radio .jp-play").click(function() {
    var playBar = $(this).data("bar-id");
    $(playBar).animate({width: '150', padding: '2px'}, 300);
  });


});
