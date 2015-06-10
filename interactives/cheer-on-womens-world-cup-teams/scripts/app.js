var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function(){

    initializeDisplay(venueData);

    // set params for mobile devices
    if (navigator.userAgent.match(/(iPad)/i)) {
        //$("navbar-right").addClass("hidden");
    } else if (navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i)) {
        //$("navbar-right").addClass("hidden");
    } else {

    };

});

function initializeDisplay(array){
    jqueryNoConflict("#content-intro").html(
        "<h3>Women's World Cup 2015: Where to watch your team</h3>" +
        "<p><span class='credits'>Produced by Taylor Haney &amp; <a href='http://www.scpr.org/about/people/staff/chris-keller'>Chris Keller</a></span> | <span class='pubdate'>Published June 9, 2015</span></p>" +
        "<p>World Cup matches start up this week, and whether you're a fan of a specific country's team or just want to experience the \"beautiful game\" with those who are, we've curated a list of places to catch the 2015 Women's World Cup in Southern California, the nation's most diverse region. Is your favorite spot missing? <a href='mailto:scprweb@scpr.org?Subject=World Cup 2015: Where to watch your country’s team' target='_top'>Let us know.</a></p>"
    );

    var arrayOfNations = _.uniq(_.collect(array, function(x){
        return x.nation;
    }));

    jqueryNoConflict("#team-selection").empty();

    for (var i=0; i<arrayOfNations.length; i++) {
        jqueryNoConflict("#team-selection").append(
                "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>" +
                    "<a id='" + arrayOfNations[i] + "' href='javascript:void(0)' title='" + arrayOfNations[i] + "'><img class='flag' src='img/" + arrayOfNations[i] + ".jpg'></a>" +
                "</div>"
        );
    };

    $("#team-selection a").click(function(){
        var id = jqueryNoConflict(this).attr('id');
        var matchingCountryData = _.where(venueData, {nation: id});
        displayVenueData(id, matchingCountryData);
    });
}

