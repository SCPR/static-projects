var fn = fn || {};
var initializeProject = initializeProject || {};

$(document).ready(function() {
    initializeProject.renderPage();
});

// begin intitial page rendering
var initializeProject = {

    renderPage: function(){
        var checkExist = setInterval(function() {
            if ($('.header-links').length) {
                clearInterval(checkExist);
                initializeProject.hideEmbedBox();
            }

            if ($('.buttons').length) {
                clearInterval(checkExist);
                initializeProject.toggleDisplayIcon();
            }
        }, 1000);
    },

    hideEmbedBox: function(){
        if ("1" === ""){
            $('li.projects-embed').addClass('hidden');
        };
    },

    renderEmbedBox: function(){
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page. You may need to adjust the height parameter. <br /><br /> &lt;iframe src=\"'+ "http://projects.scpr.org/" +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){
        $('.text').on('shown.bs.collapse', function(){
            $('span.text').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        $('.text').on('hidden.bs.collapse', function(){
            $('span.text').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
        $('.about').on('shown.bs.collapse', function(){
            $('span.about').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        $('.about').on('hidden.bs.collapse', function(){
            $('span.about').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
        if ("1" === "1"){
            $('.text').collapse('show');
        };
    }
};
// end intitial page rendering