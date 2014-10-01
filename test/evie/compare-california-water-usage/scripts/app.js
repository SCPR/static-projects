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

        },

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(viewObject){
            this.render(viewObject);
        },

        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            $("#title1").html("<h2>Compare by year (same month)</h2><p>July 2014 vs July 2013</p>");
            $("#subtitle1").html("<h4>Top 10 agencies with most increase</h4>");
            $("#subtitle2").html("<h4>Top 10 agencies with most decrease</h4>");
            $("#title2").html("<h2>Compare by month (same year)</h2><p>July 2014 vs June 2014</p>");
            $("#subtitle3").html("<h4>Top 10 agencies with most increase</h4>");
            $("#subtitle4").html("<h4>Top 10 agencies with most decrease</h4>");
            renderChart();
        },

            renderChart: function(){

                var chart = c3.generate({
                    bindto: '#chart1',
                    data: {
                        x: 'x',
                        url: "data/highest-by-year.csv",
                        type: "bar",
                        onclick: function (d, i) { console.log("onclick", d, i); },
                        labels: true
                    },

                    axis: {
                        x: {
                            type: 'category',
                        },

                        y: {
                            label: {
                              text: "Rate (%)",
                              position: 'outer-middle'
                            }
                          },
                        
                        rotated: true,
                    },

                });
            },

                  

        },
