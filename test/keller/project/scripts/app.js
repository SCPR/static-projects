var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();

    var charts = [new Highcharts.Chart(
        fn.configScatterPlot(
            "scatter-plot-chart",
            "scatter",
            salesDataArray,
            "Year team was sold",
            "Sale price (in millions)"
        )
    )];


});

// application configuration object
var appConfig = {
    openAboutThis: false,
    embed_this: false,
    embed_url_root: "",
    dataSource: "flat-file",
    spreadsheetKey: "",
    flatFile: "data/nba_owner_reactions.json"
};

// build a scatterplot
var fn = {

    configScatterPlot: function(containerToRenderTo, chartType, chartDataArray, xTitle, yTitle){

        var deviceInterval;

        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            deviceInterval = 50;
        } else {
            deviceInterval = 25;
        }

        var configChart = {};

        configChart.chart = {
            renderTo: containerToRenderTo,
            backgroundColor: "#ffffff",
            type: chartType,
            zoomType: "xy",
            pinchType: null
        };

        configChart.title = {
            text: "",
            style: {
                display: "none"
            }
        };

        configChart.subtitle = {
            text: "",
            style: {
                display: "none"
            }
        };

        configChart.xAxis = [{
            type: "date",
            categories: ["1979"],
            tickInterval: 2,
            title: {
                enabled: true,
                text: xTitle,
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        }];

        configChart.yAxis = [{
            min: 0,
            max: 600000000,
            tickInterval: 50000000,
            title: {
                enabled: true,
                text: yTitle,
            },
        }];

        configChart.tooltip = {
            formatter: function(){
                return this.point.ownership + " purchased the " + this.point.name + " in " + this.x + " for $" + Highcharts.numberFormat(this.y, 0, ".");
            },

            backgroundColor: "#020202",

            style: {
                color: "#ffffff",
                fontSize: "12px",
                padding: "8px"
            },

            followPointer: true,

            followTouchMove: true

        };

        configChart.legend = {
            enabled: false,
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            x: 0,
            y: 0,
            floating: false,
            borderWidth: 1,
            backgroundColor: "#FFFFFF",
            shadow: true
        };

        configChart.plotOptions = {
            scatter: {
                marker: {
                    radius: 1,
                    symbol: "circle",
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: "rgb(100,100,100)"
                        }
                    }
                },

            }
        };

        configChart.credits = {
            enabled: false,
            text: "",
            href: ""
        };

        configChart.series = chartDataArray;
        return configChart;
    }
};

