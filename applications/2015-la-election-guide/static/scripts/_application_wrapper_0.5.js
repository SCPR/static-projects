(function(){

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    App.Views.ApplicationWrapper = Backbone.View.extend({

        el: "body",

        initialize: function(){

            // sets window size
            window.appConfig.windowSize = $(window).width();

            // sets embed options
            if (window.location.href.indexOf("embed") > -1){
                window.appConfig.open_about_this = false;
                window.appConfig.comments = false;
                window.appConfig.is_embedded = true;
            };

            // set params for mobile devices
            window.appConfig.is_mobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) || (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/) || (window.appConfig.windowSize < 568));

            if (window.appConfig.is_mobile) {
                window.appConfig.open_about_this = false;
                window.appConfig.comments = false;
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
            if (window.appConfig.open_about_this === true){
                $(".about").collapse("show");
            };

            if (window.appConfig.embed_this === false){
                $("li.projects-embed").addClass("hidden");
            }

            if (window.appConfig.is_embedded === true){
                $(".data-comments").remove();
                $(".buttons a:last").before("<a class='btn btn-primary' href='" + window.appConfig.project_root + "' target='_blank'><span class='glyphicon glyphicon-resize-full'></span> New window</a>");
            }

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
        window.app = new App.Router();
        Backbone.history.start({
            root: window.appConfig.project_root,
            pushState: false,
        });
    });

    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },
    });

    // helper functions
    window.percentifyValue = function(value){
        var value = value * 100
        return parseFloat(value.toFixed(2));
    };

    window.toFixedPercent = function(part, whole){
        var targetValue = part / whole;
        var decimal = parseFloat(targetValue);
        return decimal
    };

    window.addCommas = function(nStr){
        nStr += "";
        x = nStr.split(".");
        x1 = x[0];
        x2 = x.length > 1 ? "." + x[1] : "";
            var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, "$1" + "," + "$2");
                }
            return x1 + x2;
    };

    window.ifEmptyStringForTotal = function(value){
        var result;
        if (value === ""){
            result = "Total not available";
        } else {
            result = window.addCommas(value);
        }
        return result;
    };

    String.prototype.truncateToGraf = function(){
        var lengthLimit = 900;
        if (this.length > lengthLimit){
            return this.substring(0, lengthLimit) + " ... ";
        } else {
            return this;
        }
    };

    String.prototype.toProperCase = function(){
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

})();