(function(){

    window.appConfig = {

        // general configs
        open_about_this: true,
        comments: true,
        isMobile: false,
        project_root: "http://projects.scpr.org/static/maps/california-cases-of-whooping-cough-by-county",
        embed_this: true,
        embed_width: "100%",
        embed_height: "1650px",
        twitter_share_text: "Map: View a county-by-county breakdown of whooping cough cases in California so far in 2014",

        // map configs
        initial_map_zoom: 7,
        //map_center_los_angeles: new L.LatLng(34.061841979429445, -118.26370239257812),
        //map_center_listening_area: new L.LatLng(34.000304, -118.238039),
        map_center_california: new L.LatLng(37.335194502529724, -119.366455078125),
        //map_center_united_states: new L.LatLng(38.134557,-98.349609)
    };

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    // load external templates via ajax
    window.template = function(url){
        var data = "<h1> failed to load url : " + url + "</h1>";
        $.ajax({
            async: false,
            dataType: "text",
            url: url,
            success: function(response) {
                data = response;
            }
        });
        return data;
    };

    App.Views.ApplicationWrapper = Backbone.View.extend({

        el: "body",

        initialize: function(){

            // checks url to see if we're live
            var urlLink = window.location.href;

            // sets template path
            if (urlLink.indexOf("http://projects.scpr.org/") > -1){
                window.wrapperTemplatePath = "http://projects.scpr.org/static/static-files/v3-dependencies/templates/"
            } else {
                window.wrapperTemplatePath = "/2kpcc/static-projects/static-files/v3-dependencies/templates/"
            };

            // sets embed options
            if (urlLink.indexOf("embed") > -1){
                window.appConfig.open_about_this = false;
                window.appConfig.comments = false;
                $(".data-comments").remove();
            };

            // set params for mobile devices
            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                window.appConfig.open_about_this = false;
                window.appConfig.isMobile = true;
                window.appConfig.initial_map_zoom = 1;
            };

            // checks comments setting
            if (window.appConfig.comments === true){
                var disqus_shortname = 'kpcc-projects';
                var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(dsq);
            } else {
                $(".data-comments").remove();
            };

            this.render();

        },

        events: {
            "click li.projects-embed a": "renderEmbedBox",
        },

        renderEmbedBox: function(){
            jAlert("<h4>Embed this on your site or blog</h4><span>Copy this code and paste to source of your page. You may need to adjust the height parameter.<br /><br /><textarea>&lt;iframe src='" + window.appConfig.project_root + "?=embed/' width='" + appConfig.embed_width + "' height='" + appConfig.embed_height + "' style='margin: 0 0 0 0;' scrolling='no' frameborder='0'&gt;&lt;/iframe></textarea>");
        },

        render: function(){

            $(".kpcc-header").html(_.template(template(window.wrapperTemplatePath + "kpcc-header.html"), {
                "encoded_share_url": encodeURIComponent(window.appConfig.project_root),
                "twitter_share_text": window.appConfig.twitter_share_text
            }));

            $(".data-details").html(_.template(template("templates/data-details.html")));

            $(".kpcc-footer").html(_.template(template(window.wrapperTemplatePath + "kpcc-footer.html")));

            if (window.appConfig.open_about_this === true){
                $('.text').collapse('show');
            };

            if (window.appConfig.embed_this === false){
                $('li.projects-embed').addClass('hidden');
            }

            $('.text').on('shown.bs.collapse', function(){
                $('span.text').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            });

            $('.text').on('hidden.bs.collapse', function(){
                $('span.text').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
            });

            $('.about').on('shown.bs.collapse', function(){
                $('span.about').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            });

            $('.about').on('hidden.bs.collapse', function(){
                $('span.about').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
            });

        }
    });

    $(function(){
        window.app = new App.Router();
        Backbone.history.start({
            root: window.appConfig.project_root,
            pushState: false,
        });
    });
})();