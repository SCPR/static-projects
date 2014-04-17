// create basic object to house application
(function(){
    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
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

    window.appConfig = {
        openAboutThis: false,
        embed_this: true,
        embed_url_root: 'http://localhost:8880/2kpcc/static-projects/test/keller/working-rent-map/',
    };

    window.renderEmbedBox = function(){
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page. You may need to adjust the height parameter. <br /><br /> &lt;iframe src=\"'+ appConfig.embed_url_root +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    };

    $(function(){
        window.router = new App.Router();
        Backbone.history.start({
            root: 'http://localhost:8880/2kpcc/static-projects/test/keller/working-rent-map/',
            pushState: false,
        });

        if (window.appConfig.embed_this === false){
            $('li.projects-embed').addClass('hidden');
        };

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

    });

})();