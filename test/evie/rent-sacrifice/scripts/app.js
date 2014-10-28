$(document).ready(function() {
   scaleFont();
});

$(window).resize(function() {
   scaleFont();
});


function scaleFont() {

  var viewPortWidth = $(window).width();

  if (viewPortWidth >= 1900) {$('body').attr('class','extraWide');}
  else if (viewPortWidth >= 1400) {$('body').attr('class','wide');}
  else if (viewPortWidth >= 1000) {$('body').attr('class','medium');}
  else if (viewPortWidth >= 600) {$('body').attr('class','narrow');}
  else {$('body').attr('class','extraNarrow');}
};

$.getJSON("data/sacrifice_data.json", function(data){

	var	i = 0;

	$("#button").click(function(){

	    if (i < 16) {
	    	i++;
	    	$("#iconimg").attr("src","img/" + data[i].image + ".png");
	    	$("#category").html(data[i].category);
	    	$("#quotes").html('"' + data[i].quote + '"');
	    	$("#name").html(data[i].name);
	    	$("#location").html(data[i].location);
	    }
	    else {
	    	i = 0;
	    	$("#iconimg").attr("src","img/" + data[i].image + ".png");
	    	$("#category").html(data[i].category);
	    	$("#quotes").html('"' + data[i].quote + '"');
			$("#name").html(data[i].name);
	    	$("#location").html(data[i].location);
	    };
	})

});