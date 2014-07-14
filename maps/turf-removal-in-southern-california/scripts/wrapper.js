(function(){
    window.appConfig = {

        // general configs
        open_about_this: true,
        comments: true,
        project_root: "http://projects.scpr.org/static/maps/turf-removal-in-southern-california",
        embed_this: true,
        is_embedded: false,
        embed_width: "100%",
        embed_height: "1650px",
        twitter_share_text: "Map: View a breakdown of turf removal in Southern California zip codes",

        // map configs
        initial_map_zoom: 10,
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

            // sets template path
            if (window.location.href.indexOf("http://projects.scpr.org/") > -1){
                window.wrapperTemplatePath = "http://projects.scpr.org/static/static-files/v3-dependencies/templates/"
            } else {
                window.wrapperTemplatePath = "/2kpcc/static-projects/static-files/v3-dependencies/templates/"
            };

            // sets embed options
            if (window.location.href.indexOf("embed") > -1){
                window.appConfig.open_about_this = false;
                window.appConfig.comments = false;
                window.appConfig.is_embedded = true;
            };

            // set params for mobile devices
            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                window.appConfig.open_about_this = false;
                window.appConfig.comments = false;
                window.appConfig.initial_map_zoom = 7;
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

            if (window.appConfig.is_embedded === true){
                $(".data-comments").remove();
                $(".buttons a:last").before("<a class='btn btn-primary' href='" + window.appConfig.project_root + "' target='_blank'><span class='glyphicon glyphicon-resize-full'></span> New window</a>");
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