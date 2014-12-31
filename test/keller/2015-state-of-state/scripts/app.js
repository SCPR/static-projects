var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
    fn.checkForDataVisuals();
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
});

// application configuration object
var appConfig = {
    openAboutThis: true,
    embed_this: true,
    embed_url_root: 'http://projects.scpr.org/static/interactives/2015-state-of-state/',
    docDiv: "DV-viewer-1005633-california-2013-state-of-state-address",
    docUrl: "//www.documentcloud.org/documents/1005633-california-2013-state-of-state-address.js",
    docContainer: "#DV-viewer-1005633-california-2013-state-of-state-address"
};

// begin application object
var fn = {

    checkForDataVisuals: function(){
        var checkExist = setInterval(function() {
            if (jqueryNoConflict('.data-visuals').length) {
                clearInterval(checkExist);
                fn.loadInitialDoc(appConfig.docDiv, appConfig.docUrl, appConfig.docContainer);
            }
        }, 1000);
    },

    loadInitialDoc: function(docDiv, docUrl, docContainer){

        jqueryNoConflict("#document-container").append("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");

        var sidebarParam;
        var docHeightParam;

        // set params for mobile devices
        if (navigator.userAgent.match(/(iPad)/i)) {
            sidebarParam = false;
            docHeightParam = 700;
        } else if (navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i)) {
            sidebarParam = false;
            docHeightParam = 400;
        } else {
            sidebarParam = false;
            docHeightParam = 820;
        };

        var initialWidth = jqueryNoConflict('#document-container').width();

        DV.load(docUrl, {
            width: initialWidth,
            height: docHeightParam,
            sidebar: sidebarParam,
            text: false,
            pdf: false,
            container: docContainer
        });

        var docId = docDiv.replace("DV-viewer-", "");

        fn.retrieveDocumentMetaData(docId);
    },

    retrieveDocumentMetaData: function(docId){
        var apiPrefix = "https://www.documentcloud.org/api/documents/";
        $.getJSON(apiPrefix + docId + ".json", fn.processDocumentMetaData);
    },

    processDocumentMetaData: function(data){
        jqueryNoConflict('#document-meta-data').html("<h6><span id='speech-topic'>Click an icon to see what Gov. Jerry Brown said about a particular topic in his State of the State address.</span></h6>"
        );

        // get unique note topics we will display
        var arrayOfCategories = fn.createNoteCategoryList(data.document.annotations);

        // create topic elements across the top
        fn.createTopicControls(arrayOfCategories);

        // display initial topic
        fn.createTopicObjects(arrayOfCategories, data);
    },

    // create an array of unique notes categories
    createNoteCategoryList: function(notesArray){
        var notesAllCategories = [];
        for(var n=0; n<notesArray.length; n++){
            var noteCategory = notesArray[n].title.split(":");
            notesAllCategories.push(noteCategory[0].toProperCase());
        };
        var notesUniqueCategories = _.uniq(notesAllCategories);
        return notesUniqueCategories;
    },

    displayNoteData: function(arrayOfTopicNotes, targetValue){
        var targetTopic = targetValue.replace('-', ' ').toProperCase();
        var targetTopicArray = _.where(arrayOfTopicNotes, {topic: targetTopic});
        jqueryNoConflict("#speech-topic").html(
            targetTopicArray[0].topic
        ).css({
            'font-weight': '900',
        });
        jqueryNoConflict("#note-navigation-links").html(
            "<div id='" + targetValue + "'>" + "<ul></ul></div>"
        );
        var divToAppend = "#" + targetValue;
        for(var i=0; i<targetTopicArray[0].notes.length; i++){
            var topicLessDisplay = targetTopicArray[0].notes[i].title.split(":");
            jqueryNoConflict("#note-navigation-links>" + divToAppend + " ul").append(
                "<li><a href='#document/p" + targetTopicArray[0].notes[i].page + "/a" +
                targetTopicArray[0].notes[i].id + "'>" + topicLessDisplay[1] + "</a></li>"
            );
        };
    },

    // create the topical navigation across the top of the page
    createTopicControls: function(data){
        for(var i=0; i<data.length; i++){
            jqueryNoConflict("#controls").append("<div id='" + data[i].replace(" ", "-").toLowerCase() + "' class='indicator'><p class='text-center'><small>" + data[i] + "</small></p></div>");
        }
        var controlsWidth = jqueryNoConflict('#controls').width();
        var numberOfElements = data.length;
        var elementDimension = (controlsWidth-5)/numberOfElements;
        jqueryNoConflict('#controls .indicator').css({
            'width': elementDimension + 'px',
            'height': elementDimension + 'px'
        });
        jqueryNoConflict('#controls .indicator:first').addClass('active');

        // here's the click event
        jqueryNoConflict('div.indicator').click(function(){
            var targetValue = jqueryNoConflict(this).attr('id');
            jqueryNoConflict('div').removeClass('active');
            jqueryNoConflict('div#' + targetValue).addClass('active');
            fn.displayNoteData(fn.arrayOfTopicNotes, targetValue);
        });
    },

    arrayOfTopicNotes: [],

    createTopicObjects: function(array, data){
        for(var i=0; i<array.length; i++){
            var topicObjectClass = {
                topic: array[i],
                notes: fn.createArrayOfNotes(array[i], data.document.annotations)
            };
            fn.arrayOfTopicNotes.push(topicObjectClass);
        }
    },

    createArrayOfNotes: function(comparison, data){
        var noteArray = [];
        for(var i=0; i<data.length; i++){
            var noteTitle = data[i].title.split(":");
            noteTitle = noteTitle[0].toProperCase();
            if (comparison === noteTitle){
                noteArray.push(data[i]);
            } else {
                continue;
            }
        };
        return noteArray;
    },
}
// end data configuration object

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = 'http://projects.scpr.org/static/static-files/v3-dependencies/templates/';
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');
        renderHandlebarsTemplate('templates/data-share.handlebars', '.data-share');
        renderHandlebarsTemplate('templates/data-details.handlebars', '.data-details');
        renderHandlebarsTemplate('templates/data-visuals.handlebars', '.data-visuals');

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