var salesDataArray = [
    {
        name: "New York Knicks",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/knicks.png)",
        },
        data: [{"ownership": "James Dolan/Madison Square Garden", "name": "New York Knicks", "y": 300000000, "x": 1997}]
    }, {
        name: "Los Angeles Lakers",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/lakers.png)",
        },
        data: [{"ownership": "Jerry Buss Family Trusts, Philip Anschutz", "name": "Los Angeles Lakers", "y": 20000000, "x": 1979}]
    }, {
        name: "Chicago Bulls",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/bulls.png)",
        },
        data: [{"ownership": "Jerry Reinsdorf", "name": "Chicago Bulls", "y": 16000000, "x": 1985}]
    }, {
        name: "Boston Celtics",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/celtics.png)",
        },
        data: [{"ownership": "Wycliffe Grousbeck, Irving Grousbeck", "name": "Boston Celtics", "y": 360000000, "x": 2002}]
    }, {
        name: "Brooklyn Nets",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/nets.png)",
        },
        data: [{"ownership": "Mikhail Prokhorov", "name": "Brooklyn Nets", "y": 365000000, "x": 2009}]
    }, {
        name: "Houston Rockets",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/rockets.png)",
        },
        data: [{"ownership": "Leslie Alexander", "name": "Houston Rockets", "y": 85000000, "x": 1993}]
    }, {
        name: "Miami Heat",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/heat.png)",
        },
        data: [{"ownership": "Micky Arison", "name": "Miami Heat", "y": 32000000, "x": 1988}]
    }, {
        name: "Dallas Mavericks",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/mavericks.png)",
        },
        data: [{"ownership": "Mark Cuban", "name": "Dallas Mavericks", "y": 280000000, "x": 2000}]
    }, {
        name: "Golden State Warriors",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/warriors.png)",
        },
        data: [{"ownership": "Peter Guber, Joe Lacob", "name": "Golden State Warriors", "y": 450000000, "x": 2010}]
    }, {
        name: "San Antonio Spurs",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/spurs.png)",
        },
        data: [{"ownership": "Peter Holt", "name": "San Antonio Spurs", "y": 76000000, "x": 1996}]
    }, {
        name: "Oklahoma City Thunder",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/thunder.png)",
        },
        data: [{"ownership": "Clayton Bennett", "name": "Oklahoma City Thunder", "y": 325000000, "x": 2006}]
    }, {
        name: "Portland Trail Blazers",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/trailblazers.png)",
        },
        data: [{"ownership": "Paul Allen", "name": "Portland Trail Blazers", "y": 70000000, "x": 1988}]
    }, {
        name: "Los Angeles Clippers",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/clippers.png)",
        },
        data: [{"ownership": "Donald Sterling", "name": "Los Angeles Clippers", "y": 12000000, "x": 1981}]
    }, {
        name: "Phoenix Suns",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/suns.png)",
        },
        data: [{"ownership": "Robert Sarver", "name": "Phoenix Suns", "y": 404000000, "x": 2004}]
    }, {
        name: "Orlando Magic",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/magic.png)",
        },
        data: [{"ownership": "RDV Sports, Inc.", "name": "Orlando Magic", "y": 85000000, "x": 1991}]
    }, {
        name: "Sacramento Kings",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/kings.png)",
        },
        data: [{"ownership": "Vivek Ranadive", "name": "Sacramento Kings", "y": 534000000, "x": 2013}]
    }, {
        name: "Utah Jazz",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/jazz.png)",
        },
        data: [{"ownership": "Gail Miller", "name": "Utah Jazz", "y": 24000000, "x": 1986}]
    }, {
        name: "Toronto Raptors",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/raptors.png)",
        },
        data: [{"ownership": "Bell Canada, Rogers Communications", "name": "Toronto Raptors", "y": 400000000, "x": 1998}]
    }, {
        name: "Cleveland Cavaliers",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/cavaliers.png)",
        },
        data: [{"ownership": "Dan Gilbert", "name": "Cleveland Cavaliers", "y": 375000000, "x": 2005}]
    }, {
        name: "Denver Nuggets",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/nuggets.png)",
        },
        data: [{"ownership": "Stan Kroenke", "name": "Denver Nuggets", "y": 202000000, "x": 2000}]
    }, {
        name: "Washington Wizards",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/wizards.png)",
        },
        data: [{"ownership": "Ted Leonsis", "name": "Washington Wizards", "y": 551000000, "x": 2010}]
    }, {
        name: "Indiana Pacers",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/pacers.png)",
        },
        data: [{"ownership": "Herbert Simon", "name": "Indiana Pacers", "y": 10000000, "x": 1983}]
    }, {
        name: "Philadelphia 76ers",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/sixers.png)",
        },
        data: [{"ownership": "Joshua Harris, David Blitzer", "name": "Philadelphia 76ers", "y": 287000000, "x": 2011}]
    }, {
        name: "Memphis Grizzlies",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/grizzlies.png)",
        },
        data: [{"ownership": "Robert J. Pera", "name": "Memphis Grizzlies", "y": 377000000, "x": 2012}]
    }, {
        name: "Detroit Pistons",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/pistons.png)",
        },
        data: [{"ownership": "Tom Gores", "name": "Detroit Pistons", "y": 325000000, "x": 2011}]
    }, {
        name: "Minnesota Timberwolves",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/timberwolves.png)",
        },
        data: [{"ownership": "Glen Taylor", "name": "Minnesota Timberwolves", "y": 88000000, "x": 1995}]
    }, {
        name: "New Orleans Pelicans",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/pelicans.png)",
        },
        data: [{"ownership": "Tom Benson", "name": "New Orleans Pelicans", "y": 340000000, "x": 2012}]
    }, {
        name: "Charlotte Bobcats",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/bobcats.png)",
        },
        data: [{"ownership": "Michael Jordan", "name": "Charlotte Bobcats", "y": 175000000, "x": 2010}]
    }, {
        name: "Atlanta Hawks",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/hawks.png)",
        },
        data: [{"ownership": "Bruce Levenson, Michael Gearon, Jr.", "name": "Atlanta Hawks", "y": 208000000, "x": 2004}]
    }, {
        name: "Milwaukee Bucks",
        marker: {
            symbol: "url(http://projects.scpr.org/static/test/keller/project/images/bucks.png)",
        },
        data: [{"ownership": "Wesley Edens and Marc Lasry", "name": "Milwaukee Bucks", "y": 550000000, "x": 2014}]
    }
];















