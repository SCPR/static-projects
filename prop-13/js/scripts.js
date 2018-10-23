// Responsive videos

  $.each($('video'), function() {

    const elSize = $(this).width();

    const videoSize = elSize > 800 ? 'large' : 'small';
    const videoName = $(this).attr('data-videoname');

    $(this).children('.webm-source').attr('src', `../video/${videoName}-${videoSize}.webm`);
    $(this).children('.mp4-source').attr('src', `../video/${videoName}-${videoSize}.mp4`);


    $(this)[0].load();

});


$(document).ready(function(){

  // const offsetTop = $(".scroll-transition").offset().top - 200;
  //
  // $(window).scroll(function() {
  //   const scrollTop = $(window).scrollTop();
  //
  //   // Animation on scroll
  //   if (scrollTop > offsetTop) {
  //     $(".scroll-transition").addClass("visible");
  //   } else {
  //     $(".scroll-transition").removeClass("visible");
  //   }




  //Toggle menu dropdown
  $('.menu').click(function(){
    $('.menu-dropdown').slideToggle('slow');
  });

  // Show glossary modal
  $(".glossary-btn").click(function(){
    $(".mask").addClass("active");
  });

  $(".glossary-btn").click(function(){
    //$('.menu-dropdown').slideToggle('slow');
    $(".mask").addClass("active");
  });

  // Close modal
  function closeModal(){
    $(".mask").removeClass("active");
  }

  // Keyboard functions to close modal
  $("#close, .mask").click(function(){
    closeModal();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      closeModal();
    }
  });


  // // Add smooth scrolling to all links
  // $("a").on('click', function(event) {
  //
  //   // Make sure this.hash has a value before overriding default behavior
  //   if (this.hash !== "") {
  //     // Prevent default anchor click behavior
  //     event.preventDefault();
  //
  //     // Store hash
  //     const hash = this.hash;
  //
  //     // Using $'s animate() method to add smooth page scroll
  //     // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
  //     $('html, body').animate({
  //       scrollTop: $(hash).offset().top
  //     }, 800, function(){
  //
  //       // Add hash (#) to URL when done scrolling (default click behavior)
  //       window.location.hash = hash;
  //     });
  //   } // End if
  // });

});
