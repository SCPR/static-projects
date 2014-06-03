var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

//begin main function
jqueryNoConflict(document).ready(function(){
    initializeDisplay(venueData);
    //initializeTemplates.renderStaticTemplates();
});

// application configuration object
var appConfig = {
    openAboutThis: false,
    embed_this: false,
    embed_url_root: null
};

function initializeDisplay(array){
    for (var i=0; i<array.length; i++) {
        jqueryNoConflict("#venue-display").append("<p><a id='" + array[i].nation + "' href='javascript:void(0)'>" + array[i].nation + "</a></p>");
    };

    $("#venue-display a").click(function(){
        var id = jqueryNoConflict(this).attr('id');
        displayVenueData(id, venueData);
    });
}

function displayVenueData(id, venueData){
    var matchingCountryData = _.where(venueData, {nation: id});

    // here is an issue we need to work through...
    console.log(matchingCountryData);

    jqueryNoConflict("#venue-display").find("a").addClass("hidden");

    var mainDisplay = _.template(
        "<div class='row'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                "<h4 id='title'><%= nation %></h4>" +
                "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'>" +
                    "<img class='flag' src='img/<%= nation %>.jpg'>" +
                "</div>" +
                "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'>" +
                    "<h4><%= venue %></h4>" +
                    "<p><%= streetaddress %><br><%= city %>, <%= state %>, <%= zip %><br><%= phone %></p>" +
                "</div>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                "<div class='buttons btn-group btn-group-justified'>" +
                    "<a id='venuebutton' class='btn btn-primary' href='javascript:void(0)'><span class='glyphicon glyphicon-link'></span> Venue</a>" +
                    "<a id='teambutton'class='btn btn-primary' href='javascript:void(0)'><span class='glyphicon glyphicon-link'></span> Team</a>" +
                "</div>" +
            "</div>" +
        "</div>", matchingCountryData[0]);

    jqueryNoConflict("#venue-display").html(mainDisplay);

    venueDetails(matchingCountryData[0]);

    jqueryNoConflict("#venuebutton").live("click", function(){
        venueDetails(matchingCountryData[0]);
    });

    jqueryNoConflict("#teambutton").live("click", function(){
        teamDetails(matchingCountryData[0]);
    });

};

function venueDetails(arrayOfData){
    var venueDetails = _.template(
        "<div class='row'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                "<p><strong>About this venue</strong>: <%= notes %></p>" +
                "<img src='http://maps.googleapis.com/maps/api/staticmap?center=<%= latitude %>,<%= longitude %>&zoom=12&size=300x300&markers=color:red%7C<%= latitude %>,<%= longitude %>&sensor=false&key=AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8'>" +
            "</div>" +
        "</div>", arrayOfData);
    jqueryNoConflict("#details-display").html(venueDetails);
};

function teamDetails(arrayOfData){
    var teamDetails = _.template(
        "<div class='row'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                "<p><strong>World Cup slogan</strong>: <%= officialslogan %></p>" +
                "<p><strong>Team colors</strong>: <%= dress %></p>" +
                "<p><strong>Game dates</strong>: <%= gamedates %></p>" +
            "</div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                "<iframe width='100%' src='<%= songcheer %>' frameborder='0' allowfullscreen></iframe>" +
            "</div>" +
        "</div>", arrayOfData);
    jqueryNoConflict("#details-display").html(teamDetails);
};

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = "http://projects.scpr.org/static/static-files/v3-dependencies/templates/";
        renderHandlebarsTemplate(proxyPrefix + "kpcc-header.handlebars", ".kpcc-header");
        renderHandlebarsTemplate(proxyPrefix + "kpcc-footer.handlebars", ".kpcc-footer");
        renderHandlebarsTemplate("templates/data-share.handlebars", ".data-share");
        renderHandlebarsTemplate("templates/data-details.handlebars", ".data-details");

        var checkExist = setInterval(function() {

            if (jqueryNoConflict(".header-links").length) {
                clearInterval(checkExist);
                initializeTemplates.hideEmbedBox();
            }

            if (jqueryNoConflict(".buttons").length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);
    },

    hideEmbedBox: function(){
        if (appConfig.embed_this === false){
            jqueryNoConflict("li.projects-embed").addClass("hidden");
        };
    },

    renderEmbedBox: function(){
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page. You may need to adjust the height parameter. <br /><br /> &lt;iframe src=\"'+ appConfig.embed_url_root +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){
        jqueryNoConflict(".text").on("shown.bs.collapse", function(){
            jqueryNoConflict("span.text").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".text").on("hidden.bs.collapse", function(){
            jqueryNoConflict("span.text").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".about").on("shown.bs.collapse", function(){
            jqueryNoConflict("span.about").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".about").on("hidden.bs.collapse", function(){
            jqueryNoConflict("span.about").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
        });
        if (appConfig.openAboutThis === true){
            $(".text").collapse("show");
        };
    }
};
// end template rendering object