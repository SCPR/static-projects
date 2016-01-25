    App.Models.DataEvent = Backbone.Model.extend({
        defaults: {
            time: null,
            Nino34_sst: null,
            Nino34_ssta: null,
        }
    });

    App.Collections.DataEvents = Backbone.Collection.extend({
        model: App.Models.DataEvent,
        url: "http://oceanview.pfeg.noaa.gov/erddap/tabledap/ncepNinoSSTwk.json?time,Nino34_sst,Nino34_ssta&time>=1990-01-03T00:00:00Z",
        sync: function (method, collection, options){
            options.dataType = "jsonp";
            options.jsonp = ".jsonp";
            options.cache = "true";
            options.jsonpCallback = "functionname";
            return Backbone.sync(method, collection, options);
        },
        parse: function (response){
            var obj = response.table.rows;
            return _.map(obj, function (value, key){
                return _.object(["time", "Nino34_sst", "Nino34_ssta"], value)
            });
        },
        filtered: function (start_date, end_date){
            var filtered_data = this.models.filter(function(model){
                return (
                    model.get("time") > start_date &&
                    model.get("time") <= end_date
                )
            });
            return filtered_data
        }
    });

    App.Router = Backbone.Router.extend({

        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "fetchData",
            ":compare-ninos": "compareNinos",
        },

        fetchData: function(){
            var _this = this;
            var applicationCollection = new App.Collections.DataEvents();
            applicationCollection.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (applicationCollection.length > 0){
                    clearInterval(checkExist);
                    _this.renderApplicationVisuals(applicationCollection);
                }
            }, 500);
        },

        compareNinos: function(){
            $(".data-details").empty();
            var _this = this;
            var applicationCollection = new App.Collections.DataEvents();
            applicationCollection.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (applicationCollection.length > 0){
                    clearInterval(checkExist);
                    if (this.applicationComparison){
                        this.applicationComparison.remove();
                    };
                    this.applicationComparison = new App.Views.ApplicationComparison({
                        collection: applicationCollection,
                        container: ".data-visuals"
                    });
                    return this.applicationComparison;
                }
            }, 500);
        },

        renderApplicationVisuals: function(application_collection){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                collection: application_collection,
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        },

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(object){
            this.view_object = object;
            this.render(this.view_object);
        },

        calculate_data_fields: function(collection){
            collection.forEach(function(model, index){
                var _this = model.attributes;
                _this.time = moment.utc(_this.time).toDate();
            });
            return collection;
        },

        build_data_series: function(collection){

            var series_data = [];

            var seriesCounter = 0;

            var years = [
                // 1990,
                // 1991,
                1992,
                1993,
                1994,
                1995,
                1996,
                1997,
                1998,
                1999,
                2000,
                2001,
                2002,
                2003,
                2004,
                2005,
                2006,
                2007,
                2008,
                2009,
                2010,
                2011,
                2012,
                2013,
                2014,
                2015,
                2016,
            ];

            _.each(years, function(item, index){
                var start_time = moment(item + "-01-01T00:00:00Z");
                var end_time = moment(item + "-12-31T00:00:00Z");
                var _data = collection.filtered(start_time, end_time);
                var _collection = new App.Collections.DataEvents(_data);
                var _chart_data_series = _collection.invoke("pick", ["time", "Nino34_ssta"]);
                var chart_data = [];
                _.each(_chart_data_series, function(item, index){
                    var year = item.time.getFullYear();
                    var month = item.time.getMonth();
                    var day = item.time.getDate() + 1;
                    chart_data[index] = [
                        Date.UTC(year, month, day),
                        item.Nino34_ssta,
                    ]
                });

                var see_this;

                if (item === 1992 || item === 1997 || item === 1998 || item === 2014 || item === 2015 || item === 2016){
                    see_this = true;
                } else if (item === 1993 || item === 2002 || item === 2003 || item === 2009 || item === 2010){
                    see_this = true;
                } else {
                    see_this = false;
                }

                series_data[index] = {
                    name: item,
                    data: chart_data,
                    visible: see_this,
                    color: "#7cb5ec",
                    zones: [{
                        value: 0,
                        color: "#7cb5ec"
                    }, {
                        value: 0.5,
                        color: "#feb24c"
                    }, {
                        value: 1.0,
                        color: "#fc4e2a"
                    }, {
                        value: 1.5,
                        color: "#fc4e2a"
                    }, {
                        value: 2.0,
                        color: "#e31a1c"
                    }, {
                        value: 3.0,
                        color: "#b10026"
                    }],
                    marker: {
                        symbol: "circle"
                    }
                };

            });

            return series_data;

        },

        render: function(view_object){

            $(view_object.container).html(_.template(this.template));

            this.calculate_data_fields(view_object.collection);

            var cloneToolTip = null;

            var chart_options = {

                chart: {
                    renderTo: "content-chart-container",
                    backgroundColor: null
                },

                title: {
                    text: "Niño 3.4 sea surface temperature anomalies",
                    x: -20 //center
                },

                subtitle: {
                    text: "Source: NOAA's Environmental Research Division's Data Access Program weekly Niño sea surface temperature anomalies.",
                    x: -20
                },

                xAxis: {
                    type: "datetime",

                    dateTimeLabelFormats: {
                        week: '%b \'%y',
                    },

                    title: {
                        text: "Year"
                    }
                },

                yAxis: {
                    tickInterval: .5,
                    title: {
                        text: "Deviation from sea surface temperature baseline"
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: "#808080"
                    }]
                },

                plotOptions: {
                    series: {
                        allowPointSelect: true,
                        connectNulls: true,
                        cursor: "pointer",
                        point: {
                            events: {
                                click: function(){
                                    if (cloneToolTip){
                                        chart.container.firstChild.removeChild(cloneToolTip);
                                    };
                                    cloneToolTip = this.series.chart.tooltip.label.element.cloneNode(true);
                                    chart.container.firstChild.appendChild(cloneToolTip);
                                }
                            }
                        }
                    }
                },

                tooltip: {
                    backgroundColor: "rgba(255, 255, 255, 1.0)",
                    borderColor: "#000000",
                    formatter: function(){
                        var output = "<strong>" + Highcharts.dateFormat("%b %d, %Y", this.x) + "</strong><br />" + this.y + "°C from baseline";
                        return output;
                    }
                },

                legend: {
                    layout: "vertical",
                    align: "right",
                    verticalAlign: "middle",
                    borderWidth: 0
                },

                series: null

            };

            chart_options.series = this.build_data_series(view_object.collection);

            var chart = new Highcharts.Chart(chart_options);

        },

    });

    App.Views.ApplicationComparison = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(object){
            this.view_object = object;
            this.render(this.view_object);
        },

        calculate_data_fields: function(collection){
            collection.forEach(function(model, index){
                var _this = model.attributes;
                _this.time = moment.utc(_this.time).toDate();
            });
            return collection;
        },

        build_data_series: function(collection){

            var series_data = [];

            var years = [
                1997,
                1998,
                2015,
                2016
            ];

            _.each(years, function(item, index){
                var start_time = moment(item + "-01-01T00:00:00Z");
                var end_time = moment(item + "-12-31T00:00:00Z");
                var _data = collection.filtered(start_time, end_time);
                var _collection = new App.Collections.DataEvents(_data);
                var _chart_data_series = _collection.invoke("pick", ["time", "Nino34_ssta"]);
                var chart_data = [];
                _.each(_chart_data_series, function(item, index){
                    var year = item.time.getFullYear();
                    var month = item.time.getMonth();
                    var day = item.time.getDate();
                    chart_data[index] = [
                        Date.UTC(2015, month, day),
                        item.Nino34_ssta,
                    ]
                });

                if (item === 1997){
                    this_color = "#7cb5ec";
                } else if (item === 1998){
                    this_color = "#567ea5";
                } else if (item === 2015){
                    this_color = "#b10026";
                } else {
                    this_color = "#7b001a";
                }

                series_data[index] = {
                    name: item,
                    data: chart_data,
                    color: this_color,
                    marker: {
                        symbol: "circle"
                    }
                };

            });

            return series_data;

        },

        render: function(view_object){

            $(view_object.container).html(_.template(this.template));

            this.calculate_data_fields(view_object.collection);

            var cloneToolTip = null;

            var chart_options = {

                chart: {
                    renderTo: "content-chart-container",
                    backgroundColor: null
                },

                title: {
                    text: "Niño 3.4 sea surface temperature anomalies (1997 vs. 2015)",
                    x: -20 //center
                },

                subtitle: {
                    text: "Source: NOAA's Environmental Research Division's Data Access Program weekly Niño sea surface temperature anomalies.",
                    x: -20
                },

                xAxis: {
                    type: "datetime",

                    dateTimeLabelFormats: {
                        week: '%b',
                    },

                    title: {
                        text: "Year"
                    }
                },

                yAxis: {
                    tickInterval: .5,
                    title: {
                        text: "Deviation from surface temperature baseline"
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: "#808080"
                    }]
                },

                plotOptions: {
                    series: {
                        allowPointSelect: true,
                        connectNulls: true,
                        cursor: "pointer",
                        point: {
                            events: {
                                click: function(){
                                    if (cloneToolTip){
                                        chart.container.firstChild.removeChild(cloneToolTip);
                                    };
                                    cloneToolTip = this.series.chart.tooltip.label.element.cloneNode(true);
                                    chart.container.firstChild.appendChild(cloneToolTip);
                                }
                            }
                        }
                    }
                },

                tooltip: {
                    backgroundColor: "rgba(255, 255, 255, 1.0)",
                    borderColor: "#000000",
                    formatter: function(){
                        var output = "<strong>" + Highcharts.dateFormat("%b %d", this.x) + "</strong><br />" + this.y + "°C from baseline";
                        return output;
                    }
                },

                legend: {
                    layout: "vertical",
                    align: "right",
                    verticalAlign: "middle",
                    borderWidth: 0
                },

                series: null

            };

            chart_options.series = this.build_data_series(view_object.collection);

            var chart = new Highcharts.Chart(chart_options);

        },

    });
