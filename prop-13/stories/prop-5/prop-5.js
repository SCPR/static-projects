// Responsive video/GIFs

$.each($('video'), function() {

  const elSize = $(this).width();

  const videoSize = elSize > 800 ? 'large' : 'small';
  const videoName = $(this).attr('data-videoname');

  $(this).children('.mp4-source').attr('src', `../prop-5/video/${videoName}-${videoSize}.mp4`);
  $(this).children('.webm-source').attr('src', `../prop-5/video/${videoName}-${videoSize}.webm`);

  $(this)[0].load();

});

$(document).ready(function(){

  if ($(window).width() > 1615){

    const targetOffset1 = $("#prop-5-section-1").offset().top;
    //const targetOffset2 = $("#prop-5-section-2").offset().top;
    const targetOffset3 = $("#anchor-point-2").offset().top;
    const targetOffset4 = $("#anchor-point-3").offset().top;

    const $w = $(window).scroll(function() {

      const scrollTop = $(window).scrollTop();
      $('.visuals-container').addClass('is-visible',scrollTop >= $('#prop-5-section-1').offset().top - 150);

      if (($w.scrollTop() + $(window).height()) > targetOffset1) {
        $('.visuals-container img').attr("src","../prop-5/images/prop-5-ken-sitting.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-prop-5-ken-sitting').show();
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset3) {
        $('.visuals-container img').attr("src","../prop-5/images/scenes-power-lines-overhead.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-scenes-power-lines-overhead').show();
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset4) {
        $('.visuals-container img').attr("src","../prop-5/images/scenes-three-plants.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-scenes-three-plants').show();
      }

    });
  } else {
    $('.visuals-container').addClass('is-visible');
  }

});
