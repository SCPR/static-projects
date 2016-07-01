var fn = fn || {};

$(document).ready(function() {
    fn.retrieve_api_data("http://www.scpr.org/api/v3/tags");
});

var fn = {

    retrieve_api_data: function(target_url){
        $.getJSON(target_url, fn.process_data);
    },

    process_data: function(data){
        fn.write_block_to_page(data.tags)
    },

    write_block_to_page: function(array){
        var url_base = "http://www.scpr.org/topics/"
        var sorted = array.sort(fn.compare);
        $.each(sorted, function(index, value){
            $("#page-links").append(
                "<h3><a href='" + url_base + value.slug + "' target='blank'>" + value.title + "</a></h3>"
            );
        });
    },

    get_article_count: function(tag){
        var tag_count_url = "http://www.scpr.org/api/v3/articles/?tags=" + tag + "&limit=500";
    },

    compare: function(a, b){
        if (a.slug < b.slug)
            return -1;
        if (a.slug > b.slug)
            return 1;
        return 0;
    },


};