var valuationDataArray = [{
    name: "Forbes valuation of each NBA Team",
    color: "#E41A1C",
    data: [
        {"ownership": "James Dolan/Madison Square Garden", "name": "New York Knicks", "x": 1, "y": 1400000000},
        {"ownership": "Jerry Buss Family Trusts, Philip Anschutz", "name": "Los Angeles Lakers", "x": 2, "y": 1350000000},
        {"ownership": "Jerry Reinsdorf", "name": "Chicago Bulls", "x": 3, "y": 1000000000},
        {"ownership": "Wycliffe Grousbeck, Irving Grousbeck", "name": "Boston Celtics", "x": 4, "y": 875000000},
        {"ownership": "Mikhail Prokhorov", "name": "Brooklyn Nets", "x": 5, "y": 780000000},
        {"ownership": "Leslie Alexander", "name": "Houston Rockets", "x": 6, "y": 775000000},
        {"ownership": "Micky Arison", "name": "Miami Heat", "x": 7, "y": 770000000},
        {"ownership": "Mark Cuban", "name": "Dallas Mavericks", "x": 8, "y": 765000000},
        {"ownership": "Peter Guber, Joe Lacob", "name": "Golden State Warriors", "x": 9, "y": 750000000},
        {"ownership": "Peter Holt", "name": "San Antonio Spurs", "x": 10, "y": 660000000},
        {"ownership": "Clayton Bennett", "name": "Oklahoma City Thunder", "x": 11, "y": 590000000},
        {"ownership": "Paul Allen", "name": "Portland Trail Blazers", "x": 12, "y": 587000000},
        {"ownership": "Donald Sterling", "name": "Los Angeles Clippers", "x": 13, "y": 575000000},
        {"ownership": "Robert Sarver", "name": "Phoenix Suns", "x": 14, "y": 565000000},
        {"ownership": "RDV Sports, Inc.", "name": "Orlando Magic", "x": 15, "y": 560000000},
        {"ownership": "Vivek Ranadive", "name": "Sacramento Kings", "x": 16, "y": 550000000},
        {"ownership": "Gail Miller", "name": "Utah Jazz", "x": 17, "y": 525000000},
        {"ownership": "Bell Canada, Rogers Communications", "name": "Toronto Raptors", "x": 18, "y": 520000000},
        {"ownership": "Dan Gilbert", "name": "Cleveland Cavaliers", "x": 19, "y": 515000000},
        {"ownership": "Stan Kroenke", "name": "Denver Nuggets", "x": 20, "y": 495000000},
        {"ownership": "Ted Leonsis", "name": "Washington Wizards", "x": 21, "y": 485000000},
        {"ownership": "Herbert Simon", "name": "Indiana Pacers", "x": 22, "y": 475000000},
        {"ownership": "Joshua Harris, David Blitzer", "name": "Philadelphia 76ers", "x": 23, "y": 469000000},
        {"ownership": "Robert J. Pera", "name": "Memphis Grizzlies", "x": 24, "y": 453000000},
        {"ownership": "Tom Gores", "name": "Detroit Pistons", "x": 25, "y": 450000000},
        {"ownership": "Glen Taylor", "name": "Minnesota Timberwolves", "x": 26, "y": 430000000},
        {"ownership": "Bruce Levenson, Michael Gearon, Jr.", "name": "Atlanta Hawks", "x": 27, "y": 425000000},
        {"ownership": "Tom Benson", "name": "New Orleans Pelicans", "x": 28, "y": 420000000},
        {"ownership": "Michael Jordan", "name": "Charlotte Bobcats", "x": 29, "y": 410000000},
        {"ownership": "Wesley Edens and Marc Lasry", "name": "Milwaukee Bucks", "x": 30, "y": 405000000}
    ]}
];


// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = "http://projects.scpr.org/static/static-files/v3-dependencies/templates/";
        renderHandlebarsTemplate(proxyPrefix + "kpcc-header.handlebars", ".kpcc-header");
        renderHandlebarsTemplate(proxyPrefix + "kpcc-footer.handlebars", ".kpcc-footer");
        renderHandlebarsTemplate("templates/data-share.handlebars", ".data-share");
        renderHandlebarsTemplate("templates/data-details.handlebars", ".data-details");

        var checkExist = setInterval(function() {

            if (jqueryNoConflict(".header-links").length) {
                clearInterval(checkExist);
                initializeTemplates.hideEmbedBox();
            }

            if (jqueryNoConflict(".buttons").length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);
    },

    hideEmbedBox: function(){
        if (appConfig.embed_this === false){
            jqueryNoConflict("li.projects-embed").addClass("hidden");
        };
    },

    renderEmbedBox: function(){
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page. You may need to adjust the height parameter. <br /><br /> &lt;iframe src=\"'+ appConfig.embed_url_root +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){
        jqueryNoConflict(".text").on("shown.bs.collapse", function(){
            jqueryNoConflict("span.text").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".text").on("hidden.bs.collapse", function(){
            jqueryNoConflict("span.text").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".about").on("shown.bs.collapse", function(){
            jqueryNoConflict("span.about").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".about").on("hidden.bs.collapse", function(){
            jqueryNoConflict("span.about").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
        });
        if (appConfig.openAboutThis === true){
            $(".text").collapse("show");
        };
    }
};
// end template rendering object