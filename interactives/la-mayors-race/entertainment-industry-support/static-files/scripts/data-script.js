var jqueryNoConflict = jQuery;
var icicle, labelType, useGradients, nativeTextSupport, animate;

//begin main function
jqueryNoConflict(document).ready(function(){

    createVisual();

});
//end main function

function createVisual(){

    //init TreeMap
    var tm = new $jit.TM.Squarified({

    //where to inject the visualization
    injectInto: 'infovis',

    //parent box title heights
    titleHeight: 40,

    //enable animations
    animate: animate,

    //box offsets
    offset: 1,

    //Attach left and right click events
    Events: {
        enable: true,
        onClick: function(node) {
            if(node) tm.enter(node);
        },

        onRightClick: function() {
            tm.out();
        }
    },

    duration: 1000,

    //Enable tips
    Tips: {
        enable: true,

        //add positioning offsets
        offsetX: 20,
        offsetY: 20,

        //implement the onShow method to
        //add content to the tooltip when a node
        //is hovered

        onShow: function(tip, node, isLeaf, domElement) {
            var html = "<div class=\"tip-title\">" + "</div>";

            var data = node.data;

            // use this to key on candidates
            if(data.amount_recv) {
                html += "<div class=\"tip-centered\"><strong>" + data.full_name +
                    "</strong><br />Amount Received: $" + data.amount_recv +
                    "</strong><br /><img src=\"" + data.image + "\" width=\"100px\" /></div>";
            }

            // use this to key on groups
            if(data.subgroups) {
                html += "<strong>" + node.name +
                    "</strong> category includes <strong>$" +
                    data.amount_contrib + "</strong> in contributions " +
                    data.subgroups;
            }

            tip.innerHTML = html;
        }
    },

    //Add the name of the node in the correponding label
    //This method is called once, on label creation.
    onCreateLabel: function(domElement, node){
        domElement.innerHTML = node.name;
        var style = domElement.style;

        style.display = '';
        style.border = '1px solid #87CEFA';

        domElement.onmouseover = function() {
            style.border = '1px solid #fff';
        };

        domElement.onmouseout = function() {
            style.border = '1px solid #87CEFA';
        };
    }

  });

  tm.loadJSON(json);

  tm.refresh();
};

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

    // embed function
    function embedBox() {
        var embed_url = 'http://projects.scpr.org/static/interactives/la-mayors-race/entertainment-industry-support/iframe.html';

        jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"600px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    }
    // end