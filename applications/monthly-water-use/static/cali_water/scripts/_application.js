var fn = {

    enableSelectMenu: function(){
        $(".js-basic-single").select2();
        document.getElementById("water-supplier-list").onchange = function() {
            var selectedOption = this.value;
            window.location.href = selectedOption;
        };
    },

    whichChartToDisplay: function(){
        if (window.appConfig.is_mobile === false){
            fn.enableComparisonCharts();
        } else {
            if (window.appConfig.is_mobile === true && window.appConfig.windowSize > 568){
                fn.enableComparisonCharts();
                //$(".coal-chart .point").css("width", "22px").css("height", "22px");
            } else {
                $(".coal-chart-container").addClass("hidden").removeClass("show");
                $(".coal-chart-sentence").addClass("hidden").removeClass("show");

                $(".data-point-container").removeClass("hidden").addClass("show");
                $(".data-point-sentence").removeClass("hidden").addClass("show");
            }
        }
    },

    enableComparisonCharts: function(){

        /*
            based on census reporter distribution "circles on a line" charts by Ryan Pitts, Joe Germuska, Ian Dees and Sara Schnadt. example here: http://censusreporter.org/data/distribution/?table=B25064&geo_ids=860|16000US0644000

            formula to arrive at the circles on a line: https://github.com/censusreporter/censusreporter/blob/47ee559d3939ec00d2e39e1f540b277bc50bbff8/censusreporter/apps/census/static/js/comparisons.js#L703

            styles to arrive at the circles on a line: https://github.com/censusreporter/censusreporter/blob/47ee559d3939ec00d2e39e1f540b277bc50bbff8/censusreporter/apps/census/static/css/charts.css#L450
        */

        var comparison = {};

        comparison.coalCharts = $(".coal-chart");

        comparison.coalChartPoints = $(".coal-chart .point");

        comparison.coalCharts.on("mouseover", ".point", function(e) {
            var chosenIndex = $(this).data("index"),
                filteredPoints = comparison.coalChartPoints.filter("[data-index=" + chosenIndex + "]");
            filteredPoints.addClass("hovered");
            filteredPoints.children("span").css("display", "block");
        });

        comparison.coalCharts.on("mouseout", ".point", function(e) {
            comparison.coalChartPoints.removeClass("hovered");
            comparison.coalChartPoints.children("span").removeAttr("style");
        });

        comparison.coalCharts.on("click", ".point", function(e) {
            // allow clicking on the hovercard link
            if (e.target.tagName == "A") return;
            e.preventDefault();
            comparison.toggleSelectedDistributionPoints($(this).data("index"));
            //comparison.trackEvent('Distribution View', 'Click to toggle point highlight', '');
        });

        comparison.toggleSelectedDistributionPoints = function(chosenIndex){
            var filteredPoints = comparison.coalChartPoints.filter("[data-index=" + chosenIndex + "]");
            if (!filteredPoints.hasClass("selected")){
                targetColor = "#f17b21"
            }
            filteredPoints.toggleClass("selected").removeAttr("style").filter(".selected").css({
                "background-color": targetColor,
                "border-color": targetColor
            });
        }
    },

    drawUsageOverTimeChart: function(chartAxisLabels, data){

        // we are setting a few options for our chart and override the defaults
        var options = {

            seriesBarDistance: 15,

            reverseData: true,

            horizontalBars: true,

            // line chart points
            showPoint: true,

            // line smoothing
            lineSmooth: true,

            // overriding the natural low of the chart
            low: 0,

            // overriding the natural high of the chart allows you to zoom
            high: undefined,

            // x-axis specific configuration
            axisX: {

                labelOffset: {
                    x: 0,
                    y: 10
                },

                // we can disable the grid for this axis
                showGrid: true,

                // and also don't show the label
                showLabel: true,

                labelInterpolationFnc: function(value) {
                    return value;
                }
            },

            // y-axis specific configuration
            axisY: {

                // lets offset the chart a bit from the labels
                offset: 70,

                // the label interpolation function enables you to modify the values
                // used for the labels on each axis. here we are converting the
                // values into million pound.
                labelInterpolationFnc: function(value) {
                    return value + " rgpcd";
                }
            }
        };

        // create a new line chart object where as first parameter we pass in a selector
        // that is resolving to our chart container element. the second parameter
        // is the actual data object.
        new Chartist.Line(".ct-chart", data, options);

        var $chart = $(".ct-chart");

        var $tooltip = $("<div class='tooltip tooltip-hidden'></div>").appendTo($(".ct-chart"));

        $(document).on("mouseenter", ".ct-point", function() {

            var seriesName = $(this).parent().attr('ct:series-name');

            var value = parseFloat($(this).attr("ct:value")).toFixed(2);

            $tooltip.text(seriesName + ": " + value + " rgpcd");

            $tooltip.removeClass("tooltip-hidden");
        });

        $(document).on("mouseleave", ".ct-point", function() {
            $tooltip.addClass("tooltip-hidden");
        });

        $(document).on("mousemove", ".ct-point", function(event) {
            $tooltip.css({
                left: (event.offsetX || event.originalEvent.layerX) - $tooltip.width() / 2,
                top: (event.offsetY || event.originalEvent.layerY) - $tooltip.height() - 20
            });
        });

    },

    createReductionComparisonTable: function(sorting_array, headers_object){

        $.tablesorter.defaults.textExtraction = "complex";

        var extractResponsiveMark = function(node){
            if (node.childNodes[0].nextSibling === null){
                return " ";
            } else {
                var cellContent = node.childNodes[0].nextSibling.textContent;
                return cellContent
            };
        };

        // define pager options
        var pagerOptions = {

            // target the pager markup - see the HTML block below
            container: $(".pager"),

            // output string - default is '{page}/{totalPages}'; possible variables: {page}, {totalPages}, {startRow}, {endRow} and {totalRows}
            output: "{startRow} - {endRow} out of {totalRows}",

            // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty table row set to a height to compensate; default is false
            fixedHeight: true,

            page: 0,

            size: 15,

            // remove rows from the table to speed up the sort of large tables. setting this to false, only hides // the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
            removeRows: true,

            // location of where the "output" is displayed
            cssPageDisplay: ".pagedisplay",

            // go to page selector - select dropdown that sets the current page
            cssGoto: ".pagenav",

            // dropdown that sets the "size" option
            cssPageSize: ".pagesize",

        };

        fn.createResponsiveTable();

        var fu = $("#table_fu");

        var table = window.table = $("#data", fu)

            .tablesorter({

                textExtraction: extractResponsiveMark,

                widgets: ["zebra"],

                sortList: sorting_array,

                headers: headers_object

            })

            //.tablesorterPager(pagerOptions)

            .tablesorterMultiPageFilter({
                filterSelector: $(".search", fu)
            });

        var urlSortColumn = getParameterByName("sortColumn");

        var urlSortOrder = getParameterByName("sortOrder");
        if (urlSortColumn && urlSortOrder) {
            urlSortColumn  = parseInt(urlSortColumn);
            urlSortOrder  = parseInt(urlSortOrder);
            newSort = [[urlSortColumn, urlSortOrder]];
            $("table").trigger("sorton", [newSort]);
        };

        $(window).resize(function(){
            fn.createResponsiveTable();
        });

    },

    createResponsiveTable: function(){
        var windowWidth = $(window).width();
        if (windowWidth <= 595){
            $(".kpcc-table").each(function(){
                $("tbody tr").each(function(){
                    $(this).find("td").each(function(){
                        $(this).css("width", "100%");
                    });
                });
            });
        } else {
            $(".kpcc-table").each(function(){
                var numberOfCells = $("tbody tr:nth-child(2) td").length;
                var widthResize = 100 / numberOfCells
                $("tbody tr").each(function(){
                    $(this).find("td").each(function(){
                        $(this).css("width", widthResize + "%");
                    });
                });
            });
        }
    }
};