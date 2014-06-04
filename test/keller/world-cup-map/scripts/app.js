var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function(){
    initializeDisplay(venueData);
});

function initializeDisplay(array){
    jqueryNoConflict("#content-intro").html(
        "<h3>World Cup: Where to watch</h3>" +
        "<p>Whether you're a fan of a specific country's national team, or just want to soak up a new experience with those who are, we've compiled a list of places to catch the international flavor of the 2014 World Cup in the nation's most diverse city.</p>"
    );

    var arrayOfNations = _.uniq(_.collect(array, function(x){
        return x.nation;
    }));

    jqueryNoConflict("#team-selection").empty();

    for (var i=0; i<arrayOfNations.length; i++) {
        jqueryNoConflict("#team-selection").append(
                "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'>" +
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
                        "<h5 class='kicker'><%= nation %> (Showing " + resultIndex + " of " + matchingCountryData.length + ")</h5>" +
                        "<img class='main-flag' src='img/<%= nation %>.jpg'>" +
                        "<div class='carousel-caption'>" +
                            "<h5><%= venue %></h5>" +
                            "<p><%= streetaddress %><br><%= city %>, <%= state %>, <%= zip %><br><%= phone %><br><a href='<%= website %>' target='_top'>Website</a></p>" +
                            "<div class='buttons btn-group btn-group-justified'>" +
                                "<a id='venuebutton' class='btn btn-primary' href='javascript:void(0)'> About</a>" +
                                "<a id='teambutton'class='btn btn-primary' href='javascript:void(0)'> Team <%= nation %></a>" +
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                    "<div id='details-display'>" +
                                        "<p><%= notes %></p>" +
                                        "<p class='center'><strong>Click the map below to get directions</strong></p>" +
                                        "<a href='https://www.google.com/maps/place/<%= streetaddress %>/@<%= latitude %>,<%= longitude %>,16z' ><img src='http://maps.googleapis.com/maps/api/staticmap?center=<%= latitude %>,<%= longitude %>&zoom=12&size=300x300&markers=color:red%7C<%= latitude %>,<%= longitude %>&sensor=false&key=AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8'></a>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                    "<div id='team-display' class='hidden'>" +
                                        "<p><strong><%= officialslogan %></strong></p>" +
                                        "<p><a href='<%= fifapage %>' target='_top'><%= nation %>'s</a> team colors are <%= dress %> and will play in <%= group %> during the 2014 World Cup.</p>" +
                                        "<p><strong>Game dates</strong>: <%= gamedates %></p>" +
                                        "<div class='aspect-ratio'>" +
                                            "<iframe width='100%' src='<%= songcheer %>' frameborder='0' allowfullscreen></iframe>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>", matchingCountryData[i]);

            jqueryNoConflict(".carousel-inner").append(mainDisplay);

            //$(".pagination li").first().addClass("active");
            $(".carousel-inner .item").first().addClass("active");

        } else if (matchingCountryData.length < 1){

            console.log("outlier");

        } else {

            var mainDisplay = _.template(
                "<div class='item'>" +
                    "<div class='container'>" +
                        "<h5 class='kicker'><%= nation %></h5>" +
                        "<img class='main-flag' src='img/<%= nation %>.jpg'>" +
                        "<div class='carousel-caption'>" +
                            "<h5><%= venue %></h5>" +
                            "<p><%= streetaddress %><br><%= city %>, <%= state %>, <%= zip %><br><%= phone %><br>" +
                            "<% if (website === ''){ %>" +
                            "<% } else { %>" +
                                "<a href='<%= website %>' target='_top'>Website</a>" +
                            "<% } %>" +
                            "</p>" +
                            "<div class='buttons btn-group btn-group-justified'>" +
                                "<a id='venuebutton' class='btn btn-primary' href='javascript:void(0)'> About</a>" +
                                "<a id='teambutton'class='btn btn-primary' href='javascript:void(0)'> Team <%= nation %></a>" +
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                    "<div id='details-display'>" +
                                        "<p><%= notes %></p>" +
                                        "<p class='center'><strong>Click the map below to get directions</strong></p>" +
                                        "<a href='https://www.google.com/maps/place/<%= streetaddress %>/@<%= latitude %>,<%= longitude %>,16z' ><img src='http://maps.googleapis.com/maps/api/staticmap?center=<%= latitude %>,<%= longitude %>&zoom=12&size=300x300&markers=color:red%7C<%= latitude %>,<%= longitude %>&sensor=false&key=AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8'></a>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='row'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                    "<div id='team-display' class='hidden'>" +
                                        "<p><strong><%= officialslogan %></strong></p>" +
                                        "<p><a href='<%= fifapage %>' target='_top'><%= nation %>'s</a> team colors are <%= dress %> and will play in <%= group %> during the 2014 World Cup.</p>" +
                                        "<p><strong>Game dates</strong>: <%= gamedates %></p>" +
                                        "<div class='aspect-ratio'>" +
                                            "<iframe width='100%' src='<%= songcheer %>' frameborder='0' allowfullscreen></iframe>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>", matchingCountryData[i]);

            jqueryNoConflict(".carousel-inner").append(mainDisplay);
            $(".carousel-inner .item").first().addClass("active");
        }
    };

    jqueryNoConflict(".carousel-inner .active").on("click", "#venuebutton", function(){

        console.log(this);

        jqueryNoConflict("#team-display").addClass("hidden");
        jqueryNoConflict("#details-display").removeClass("hidden");

    });


    jqueryNoConflict(".carousel-inner .active").on("click", "#teambutton", function(){

        console.log(this);

        jqueryNoConflict("#details-display").addClass("hidden");
        jqueryNoConflict("#team-display").removeClass("hidden");

    });

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
