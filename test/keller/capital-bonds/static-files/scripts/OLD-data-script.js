    var jqueryNoConflict = jQuery;

    // begin main function
    jqueryNoConflict(document).ready(function(){

        drawCircles();

    });
    // end

var paper;

    // begin circle function
    function drawCircles(){

        /*
        tutorials:
        http://net.tutsplus.com/tutorials/javascript-ajax/an-introduction-to-the-raphael-js-library/
        http://www.irunmywebsite.com/raphael/additionalhelp.php#pagetop
        http://blog.jeremi.info/entry/creating-a-chart-with-raphael-js-from-a-google-spreadsheet
        Raphael draws in canvas using Raphael() object
        Specify html element the canvas is drawn in, width & height of canvas
        */

        // All our drawing methods will be bound to the paper variable
        paper = new Raphael(document.getElementById('school-debt-container'), 500, 500);

        /*
        The origin -- x = 0, y = 0 point -- is at the top-left corner.
        Any x, y coordinates we specify in our methods are relative to this point.
        attr() method an object with various property-value pairs as its parameter.
        */

        var circleTotalPrincipal = paper.circle(300, 350, 40).attr({
            fill: '#ccc',
            stroke: '#ddd',
            'stroke-width': 5,
            'stroke-linejoin': 'round'
        });


        var circleTotalPayment = paper.circle(300, 150, 100).attr({
            fill: '#9cf',
            stroke: '#ddd',
            'stroke-width': 5,
            'stroke-linejoin': 'round',
        });


        /*
        'M' moves cursor to bottom of circle radius
        'l' draws vertical line from circle
        'z' closes the path
        */

        var connection = paper.path("M 420 380 l 0 -330 z").attr({
            stroke: '#000',
            'stroke-width': 5,
            'stroke-linejoin': 'round',
            opacity: 1
        });

        var schoolDistrictName = paper.text(300, 350, 'District Name').attr({
            fill: '#000',
            opacity: 1
        });

        var schoolDistrictDebt = paper.text(300, 150, 'Amount of Debt').attr({
            fill: '#000',
            opacity: 0
        });

        // creates a DOM mouseover/onclick event

/*
        circleTotalPrincipal.node.onmouseover = function() {
            this.style.cursor = 'pointer';
        }

        circleTotalPrincipal.node.onclick = function() {

            schoolDistrictDebt.animate({
                opacity: 1
            }, 1000);

            connection.animate({
                opacity: 1
            }, 1000);

        }
*/

        drawRectangles();


    };
    // end


    // begin rectangle function
    function drawRectangles(){

        /*
        The origin -- x = 0, y = 0 point -- is at the top-left corner.
        Any x, y coordinates we specify in our methods are relative to this point.
        attr() method an object with various property-value pairs as its parameter.
        */

        var rectangleSchoolBond = paper.rect(250, 450, 150, 4).attr({
            fill: 'red',
            stroke: 'red',
            'stroke-width': 1
        });

    };
    // end


    // function to generate iframe embed code
    function embedBox() {
        var embed_url = '#';
        jAlert('<strong>To embed this on your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"420px\" height=\"450px\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe>', 'Share or Embed');
    };
    // end