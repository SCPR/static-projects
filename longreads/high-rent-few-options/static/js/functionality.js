var pinFn = pinFn || {};

// begin main function
$(document).ready(function() {

    // fire up google analytics event tracking
    eventTracking = new EventTracking();
    $.scrollDepth({
        // track dom elements
        elements: ['section.event'],

        // don't track depth percentage
        percentage: false
    });

    // certain links open in new windows
    $(".afterword .credits a,.event a,.promo-map a,.masthead a,.school-meta a").click( function() {
        window.open(
            $(this).attr("href")
        );
        return false;
    });

    // prevent stupid tap delays
    // okay, this is borking IE8, and thus causing all subsequent scripts to fail
    // document.addEventListener("touchstart", function() {},false);

    // markup fiddling
    $(".school").last().addClass("school-last");

    // reactive global nav
    $("#wayfinder").waypoint("sticky", {
        offset: 50
    });

    //photo slideshows
    $("#gallery-01,#gallery-02,#gallery-03").rsfSlideshow({
        data_container: 'ol.slides',
        slide_data_container: 'li',
        slide_data_selectors: {
            url: {selector: 'a', attr: 'href'},
            caption: {selector: 'a', attr: 'title'}
        },
        autostart: false,

        // Used to be 300. Tweaking in the interest of addressing IE8's ineptitude. Might revisit later.
        transition: 0,
        effect: 'fade',
        controls: {
            playPause: {auto: false},
            previousSlide: {auto: true},
            nextSlide: {auto: true},
            index: {auto: false}
        }
    });

    // video
    $(".video").one('click', function() {
        var videoHeight = $(this).height();
        var videoSrc = $(this).data("href");
        $(this).height(videoHeight).load(videoSrc);
    });

    // audio
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

    js_audioPlayer("http://projects.scpr.org/static/longreads/high-rent-few-options/media/audio/rent.mp3", 10);

    $(".radio .jp-play").click(function() {
        var playBar = $(this).data("bar-id");
        $(playBar).animate({width: '150', padding: '2px'}, 300);
    });

    PIN.Form.render(PIN_QUERY);

});
// begin main function

// begin pin query variable
var PIN_QUERY = {
    uuid: '7345004f6c9f',
    divId: 'pin-query-7345004f6c9f',
    opts: {
        includeLegalFooter: false,
        validationErrorMsg: 'Sorry, you have problems!',
        showIntro: false,

        // the thankYou callback is invoked after the Submit button is clicked
        thankYou: function(divId, respData) {
            var div = jQuery('#'+divId);
            var queryMeta = PIN.Form.Registry[divId];
            div.text('Thanks! Your submission is ' + respData.uuid);
        },

        // the onRender callback is invoked after the query HTML is built.
        onRender: function(divId, queryData) {
            var div = jQuery('#'+divId);
            div.prepend('<h2>'+queryData.query.inq_ext_title+'</h2>');
        }
    }
};
// end pin query variable