


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
            var checkExist = setInterval(function() {
                if ($(".vco-menubar").length > 0){
                    clearInterval(checkExist);
                    $(".vco-menubar").append(
                        "<span class='vco-menubar-button change-form'><a href='https://docs.google.com/forms/d/e/1FAIpQLSc2xebXbNvVdk8f8MvPuG9tMzYgdKu-oz-TFZ6lNqOWfOG0jg/viewform' target='blank'>Tell Us: Where Have You Seen Change?</a></span>"
                    );

                    // $(document).on("click",".change-form", function(){
                    //     $("#data-user-submit").center().fadeIn('slow');
                    // });

                    // $(document).on("click","#close", function(){
                    //     $("#data-user-submit").fadeOut('slow');
                    // });

                }
            }, 1500);
        },
    });
