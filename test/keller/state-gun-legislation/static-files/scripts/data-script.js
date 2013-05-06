var jqueryNoConflict = jQuery;

    //begin main function
    jqueryNoConflict(document).ready(function(){
        getIdOfBillContainer();
        animateContainers();
        runHandlebarsHelpers();
    });
    //end main function

    // get the id of a bill container on click
    function getIdOfBillContainer(billId){
        jqueryNoConflict('.item').click(function(){
            billId = jqueryNoConflict(this).attr('id');
            constructQueryUrl(billId);
        });
    }

    // construct the url to query for data
    function constructQueryUrl(billId){
        var urlPrefix = 'http://openstates.org/api/v1/bills/ca/20132014/';
        var urlSuffix = '/?apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?';
        var targetUrl = urlPrefix + billId + urlSuffix;
        retriveData(targetUrl, billId);

    }

    // grab data
    function retriveData(targetUrl) {
        console.log(targetUrl);
        jqueryNoConflict.getJSON(targetUrl, renderHandlebarsDisplayTemplate);
    }

    // render content display template
    function renderHandlebarsDisplayTemplate(data){
        renderHandlebarsTemplate('static-files/templates/content-display.handlebars', '#content-display', data);

        compareBillIds('SB%20108');

    }



/*****/


    // begin
    function compareBillIds(billId){
        var targetBillId = 'SB%20108'
        if (billId === targetBillId){
            console.log('we have a match');

            jqueryNoConflict('#reporter-summary').waitUntilExists(function(){
                jqueryNoConflict('#reporter-summary').html('<h1>BOOM! ' + billId + '</h1>');
            });

        } else {
            console.log('move along now');
        }
    }

/*****/




    // isotope function to animate the containers
    function animateContainers(){
        var container = jqueryNoConflict('#container');
        var checkboxes = jqueryNoConflict('#data-legend-items input');
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

    // format date/time
    function takeTime(dateInput) {
        var dateFormat = 'MMM. D, YYYY';
        var dateOutput = moment(dateInput).format(dateFormat);
        return dateOutput;
    }

    // begin
    function runHandlebarsHelpers(){

        handlebarsreplaceSpacesHelper();

        // use moment to format date and time
        Handlebars.registerHelper('dateFormat', function(context, block) {
            if (context === null) {
                return ('n/a');
            } else if (window.moment) {
                return takeTime(context);
            } else {
                return context;
            };
        });

        // evaluate chamber type and convert
        Handlebars.registerHelper('chamberType', function(context, block) {
            if (context == "lower") {
                return "Assembly";
            }else{
                return "Senate";
            };
        });
    }

    // embed function
    function embedBox() {
        var embed_url = 'http://projects.scpr.org/static/maps/election-day-voting-issues/iframe.html';
        jAlert('<h4>Embed this on your site or blog</h4>' +
        '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"620px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    }