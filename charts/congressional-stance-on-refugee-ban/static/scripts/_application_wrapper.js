(function(){

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    // load external templates via ajax
    // window.template = function(url){
    //     var data = "<h1> failed to load url : " + url + "</h1>";
    //     $.ajax({
    //         async: false,
    //         dataType: "text",
    //         url: url,
    //         success: function(response) {
    //             data = response;
    //         }
    //     });
    //     return data;
    // };

    App.Views.ApplicationWrapper = Backbone.View.extend({

        el: ".header-links",

        initialize: function(config){

            // sets window size
            config.windowSize = $(window).width();

            // sets embed options
            if (window.location.href.indexOf("embed") > -1){
                config.open_about_this = false;
                config.comments = false;
                config.is_embedded = true;
            };

            // set params for mobile devices
            if (navigator.userAgent.match(/android/i)){
                config.is_mobile = true;
                config.userAgent = navigator.userAgent;
            } else if (navigator.userAgent.match(/Blackberry/i)){
                config.is_mobile = true;
                config.userAgent = navigator.userAgent;
            } else if (navigator.userAgent.match(/iPhone|iPod/i)){
                config.is_mobile = true;
                config.userAgent = navigator.userAgent;
            } else if (navigator.userAgent.match(/iPad/i)){
                config.is_mobile = true;
                config.userAgent = navigator.userAgent;
            } else if (navigator.userAgent.match(/Opera Mini/i)){
                config.is_mobile = true;
                config.userAgent = navigator.userAgent;
            } else if (navigator.userAgent.match(/IEMobile/i)){
                config.is_mobile = true;
                config.userAgent = navigator.userAgent;
            } else if (navigator.userAgent.match(/webOS/i)){
                config.is_mobile = true;
                config.userAgent = navigator.userAgent;
            } else if (config.windowSize < 568){
                config.is_mobile = true;
                config.userAgent = navigator.userAgent;
            } else {
                config.is_mobile = false;
                config.userAgent = navigator.userAgent;
            };

            if (config.is_mobile === true) {
                config.open_about_this = false;
                config.comments = false;
                config.embed_this = false;
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

            this.render(config);

        },

        events: {
            "click li.projects-embed a": "renderEmbedBox",
        },

        renderEmbedBox: function(){
            var _config = window.appConfig.config_object;
            alert("<h4>Embed this on your site or blog</h4><span>Copy this code and paste to source of your page. You may need to adjust the height parameter.<br /><br /><textarea>&lt;iframe src='" + _config.app_root + "?=embed/' width='" + _config.embed_width + "' height='" + _config.embed_height + "' style='margin: 0 0 0 0;' scrolling='no' frameborder='0'&gt;&lt;/iframe></textarea>");
        },

        render: function(config){

            if (config.open_about_this === true){
                $(".about").collapse("show");
            };

            if (config.embed_this === false){
                $("li.projects-embed").addClass("hidden");
            }

            if (config.is_embedded === true){
                $(".data-comments").remove();
                $(".buttons a:last").before("<a class='btn btn-primary' href='" + config.project_root + "' target='_blank'><span class='glyphicon glyphicon-resize-full'></span> New window</a>");
            }

            $(".kpcc-header a.facebook").prop("href", encodeURIComponent("https://www.facebook.com/sharer/sharer.php?u=" + config.app_root));

            $(".kpcc-header a.twitter").prop("href", "http://twitter.com/share?text=" + config.twitter_share_text + "&url=" + config.twitter_url);

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

            $(".sources").on("shown.bs.collapse", function(){
                $("span.sources")
                    .removeClass("glyphicon-chevron-down")
                    .addClass("glyphicon-chevron-up")
                    .css("height", "auto");
            });

            $(".sources").on("hidden.bs.collapse", function(){
                $("span.sources")
                    .removeClass("glyphicon-chevron-up")
                    .addClass("glyphicon-chevron-down")
                    .css("height", "auto");
            });
        }
    });

    $(function(){
        this.app_wrapper = new App.Views.ApplicationWrapper(window.appConfig.config_object);
        if (this.app_view){
            this.app_view.remove();
        };
        this.app_view = new App.Views.Application(window.appConfig.config_object);
    });

})();
