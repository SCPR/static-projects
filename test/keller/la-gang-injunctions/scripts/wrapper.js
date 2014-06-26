(function(){

    window.appConfig = {
        testing: true,
        project_root: "http://projects.scpr.org/static/applications/",
        open_about_this: false,
        comments: false,
        embed_this: false,
        embed_width: "100%",
        embed_height: "850px",
        twitter_share_text: "This is a test",
        initial_zoom: 10
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

    $(function(){
        window.app = new App.Router();
        Backbone.history.start({
            root: window.appConfig.project_root,
            pushState: false,
        });
    });
})();