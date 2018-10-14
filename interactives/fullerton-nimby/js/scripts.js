
$.extend($.easing, {
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  }
});

$(document).ready(function(){

  // Expandable sections
  $(".expander-trigger").click(function(){
     var idx = $(this).attr("data-num");
     idx = +idx;
     $(".expander-content:eq("+idx+")").slideDown();

  });

  $(".expander-close").click(function(){
     $(this).closest(".expander-content").slideUp();
  });

  // set up and create progress bar in DOM
  $('.chapter-num').eq(0).before('<div class="progressbar"></div>');
  const container = $('.progressbar');
	container.append('<div class="shim"></div>');
  const shim = $('.progressbar .shim');
	container.append('<div class="holder clearfix"></div>');
	const holder = $('.progressbar .holder');
	holder.append('<div class="bar"></div>');
	const bar = $('.progressbar .bar');
	bar.append('<div class="indicator"></div>');
	const indicator = $('.progressbar .indicator');
	holder.append('<div class="labels"></div>');
	const labels = $('.progressbar .labels');
	$('.chapter-num').each(function(){
		const code = '<i data-label="'+$(this).text()+'"></i>';
		labels.append(code);
	});
	const points = labels.find('i');
	points.css('width', 100/$('.chapter-num').length+'%');

  // match height of shim
  // stop layout jumping when progress bar fixes to / unfixes
  // from top of viewport
	function setShimHeight(){
		shim.css('height', container.height()+'px');
	}
	setShimHeight();
	$(window).resize(function(){ setShimHeight(); });

  // position indicator bar so it starts at first dot
  function setIndicatorX(){
    const point = points.eq(0);
    const xpos = point.offset().left + (point.width() / 2);
    //indicator.css('left', xpos+'px');
  }
  setIndicatorX();
  $(window).resize(function(){ setIndicatorX(); });

	// fix/unfix progress bar to top of viewport
	function fixPosition(){
		if(container.is(':visible')) {
			if(!container.hasClass('fixed')) {
				if(holder.offset().top <= $(window).scrollTop()) {
          container.addClass('fixed');
        }
			}
			else {
				if(shim.offset().top > $(window).scrollTop()) {
          container.removeClass('fixed');
        }
			}
		}
	}
	fixPosition();
	$(window).scroll(function(){ fixPosition() });
	$(window).resize(function(){ fixPosition(); });

  // set trigger point
	var triggerPoint = 0;
	function setTriggerPoint(){
		triggerPoint = $(window).height() * .18;
	}
	setTriggerPoint();
	$(window).resize(function(){ setTriggerPoint(); });

	// update progress bar
	function setPosition(){
    if(container.is(':visible')) {
			var section = false;
			var sectionIndex = 0;
			const currentPosition = $(window).scrollTop() + triggerPoint;
			// dots
			// if before first section
			if(currentPosition < $('.chapter-num').eq(0).offset().top) {
				points.removeClass('reading read');
				section = -1;
			}
			// if after first section
			else {
				$('.chapter-num').each(function(){
					const sectionTop = $(this).offset().top;
					if(currentPosition >= sectionTop) {
						points.removeClass('reading');
						points.eq(sectionIndex).addClass('reading');
						points.eq(sectionIndex).addClass('read');
						section = sectionIndex;
					}
					else {
						points.eq(sectionIndex).removeClass('read');
					}
					sectionIndex++;
				});
			}
			// progress bar
			var barWidth = 0;
			// if before start...
			if(section == -1) {
				const point = points.eq(0);
				barWidth = point.offset().left + (point.width() / 2);
			}
			// if after end...
			else if(section >= (points.length - 1)) {
				const point = points.eq((points.length - 1));
				barWidth = point.offset().left + (point.width() / 2);
			}
			// if within document...
			else {
				const startPoint = points.eq(section);
				const startPointX = startPoint.offset().left;
				const startPointWidth = startPoint.width();
				const startSection = $('.chapter-num').eq(section);
				const endSection = $('.chapter-num').eq(section+1);
				const startSectionY = startSection.offset().top;
				const endSectionY = endSection.offset().top;
				const sectionLength = endSectionY - startSectionY;
				const scrollY = currentPosition - startSectionY;
				const sectionProgress = scrollY / sectionLength;
				barWidth = startPointX + (startPointWidth / 2) + (startPointWidth * sectionProgress);
			}
      barWidth -= indicator.offset().left;
			indicator.css('width', barWidth+'px');
		}
	}
	setPosition();
	$(window).scroll(function(){ setPosition(); });
	$(window).resize(function(){ setPosition(); });

	// on click, scroll to target section
	points.click(function(){
		const sectionIndex = points.index($(this));
		const targetY = $('.chapter-num').eq(sectionIndex).offset().top - (triggerPoint * .92);
		$('html, body').animate({scrollTop:targetY}, 600, 'easeInOutCubic');
	});

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
// });
