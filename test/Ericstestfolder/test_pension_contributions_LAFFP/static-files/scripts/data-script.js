    var jqueryNoConflict = jQuery;

    // make sure the spreadsheet is published to the web
    var dataSpreadsheet = '0AjsyCVrBXivzdFBOeDBOMnRJMmpzc3pHLXhhQnVRQVE';

    // the sheet being queried
    var dataSheet = 'LACERS_contribs';

    // container arrays
    var allContribsData = [];
    var arraysOfContribsData = [];

    // chart options
    var chart;
    var chartCategories = ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        Tabletop.init({
            key: dataSpreadsheet,
            callback: showInfo,
            simpleSheet: false,
            debug: false
        });

        drawHighchart();

    });

    // display data from tabletop
    function showInfo(data, tabletop){

        var allContribsData = [];
        var arraysOfContribsData = [];

        console.log(data.LACERS_contribs.elements);

        // pulls data from the spreadsheet
        jqueryNoConflict.each(tabletop.sheets(dataSheet).all(), function(i, record) {

                   // set variables and convert to integers if needed
                    var yr2002 = parseInt(record.yr2002);
                    var yr2003 = parseInt(record.yr2003);
                    var yr2004 = parseInt(record.yr2004);
                    var yr2005 = parseInt(record.yr2005);
                    var yr2006 = parseInt(record.yr2006);
                    var yr2007 = parseInt(record.yr2007);
                    var yr2008 = parseInt(record.yr2008);
                    var yr2009 = parseInt(record.yr2009);
                    var yr2010 = parseInt(record.yr2010);
                    var yr2011 = parseInt(record.yr2011);
                    var yr2012 = parseInt(record.yr2012);
                    
                    allContribsData = [yr2002, yr2003, yr2004, yr2005, yr2006, yr2007, yr2008, yr2009, yr2010, yr2011, yr2012];

                    // push each array to an array
                    arraysOfContribsData.push(allContribsData);

        });

                   // objects for highcharts data series
                   // var initialMonthlyJobs = {
                        var MemberContribLacers = {
                        name: 'Member contributions',
                        color: '#002734',
                        type: 'spline',
                        data: arraysOfContribsData[0]
                    };

    
                    var CityContribLacers = {
                        name: 'City contributions',
                        color: '#377EB8',
                        type: 'spline',
                        data: arraysOfContribsData[1]
                    };
            
                           // add respective objects to highcharts series
                            //chart.addSeries(revisedMonthlyJobs);
                            chart.addSeries(MemberContribLacers);
                            chart.addSeries(CityContribLacers);            
    }
    
     // draw the chart
        function drawHighchart(){

            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'data-chart',
                    zoomType: 'xy'
                },

                title: {
                    text: 'Contributions to LA city employees pension fund (LACERS) '
                },

                subtitle: {
                    text: 'Data Sources: xxx'
                },

                xAxis: [{
                    categories: chartCategories
                }],

                yAxis: [{

                    // primary axis
                    labels: {
                       formatter: function() {
                            return this.value / 1000000 +'M';
                        },
                        style: {
                            color: '#2B2B2B'
                        }
                    },
                    title: {
                        text: 'Annual pension contributions (in millions)',
                        style: {
                            color: '#2B2B2B'
                        }
                    },

                    tickPixelInterval: 25

                }],

                tooltip: {
                    formatter: function(){
                        return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 0, ',');
                    }
                },

                // testing various click event options
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                mouseOver: function() {
                                    var highlightRowColor = String(this.series.color);
                                    var highlightRowId = String(this.series.name);
                                    var highlightCellId = String(this.x);
                                    var selectedRow = 'tr#' + highlightRowId;
                                    var selectedCell = 'td#' + highlightCellId;

                                    jqueryNoConflict(selectedRow).css(
                                        {'text-decoration': 'underline', 'color': highlightRowColor});

                                },

                                mouseOut: function() {
                                    var highlightRowColor = String(this.series.color);
                                    var highlightRowId = String(this.series.name);
                                    var highlightCellId = String(this.x);
                                    var selectedRow = 'tr#' + highlightRowId;
                                    var selectedCell = 'td#' + highlightCellId;

                                    jqueryNoConflict(selectedRow).css(
                                        {'text-decoration': 'none', 'color': 'black'});
                                }
                            }
                        },

                        events: {

    /*
                            mouseOver: function() {
                                var highlightRowId = String(this.name);
                                var highlightRowColor = String(this.color);
                                var selectedRow = 'tr#' + highlightRowId;
                                jqueryNoConflict(selectedRow).css(
                                        'color', highlightRowColor);
                            },

                            mouseOut: function() {
                                var highlightRowId = String(this.name);
                                var highlightRowColor = String(this.color);
                                var selectedRow = 'tr#' + highlightRowId;
                                jqueryNoConflict(selectedRow).css(
                                        'color', 'black');
                            },
    */

                            legendItemClick: function () {
                                var highlightRowId = String(this.name);
                                var selectedRow = 'tr#' + highlightRowId;
                                jqueryNoConflict(selectedRow).toggle();

                                 //returning false cancels default action
                                // return false;
                            }
                        }
                    }
                },

                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    //x: 0,
                    y: 0,
                    floating: false,
                    borderWidth: 1,
                    backgroundColor: '#FFFFFF',
                    shadow: true
                },

                credits: {
                    enabled: false
                },

                series: []
            });

        };
        //end function