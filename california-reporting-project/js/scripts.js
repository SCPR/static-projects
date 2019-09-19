// FAQs accordion

$(function() {
  $('.accordion li').on('click', function() {
    if ($(this).find('ul').hasClass('open')) {
      $('ul.open').slideToggle().removeClass('open');
      $('.accordion h3 span').removeClass('closed');
      $('.accordion h3').removeClass('closed');
    } else {
      $('ul.open').slideToggle().removeClass('open');
      $(this).find('ul').slideToggle().addClass('open');
      $('.accordion h3, .accordion h3 span').removeClass('closed');
      $(this).find('h3, h3 span').addClass('closed')
    }
  });

  // Active class adds open class
  $('.accordion li.active ul').slideDown().addClass('open');
});

// Query spreadsheet for story headlines
$(function(){
  var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1A32cgprM-6_3Ax7b9kZBwjjw3oz6ynx9GoEDzeS4reQ/1/public/full?alt=json';
  $.getJSON(sheetUrl, function(data){
    var entry = data.feed.entry;
    console.log(entry);
  })
});

$(document).ready(function(){

  // Toggle menu dropdown
  $('.menu, .menu-item').click(function(){
    $('.menu-dropdown').slideToggle('slow');
  });

  // Bar chart
  $(".bar").each(function(){
    const barWidth = $(this).attr("data-num");

    if ($(window).width() > 500) {
      $(this).css('width',barWidth/2+'px');
      if (barWidth < 60){
        $(this).addClass('small-num');
      }
    } else {
      $(this).css('width',barWidth/2+'px');
      if (barWidth < 60){
        $(this).addClass('small-num');
      }
    }

  });

});
