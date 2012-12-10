    var jqueryNoConflict = jQuery;

    // begin main function
    jqueryNoConflict(document).ready(function(){


    });
    // end


    // function to generate iframe embed code
    function embedBox() {
        var embed_url = '#';
        jAlert('<strong>To embed this on your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"420px\" height=\"450px\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe>', 'Share or Embed');
    };
    // end