var appConfig = appConfig || {};
var fn = fn || {};
var initializeTemplates = initializeTemplates || {};

var appConfig = {
    openAboutThis: false,
    embed_this: false,
    embed_url_root: 'http://projects.scpr.org/static/test/keller/project-template/project-interactive/',

    // chart config and defaults
    spreadsheetKey: "0Aq8qwSArzKP9dDl4dDRyT3NQWEEwNjhrNE5DS2xGTFE",
    worksheetKey: "1",
    quadsize: 20,
    clickcount: 0,
    submitted: false,
    initialWidth: null
};

var data_by_cell = {};
var tooltip_template;
var chart;
var formopen;

$(document).ready(function(){
    appConfig.initialWidth = $('#chart-container').width();

    initializeTemplates.renderStaticTemplates();

    fn.fetchMisoData(appConfig.spreadsheetKey, appConfig.worksheetKey);

    tooltip_template = Handlebars.compile($('#tooltip-template').html());

    $("#formsubmit").click(function(){
        alert("Thank you for your submission");
    });

    $("#form-comment").keyup(function(){
        $("#charcounter").html(160 - $(this).val().length + ' chars');
        if ($(this).val().length > 160){

            // for browsers that don't support max length
            var text = $(this).val();
            text = text.substr(0, 160);
            $(this).val(text);
        }
    });

    $("#cancelbutton").click(function(){
        $("#theform").hide();
        fn.closeform();
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27){
            //escape
            //closebox();
            $("#theform").hide();
            closeform();
        }
    });

    $("#formsubmit").mouseover(function(){
        var src = $(this).css("background-image");
        $(this).css("background-image", src.replace("_off","_on"));
    });

    $("#formsubmit").mouseout(function(){
        var src = $(this).css("background-image");
        $(this).css("background-image", src.replace("_on","_off"));
    });

});

