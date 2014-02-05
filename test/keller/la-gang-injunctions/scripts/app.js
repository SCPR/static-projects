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

    $(function(){
        window.router = new App.Router();
        Backbone.history.start({
            root: 'http://localhost:8880/2kpcc/static-projects/test/keller/la-gang-injunctions/',
            pushState: false,
        });
    });

})();
