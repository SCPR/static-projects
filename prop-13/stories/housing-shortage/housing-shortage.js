// Responsive video/GIFs

$.each($('video'), function() {

  const elSize = $(this).width();

  const videoSize = elSize > 800 ? 'large' : 'small';
  const videoName = $(this).attr('data-videoname');

  $(this).children('.mp4-source').attr('src', `../housing-shortage/video/${videoName}-${videoSize}.mp4`);
  $(this).children('.webm-source').attr('src', `../housing-shortage/video/${videoName}-${videoSize}.webm`);

  $(this)[0].load();

});

$(document).ready(function(){

  if ($(window).width() > 1615){

    const targetOffset1 = $("#shortage-section-1").offset().top;
    const targetOffset2 = $("#shortage-section-2").offset().top;
    //const targetOffset3 = $("#anchor-point-2").offset().top;
    //const targetOffset4 = $("#anchor-point-3").offset().top;

    const $w = $(window).scroll(function() {

      const scrollTop = $(window).scrollTop();
      $('.visuals-container').addClass('is-visible',scrollTop >= $('#shortage-section-1').offset().top - 150);

      if (($w.scrollTop() + $(window).height()) > targetOffset1) {
        $('.visuals-container img').attr("src","../housing-shortage/images/housing-shortage-michelle-portrait.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-housing-shortage-michelle-portrait').show();
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset2) {
        $('.visuals-container img').attr("src","../housing-shortage/images/housing-shortage-empty-lot.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-housing-shortage-empty-lot').show();
      }

    });
  } else {
    $('.visuals-container').addClass('is-visible');
  }

});
