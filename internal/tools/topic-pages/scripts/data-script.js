var fn = fn || {};

$(document).ready(function() {
    var this_data = fn.retrieve_ajax_data("http://www.scpr.org/api/v3/tags");
    var sorted = this_data.tags.sort(fn.compare);
    var results = fn.process_api_data(sorted);
    $.each(results, function(index, value){
        $("#page-links").append(
            "<h5><a href='" + value.url + "' target='blank'>" + value.title + "</a></h5>"
        );
    });
});

var fn = {

    retrieve_ajax_data: function(target_url){
        var data = "";
        $.ajax({
            async: false,
            url: target_url,
            dataType: 'json',
            success: function(response){
                data = response;
            }
        });
        return data;
    },

    process_api_data: function(array){
        var results = [];
        $.each(array, function(index, value){
            var tag_proto = {
                slug: null,
                url: null,
                title: null,
                quantity: null,
            };
            tag_proto.slug = value.slug;
            tag_proto.title = value.title;
            tag_proto.url = "http://www.scpr.org/topics/" + value.slug + "/";
            results.push(tag_proto);
        });
        return results;
    },

    compare: function(a, b){
        if (a.slug < b.slug)
            return -1;
        if (a.slug > b.slug)
            return 1;
        return 0;
    },

};
