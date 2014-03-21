    var jqueryNoConflict = jQuery;
    var fn = fn || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        fn.initializeDataSource();
    });

    // begin data configuration object
    var fn = {

        postContent: [],

        dataSpreadsheetKey: '0Aq8qwSArzKP9dC0yMGJuUFp0UEtJSEhaM29CMVl1Nmc',

        initializeDataSource: function(){
            Tabletop.init({
                key: fn.dataSpreadsheetKey,
                callback: fn.determineDataSource,
                parseNumbers: true,
                simpleSheet: false,
                debug: false
            });
        },

        determineDataSource: function(data, tabletop){
            jqueryNoConflict("#postForADay").on('change', function(){
                fn.clearDisplayPreview();
                var postForPreview = this.value;
                var postData = data[postForPreview].elements;
                if (postData.length < 1){
                    alert("We don't have entries for this post. Please check the spreadsheet");
                } else {
                    fn.processDataSource(postData);
                }
            });
        },

        processDataSource: function(array){
            for (var x=0; x<array.length; x++){
                fn.evaluateLengthOfSources(array[x])
            };

            fn.displayPreviewOnPage(fn.postContent);

        },

        evaluateLengthOfSources: function(object){
            if (object.source != ""){

                if (object.source.indexOf(';') > 0){
                    var sourceArray = object.source.split(';')
                    object.source = sourceArray;
                }

                if (object.sourceurl.indexOf(';') > 0){
                    var sourceUrlArray = object.sourceurl.split(';')
                    object.sourceurl = sourceUrlArray;
                }
            }

            fn.createPostHtml(object)
        },

        createPostHtml: function(object){
            if (object.element === "sentence"){

                object.html = "<p>" + object.text + "</p>";

            } else if (object.element === "bullet_item"){

                if (object.source != "" && typeof(object.source) === "object" && typeof(object.sourceurl) === "object"){

                    var sourceString = "";

                    for (var x=0; x<object.source.length; x++){
                        sourceString += "<a href='" +
                            object.sourceurl[x].replace(/^\s+|\s+$/g,'') +
                            "' target='_blank'>" +
                            object.source[x].replace(/^\s+|\s+$/g,'') +
                            "</a>, ";
                    };

                    object.html = "<li>" + object.text + " (" + sourceString + ")</li>";

                } else if (object.source != "" && typeof(object.source) != "object" && typeof(object.sourceurl) != "object"){

                    object.html = "<li>" + object.text + " (<a href='" + object.sourceurl + "' target='_blank'>" + object.source + "</a>)</li>";

                } else {

                    object.html = "<li>" + object.text + "</li>";

                }

            } else if (object.element === "blockquote"){

                if (object.source != "" && typeof(object.source) === "object" && typeof(object.sourceurl) === "object"){

                    var sourceString = "";

                    for (var x=0; x<object.source.length; x++){
                        sourceString += "<a href='" +
                            object.sourceurl[x].replace(/^\s+|\s+$/g,'') +
                            "' target='_blank'>" +
                            object.source[x].replace(/^\s+|\s+$/g,'') +
                            "</a>, ";
                    };

                    object.html = "<blockquote>" + object.text + " (" + sourceString + ")</blockquote>";

                } else if (object.source != "" && typeof(object.source) != "object" && typeof(object.sourceurl) != "object"){

                    object.html = "<blockquote>" + object.text + " (<a href='" + object.sourceurl + "' target='_blank'>" + object.source + "</a>)</blockquote>";

                } else {

                    object.html = "<blockquote>" + object.text + "</blockquote>";

                }

            } else {
                object.html = "<p></p>";

            }

            fn.postContent.push(object);
        },

        clearDisplayPreview: function(){
            fn.postContent = [];
            jqueryNoConflict("#formatted-output").empty();
            document.getElementById("html-output").value = "";
        },

        displayPreviewOnPage: function(array){
            for (var i=0; i<array.length; i++){
                jqueryNoConflict("#formatted-output").append(array[i].html);
                document.getElementById("html-output").value += array[i].html;
            };
        }
    }
    // end data configuration object