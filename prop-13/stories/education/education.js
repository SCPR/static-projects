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
    //const targetOffset2 = $("#anchor-point-2").offset().top;
    const targetOffset3 = $("#anchor-point-3").offset().top;

    const $w = $(window).scroll(function() {

      const scrollTop = $(window).scrollTop();
      $('.visuals-container').addClass('is-visible',scrollTop >= $('#education-section-1').offset().top - 150);

      if (($w.scrollTop() + $(window).height()) > targetOffset1) {
        $('.visuals-container img').attr("src","../education/images/edu-woodsons-portrait.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-edu-woodsons-portrait').show();
        $('.chart-container').css('display','none');
      }

      // if (($w.scrollTop() + $(window).height()) > targetOffset2) {
      //   $('.visuals-container').hide();
      //   $('#cutline-spending-chart').show();
      //   $('.chart-container').show();
      // }

      if (($w.scrollTop() + $(window).height()) > targetOffset3) {
        $('.visuals-container img').attr("src","../education/images/scenes-basketball-hoop.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-scenes-basketball-hoop').show();
        $('.chart-container').css('display','none');

      }

    });
  } else {
    $('.visuals-container').addClass('is-visible');
  }

});
