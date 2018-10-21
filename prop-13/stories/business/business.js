// Responsive video/GIFs

$.each($('video'), function() {

  const elSize = $(this).width();

  const videoSize = elSize > 800 ? 'large' : 'small';
  const videoName = $(this).attr('data-videoname');

  $(this).children('.mp4-source').attr('src', `../business/video/${videoName}-${videoSize}.mp4`);
  $(this).children('.webm-source').attr('src', `../business/video/${videoName}-${videoSize}.webm`);

  $(this)[0].load();

});

$(document).ready(function(){

  if ($(window).width() > 1615){

    const targetOffset1 = $("#business-section-1").offset().top;
    const targetOffset2 = $("#business-section-2").offset().top;
    const targetOffset3 = $("#anchor-point-3").offset().top;
    const targetOffset4 = $("#anchor-point-4").offset().top;

    const $w = $(window).scroll(function() {

      const scrollTop = $(window).scrollTop();
      $('.visuals-container').addClass('is-visible',scrollTop >= $('#business-section-1').offset().top - 150);

      if (($w.scrollTop() + $(window).height()) > targetOffset1) {
        $('.visuals-container img').attr("src","../business/images/biz-noah-portrait.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-biz-noah-portrait').show();
        $('#revenue-map').css('display','none');
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset2) {
        $('.visuals-container img').attr("src","../business/images/biz-noah-working-at-table.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-biz-noah-working-at-table').show();
        $('#revenue-map').css('display','none');
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset3) {
        $('#revenue-map').show();
        $('.cutline').hide();
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset4) {
        $('.visuals-container img').attr("src","../business/images/biz-timothy-portrait.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-biz-timothy-portrait').show();
        $('#revenue-map').css('display','none');
      }

    });
  } else {
    $('.visuals-container').addClass('is-visible');
  }

});
