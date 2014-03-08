var quadsize = 20;
var nextbuttonset = false;
var clickcount = 0;

var data_by_cell = {};
var tooltip_template;
var chart;
var formopen;
var submitted = false;
var ds;

function join (x) {
    return _.reduceRight(x, function (memo, item) { return item + ',' + memo; }, '');

}
function cleartip ()
{
    $('.commentpop').hide();
    $('#tooltip').hide();
}
function closeform ()
{
    $('#theform').hide();
    formopen = false;
    _.map(chart.getSelectedPoints(), function(pt)
    {
        pt.select(false);
    });
    $('svg').css('pointer-events', 'auto');
}
function showtip (pt, curcomment)
{ 

    var ptdata = data_by_cell[pt.i + ',' + pt.j];
    var tipx, tipy;

    if(pt.i <= 0)
    {
        tipx = pt.plotX + 15;
        $('#clickinstructions').css('left','15px');
    }
    else
    {
        tipx = pt.plotX -295;
        $('#clickinstructions').css('left','102px');
    }
    tipy = pt.plotY+ 40;
    if (pt.j <= 0)
    {
        tipy = pt.plotY - 100;
    }
    $('#tooltip').css('position','absolute')
    .css('left', tipx)
    .css('top', tipy);
    console.log(pt.pointAttr['']);
    $('#tooltip').css({
        position: 'absolute',
        'left' : '120px',
        'top' : '140px'

    });
    console.log(pt.pointAttr[''].fill);
    $('#tooltip').show();

    if (_.isUndefined(ptdata))
    {
        return false;
    }

    curcomment = curcomment % ptdata.length;
    var startcomment = curcomment;


    $('#tooltip').html(tooltip_template(
    {name : ptdata[curcomment].Name || "Anonymous",
        body: ptdata[curcomment].Comment,
        num: curcomment + 1,
        count: ptdata.length
    }));

    if(pt.i <= 0)
    {
        $('#clickinstructions').css('left', '0px');

    }
    else
    {
        $('#clickinstructions').css('left','102px');
    }

    $('.commentpop').css('background-color', pt.pointAttr[''].fill);
    $('.buttonfooter').css({
        'background-color' : 'rgba(0,0,0,0.1)'
        

    });
    $('#commentpop').show();
    if (ptdata.length == 1) {
        $('#nextbutton').hide();

    }
    else
    {
        $('#nextbutton').show();
    }



    return curcomment;


}
function validate_form()
{
    $('#theform').hide();
    var cell = $('#form-cell').val();
    closeform();

    if(!_.has(data_by_cell, cell))
    {
        data_by_cell[cell] = [];
    }

    data_by_cell[cell].push({
        Cell : cell,
        Comment: $('#form-comment').val(),
        Name: $('#form-name').val()

    });

    chart.get(cell).update({marker: {fillColor : get_color(cell) }});
    submitted = true;

    return true;

}
function get_color(pt)
{
    var topleft = [0x04, 0x34, 0x64];
    var topright = [0x0f,0x69,0xc9];
    var bottomleft = [0x82,0x03,0x08];
    var bottomright = [0xdb,0x0f,0x5c];
    var splitpt = pt.split(",");
    splitpt[0] = parseInt(splitpt[0]);
    splitpt[1] = parseInt(splitpt[1]);

    var x = splitpt[0] + quadsize;
    var y = splitpt[1] + quadsize;
    var fulllength = quadsize * 2;

    var rgb = [0,0,0];
    var top, bottom;

    for (var i =0; i < 3; i++)
    {
        // Weighted average of top
        top = (fulllength - x) * topleft[i] + x * topright[i];
        bottom = (fulllength - x) * bottomleft[i] + x * bottomright[i];

        rgb[i] = (fulllength - y) * bottom + y * top;
        rgb[i] /= (fulllength * fulllength);
        rgb[i] = Math.round(rgb[i]);

    }
    var opacity = 0.1;
    if(_.has(data_by_cell, pt))
    {
        opacity += data_by_cell[pt].length / Math.sqrt(clickcount);
        if (opacity < 0.2)
        {
            opacity = 0.2;
        }
        opacity += 0.2;
        if(opacity > 1)
        {
            opacity = 1;
        }
    }

    return 'rgba(' + join(rgb) + '' + opacity + ')';

}
function update_tip(ptdata, curcomment)
{
    var comment = ptdata[curcomment];
    $('#ourtip .commentname').text(ptdata[curcomment].Name || "Anonymous");
    $('#ourtip .commentbody').text(ptdata[curcomment].Comment);
    $('#ourtip .commentcounter').text(curcomment + 1 + " of " + ptdata.length);

}
function get_data()
{
    var i,j;
    var data = [];
    var axissize;
    var xaxisshift = 0.42;
    var yaxisshift = 0.4;

    for(i = -1 * quadsize;i <= quadsize; i++)
    {
        for (j = -1 * quadsize; j<= quadsize; j++)
        {
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
                    fillColor: get_color(i + ',' + j)
                },
                id: i + ',' + j



            });
        }
    }
    return data;
            
        
}

