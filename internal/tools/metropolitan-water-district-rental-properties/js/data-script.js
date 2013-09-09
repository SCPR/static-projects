var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {

    jqueryNoConflict(window).resize(function () {
        var h = jqueryNoConflict(window).height(),
            offsetTop = 0;
        jqueryNoConflict('#content-map-canvas').css('height', (h - offsetTop));
    }).resize();

    jqueryNoConflict(function() {
        MapsLib.initialize();

        jqueryNoConflict("#search_address").geocomplete();

        jqueryNoConflict(':checkbox').click(function(){
            MapsLib.doSearch();
        });

        jqueryNoConflict(':radio').click(function(){
            MapsLib.doSearch();
        });

        jqueryNoConflict('#search_radius').change(function(){
            MapsLib.doSearch();
        });

        jqueryNoConflict('#search').click(function(){
            MapsLib.doSearch();
        });

        jqueryNoConflict('#find_me').click(function(){
            MapsLib.findMe();
            return false;
        });

        jqueryNoConflict('#reset').click(function(){
            jqueryNoConflict.address.parameter('address','');
            MapsLib.initialize();
            return false;
        });

        jqueryNoConflict(":text").keydown(function(e){
            var key =  e.keyCode ? e.keyCode : e.which;
            if(key == 13) {
                jqueryNoConflict('#search').click();
                return false;
            }
        });

        /*
        setTimeout(function() {
            MapsLib.uncacheTiles();
        }, 5000);
        */

    });

	jqueryNoConflict('#content-background').click(function(){
		jqueryNoConflict('#content-background').fadeOut('slow');
		jqueryNoConflict('#content-display').fadeOut('slow');
	});

	jqueryNoConflict(document).keydown(function(e){
		if(e.keyCode==27) {
			jqueryNoConflict('#content-background').fadeOut('slow');
			jqueryNoConflict('#content-display').fadeOut('slow');
		}
	});
});