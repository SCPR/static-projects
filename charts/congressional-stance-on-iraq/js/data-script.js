var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.scrollToRep();

	//Calculate the height of <header>
	//Use outerHeight() instead of height() if have padding
    var aboveHeight = jqueryNoConflict('header').outerHeight();

	// when scroll
    jqueryNoConflict(window).scroll(function(){

		//if scrolled down more than the header's height
        if (jqueryNoConflict(window).scrollTop() > aboveHeight){

			// if yes, add "fixed" class to the <nav>
			// add padding top to the #content (value is same as the height of the nav)
            jqueryNoConflict('nav').addClass('fixed').css('top','100').next().css('padding-top','60px');
        } else {

			// when scroll up or less than aboveHeight, remove the "fixed" class, and the padding-top
            jqueryNoConflict('nav').removeClass('fixed').next().css('padding-top','0');
        }
    });
});

// begin data configuration object
var fn = {

    // scroll into view function
    scrollToRep: function(){
        var congressionalMember = jqueryNoConflict('#search-congressional-delegation').val();
        jqueryNoConflict.scrollTo(congressionalMember)
    },

};
// end data configuration object