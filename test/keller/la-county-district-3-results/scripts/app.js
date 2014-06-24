(function(){

    window.appConfig = {
        testing: true,
        project_root: "http://projects.scpr.org/static/applications/",
        open_about_this: true,
        comments: false,
        embed_this: false,
        embed_width: "100%",
        embed_height: "850px",
        twitter_share_text: "This is a test"
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

    App.Router = Backbone.Router.extend({
        initialize: function(){
            console.log("router initialized");
        },

        routes: {
            "": "renderApplicationWrapper",
        },

        renderApplicationWrapper: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },
    });

    App.Views.ApplicationWrapper = Backbone.View.extend({

        el: ".kpcc-header",

        initialize: function(){

            // checks for testing environment
            if (window.appConfig.testing === true){
                window.wrapperTemplatePath = "/2kpcc/static-projects/static-files/v3-dependencies/templates/"
            } else {
                window.wrapperTemplatePath = "http://projects.scpr.org/static/static-files/v3-dependencies/templates/"
            }

            // checks embed settings
            if (window.appConfig.embed_this != true){
                $('li.projects-embed').addClass('hidden');
            }

            // checks url to see if its embedded
            var urlLink = window.location.href;
            if (urlLink.indexOf("embed") > -1){
                window.appConfig.openAboutThis = false;
                window.appConfig.comments = false;
                $(".data-comments").remove();
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

            // checks open the about this project pane
            if (window.appConfig.openAboutThis === true){
                $('.text').collapse('show');
            };

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

            this.render();

        },

        events: {
            "click li.projects-embed a": "renderEmbedBox",
        },

        popEmbedBox: function(){
            var embed_url_root = window.appConfig.project_root + "?=embed/";
            jAlert("<h4>Embed this on your site or blog</h4><span>Copy this code and paste to source of your page. You may need to adjust the height parameter.<br /><br /><textarea>&lt;iframe src='" + embed_url_root + "' width='" + appConfig.embed_width + "' height='" + appConfig.embed_height + "' style='margin: 0 3% 0 3%;' frameborder='no'&gt;&lt;/iframe></textarea>");
        },

        render: function(){
            $(".kpcc-header").html(_.template(template(window.wrapperTemplatePath + "kpcc-header.html"), {
                "encoded_share_url": encodeURIComponent(window.appConfig.project_root),
                "twitter_share_text": window.appConfig.twitter_share_text
            }));
            $(".kpcc-footer").html(_.template(template(window.wrapperTemplatePath + "kpcc-footer.html")));
        }
    });








    $(function(){
        window.app = new App.Router();
        Backbone.history.start({
            root: "http://localhost:8880/2kpcc/static-projects/test/keller/la-county-district-3-results/",
            pushState: false,
        });
    });
})();