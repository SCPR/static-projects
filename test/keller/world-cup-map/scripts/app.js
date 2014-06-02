var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

//begin main function
jqueryNoConflict(document).ready(function(){
    createMap();
    //initializeTemplates.renderStaticTemplates();
});

// application configuration object
var appConfig = {
    openAboutThis: false,
    embed_this: false,
    embed_url_root: null
};

// begin function
function createMap() {
    var locationColumn = 'geocode_address';
    var tableID = '1Zyd01azLsZrT9LB___7T4DO_P8GQ7Tga-930TKjl';
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new
        google.maps.LatLng(34.16589048389459,-118.2683405195312),
        zoom: 10,
        scrollwheel: false,
        draggable: true,
        mapTypeControl: false,
        navigationControl: true,
        streetViewControl: false,
        panControl: false,
        scaleControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_TOP}
    });

    // Initialize ft layer
    var  layer = new google.maps.FusionTablesLayer({
        map: map,
        query: {
            select: "col5",
            from: "1Zyd01azLsZrT9LB___7T4DO_P8GQ7Tga-930TKjl",
            where: ""
        },
        options: {
            styleId: 2,
            templateId: 3,
            suppressInfoWindows: true,
        }
    });

    google.maps.event.addListener(layer, 'click', function(e) {

        var fusionTableObject = {
            venue: e.row['VENUE'].value,
            street_address: e.row['STREET ADDRESS'].value,
            city: e.row['CITY'].value,
            state: e.row['STATE'].value,
            zip: e.row['ZIP'].value,
            geocode_address: e.row['geocode_address'].value,
            phone: e.row['PHONE'].value,
            nation: e.row['NATION'].value,
            visual_assets: e.row['VISUAL ASSETS'].value,
            food: e.row['FOOD'].value,
            drink: e.row['DRINK'].value,
            song: e.row['SONG/CHEER'].value,
            official_slogan: e.row['OFFICIAL SLOGAN'].value,
            dress: e.row['DRESS'].value,
            nearby_attractions: e.row['NEARBY ATTRACTIONS'].value,
            photos: e.row['PHOTOS'].value,
            audio_options: e.row['AUDIO OPTIONS'].value,
            notes: e.row['NOTES'].value,
            game_dates: e.row['GAME DATES'].value
        }

        var leftDisplay = _.template(
            "<div class='row'>" +
                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                    "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>" +
                        "<div class='teaminfo'>" +
                            "<img class='flag' src='img/<%= nation %>.jpg'>" +
                        "</div>" +
                    "</div>" +
                    "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10'>" +
                        "<h2><%= venue %> (<%= nation %>)</h2>" +
                        "<p><%= street_address %><br><%= city %>, <%= state %>, <%= zip %><br><%= phone %></p>" +
                    "</div>" +
                    "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                        "<p><strong>About <%= venue %></strong>: <%= notes %></p>" +
                        "<p><strong>World Cup slogan</strong>: <%= official_slogan %></p>" +
                        "<p><strong>Team colors</strong>: <%= dress %></p>" +
                        "<p><strong>Game dates</strong>: <%= game_dates %></p>" +
                    "</div>" +
                "</div>" +
            "</div>", fusionTableObject);

        var rightDisplay = _.template(
                "<div id='video'>" +
                    "<iframe width='600' height='315' src='<%= song %>' frameborder='0' allowfullscreen></iframe>" +
                "</div>", fusionTableObject);

        jqueryNoConflict("#intro-display").empty();
        jqueryNoConflict("#left-display").html(leftDisplay);
        jqueryNoConflict("#right-display").html(rightDisplay);

    });

    $("#back").click (function(){
        $("#info").html(
            "<div class='banner' id='a'><img class='flag' src='img/Argentina.jpg'></div><div class='banner id='b'><img class='flag' src='img/Brazil.jpg'></div><div class='banner' id='c'><img class='flag' src='img/Colombia.jpg'></div><div class='banner' id='d'><img class='flag' src='img/England.jpg'></div><div class='banner' id='e'><img class='flag' src='img/France.jpg'></div>"
        )
    });

};
// end function

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