// begin application object
var fn = {

    fetchMisoData: function(spreadsheetKey, worksheetKey){
        var ds = new Miso.Dataset({
            importer : Miso.Dataset.Importers.GoogleSpreadsheet,
            parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
            key : spreadsheetKey,
            worksheet : worksheetKey
        });

        ds.fetch({
            success: function(){
                ds.each(function(row){
                    if(!(_.has(data_by_cell,row.Cell))){
                        data_by_cell[row.Cell] = [];
                    }
                    data_by_cell[row.Cell].push(row);
                    appConfig.clickcount++;
                });

                fn.drawgrid(appConfig.initialWidth);
            },
            error: function(){
                console.log("error just happened fool");
            }
        });
    },

    drawgrid: function(initialWidth){
        var chartWidth = initialWidth-150
        var chartMargin = (initialWidth-chartWidth)/2
        console.log(chartMargin);

        var interval = false;
        formopen = false;
        var curcomment = null;

        Highcharts.setOptions({
            chart: {
                style : {
                    fontFamily : "'proxima-nova', 'Helvetica Neue', Helvetica, Arial, sans-serif"
                }

            }
        });

        chart = new Highcharts.Chart({
            chart: {
                renderTo: "chart-container",
                type: "scatter",
                width: (initialWidth-150),
                marginTop : -50,
                marginBottom : -50,
                marginLeft: 0,
                marginRight: 0,
                spacingTop: 0,
                spacingLeft: 0,
                spacingRight: 0,
                spacingBottom: 0,
                backgroundColor: "#ffffff",
                events: {
                    click: function(){

                    }
                }
            },

            labels : {
                items: []
            },

            legend: "none",

            plotOptions : {
                series : {
                    turboThreshold: 10000,
                    stickyTracking: false,
                    point: {
                        events : {
                            mouseOver: function(){
                                if(formopen){
                                    return;
                                }

                                if(interval){
                                    clearInterval(interval);
                                }

                                var thepoint = this;

                                interval = setInterval(function(){
                                    curcomment = 0;
                                    curcomment = fn.showtip(thepoint, curcomment);
                                    clearInterval(interval);
                                    interval = setInterval(function(){
                                        curcomment += 1;
                                        fn.showtip(thepoint, curcomment);
                                    }, 5000);
                                }, 300);
                            },

                            mouseOut: function(){
                                if(interval){
                                    clearInterval(interval);
                                }
                                interval = false;
                                fn.cleartip();
                            },

                            click: function(){
                                if(appConfig.submitted || $.cookie("boom")){
                                    // can't submit form twice
                                    alert("You've already submitted your thoughts");
                                    return;
                                }

                                var thept = this;

                                if(formopen){
                                    return;
                                }

                                thept.setState("hover");

                                $(".forminput").val("");

                                $("#charcounter").html("160 chars");

                                $("#form-cell").val(thept.i + "," + thept.j);

                                $("#theform").show();

                                $("svg").css("pointer-events", "none");

                                formopen = true;

                                $("#form-name").focus();

                                fn.cleartip();
                            }
                        }
                    }
                },

                scatter: {
                    animation: false,
                    allowPointSelect: true,
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                radius: 5,
                                lineColor: "#ff3300",
                                lineWidth: 0,
                                fillColor: "#ff3300"

                            },
                            select: {
                                radius: 5,
                                lineColor: "#ff3300",
                                lineWidth: 0,
                                fillColor: "#ff3300"
                            }
                        }
                    }
                }
            },

            title: {
                text: ' ',
                margin: 0,
                y:0
            },

            credits: {
                enabled: false
            },

            yAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                title : {
                    text: null

                },
                tickWidth: 0,
                lineWidth: 0

             },

             xAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                title : {
                    text: null

                },
                tickWidth: 0,
                lineWidth: 0
             },

             tooltip: {
                enabled: false,
                backgroundColor: 'black',
                useHTML: true
             },

             series :
             [{
                name: 'points',
                id: 'points',
                data: fn.get_data()
             }]
        });

        $(".highcharts-container").css("margin", "0 auto 0 auto");

    },

    get_data: function(){
        var i,j;
        var data = [];
        var axissize;
        var xaxisshift = 0.42;
        var yaxisshift = 0.4;

        for(i = -1 * appConfig.quadsize;i <= appConfig.quadsize; i++){
            for (j = -1 * appConfig.quadsize; j<= appConfig.quadsize; j++){
                var x = i;
                var y = j;
                if (x > 0)
                    x-= xaxisshift;
                if (x < 0)
                    x += xaxisshift;
                if (y > 0)
                    y-= yaxisshift;
                if (y < 0)
                    y += yaxisshift;
                if (x === 0 || y === 0)
                    continue;
                data.push({
                    x: x,
                    y: y,
                    i: i,
                    j:j,
                    marker: {
                        fillColor: fn.get_color(i + "," + j)
                    },
                    id: i + "," + j
                });
            };
        };

        return data;
    },

    get_color: function(pt){
        var topright = [0xff,0x66,0x00];
        var topleft = [0x33,0x33,0xcc];
        var bottomleft = [0x33,0x00,0x66];
        var bottomright = [0x66,0x33,0x00];
        var splitpt = pt.split(",");
        splitpt[0] = parseInt(splitpt[0]);
        splitpt[1] = parseInt(splitpt[1]);

        var x = splitpt[0] + appConfig.quadsize;
        var y = splitpt[1] + appConfig.quadsize;
        var fulllength = appConfig.quadsize * 2;

        var rgb = [0,0,0];
        var top, bottom;

        for (var i =0; i < 3; i++){

            // weighted average of top
            top = (fulllength - x) * topleft[i] + x * topright[i];
            bottom = (fulllength - x) * bottomleft[i] + x * bottomright[i];

            rgb[i] = (fulllength - y) * bottom + y * top;
            rgb[i] /= (fulllength * fulllength);
            rgb[i] = Math.round(rgb[i]);

        }

        var opacity = 0.1;

        if(_.has(data_by_cell, pt)){
            opacity += data_by_cell[pt].length / Math.sqrt(appConfig.clickcount);

            if (opacity < 0.2){
                opacity = 0.2;
            }

            opacity += 0.2;

            if(opacity > 1){
                opacity = 1;
            }
        }
        return 'rgba(' + fn.join(rgb) + '' + opacity + ')';
    },

    join: function(x){
        return _.reduceRight(x, function (memo, item) { return item + ',' + memo; }, '');
    },

    cleartip: function(){
        $(".commentpop").hide();
        $("#tooltip").hide();
    },

    showtip: function(pt, curcomment){
        var ptdata = data_by_cell[pt.i + "," + pt.j];
        var tipx, tipy;

        if(pt.i <= 0){
            tipx = pt.plotX + 15;
            $("#clickinstructions").css("left","15px");
        } else {
            tipx = pt.plotX -295;
            $("#clickinstructions").css("left","102px");
        }

        tipy = pt.plotY+ 40;

        if (pt.j <= -12){
            tipy = pt.plotY - 100;
        }

        $("#tooltip").css("position","absolute").css("left", tipx).css("top", tipy);
        $("#tooltip").show();

        if (_.isUndefined(ptdata)){
            return false;
        }

        curcomment = curcomment % ptdata.length;
        var startcomment = curcomment;

        while (_.isNull(ptdata[curcomment].Comment)){
            curcomment++;
            curcomment = curcomment % ptdata.length;

            if (curcomment == startcomment){
                break;
            }
        }

        $("#tooltip").html(tooltip_template({
            name : ptdata[curcomment].Name || "Anonymous",
            body: ptdata[curcomment].Comment,
            num: curcomment + 1,
            count: ptdata.length
        }));

        if(pt.i <= 0){
            $("#clickinstructions").css("left", "0px");
        } else {
            $("#clickinstructions").css("left","102px");
        }

        $("#commentpop").show();

        if (_.isNull(ptdata[curcomment].Comment)){
            $(".commentpop").hide();
        }

        return curcomment;
    },

    validate_form: function(){
        $("#theform").hide();

        var cell = $("#form-cell").val();

        fn.closeform();

        if(!_.has(data_by_cell, cell)){
            data_by_cell[cell] = [];
        }

        data_by_cell[cell].push({
            Cell : cell,
            Comment: $("#form-comment").val(),
            Name: $("#form-name").val()
        });

        chart.get(cell).update({
            marker: {
                fillColor : fn.get_color(cell)
            }
        });

        appConfig.submitted = true;

        $.cookie("valentines", "submitted", {expires : 30});

        return true;
    },

    closeform: function(){
        $("#theform").hide();

        formopen = false;

        _.map(chart.getSelectedPoints(), function(pt){
            pt.select(false);
        });

        $("svg").css("pointer-events", "auto");
    },

    update_tip: function(ptdata, curcomment){
        var comment = ptdata[curcomment];
        $("#ourtip .commentname").text(ptdata[curcomment].Name || "Anonymous");
        $("#ourtip .commentbody").text(ptdata[curcomment].Comment);
        $("#ourtip .commentcounter").text(curcomment + 1 + " of " + ptdata.length);
    }
}
// end application object

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = 'http://projects.scpr.org/static/static-files/v3-dependencies/templates/';
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');
        renderHandlebarsTemplate('templates/data-share.handlebars', '.data-share');
        renderHandlebarsTemplate('templates/data-details.handlebars', '.data-details');

        var checkExist = setInterval(function() {

            if (jqueryNoConflict('.header-links').length) {
                clearInterval(checkExist);
                initializeTemplates.hideEmbedBox();
            }

            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);
    },

    hideEmbedBox: function(){
        if (appConfig.embed_this === false){
            jqueryNoConflict('li.projects-embed').addClass('hidden');
        };
    },

    renderEmbedBox: function(){
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page. You may need to adjust the height parameter. <br /><br /> &lt;iframe src=\"'+ appConfig.embed_url_root +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){

        if (appConfig.openAboutThis === true){
            jqueryNoConflict('.text').collapse('show');
        };

        jqueryNoConflict('.text').on('shown.bs.collapse', function(){
            jqueryNoConflict('span.text').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.text').on('hidden.bs.collapse', function(){
            jqueryNoConflict('span.text').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.about').on('shown.bs.collapse', function(){
            jqueryNoConflict('span.about').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.about').on('hidden.bs.collapse', function(){
            jqueryNoConflict('span.about').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
    }
}
// end template rendering object