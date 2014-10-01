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

        renderChart: function(chartbox,csv_url){

                var chart = c3.generate({
                    bindto: chartbox,
                    data: {
                        x: 'x',
                        url: csv_url,
                        type: "bar",
                        onclick: function (d, i) { console.log("onclick", d, i); },
                        labels: true,
                        colors: '#ff0000',
                    },

                    legend: {
                        show: false
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

            this.renderChart("#chart1","data/highest-by-year.csv");
            this.renderChart("#chart2","data/lowest-by-year.csv");
            this.renderChart("#chart3","data/highest-by-month.csv");
            this.renderChart("#chart4","data/lowest-by-month.csv");          

        },
    });
