    var jqueryNoConflict = jQuery;
    var dataConfig = dataConfig || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        dataConfig.initializeTabletopDataSource();
        animateContainers();
        runHandlebarsHelpers();
    });


    // begin data configuration object
    var dataConfig = {

        targetBillId: null,

        // initialize our tabletop object
        initializeTabletopDataSource: function(){
            Tabletop.init({
                key: '0Aq8qwSArzKP9dGlidnhTaEJuWXRQTWNjQWtIVjdXOFE',
                callback: dataConfig.getIdOfBillContainer,
                parseNumbers: true,
                simpleSheet: false,
                debug: false
            });
        },

        // get the id of a bill container on click
        getIdOfBillContainer: function(data){
            jqueryNoConflict('.item').click(function(){

                dataConfig.targetBillId = jqueryNoConflict(this).attr('id');

                dataConfig.constructOpenStatesQuery(dataConfig.targetBillId);

                /* comparison function here? */
                jqueryNoConflict('#reporter-summary').waitUntilExists(function(){
                    dataConfig.compareBillIdToTabletopData(data, dataConfig.targetBillId);
                    contentDisplay.scrollIntoView(true);
                });

            });
        },

        // construct the url to query for data
        constructOpenStatesQuery: function(billId){
            var urlPrefix = 'http://openstates.org/api/v1/bills/ca/20132014/';
            var urlSuffix = '/?apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?';
            var targetUrl = urlPrefix + billId + urlSuffix;

            console.log(targetUrl);

            dataConfig.retriveOpenStatesData(targetUrl);
        },

        // grab data
        retriveOpenStatesData: function(targetUrl) {
            jqueryNoConflict.getJSON(targetUrl, dataConfig.renderHandlebarsDisplayTemplate);
        },

        // render content display template
        renderHandlebarsDisplayTemplate: function(data){
            renderHandlebarsTemplate('static-files/templates/content-display.handlebars', '#contentDisplay', data);
        },


        // run the comparsion on actual bill and target bill
        compareBillIdToTabletopData: function(data, TestBillId){

            for(var i=0; i<data.working_data.elements.length; i++){

                var formattedTableTopSummaryText = data.working_data.elements[i].juliessummary;
                var formattedTableTopBillId = data.working_data.elements[i].billid.replace(/\s/g, "%20");

                if (TestBillId === formattedTableTopBillId){
                    console.log(TestBillId + ' = ' + formattedTableTopSummaryText);
                    dataConfig.writeTableTopData(formattedTableTopSummaryText);
                }
            }
        },

        writeTableTopData: function(data){
            jqueryNoConflict('#reporter-summary').html(data);
        },

        backToTop: function(){
            window.scrollTo(0,0);
        }

    }
    // end configuration object

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