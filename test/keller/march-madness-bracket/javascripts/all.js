$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 800);
        return false;
      }
    }
  });
});
// Homepage hero resizing
    (function () {
    var e;
    e = function () {
        $(".hero").css("height", $(window).height() - 90);
    };
    $(function () {
        return $(window).on("load resize", e)
    })
    }).call(this);
