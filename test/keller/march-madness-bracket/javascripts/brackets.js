// Homepage hero resizing
(function () {
var e;
e = function () {
  if ($(".download").css("position") != "relative" ){
    $(".hero").css("height", $(window).height() - 90);
  } 
};
$(function () {
    return $(window).on("load resize", e)
})
}).call(this);

// Smooth anchor scrolling
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 600);
        return false;
      }
    }
  });
});

// Facebook popup
function fbs_click() {
  u=location.href;
  t=document.title;
  window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=626,height=436');
  return false;
}

// Style Matchups that have been voted on
$(".pds-vote-button").click(function() {
  $(this).closest(".matchup").addClass("voted");
});
