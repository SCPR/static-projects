    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },
        routes: {
            "": "renderApplicationVisuals",
        },
        renderApplicationVisuals: function(collection){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        }
    });

    App.Views.ApplicationVisuals = Backbone.View.extend({
        template: template("templates/data-visuals.html"),
        el: ".data-visuals",
        initialize: function(viewObject){
            $(".data-details").remove();
            this.render(viewObject);
        },
        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            var storymap_data = "data/published.json";
            var storymap_options = {};
            var storymap = new VCO.StoryMap("story-map-container", storymap_data, storymap_options);
            window.onresize = function(event) {
                storymap.updateDisplay();
            }
        },
    });
