// Responsive video/GIFs
if ($(window).width() > 800){

  $('.video-gif').hide();
  $('.video-wrapper').show();

  $.each($('video'), function() {

    const elSize = $(this).width();

    //const videoSize = elSize > 800 ? 'large' : 'small';
    const videoName = $(this).attr('data-videoname');

    $(this).children('.mp4-source').attr('src', `../videos/${videoName}-large.mp4`);
    // $(this).children('.webm-source').attr('src', `../../../../prop-13/video/${videoName}-${videoSize}.webm`);

    $(this)[0].load();

  });

} else {

  $('.video-wrapper').hide();
  $('.video-gif').show();

  $.each($('.video-gif img'), function() {

    const gifName = $(this).attr('data-gifname');

    $(this).attr('src', `../videos/${gifName}.gif`);

  });

}


$(document).ready(function(){

  if ($(window).width() > 1615){

    const targetOffset1 = $("#fairness-section-1").offset().top;
    const targetOffset2 = $("#fairness-section-2").offset().top;
    const targetOffset3 = $("#anchor-point-3").offset().top;
    const targetOffset4 = $("#anchor-point-4").offset().top;

    const $w = $(window).scroll(function() {

      const scrollTop = $(window).scrollTop();
      $('.visuals-container').addClass('is-visible',scrollTop >= $('#fairness-section-1').offset().top - 150);

      if (($w.scrollTop() + $(window).height()) > targetOffset1) {
        $('.visuals-container img').attr("src","../fairness/images/fairness-jas-portrait.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-jas-portrait').show();
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset2) {
        $('.visuals-container img').attr("src","../fairness/images/fairness-don-home.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-don-home').show();
      }

      // if (($w.scrollTop() + $(window).height()) > targetOffset3) {
      //   $('.visuals-container img').attr("src","../fairness/images/fairness-jas-portrait-2.jpg");
      //   $('.scroll-cutline').hide();
      //   $('#cutline-jas-portrait-2').show();
      // }

      if (($w.scrollTop() + $(window).height()) > targetOffset3) {
        $('.visuals-container img').attr("src","../fairness/images/scenes-garages.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-scenes-garages').show();
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset4) {
        $('.visuals-container img').attr("src","../fairness/images/fairness-stephanie-portrait.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-stephanie-portrait').show();
      }
    });
  } else {
    $('.visuals-container').addClass('is-visible');
  }

});
