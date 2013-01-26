var jqueryNoConflict = jQuery;

jqueryNoConflict(document).ready(function() {
    google.maps.event.addDomListener(window, 'load', buildMapDisplay);
});

function buildMapDisplay(){

    /*
        map library and search filtering from Derek Eder's Searchable Map Template
        find out more here: https://github.com/derekeder/FusionTable-Map-Template
    */

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
        //showDisplayDetails();
        return false;
    });

    jqueryNoConflict(":text").keydown(function(e){
        var key =  e.keyCode ? e.keyCode : e.which;
        if(key == 13) {
            jqueryNoConflict('#search').click();
            return false;
        }
    });
};

// create the bootrap modal
function clickModal(){
    jqueryNoConflict('#popupContent').modal('show');
};

function closeDialog () {
	jqueryNoConflict('#popupContent').modal('hide');
};

// begin remove article text
function alterDisplayDetails(){

    var $togglers = $('[data-toggle="collapse"]');
    $togglers.each(function() {
        var $this = $(this);
        var $collapsible = $($this.data('target'));
        $collapsible.on('hidden', function() {
            var text = $this.data('on-hidden');
            text && $this.text(text);
        }).on('shown', function() {
            var text = $this.data('on-active');
            text && $this.text(text);
            $('#content-display').empty();
        });
    });

    $('.collapse').collapse();
};