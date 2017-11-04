    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },
        routes: {
            "": "renderApplicationVisuals",
        },
        renderApplicationVisuals: function(){
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
            this.render(viewObject);

var today = new Date();
var date2 = new Date("1/20/2017");
var timeDiff = Math.abs(date2.getTime() - today.getTime());
var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
//document.write('<br>Donald J. Trump has been President for ' + diffDays + " and still hasn't visited California");
document.getElementById("message").innerHTML = 'Donald J. Trump has been President for <span id = "color">' + diffDays + " days</span> — and still hasn't visited California.";

        },


        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
        }

    });
