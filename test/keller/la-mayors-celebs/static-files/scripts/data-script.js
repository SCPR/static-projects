var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function(){
    retriveData();
});
//end main function

// grab data
function retriveData() {
    var dataSource = 'static-files/data/6_json_celebs_la_mayors_contribs.json';
    jqueryNoConflict.getJSON(dataSource, processDataFrom);
};

// display page template
function processDataFrom(data){
    renderDataVisualsTemplate(data);
};
// end

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
}
//end

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper('debug', function(optionalValue) {
        console.log('Current Context');
        console.log("====================");
        console.log(this);

      if (arguments.length > 1) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }

    });
};
// end

// handlebars help function to set every nth element
function handlebarsLoopHelper(){
    Handlebars.registerHelper('everyNth', function(context, every, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "";
        if(context && context.length > 0) {
            for(var i=0; i<context.length; i++) {
                var modZero = i % every === 0;
                ret = ret + fn(_.extend({}, context[i], {
                    isModZero: modZero,
                    isModZeroNotFirst: modZero && i > 0,
                    isLast: i === context.length - 1
                }));
            }

        } else {
            ret = inverse(this);
        }

    return ret;

    });
};
// end



// create projects content template
function renderDataVisualsTemplate(data){
    getTemplateAjax('static-files/templates/data-details.handlebars', function(template) {
        handlebarsDebugHelper();
        handlebarsLoopHelper();
        jqueryNoConflict('#data-details').html(template(data));
    })
};