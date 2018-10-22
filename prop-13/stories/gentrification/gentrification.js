// Responsive video/GIFs

$.each($('video'), function() {

  const elSize = $(this).width();

  const videoSize = elSize > 800 ? 'large' : 'small';
  const videoName = $(this).attr('data-videoname');

  $(this).children('.mp4-source').attr('src', `../gentrification/video/${videoName}-${videoSize}.mp4`);
  $(this).children('.webm-source').attr('src', `../gentrification/video/${videoName}-${videoSize}.webm`);

  $(this)[0].load();

});

$(document).ready(function(){

  //Toggle menu dropdown
  $('.menu').click(function(){
    $('.menu-dropdown').slideToggle('slow');
  });

  // Bar chart

  $(".bar").each(function(){
    const width = $(this).attr("data-num");

    $(this).css('width',width+'%');
    //$(this).html(width);
    if (width < 8){
      $(this).addClass('small-num');
    }
  });


  // Swap images on scroll

  if ($(window).width() > 1615){

    const targetOffset1 = $("#gentrification-section-1").offset().top;
    const targetOffset2 = $("#gentrification-section-2").offset().top;
    // const targetOffset2 = $("#anchor-point-2").offset().top;
    const targetOffset3 = $("#anchor-point-3").offset().top;
    const targetOffset4 = $("#anchor-point-4").offset().top;

    const $w = $(window).scroll(function() {

      const scrollTop = $(window).scrollTop();
      $('.visuals-container').addClass('is-visible',scrollTop >= $('#gentrification-section-1').offset().top - 150);

      if (($w.scrollTop() + $(window).height()) > targetOffset1) {
        $('.visuals-container img').attr("src","../gentrification/images/gentrification-dorothy-home-exterior.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-gentrification-dorothy-home-exterior').show();
        $('.chart-container').css('display','none');
      }


      if (($w.scrollTop() + $(window).height()) > targetOffset2) {
        $('.visuals-container img').attr("src","../gentrification/images/gentrification-darrell-alley.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-gentrification-darrell-alley').show();
        $('.chart-container').css('display','none');
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset3) {
        $('.scroll-cutline').hide();
        $('.chart-container').show();
        $('#cutline-demographics-chart').show();
      }

      if (($w.scrollTop() + $(window).height()) > targetOffset4) {
        $('.visuals-container img').attr("src","../gentrification/images/gentrification-darrell-portrait.jpg");
        $('.scroll-cutline').hide();
        $('#cutline-gentrification-darrell-portrait').show();
        $('.chart-container').css('display','none');
      }

    });
  } else {
    $('.visuals-container').addClass('is-visible');
  }

});
