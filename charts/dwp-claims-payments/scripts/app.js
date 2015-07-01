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
        },

        drawChart: function () {
$('#container').highcharts({


        chart: {
            type: 'bar',
            height: 575,
            backgroundColor: '#EAEAEA',
            style: {
                fontFamily: "arial"
            }
        },
        title: {
            text: null
        },


        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function () {
                return 'LADWP paid out <b>' + this.y + '</b> in <b>' + this.x +
                    '</b> claims';
            }
        },

        xAxis: {
            categories: ['Personal injury', 'Wrongful death', 'Damage to real property', 'Subrogation from insurer (non auto)', 'Fire damage', 'Personal injury from auto accident', 'Damage to vehicle (not accidents)', 'Damage to phone cable', 'Cleanup costs', 'Subrogation from insurer (auto)', 'Property damage from auto accident'],
            labels: {
                style: {
                    fontSize: '14px'
                }
            }
        },
        yAxis: {
            tickInterval: 1000000,
            min: 0,
            title: {
                text: 'Claims payments in dollars',
                style: {
                    fontSize: '15px'
                },
            },
            labels: {
                style: {
                    fontSize: '13px'
                }},
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                borderColor: '#303030'
            }
        },





        series: [

        {
            name: 'all incidents',
            data: [4999321.01, 3250000, 1996601.33, 1721079.92, 510076.68, 410757.38, 329246.79, 173134.77, 153417.54, 147578.83, 107936.35],
            color: 'rgba(0, 127, 166, .8)',
        } ]
    });


        },

        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            this.drawChart();
        }
    });
