var pinFn = pinFn || {};

function loadmedia(){
    $("#jquery_jplayer_10").jPlayer("setMedia", {
        mp3: "http://projects.scpr.org/longreads/high-rent-few-options/media/audio/rent.mp3"
    });
};

// begin main function
$(document).ready(function() {

    // certain links open in new windows
    $(".afterword .credits a, .masthead a").click( function() {
        window.open(
            $(this).attr("href")
        );
        return false;
    });

    $("#jquery_jplayer_10").jPlayer({
        ready: loadmedia,
        cssSelectorAncestor: "#jp_container_10",
        solution:"html, flash",
        supplied: "mp3",
        swfPath: "static/js/Jplayer.swf",
        wmode: "window"
    });

    $("a.jp-play").click(function(){
        var playBar = $(this).data("bar-id");
        $(playBar).animate({width: "150", padding: "2px"}, 300);
    });

    PIN.Form.render(PIN_QUERY);

});
// begin main function

// begin pin query variable
var PIN_QUERY = {
    uuid: "7345004f6c9f",
    divId: "pin-query-7345004f6c9f",
    opts: {
        includeLegalFooter: false,
        validationErrorMsg: "Sorry, you have problems!",
        showIntro: false,

        // the thankYou callback is invoked after the Submit button is clicked
        thankYou: function(divId, respData) {
            var div = jQuery("#" + divId);
            var queryMeta = PIN.Form.Registry[divId];
            div.text("Thanks! Your submission is " + respData.uuid);
        },

        // the onRender callback is invoked after the query HTML is built.
        onRender: function(divId, queryData) {
            var div = jQuery("#" + divId);
            div.prepend("<h2>" + queryData.query.inq_ext_title + "</h2>");
        }
    }
};
// end pin query variable
