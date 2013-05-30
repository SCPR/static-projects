    var jqueryNoConflict = jQuery;
    var fn = fn || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        fn.initializeDataSource();
    });

    // begin data configuration object
    var fn = {

        initializeDataSource: function(){
            Tabletop.init({
                key: '0Aq8qwSArzKP9dG1FNjJSSnh2TV96Szc0eUF2OXN2NWc',
                callback: fn.processDataSource,
                parseNumbers: true,
                simpleSheet: false,
                debug: false
            });
        },

        // first pass at pulling out data and displaying it
        processDataSource: function(data, tabletop){
            var handlebarsData = {
                objects: data.working_fire_sheet.elements
            };

            handlebarsDebugHelper();
            renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details', handlebarsData);
        }
    }

    function openModal(){
        renderHandlebarsTemplate('static-files/templates/data-modal.handlebars', '#data-modal');
        jqueryNoConflict('#popupContent').modal('show');
    };

	function closeDialog(){
		jqueryNoConflict('#popupContent').modal('hide');
	};