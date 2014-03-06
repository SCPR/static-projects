    var jqueryNoConflict = jQuery;
    var fn = fn || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        fn.initializeDataSource();
    });

    // begin data configuration object
    var fn = {

        dataSpreadsheetKey: '0Aq8qwSArzKP9dC0yMGJuUFp0UEtJSEhaM29CMVl1Nmc',

        initializeDataSource: function(){
            Tabletop.init({
                key: fn.dataSpreadsheetKey,
                callback: fn.processDataSource,
                parseNumbers: true,
                simpleSheet: true,
                debug: false
            });
        },

        finalHtmlContent: {},

        processDataSource: function(data, tabletop){

            for (var x=0; x<data.length; x++){

                var contentHtml = fn.evaluateContentType(data[x]);

                data[x].html = contentHtml;

                jqueryNoConflict("#formatted-output").append(data[x].html);
                document.getElementById("html-output").value += data[x].html;

            };

        },

        evaluateContentType: function(object){

            var contentHtml;

            if (object.element === "sentence"){
                contentHtml = "<p>" + object.text + "</p>";

            } else if (object.element === "bullet_item"){
                if (object.source != ""){
                    contentHtml = "<li>" + object.text + " (<a href='" + object.sourceurl + "' target='_blank'>" + object.source + "</a>)</li>";
                } else {
                    contentHtml = "<li>" + object.text + "</li>";
                }

                contentHtml = "<ul>" + contentHtml + "</ul>";

            } else if (object.element === "blockquote"){
                if (object.source != ""){
                    contentHtml = "<blockquote>" + object.text + " (<a href='" + object.sourceurl + "' target='_blank'>" + object.source + "</a>)</blockquote>";
                } else {
                    contentHtml = "<blockquote>" + object.text + "</blockquote>";
                }
            } else {
                contentHtml = "<p></p>";
            }


            return contentHtml;
        },

    }
    // end data configuration object