    var jqueryNoConflict = jQuery;
    var configData = configData || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        var charts = [new Highcharts.Chart(
            createScatterPlot('data-visuals', 'scatter', dataArray)
        )];
    });

    var dataArray = [{
        name: 'Los Angeles County',
        color: '#E41A1C',
        data: [
            {"ownership": "James Dolan/Madison Square Garden", name: "New York Knicks", y: 300000000, x: 1997, "forbes2014rank": "1", "forbes2014valuation": "1400000000"},
            {"ownership": "Jerry Buss Family Trusts, Philip Anschutz", name: "Los Angeles Lakers", y: 20000000, x: 1979, "forbes2014rank": "2", "forbes2014valuation": "1350000000"},
            {"ownership": "Jerry Reinsdorf", name: "Chicago Bulls", y: 16000000, x: 1985, "forbes2014rank": "3", "forbes2014valuation": "1000000000"},
            {"ownership": "Wycliffe Grousbeck, Irving Grousbeck", name: "Boston Celtics", y: 360000000, x: 2002, "forbes2014rank": "4", "forbes2014valuation": "875000000"},
            {"ownership": "Mikhail Prokhorov", name: "Brooklyn Nets", y: 365000000, x: 2009, "forbes2014rank": "5", "forbes2014valuation": "780000000"},
            {"ownership": "Leslie Alexander", name: "Houston Rockets", y: 85000000, x: 1993, "forbes2014rank": "6", "forbes2014valuation": "775000000"},
            {"ownership": "Micky Arison", name: "Miami Heat", y: 32000000, x: 1988, "forbes2014rank": "7", "forbes2014valuation": "770000000"},
            {"ownership": "Mark Cuban", name: "Dallas Mavericks", y: 280000000, x: 2000, "forbes2014rank": "8", "forbes2014valuation": "765000000"},
            {"ownership": "Peter Guber, Joe Lacob", name: "Golden State Warriors", y: 450000000, x: 2010, "forbes2014rank": "9", "forbes2014valuation": "750000000"},
            {"ownership": "Peter Holt", name: "San Antonio Spurs", y: 76000000, x: 1996, "forbes2014rank": "10", "forbes2014valuation": "660000000"},
            {"ownership": "Clayton Bennett", name: "Oklahoma City Thunder", y: 325000000, x: 2006, "forbes2014rank": "11", "forbes2014valuation": "590000000"},
            {"ownership": "Paul Allen", name: "Portland Trail Blazers", y: 70000000, x: 1988, "forbes2014rank": "12", "forbes2014valuation": "587000000"},
            {"ownership": "Donald Sterling", name: "Los Angeles Clippers", y: 12000000, x: 1981, "forbes2014rank": "13", "forbes2014valuation": "575000000"},
            {"ownership": "Robert Sarver", name: "Phoenix Suns", y: 404000000, x: 2004, "forbes2014rank": "14", "forbes2014valuation": "565000000"},
            {"ownership": "RDV Sports, Inc.", name: "Orlando Magic", y: 85000000, x: 1991, "forbes2014rank": "15", "forbes2014valuation": "560000000"},
            {"ownership": "Vivek Ranadive", name: "Sacramento Kings", y: 534000000, x: 2013, "forbes2014rank": "16", "forbes2014valuation": "550000000"},
            {"ownership": "Gail Miller", name: "Utah Jazz", y: 24000000, x: 1986, "forbes2014rank": "17", "forbes2014valuation": "525000000"},
            {"ownership": "Bell Canada, Rogers Communications", name: "Toronto Raptors", y: 400000000, x: 1998, "forbes2014rank": "18", "forbes2014valuation": "520000000"},
            {"ownership": "Dan Gilbert", name: "Cleveland Cavaliers", y: 375000000, x: 2005, "forbes2014rank": "19", "forbes2014valuation": "515000000"},
            {"ownership": "Stan Kroenke", name: "Denver Nuggets", y: 202000000, x: 2000, "forbes2014rank": "20", "forbes2014valuation": "495000000"},
            {"ownership": "Ted Leonsis", name: "Washington Wizards", y: 551000000, x: 2010, "forbes2014rank": "21", "forbes2014valuation": "485000000"},
            {"ownership": "Herbert Simon", name: "Indiana Pacers", y: 10000000, x: 1983, "forbes2014rank": "22", "forbes2014valuation": "475000000"},
            {"ownership": "Joshua Harris, David Blitzer", name: "Philadelphia 76ers", y: 287000000, x: 2011, "forbes2014rank": "23", "forbes2014valuation": "469000000"},
            {"ownership": "Robert J. Pera", name: "Memphis Grizzlies", y: 377000000, x: 2012, "forbes2014rank": "24", "forbes2014valuation": "453000000"},
            {"ownership": "Tom Gores", name: "Detroit Pistons", y: 325000000, x: 2011, "forbes2014rank": "25", "forbes2014valuation": "450000000"},
            {"ownership": "Glen Taylor", name: "Minnesota Timberwolves", y: 88000000, x: 1995, "forbes2014rank": "26", "forbes2014valuation": "430000000"},
            {"ownership": "Bruce Levenson, Michael Gearon, Jr.", name: "Atlanta Hawks", y: 208000000, x: 2004, "forbes2014rank": "27", "forbes2014valuation": "425000000"},
            {"ownership": "Tom Benson", name: "New Orleans Pelicans", y: 340000000, x: 2012, "forbes2014rank": "28", "forbes2014valuation": "420000000"},
            {"ownership": "Michael Jordan", name: "Charlotte Bobcats", y: 175000000, x: 2010, "forbes2014rank": "29", "forbes2014valuation": "410000000"},
            {"ownership": "Wesley Edens and Marc Lasry", name: "Milwaukee Bucks", y: 550000000, x: 2014, "forbes2014rank": "30", "forbes2014valuation": "405000000"}
        ]}
    ];

    // create an instance of the chart
    function createScatterPlot(containerToRenderTo, chartType, chartDataArray){

        var deviceInterval;

        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            deviceInterval = 50;
        } else {
            deviceInterval = 25;
        }

        var configChart = {};

        configChart.chart = {
            renderTo: containerToRenderTo,
            backgroundColor: '#ffffff',
            type: chartType,
            zoomType: 'xy',
            pinchType: null
        };

        configChart.title = {
            text: '',
            style: {
                display: 'none'
            }
        };

        configChart.subtitle = {
            text: '',
            style: {
                display: 'none'
            }
        };

        configChart.xAxis = [{
            type: 'date',
            categories: ['1979'],
            tickInterval: 2,
            title: {
                enabled: true,
                text: 'Year team was sold',
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
                text: 'Sale price (in millions)',
            },
        }];

        configChart.tooltip = {
            formatter: function(){
                if (this.series.name === 'API Threshold') {
                    return 'State goal of an API score of 800';
                } else if  (this.series.name === 'Trend') {
                    return false;
                } else {
                    return 'The ' + this.point.name + ' last sold in ' + this.x + ' for ' + Highcharts.numberFormat(this.y, 0, '.');
                }
            },
            backgroundColor: '#020202',
            style: {
            	color: '#ffffff',
            	fontSize: '12px',
            	padding: '8px'
            },
            followPointer: true,
            followTouchMove: true
        };

        configChart.legend = {
            enabled: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            floating: false,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        };

        configChart.plotOptions = {
            scatter: {
                marker: {
                    radius: 8,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },

            }
        };

        configChart.credits = {
            enabled: false,
            text: 'California Department of Education',
            href: 'http://www.cde.ca.gov/ta/ac/ap/'

        };

        configChart.series = chartDataArray;

        return configChart;

    };
    //end function