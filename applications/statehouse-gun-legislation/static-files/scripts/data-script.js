    var jqueryNoConflict = jQuery;
    var fn = fn || {};

    // begin data configuration object
    var fn = {

        targetBillId: null,

        // initialize our tabletop object
        initializeTabletopDataSource: function(){
            Tabletop.init({
                key: '0Aq8qwSArzKP9dGlidnhTaEJuWXRQTWNjQWtIVjdXOFE',
                callback: fn.getIdOfBillContainer,
                parseNumbers: true,
                simpleSheet: false,
                debug: false
            });
        },

        // get the id of a bill container on click
        getIdOfBillContainer: function(data){
            jqueryNoConflict('.item').click(function(){
                fn.targetBillId = jqueryNoConflict(this).attr('id');
                fn.constructOpenStatesQuery(fn.targetBillId);
                jqueryNoConflict('#reporter-summary').waitUntilExists(function(){
                    fn.compareBillIdToTabletopData(data, fn.targetBillId);
                    contentDisplay.scrollIntoView(true);
                });

            });
        },

        // construct the url to query for data
        constructOpenStatesQuery: function(billId){
            var urlPrefix = 'http://openstates.org/api/v1/bills/ca/20132014/';
            var urlSuffix = '/?apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?';
            var targetUrl = urlPrefix + billId + urlSuffix;
            fn.retriveOpenStatesData(targetUrl);
        },

        // grab data
        retriveOpenStatesData: function(targetUrl) {
            jqueryNoConflict.getJSON(targetUrl, fn.renderHandlebarsDisplayTemplate);
        },

        // render content display template
        renderHandlebarsDisplayTemplate: function(data){
            renderHandlebarsTemplate('static-files/templates/content-display.handlebars', '#contentDisplay', data);
            var arrayOfLegiSponsors = data.sponsors;
            fn.processLegislationSponsorArray(arrayOfLegiSponsors);
        },

        processLegislationSponsorArray: function(arrayOfSponsors){
            for(var x=0; x<arrayOfSponsors.length; x++){

                var displayType = toTitleCase(arrayOfSponsors[x].type);

                jqueryNoConflict.getJSON('http://openstates.org/api/v1/legislators/' + arrayOfSponsors[x].leg_id + '?apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?', function(legiData){

                    var displayParty;

                    if (legiData.party === 'Democratic'){
                        displayParty = 'D';
                    } else {
                        displayParty = 'R';
                    }

                    var districtOfficeCheck = _.has(legiData, '+district_offices');
                    var displayCity;
                    if (districtOfficeCheck === true){
                        displayCity = legiData['+district_offices'][0].city;
                    } else {
                        displayCity = ' ';
                    }

                    jqueryNoConflict('#legi-sponsors').append('<li><strong>' + displayType + '</strong>:<br />' + legiData.full_name + ' (' + displayParty + ' - ' + displayCity + ')</li>');

                });

            }

        },

        // run the comparsion on actual bill and target bill
        compareBillIdToTabletopData: function(data, TestBillId){
            for(var i=0; i<data.working_data.elements.length; i++){
                var formattedTableTopTitle = data.working_data.elements[i].shorttitle;
                var formattedTableTopSummaryText = data.working_data.elements[i].juliessummary;
                var formattedTableTopLegislationStatus = data.working_data.elements[i].legislationstatus;
                var formattedTableTopBillId = data.working_data.elements[i].billid.replace(/\s/g, "%20");
                if (TestBillId === formattedTableTopBillId){
                    fn.writeTableTopData('#reporter-title', formattedTableTopTitle);
                    fn.writeTableTopData('#reporter-summary', formattedTableTopSummaryText);
                    fn.writeTableTopData('#legislation-status', formattedTableTopLegislationStatus);
                }
            }
        },

        writeTableTopData: function(elementSelector, data){
            jqueryNoConflict(elementSelector).html(data);
        },

        backToTop: function(){
            var position = $('#data-legend-items').position();
            scroll(0,position.top);
        }

    }
    // end configuration object

    // isotope function to animate the containers
    function animateContainers(){
        var container = jqueryNoConflict('#bill-container');
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

    function toTitleCase(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    // embed function
    function embedBox() {
        var embed_url = 'http://projects.scpr.org/maps/election-day-voting-issues/iframe.html';
        jAlert('<h4>Embed this on your site or blog</h4>' +
        '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"620px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    }

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        fn.initializeTabletopDataSource();
        animateContainers();
        runHandlebarsHelpers();
    });