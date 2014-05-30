var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();

    var urlLink = window.location.href;
    if (urlLink.indexOf("embed") > -1){
        appConfig.openAboutThis = false;
    };

    var charts = [new Highcharts.Chart(
        fn.configScatterPlot(
            "scatter-plot-chart",
            "scatter",
            salesDataArray,
            "Year team was purchased",
            "Purchase price adjusted for 2014 inflation"
        )
    )];
});

// application configuration object
var appConfig = {
    openAboutThis: true,
    embed_this: true,
    embed_url_root: "http://projects.scpr.org/static/charts/last-sale-of-each-nba-team/?=embed/"
};

// build a scatterplot
var fn = {
    configScatterPlot: function(containerToRenderTo, chartType, chartDataArray, xTitle, yTitle){
        var deviceInterval;
        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            deviceIntervalX = 10;
            deviceIntervalY = 100000000;
            deviceZoom = "xy";
            for (var i=0; i<salesDataArray.length; i++) {
                if (salesDataArray[i].type != undefined){
                    salesDataArray[i].visible = false;
                }
            };
        } else {
            deviceIntervalX = 2;
            deviceIntervalY = 50000000;
            deviceZoom = null;
        }
        var configChart = {};
        configChart.chart = {
            renderTo: containerToRenderTo,
            backgroundColor: "#ffffff",
            type: chartType,
            zoomType: deviceZoom,
            pinchType: null,
            style: {
                font: "100%/1.5 'proxima-nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2B2B2B; -webkit-font-smoothing: antialiased; font-weight: normal;"
            }
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
            tickInterval: deviceIntervalX,
            endOnTick: true,
            labels: {
                style: {
                    color: "#020202",
                }
            },
            offset: 25,
            title: {
                enabled: true,
                text: xTitle,
                style: {
                    color: "#020202",
                }
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        }];
        configChart.yAxis = [{
            min: 0,
            max: 650000000,
            tickInterval: deviceIntervalY,
            endOnTick: true,
            labels: {
                formatter: function() {
                    return "$" + this.value/1000000 + " million";
                },
                style: {
                    color: "#020202",
                }
            },
            gridLineColor: "#020202",
            title: {
                enabled: true,
                text: yTitle,
                style: {
                    color: "#020202",
                }
            },
        }];
        configChart.tooltip = {
            useHTML: true,
            formatter: function(){
                if (this.series.name === "2005 Collective Bargaining Agreement") {
                    return "<p>Six-year collective bargaining agreement signed in 2005.</p>";
                } else if  (this.series.name === "2011 Collective Bargaining Agreement") {
                    return "<p>Ten-year collective bargaining agreement signed in Dec. 2011.</p>";
                } else if  (this.series.name === "1999 Collective Bargaining Agreement") {
                    return "<p>Six-year collective bargaining agreement signed in Jan. 1999 after 191 day lockout.</p>";
                } else {
                    var htmlOutput =
                        "<p>" + this.point.ownership + "</strong> purchased the " + this.point.name + " in " + this.point.x + ".</p>" +
                        "<ul>" +
                        "<li>Est. purchase price: $" + this.point.purchase_price/1000000 + " million</li>" +
                        "<li>Est. purchase price adjusted for inflation: $" + this.point.y/1000000 + " million</li>" +
                        "</ul>";
                    return htmlOutput;
                }
            },
            backgroundColor: "#020202",
            style: {
                width: "100%",
                color: "#ffffff",
                fontSize: "100%",
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
            backgroundColor: "#ffffff",
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
        visible: true,
        color: "#f07a30",
        type: "line",
        name: "1999 Collective Bargaining Agreement",
        data: [[1999, 0], [1999, 650000000]],
        showInLegend: false,
        marker: {
            enabled: false,
            symbol: "circle"
        },
        hover: {
            enabled: false
        }
    }, {
        visible: true,
        color: "#f07a30",
        type: "line",
        name: "2005 Collective Bargaining Agreement",
        data: [[2005, 0], [2005, 650000000]],
        showInLegend: false,
        marker: {
            enabled: false,
            symbol: "circle"
        },
        hover: {
            enabled: false
        }
    }, {
        visible: true,
        color: "#f07a30",
        type: "line",
        name: "2011 Collective Bargaining Agreement",
        data: [[2011, 0], [2011, 650000000]],
        showInLegend: false,
        marker: {
            enabled: false,
            symbol: "circle"
        },
        hover: {
            enabled: false
        }
    }, {
        name: "New York Knicks",
        color: '#FF5C2B',
        marker: {
            symbol: "url(images/knicks.png)",
        },
        data: [{"ownership": "James Dolan and Madison Square Garden", "name": "New York Knicks", "purchase_price": 300000000, "y": 433800000, "x": 1997, "forbes_2014_rank": 1, "forbes_2014_valuation": 1400000000}]
    }, {
        name: "Los Angeles Lakers",
        color: '#4A2583',
        marker: {
            symbol: "url(images/lakers.png)",
        },
        data: [{"ownership": "Jerry Buss Family Trust", "name": "Los Angeles Lakers", "purchase_price": 20000000,  "y": 65440000, "x": 1979, "forbes_2014_rank": 2, "forbes_2014_valuation": 1350000000}]
    }, {
        name: "Chicago Bulls",
        color: '#D4001F',
        marker: {
            symbol: "url(images/bulls.png)",
        },
        data: [{"ownership": "Jerry Reinsdorf", "name": "Chicago Bulls", "purchase_price": 16000000,  "y": 35320000, "x": 1985, "forbes_2014_rank": 3, "forbes_2014_valuation": 1000000000}]
    }, {
        name: "Boston Celtics",
        color: '#05854C',
        marker: {
            symbol: "url(images/celtics.png)",
        },
        data: [{"ownership": "Wycliffe and Irving Grousbeck", "name": "Boston Celtics", "purchase_price": 360000000,  "y": 475300000, "x": 2002, "forbes_2014_rank": 4, "forbes_2014_valuation": 875000000}]
    }, {
        name: "Brooklyn Nets",
        color: '#EFEFF1',
        marker: {
            symbol: "url(images/nets.png)",
        },
        data: [{"ownership": "Mikhail Prokhorov", "name": "Brooklyn Nets", "purchase_price": 365000000,  "y": 404000000, "x": 2009, "forbes_2014_rank": 5, "forbes_2014_valuation": 780000000}]
    }, {
        name: "Houston Rockets",
        color: '#CC0000',
        marker: {
            symbol: "url(images/rockets.png)",
        },
        data: [{"ownership": "Leslie Alexander", "name": "Houston Rockets", "purchase_price": 85000000,  "y": 139700000, "x": 1993, "forbes_2014_rank": 6, "forbes_2014_valuation": 775000000}]
    }, {
        name: "Miami Heat",
        color: '#B62630',
        marker: {
            symbol: "url(images/heat.png)",
        },
        data: [{"ownership": "Micky Arison", "name": "Miami Heat", "purchase_price": 32000000,  "y": 64260000, "x": 1988, "forbes_2014_rank": 7, "forbes_2014_valuation": 770000000}]
    }, {
        name: "Dallas Mavericks",
        color: '#006AB5',
        marker: {
            symbol: "url(images/mavericks.png)",
        },
        data: [{"ownership": "Mark Cuban", "name": "Dallas Mavericks", "purchase_price": 280000000,  "y": 386100000, "x": 2000, "forbes_2014_rank": 8, "forbes_2014_valuation": 765000000}]
    }, {
        name: "Golden State Warriors",
        color: '#FFC33C',
        marker: {
            symbol: "url(images/warriors.png)",
        },
        data: [{"ownership": "Peter Guber and Joe Lacob", "name": "Golden State Warriors", "purchase_price": 450000000,  "y": 490100000, "x": 2010, "forbes_2014_rank": 9, "forbes_2014_valuation": 750000000}]
    }, {
        name: "San Antonio Spurs",
        color: '#BEC8C9',
        marker: {
            symbol: "url(images/spurs.png)",
        },
        data: [{"ownership": "Peter Holt", "name": "San Antonio Spurs", "purchase_price": 76000000,  "y": 115100000, "x": 1996, "forbes_2014_rank": 10, "forbes_2014_valuation": 660000000}]
    }, {
        name: "Oklahoma City Thunder",
        color: '#0075C1',
        marker: {
            symbol: "url(images/thunder.png)",
        },
        data: [{"ownership": "Clayton Bennett", "name": "Oklahoma City Thunder", "purchase_price": 325000000,  "y": 382900000, "x": 2006, "forbes_2014_rank": 11, "forbes_2014_valuation": 590000000}]
    }, {
        name: "Portland Trail Blazers",
        color: '#E1393E',
        marker: {
            symbol: "url(images/trailblazers.png)",
        },
        data: [{"ownership": "Paul Allen", "name": "Portland Trail Blazers", "purchase_price": 70000000,  "y": 140600000, "x": 1988, "forbes_2014_rank": 12, "forbes_2014_valuation": 587000000}]
    }, {
        name: "Los Angeles Clippers",
        color: '#EE2944',
        marker: {
            symbol: "url(images/clippers.png)",
        },
        data: [{"ownership": "Donald Sterling", "name": "Los Angeles Clippers", "purchase_price": 12000000,  "y": 31340000, "x": 1981, "forbes_2014_rank": 13, "forbes_2014_valuation": 575000000}]
    }, {
        name: "Phoenix Suns",
        color: '#FF7A31',
        marker: {
            symbol: "url(images/suns.png)",
        },
        data: [{"ownership": "Robert Sarver", "name": "Phoenix Suns", "purchase_price": 404000000,  "y": 507900000, "x": 2004, "forbes_2014_rank": 14, "forbes_2014_valuation": 565000000}]
    }, {
        name: "Orlando Magic",
        color: '#077ABD',
        marker: {
            symbol: "url(images/magic.png)",
        },
        data: [{"ownership": "RDV Sports, Inc.", "name": "Orlando Magic", "purchase_price": 85000000,  "y": 148200000, "x": 1991, "forbes_2014_rank": 15, "forbes_2014_valuation": 560000000}]
    }, {
        name: "Sacramento Kings",
        color: '#743389',
        marker: {
            symbol: "url(images/kings.png)",
        },
        data: [{"ownership": "Vivek Ranadive", "name": "Sacramento Kings", "purchase_price": 534000000,  "y": 544400000, "x": 2013, "forbes_2014_rank": 16, "forbes_2014_valuation": 550000000}]
    }, {
        name: "Utah Jazz",
        color: '#480975',
        marker: {
            symbol: "url(images/jazz.png)",
        },
        data: [{"ownership": "Gail Miller", "name": "Utah Jazz", "purchase_price": 24000000,  "y": 52000000, "x": 1986, "forbes_2014_rank": 17, "forbes_2014_valuation": 525000000}]
    }, {
        name: "Toronto Raptors",
        color: '#CD1041',
        marker: {
            symbol: "url(images/raptors.png)",
        },
        data: [{"ownership": "Bell Canada, Rogers Communications", "name": "Toronto Raptors", "purchase_price": 400000000,  "y": 582700000, "x": 1998, "forbes_2014_rank": 18, "forbes_2014_valuation": 520000000}]
    }, {
        name: "Cleveland Cavaliers",
        color: '#9F1425',
        marker: {
            symbol: "url(images/cavaliers.png)",
        },
        data: [{"ownership": "Dan Gilbert", "name": "Cleveland Cavaliers", "purchase_price": 375000000,  "y": 456000000, "x": 2005, "forbes_2014_rank": 19, "forbes_2014_valuation": 515000000}]
    }, {
        name: "Denver Nuggets",
        color: '#4393D1',
        marker: {
            symbol: "url(images/nuggets.png)",
        },
        data: [{"ownership": "Stan Kroenke", "name": "Denver Nuggets", "purchase_price": 202000000,  "y": 278600000, "x": 2000, "forbes_2014_rank": 20, "forbes_2014_valuation": 495000000}]
    }, {
        name: "Washington Wizards",
        color: '#004874',
        marker: {
            symbol: "url(images/wizards.png)",
        },
        data: [{"ownership": "Ted Leonsis", "name": "Washington Wizards", "purchase_price": 551000000,  "y": 600100000, "x": 2010, "forbes_2014_rank": 21, "forbes_2014_valuation": 485000000}]
    }, {
        name: "Indiana Pacers",
        color: '#002E62',
        marker: {
            symbol: "url(images/pacers.png)",
        },
        data: [{"ownership": "Herbert Simon", "name": "Indiana Pacers", "purchase_price": 10000000,  "y": 23840000, "x": 1983, "forbes_2014_rank": 22, "forbes_2014_valuation": 475000000}]
    }, {
        name: "Philadelphia 76ers",
        color: '#C5003D',
        marker: {
            symbol: "url(images/sixers.png)",
        },
        data: [{"ownership": "Joshua Harris and David Blitzer", "name": "Philadelphia 76ers", "purchase_price": 287000000,  "y": 303400000, "x": 2011, "forbes_2014_rank": 23, "forbes_2014_valuation": 469000000}]
    }, {
        name: "Memphis Grizzlies",
        color: '#85A2C6',
        marker: {
            symbol: "url(images/grizzlies.png)",
        },
        data: [{"ownership": "Robert J. Pera", "name": "Memphis Grizzlies", "purchase_price": 377000000,  "y": 390000000, "x": 2012, "forbes_2014_rank": 24, "forbes_2014_valuation": 453000000}]
    }, {
        name: "Detroit Pistons",
        color: '#ED174C',
        marker: {
            symbol: "url(images/pistons.png)",
        },
        data: [{"ownership": "Tom Gores", "name": "Detroit Pistons", "purchase_price": 325000000,  "y": 343500000, "x": 2011, "forbes_2014_rank": 25, "forbes_2014_valuation": 450000000}]
    }, {
        name: "Minnesota Timberwolves",
        color: '#015287',
        marker: {
            symbol: "url(images/timberwolves.png)",
        },
        data: [{"ownership": "Glen Taylor", "name": "Minnesota Timberwolves", "purchase_price": 137100000,  "y": 88000000, "x": 1995, "forbes_2014_rank": 26, "forbes_2014_valuation": 430000000}]
    }, {
        name: "Atlanta Hawks",
        color: '#D21033',
        marker: {
            symbol: "url(images/hawks.png)",
        },
        data: [{"ownership": "Bruce Levenson, Michael Gearon, Jr.", "name": "Atlanta Hawks", "purchase_price": 208000000,  "y": 261500000, "x": 2004, "forbes_2014_rank": 27, "forbes_2014_valuation": 425000000}]
    }, {
        name: "New Orleans Pelicans",
        color: '#0095CA',
        marker: {
            symbol: "url(images/pelicans.png)",
        },
        data: [{"ownership": "Tom Benson", "name": "New Orleans Pelicans", "purchase_price": 340000000,  "y": 351700000, "x": 2012, "forbes_2014_rank": 28, "forbes_2014_valuation": 420000000}]
    }, {
        name: "Charlotte Bobcats",
        color: '#29588B',
        marker: {
            symbol: "url(images/bobcats.png)",
        },
        data: [{"ownership": "Michael Jordan", "name": "Charlotte Bobcats", "purchase_price": 175000000,  "y": 190600000, "x": 2010, "forbes_2014_rank": 29, "forbes_2014_valuation": 410000000}]
    }, {
        name: "Milwaukee Bucks",
        color: '#00330A',
        marker: {
            symbol: "url(images/bucks.png)",
        },
        data: [{"ownership": "Wesley Edens and Marc Lasry", "name": "Milwaukee Bucks", "purchase_price": 550000000,  "y": 550000000, "x": 2014, "forbes_2014_rank": 30, "forbes_2014_valuation": 405000000}]
    }
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