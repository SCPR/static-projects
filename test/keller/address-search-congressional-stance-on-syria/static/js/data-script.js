var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.getAddressValue();
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

    getAddressValue: function(){
        jqueryNoConflict('#address-search-submit').click(function(){
            var addressValue = jqueryNoConflict('#address-search').val();
            console.log(addressValue);
            //fn.geocodeAddress(addressValue)
        });
    },

    geocodeAddress: function(addressValue){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': addressValue}, function(results, status) {
            var location = results[0].geometry.location;
            fn.constructOpenStatesQuery(location.lat(), location.lng());
        });
    },

    // construct the url to query for data
    constructOpenStatesQuery: function(latitude, longitude){
        var urlPrefix = 'http://congress.api.sunlightfoundation.com/legislators/locate?';
        var testValue = 'latitude=' + latitude + '&longitude=' + longitude;
        var urlSuffix = '&apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?';
        var targetUrl = urlPrefix + testValue + urlSuffix;
        fn.retriveOpenCongressData(targetUrl);
    },

    retriveOpenCongressData: function(targetUrl){
        jqueryNoConflict.getJSON(targetUrl, fn.renderOpenCongressData);
    },

    renderOpenCongressData: function(data){
        for(var i=0; i<data.results.length; i++){
            if (data.results[i].chamber === 'house'){
                congressionalMember = '#' + data.results[i].first_name + '_' + data.results[i].last_name;
                console.log(congressionalMember);
                jqueryNoConflict.scrollTo(congressionalMember)
            }
        }
    },

    // scroll into view function
    scrollToRep: function(){
        var congressionalMember = jqueryNoConflict('#search-congressional-delegation').val();
        jqueryNoConflict.scrollTo(congressionalMember)
    },
};
// end data configuration object