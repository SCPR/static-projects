    window.splitTitle = function(title){
        var split_title = title.split("Email");
        parsed_date = moment(split_title[0]).format('MMMM D, YYYY');
        split_title[0] = parsed_date;
        return split_title[0] + " email " + split_title[1];
    };

    App.Router = Backbone.Router.extend({

        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderSearchView",
        },

        renderSearchView: function(){
            $(".data-visuals").html(
                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                    "<div id='DC-search-projectid-19698-public-comments-regarding-state-water-board-conservation-proposal' class='DC-search-container'></div>" +
                "</div>"
            );

            dc.embed.load('http://www.documentcloud.org/search/embed/', {
                q: "projectid: 19698-public-comments-regarding-state-water-board-conservation-proposal ",
                container: "#DC-search-projectid-19698-public-comments-regarding-state-water-board-conservation-proposal",
                order: "title",
                per_page: 12,
                search_bar: true,
                organization: 97
            });
        }
    });