function displayVenueData(id, matchingCountryData){
    jqueryNoConflict("#content-intro").remove();
    jqueryNoConflict("#team-selection").remove();
    jqueryNoConflict("#reset-teams").removeClass("hidden");
    jqueryNoConflict(".pagination").empty();
    jqueryNoConflict(".carousel-inner").empty();

    for (var i=0; i<matchingCountryData.length; i++) {

        var resultIndex = i + 1;

        if (matchingCountryData.length > 1){

            jqueryNoConflict(".pagination").append(
                "<li data-target='#venue-carousel' data-slide-to='" + i + "' class=''><a href='javascript:void(0)'>" + resultIndex + "</a></li>");

            var mainDisplay = _.template(
                "<div class='item'>" +
                    "<div class='container'>" +
                        "<h5 class='kicker'><%= nation %></h5>" +
                        "<img class='main-flag' src='img/<%= nation %>.jpg'>" +
                        "<div class='carousel-caption'>" +
                            "<h5><%= venue %></h5>" +
                            "<p><%= streetaddress %><br><%= city %>, <%= state %>, <%= zip %><br><a href='tel:<%= phone %>'><%= phone %></a>" +
                            "<% if (website === ''){ %>" +
                            "<% } else { %>" +
                                "&nbsp;&nbsp;&nbsp;<a href='<%= website %>' target='_top'>Website</a>" +
                            "<% } %>" +
                            "</p>" +
                            "<div class='buttons toggle-buttons btn-group btn-group-justified'>" +
                                "<a id='venuebutton' class='btn btn-primary' href='javascript:void(0)'> About</a>" +
                                "<a id='teambutton'class='btn btn-primary' href='javascript:void(0)'> Team <%= nation %></a>" +
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                    "<div id='details-display'>" +
                                        "<p><%= notes %></p>" +
                                        "<p class='center'><strong>Click the map below to get directions</strong></p>" +
                                        "<a href='https://www.google.com/maps/@<%= latitude %>,<%= longitude %>,16z' ><img src='http://maps.googleapis.com/maps/api/staticmap?center=<%= latitude %>,<%= longitude %>&zoom=13&size=300x300&markers=color:red%7C<%= latitude %>,<%= longitude %>&sensor=false&key=AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8'></a>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                    "<div id='team-display' class='hidden'>" +
                                        //"<p class='center'><strong><%= officialslogan %></strong></p>" +
                                        "<p><a href='<%= fifapage %>' target='_top'><%= nation %>'s</a> team colors are <%= dress %>. The team will play in <%= group %> during the 2015 World Cup.</p>" +
                                        "<p><strong>Game dates</strong>: <%= gamedates %></p>" +
                                        //"<div class='aspect-ratio'>" +
                                            //"<iframe width='100%' src='<%= songcheer %>' frameborder='0' allowfullscreen></iframe>" +
                                        //"</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>", matchingCountryData[i]);

            jqueryNoConflict(".carousel-inner").append(mainDisplay);

            $(".carousel-inner .item").first().addClass("active");

        } else {

            var mainDisplay = _.template(
                "<div class='item'>" +
                    "<div class='container'>" +
                        "<h5 class='kicker'><%= nation %></h5>" +
                        "<img class='main-flag' src='img/<%= nation %>.jpg'>" +
                        "<div class='carousel-caption'>" +
                            "<h5><%= venue %></h5>" +
                            "<p><%= streetaddress %><br><%= city %>, <%= state %>, <%= zip %><br><%= phone %>" +
                            "<% if (website === ''){ %>" +
                            "<% } else { %>" +
                                "&nbsp;&nbsp;&nbsp;<a href='<%= website %>' target='_top'>Website</a>" +
                            "<% } %>" +
                            "</p>" +
                            "<div class='buttons toggle-buttons btn-group btn-group-justified'>" +
                                "<a id='venuebutton' class='btn btn-primary' href='javascript:void(0)'> About</a>" +
                                "<a id='teambutton'class='btn btn-primary' href='javascript:void(0)'> Team <%= nation %></a>" +
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                    "<div id='details-display'>" +
                                        "<p><%= notes %></p>" +
                                        "<p class='center'><strong>Click the map below to find directions</strong></p>" +
                                        "<a href='https://www.google.com/maps/@<%= latitude %>,<%= longitude %>,16z' ><img src='http://maps.googleapis.com/maps/api/staticmap?center=<%= latitude %>,<%= longitude %>&zoom=13&size=300x300&markers=color:red%7C<%= latitude %>,<%= longitude %>&sensor=false&key=AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8'></a>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                    "<div id='team-display' class='hidden'>" +
                                        //"<% if (officialslogan === ''){ %>" +
                                        //"<% } else { %>" +
                                            //"<p class='center'><strong><%= officialslogan %></strong></p>" +
                                        //"<% } %>" +
                                        "<p><a href='<%= fifapage %>' target='_top'><%= nation %>'s</a> team colors are <%= dress %>. The team will play in <%= group %> during the 2015 World Cup.</p>" +
                                        "<p><strong>Game dates</strong>: <%= gamedates %></p>" +
                                        //"<% if (songcheer === ''){ %>" +
                                        //"<% } else { %>" +
                                            //"<div class='aspect-ratio'>" +
                                                //"<iframe width='100%' src='<%= songcheer %>' frameborder='0' allowfullscreen></iframe>" +
                                            //"</div>" +
                                        //"<% } %>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>", matchingCountryData[i]);

            jqueryNoConflict(".carousel-inner").append(mainDisplay);
            jqueryNoConflict(".carousel-inner .item").first().addClass("active");
        }
    };

    toggleDisplays();

    resetApplication();

    jqueryNoConflict("#venue-carousel").on('slid', function(){
        toggleDisplays();
    });

};

function toggleDisplays(){
    var targetButtons = jqueryNoConflict(".carousel-inner .active .toggle-buttons").find("a")
    jqueryNoConflict(targetButtons).on("click", function(){
        var detailsDisplay = jqueryNoConflict(".carousel-inner .active").find("#details-display");
        var teamDetails = jqueryNoConflict(".carousel-inner .active").find("#team-display");
        var id = $(this).attr('id');
        if (id === "venuebutton"){
            jqueryNoConflict(detailsDisplay).removeClass("hidden");
            jqueryNoConflict(teamDetails).addClass("hidden");
        } else {
            jqueryNoConflict(detailsDisplay).addClass("hidden");
            jqueryNoConflict(teamDetails).removeClass("hidden");
        }
    });
};

function renderEmbedBox(){
    jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page. You may need to adjust the height parameter. <br /><br /> &lt;iframe src=\"http://projects.scpr.org/interactives/cheer-on-womens-world-cup-teams\" width=\"100%\" height=\"1055px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};

function resetApplication(){
    jqueryNoConflict("#reset-teams").on("click", "#navigationbutton", function(){
        jqueryNoConflict("#reset-teams").addClass("hidden");
        jqueryNoConflict(".pagination").empty();
        jqueryNoConflict(".carousel-inner").empty();
        if (jqueryNoConflict('#team-selection').length){
            initializeDisplay(venueData);
        } else {
            jqueryNoConflict("<div id='team-selection'></div>").insertBefore("#venue-carousel");
            initializeDisplay(venueData);
        }
        if (jqueryNoConflict('#content-intro').length){
            initializeDisplay(venueData);
        } else {
            jqueryNoConflict("<div id='content-intro'></div>").insertBefore("#team-selection");
            initializeDisplay(venueData);
        }
    });
};
