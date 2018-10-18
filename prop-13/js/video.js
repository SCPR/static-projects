$(document).ready(() => {

if (!Modernizr.touchevents) {
  // all of our videos
  var videos = $('video');

  // run through all the videos, and set some positions for each one
  $.each(videos, function() {
    // setting values for the video position, height, and bottom
    const videoPos = $(this).offset().top;
    const videoHt = $(this).height();
    const videoBt = videoPos + videoHt;

    $(window).scroll(() => {
      // as we scroll through the story, set values for our window height, scroll position and bottom
      const winHt = $(window).height();
      const winTop = $(window).scrollTop();
      const winBot = winHt + winTop;

      // check if the video bottom is past the window bottom, if it is, play
      if (videoBt < winBot) {
        // console.log('play');
        $(this)[0].play();
      } else {
        // $(this)[0].pause();
      }

      // at the stame time, check to see if the video bottom is past the window scroll top
      // if it is, pause the video
      if (videoBt < winTop) {
        //$(this)[0].pause();
      }
    });

  });
} else {
  $('video').attr('controls', 'true');
}

}); // end document.ready