function drawgrid(){
    formopen = false;
    var curcomment = null;
    Highcharts.setOptions({
        chart: {
            style : {
                fontFamily : '"Arial", Arial, sans-serif;'
            }
        }

    });
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart-container',
            type: 'scatter',
            marginTop : -50,
            marginBottom : -50,
            marginLeft: 0,
            marginRight: 5,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            spacingBottom: 0,
            backgroundColor: '#ffffff',
            events: {
                click : function ()
                {
                }
            }
        },
        labels : {
            items: [


            ]
        },
        legend: 'none',
        plotOptions : {
            series : {
                turboThreshold: 10000,
                stickyTracking: false,
                point: {
                    events : {

                        click : function (){
                            if(formopen)
                            {
                                return;
                            }
                            var thept = thepoint = this;
                            curcomment = 0;
                            curcomment = showtip(thepoint, curcomment);
                            if (curcomment === false)
                            {
                                thept.select(false);
                                thept.setState();
                                if(formopen)
                                {
                                    return;
                                }
                                thept.setState('hover');

                                $('.forminput').val("");
                                $('#charcounter').html("160 chars");

                                $('#form-cell').val(thept.i + ',' + thept.j);
                                $('#theform').show();
                                $('svg').css('pointer-events', 'none');
                                formopen = true;
                                $('#form-name').focus();
                                cleartip();
                                return;
                            }
                                
                            $('.addbutton').click(function(){
                                thept.select(false);
                                thept.setState();
                                if(formopen)
                                {
                                    return;
                                }
                                thept.setState('hover');

                                $('.forminput').val("");
                                $('#charcounter').html("160 chars");

                                $('#form-cell').val(thept.i + ',' + thept.j);
                                $('#theform').show();
                                $('svg').css('pointer-events', 'none');
                                formopen = true;
                                $('#form-name').focus();
                                cleartip();

                            });
                            $('#closebutton').click(function(){
                            
                                cleartip();
                                thept.setState();
                                thept.select(false);
                            }
                            
                            );
                            if (!nextbuttonset)
                            $('body').on('click', '#nextbutton', function()
                            {
                                nextbuttonset = true;
                                curcomment += 1;
                                curcomment = showtip(thepoint, curcomment);
                                $('#closebutton').click(function(){
                                
                                    cleartip();
                                    thept.setState();
                                    thept.select(false);
                                });
                                $('.addbutton').click(function(){
                                    thept.select(false);
                                    thept.setState();
                                    if(formopen)
                                    {
                                        return;
                                    }
                                    thept.setState('hover');

                                    $('.forminput').val("");
                                    $('#charcounter').html("160 chars");

                                    $('#form-cell').val(thept.i + ',' + thept.j);
                                    $('#theform').show();
                                    $('svg').css('pointer-events', 'none');
                                    formopen = true;
                                    $('#form-name').focus();
                                    cleartip();

                                });
                        });
                        nextbuttonset = true;


                            
                            

                        },
                        no: function ()  {
                            if(submitted)
                            {
                                // Can't use form twice
                                return;

                            }
                            var thept = this;
                            if(formopen)
                            {
                                return;
                            }
                            thept.setState('hover');

                            $('.forminput').val("");
                            $('#charcounter').html("160 chars");

                            $('#form-cell').val(thept.i + ',' + thept.j);
                            $('#theform').show();
                            $('svg').css('pointer-events', 'none');
                            formopen = true;
                            $('#form-name').focus();
                            cleartip();


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
                            lineColor: '#ff3300',
                            lineWidth: 0,
                            fillColor: '#ff3300'

                        },
                        select: {
                            radius: 5,
                            lineColor: '#ff3300',
                            lineWidth: 0,
                            fillColor: '#ff3300'

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
            data: get_data()

         }]
    });








    

}


$(document).ready(function(){
    
    tooltip_template = Handlebars.compile($('#tooltip-template').html());

    ds = new Miso.Dataset({
      url: "data/spreadsheet.tsv",
      delimiter: "\t"
            });
            ds.fetch({
            success : function() {
                // your success callback here!
                ds.each(function(row){
                    if(!(_.has(data_by_cell,row.Cell)))
                    {
                        data_by_cell[row.Cell] = [];
                    }
                    data_by_cell[row.Cell].push(row);
                    clickcount++;
                });
                drawgrid();
            },
            error : function() {
            // your error callback here!
            }
        });
    $('#form-comment').keyup(function()
    {
        $('#charcounter').html(160 - $(this).val().length + ' chars');

        if ($(this).val().length > 160)
        {
            // For browsers that don't support max length
            var text = $(this).val();
            text = text.substr(0, 160);
            $(this).val(text);
        }
    });
    $('#cancelbutton a').click(function(){
        $('#theform').hide();
        closeform();

    });
    $(document).keyup(function(e) {

    if (e.keyCode == 27) { 
        //escape
        closebox();
        $('#theform').hide();
        closeform();
    
    }
    });
    $('#formsubmit').mouseover(function() 
    {
        var src = $(this).css('background-image');
        $(this).css('background-image',src.replace("_off","_on"));
    });
    $('#formsubmit').mouseout(function() 
    {
        var src = $(this).css('background-image');
        $(this).css('background-image',src.replace("_on","_off"));
    });


});
