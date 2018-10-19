$(document).ready(function(){


  const targetOffset1 = $("#anchor-point-1").offset().top;
  const targetOffset2 = $("#anchor-point-2").offset().top;
  const targetOffset3 = $("#fairness-section-2").offset().top;
  //const targetOffset4 = $("#fairness-section-3").offset().top;

  const $w = $(window).scroll(function() {

    const scrollTop = $(window).scrollTop();
    $('.visuals-container').addClass('is-visible',scrollTop >= $('#fairness-section-1').offset().top - 150);

    if (($w.scrollTop() + $(window).height()) > targetOffset3) {
      $('.visuals-container img').attr("src","../fairness/images/fairness-don-home.jpg");
    } else {
      $('.visuals-container img').attr("src","../fairness/images/fairness-jas-portrait.jpg");
    }
  });

  // var targetOffset = $("#anchor-point-1").offset().top;
  //
  // var $w = $(window).scroll(function() {
  //   if (($w.scrollTop() + $(window).height()) > targetOffset) {
  //     $('.visuals-container img').attr("src","../fairness/images/fairness-don-portrait");
  //   } else {
  //     $('.visuals-container img').attr("src","../fairness/images/fairness-jas-portrait");
  //   }
  // });

   // var iScrollPos = 0;
   // $(window).scroll(function () {
   //     var iCurScrollPos = $(this).scrollTop();
   //     if (iCurScrollPos > iScrollPos) {
   //         //Scrolling Down
   //        $('.visuals-container img').attr('src' , '../../images/fairness-jas-portrait');
   //
   //     }else {
   //
   //        //Scrolling Up
   //        $('.visuals-container img').attr('src' , '../../images/fairness-don-portrait');
   //     }
   //
   //     iScrollPos = iCurScrollPos;
   //
   // });

   // const storyTopJas = $('.fairness-jas').offset();
   // const storyTopDon = $('.fairness-don').offset();
   //
   // $(window).scroll(function() {
   //     if ( $(window).scrollTop() >= storyTopJas.top) {
   //         $(".fairness-jas").css('position','absolute');
   //         $(".fairness-don").css('position','relative');
   //     }
   //     if ( $(window).scrollTop() >= storyTopDon.top) {
   //         $(".fairness-don").css('position','absolute');
   //         $(".fairness-jas").css('position','relative');
   //         //$('.visuals-container').find('img').attr('src','../images/fairness-don-portrait.jpg');
   //
   //     }
   //
   //
   // });

   $.each($('video'), function() {
       const elSize = $(this).width();

       const videoSize = elSize > 800 ? 'large' : 'small';
       const videoName = $(this).attr('data-videoName');

       $(this).children('.mp4-source').attr('src', `../../../../video/${videoName}-${videoSize}.mp4`);
       $(this).children('.webm-source').attr('src', `../../../../video/${videoName}-${videoSize}.webm`);

       $(this)[0].load();

     });

});
