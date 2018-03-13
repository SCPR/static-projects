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
//var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24) - 1);
var diffDays = 417;

/* document.getElementById("message").innerHTML = 'Donald J. Trump has been President for <span id = "color">' + diffDays + " days</span> — and still hasn't visited California. In March, he will.";
*/

document.getElementById("message").innerHTML = 'Trump waited <span id = "color">' + diffDays + " days</span> to visit California – longer than any president in decades";


        },


        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
        }

    });
