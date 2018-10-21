

$(document).ready(function(){

  if ($(window).width() > 1615){

    const targetOffset1 = $("#history-section-1").offset().top;
    const targetOffset2 = $("#anchor-point-1").offset().top;
    //const targetOffset4 = $("#anchor-point-3").offset().top;

    const $w = $(window).scroll(function() {

      const scrollTop = $(window).scrollTop();
      $('.visuals-container').addClass('is-visible',scrollTop >= $('#history-section-1').offset().top);

      if (($w.scrollTop() + $(window).height()) > targetOffset1) {
        $('.visuals-container img').attr("src","../history/images/history-jon-coupal.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-history-jon-coupal').show();
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset2) {
        $('.visuals-container img').attr("src","../history/images/history-jarvis-gann-win.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-history-jarvis-gann-win').show();
      }

    });
  } else {
    $('.visuals-container').addClass('is-visible');
  }

});
