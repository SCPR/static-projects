var jqueryNoConflict = jQuery;

    //begin main function
    jqueryNoConflict(document).ready(function(){
        getIdOfBillContainer();
        animateContainers();
    });
    //end main function

    // get the id of a bill container on click
    function getIdOfBillContainer(){
        var billId;
        var targetOfQuery;
        jqueryNoConflict('.item').click(function(){
            billId = jqueryNoConflict(this).attr('id');
            targetOfQuery = constructQueryUrl(billId);
        });
        return targetOfQuery;
    }

    // construct the url to query for data
    function constructQueryUrl(billId){
        var urlPrefix = 'http://openstates.org/api/v1/bills/ca/20132014/'
        var urlSuffix = '/?apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?'
        var targetUrl = urlPrefix + billId + urlSuffix
        retriveData(targetUrl);
    }

    // grab data
    function retriveData(urlToQuery) {
        console.log(urlToQuery);
        jqueryNoConflict.getJSON(urlToQuery, renderHandlebarsDisplayTemplate);
    };

    // render content display template
    function renderHandlebarsDisplayTemplate(data){
        renderHandlebarsTemplate('content-display.handlebars', '#content-display', data);
    };

    // isotope function to animate the containers
    function animateContainers(){
        var container = jqueryNoConflict('#container');
        var checkboxes = jqueryNoConflict('#filters input');
        container.isotope({
            itemSelector: '.item'
        });
        checkboxes.change(function(){
            var filters = [];
            // get checked checkboxes values
            checkboxes.filter(':checked').each(function(){
                filters.push( this.value );
            });
            filters = filters.join(', ');
            container.isotope({ filter: filters });
        });
        jqueryNoConflict('#shuffle').click(function(){
            container.isotope('shuffle');
        });
    }