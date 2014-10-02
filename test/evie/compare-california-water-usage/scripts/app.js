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

        renderChart: function(chartbox,csv_url,chart_color){

                var chart = c3.generate({
                    bindto: chartbox,
                    data: {
                        x: 'x',
                        url: csv_url,
                        type: "bar",
                        onclick: function (d, i) { console.log("onclick", d, i); },
                        labels: {
                           format: {
                                //y: d3.format('%')
                           }
                        },
                        colors: {
                            Rate: chart_color
                        }
                    },

                    size: { 
                        //height: 400,
                        //width: 300
                    },

                    legend: {
                        show: false
                    },

                    tooltip: {
                        show: false
                    },

                    axis: {
                        x: {
                            type: 'category',
                        },

                        y: {
                            label: {
                              text: "Rate (%)",
                              position: 'outer-middle',

                            }
                          },
                        
                        rotated: true,
                    },

                });
            },


        initialize: function(viewObject){
            this.render(viewObject);
        },

        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            $("#title-by-year").html("<h2>July 2014 vs July 2013</h2>");
            $("#subtitle-increase-by-year").html("<h4>Agencies with largest increase</h4>");
            $("#subtitle-decrease-by-year").html("<h4>Agencies with largest decrease</h4>");
            $("#title-by-month").html("<h2>July 2014 vs June 2014</h2>");
            $("#subtitle-increase-by-month").html("<h4>Agencies with largest increase</h4>");
            $("#subtitle-decrease-by-month").html("<h4>Agencies with largest decrease</h4>");

            this.renderChart("#increase-by-year","data/highest-by-year.csv","red");
            this.renderChart("#decrease-by-year","data/lowest-by-year.csv","green");
            this.renderChart("#increase-by-month","data/highest-by-month.csv","red");
            this.renderChart("#decrease-by-month","data/lowest-by-month.csv","green");          

        },
    });
