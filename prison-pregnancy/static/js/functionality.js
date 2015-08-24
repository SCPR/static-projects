$(document).ready(function() {

    // certain links open in new windows
    $(".afterword .credits a, .masthead a").click( function() {
        window.open(
            $(this).attr("href")
        );
        return false;
    });

    function js_audioPlayer(file, location){
        $("#jquery_jplayer_" + location).jPlayer({
            ready: function (){
                $(this).jPlayer("setMedia", {
                    mp3: file
                });
            },
            cssSelectorAncestor: "#jp_container_" + location,
            solution:"html, flash",
            supplied: "mp3",
            swfPath: "static/js/Jplayer.swf",
            wmode: "window"
        }).bind($.jPlayer.event.play, function(){
            $(this).jPlayer("pauseOthers");
        });
        return;
    };

    js_audioPlayer("http://projects.scpr.org/prison-pregnancy/media/audio/collage_zodiacal.mp3", 1);
    js_audioPlayer("http://projects.scpr.org/prison-pregnancy/media/audio/collage_bray.mp3", 2);
    js_audioPlayer("http://projects.scpr.org/prison-pregnancy/media/audio/collage_bass.mp3", 3);
    js_audioPlayer("http://projects.scpr.org/prison-pregnancy/media/audio/pregnant-prisoners-full.mp3", 10);


    $(".radio .jp-play").click(function() {
        var playBar = $(this).data("bar-id");
        $(playBar).animate({width: '150', padding: '2px'}, 300);
    });

});
