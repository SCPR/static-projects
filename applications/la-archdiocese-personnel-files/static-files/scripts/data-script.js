var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    loadDocViewer();
});

// begin
function loadDocViewer(){

    dc.embed.load('http://www.documentcloud.org/search/embed/', {
        q: "projectid: 7784-la_clergy_files ",
        container: "#DC-search-projectid-7784-la_clergy_files",
        //title: "View the Documents",
        order: "title",
        per_page: 8,
        search_bar: true,
        organization: 97
    });
};

// create the bootrap modal
function clickModal(){
    jqueryNoConflict('#popupContent').modal('show');
};

function closeDialog () {
	jqueryNoConflict('#popupContent').modal('hide');
};

// begin remove article text
function alterDisplayDetails(){

    var $togglers = $('[data-toggle="collapse"]');
    $togglers.each(function() {
        var $this = $(this);
        var $collapsible = $($this.data('target'));
        $collapsible.on('hidden', function() {
            var text = $this.data('on-hidden');
            text && $this.text(text);
        }).on('shown', function() {
            var text = $this.data('on-active');
            text && $this.text(text);
            $('#content-display').empty();
        });
    });

    $('.collapse').collapse();
};

// embed function
function embedBox() {
    var embed_url = 'http://localhost:8880/2kpcc/static-projects/applications/la-archdiocese-personnel-files/iframe.html';

    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /> &lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"750px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};