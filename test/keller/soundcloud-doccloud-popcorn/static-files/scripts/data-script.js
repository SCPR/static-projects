// ensure the web page (DOM) has loaded
document.addEventListener("DOMContentLoaded", function () {

    // Create a popcorn instance by calling Popcorn("#id-of-my-video")
    var pop = Popcorn.soundcloud("#narration", 'http://soundcloud.com/knowtheory/short-commentary-on-lolspeak');

    var timings = [
        { start: 1,   end: 6.5, page: 1 },
        { start: 6.5, end: 12, page: 76 },
        { start: 12,  end: 19, aid: 42282 },
        { start: 19,  end: 25, aid: 42250 },
        { start: 25,  end: 33, aid: 42281 },
        { start: 33, aid: 42283 }
    ]

    function schedule(details) {
        var basicDetails = {
            target: "viewer-container",
            width: 1200,
            height: 900,
            url: "http://www.documentcloud.org/documents/282753-lefler-thesis.html"

        }

        pop.documentcloud(_.extend({}, basicDetails, details))
    }

    _.forEach(timings, schedule)

    // play the video right away
    //pop.play();
}, false);