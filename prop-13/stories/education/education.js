// Responsive video/GIFs

$.each($('video'), function() {

  const elSize = $(this).width();

  const videoSize = elSize > 800 ? 'large' : 'small';
  const videoName = $(this).attr('data-videoname');

  $(this).children('.mp4-source').attr('src', `../education/video/${videoName}-${videoSize}.mp4`);
  $(this).children('.webm-source').attr('src', `../education/video/${videoName}-${videoSize}.webm`);

  $(this)[0].load();

});

$(document).ready(function(){

  if ($(window).width() > 1615){

    const targetOffset1 = $("#education-section-1").offset().top;
    const targetOffset2 = $("#education-section-2").offset().top;
    const targetOffset3 = $("#anchor-point-1").offset().top;
    const targetOffset4 = $("#anchor-point-4").offset().top;

    const $w = $(window).scroll(function() {

      const scrollTop = $(window).scrollTop();
      $('.visuals-container').addClass('is-visible',scrollTop >= $('#education-section-1').offset().top - 150);

      if (($w.scrollTop() + $(window).height()) > targetOffset1) {
        $('.visuals-container img').attr("src","../education/images/edu-woodsons-portrait.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-edu-woodsons-portrait').show();
      }

      // if (($w.scrollTop() + $(window).height()) > targetOffset2) {
      //   $('.visuals-container img').attr("src","../education/images/edu-woodsons-soccer.jpg");
      //   $('.scroll-cutline').hide();
      //   $('#cutline-edu-woodsons-soccer').show();
      // }

      // if (($w.scrollTop() + $(window).height()) > targetOffset3) {
      //   $('.visuals-container img').attr("src","../education/images/edu-timothy-portrait.jpg");
      //   $('.scroll-cutline').hide();
      //   $('#cutline-edu-timothy-portrait').show();
      // }

    });
  } else {
    $('.visuals-container').addClass('is-visible');
  }

});
