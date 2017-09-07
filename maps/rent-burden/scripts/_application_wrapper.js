(function(){

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
            if (window.location.href.indexOf("https://projects.scpr.org/") > -1) {
                window.wrapperTemplatePath = "https://projects.scpr.org/static-files/v3-dependencies/templates/"
            } else if (window.location.href.indexOf("https://projects.scpr.org/") > -1) {
                window.wrapperTemplatePath = "https://projects.scpr.org/static-files/v3-dependencies/templates/"
            }
            else {
                window.wrapperTemplatePath = "/static-projects/static-files/v3-dependencies/templates/"
            };

            // sets window size
            window.appConfig.windowSize = $(window).width();

            // sets desktop default options
            window.appConfig.open_about_this = true;

            // sets embed options
            if (window.location.href.indexOf("embed") > -1){
                window.appConfig.open_about_this = true;
                window.appConfig.comments = false;
                window.appConfig.is_embedded = true;
            };

            // set params for mobile devices
            window.appConfig.is_mobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) || (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/) || (window.appConfig.windowSize < 568));

            if (window.appConfig.is_mobile) {
                window.appConfig.open_about_this = true;
                window.appConfig.comments = false;
                window.appConfig.initial_map_zoom = 9;
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
            "click li.projects-embed a": "renderEmbedBox"
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
                $(".text").collapse("show");
            };

            if (window.appConfig.embed_this === false){
                $("li.projects-embed").addClass("hidden");
            }

            if (window.appConfig.is_embedded === true){
                $(".data-comments").remove();
                $(".buttons a:last").before("<a class='btn btn-primary' href='" + window.appConfig.project_root + "' target='_blank'><span class='glyphicon glyphicon-resize-full'></span> New window</a>");
            }

            $(".text").on("shown.bs.collapse", function(){
                $("span.text")
                    .removeClass("glyphicon-chevron-down")
                    .addClass("glyphicon-chevron-up")
                    .css("height", "auto");
            });

            $(".text").on("hidden.bs.collapse", function(){
                $("span.text")
                    .removeClass("glyphicon-chevron-up")
                    .addClass("glyphicon-chevron-down")
                    .css("height", "auto");
            });

            $(".about").on("shown.bs.collapse", function(){
                $("span.about")
                    .removeClass("glyphicon-chevron-down")
                    .addClass("glyphicon-chevron-up")
                    .css("height", "auto");
            });

            $(".about").on("hidden.bs.collapse", function(){
                $("span.about")
                    .removeClass("glyphicon-chevron-up")
                    .addClass("glyphicon-chevron-down")
                    .css("height", "auto");
            });
        }
    });

    $(function(){
        window.app = new App.Router();
        Backbone.history.start({
            root: window.appConfig.project_root,
            pushState: false
        });
    });

})();
