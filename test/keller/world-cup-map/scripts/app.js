var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function(){
    initializeDisplay(venueData);
});

function initializeDisplay(array){
    jqueryNoConflict("#content-intro").html(
        "<h1>Xxxxx xxxx</h1>" +
        "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ipsum libero, consectetur at libero non, viverra mattis nunc. Cras nec ipsum ullamcorper, accumsan justo sit amet.</p>"
    );

    var arrayOfNations = _.uniq(_.collect(array, function(x){
        return x.nation;
    }));

    jqueryNoConflict("#team-selection").empty();

    for (var i=0; i<arrayOfNations.length; i++) {
        jqueryNoConflict("#team-selection").append(
                "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>" +
                    "<a id='" + arrayOfNations[i] + "' href='javascript:void(0)'><img class='flag' src='img/" + arrayOfNations[i] + ".jpg'></a>" +
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
    jqueryNoConflict(".carousel-indicators").empty();
    jqueryNoConflict(".carousel-inner").empty();

    for (var i=0; i<matchingCountryData.length; i++) {

        jqueryNoConflict(".carousel-indicators").append(
            "<li data-target='#venue-carousel' data-slide-to='" + [i] + "' class=''></li>");

        var mainDisplay = _.template(
            "<div class='item'>" +
                "<div class='container'>" +
                    "<h5 class='kicker'><%= nation %></h5>" +
                    "<img class='main-flag' src='img/<%= nation %>.jpg'>" +
                    "<div class='carousel-caption'>" +
                        "<h5><%= venue %></h5>" +
                        "<p><%= streetaddress %><br><%= city %>, <%= state %>, <%= zip %><br><%= phone %></p>" +
                        "<div class='buttons btn-group btn-group-justified'>" +
                            "<a id='venuebutton' class='btn btn-primary' href='javascript:void(0)'><span class='glyphicon glyphicon-link'></span> Venue</a>" +
                            "<a id='teambutton'class='btn btn-primary' href='javascript:void(0)'><span class='glyphicon glyphicon-link'></span> Team</a>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                "<div id='details-display'>" +
                                    "<p><strong>About this venue</strong>: <%= notes %></p>" +
                                    "<img src='http://maps.googleapis.com/maps/api/staticmap?center=<%= latitude %>,<%= longitude %>&zoom=12&size=300x300&markers=color:red%7C<%= latitude %>,<%= longitude %>&sensor=false&key=AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8'>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                                "<div id='team-display' class='hidden'>" +
                                    "<p><strong>World Cup slogan</strong>: <%= officialslogan %></p>" +
                                    "<p><strong>Team colors</strong>: <%= dress %></p>" +
                                    "<p><strong>Game dates</strong>: <%= gamedates %></p>" +
                                    "<iframe width='100%' src='<%= songcheer %>' frameborder='0' allowfullscreen></iframe>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>", matchingCountryData[i]);

        jqueryNoConflict(".carousel-inner").append(mainDisplay);

    };

    $(".carousel-indicators li").first().addClass("active");
    $(".carousel-inner .item").first().addClass("active");


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

        jqueryNoConflict(".carousel-indicators").empty();

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
