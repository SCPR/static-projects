App.Views.DetailView = Backbone.View.extend({

    tagName: 'div',

    id: 'candidate-profile',

    template: template('detail-template'),

    setModel: function(model){
        this.model = model;
        var $this = this;
        var kpccApiQuery = this.model[0].attributes.first_name + '+' + this.model[0].attributes.last_name;
        var kpccApiQueryUrl = "http://www.scpr.org/api/v3/articles?types=news,blogs&limit=5&query=" + kpccApiQuery;
        $this.model[0].set('kpccApiQueryUrl', kpccApiQueryUrl);

        var twitterApiQuery = this.model[0].attributes.twitter_id;
        var twitterApiQueryUrl;

        if (twitterApiQuery === null){
            twitterApiQueryUrl = null
        } else {
            twitterApiQueryUrl = "https://socal-political-tweets.herokuapp.com/1.1/statuses/user_timeline.json?count=5&screen_name=" + twitterApiQuery + "&callback=?";
        }

        $this.model[0].set('twitterApiQueryUrl', twitterApiQueryUrl);

        if (!this.model[0].get('loaded')) {
            $this.model[0].set('loaded', true);

            var getArticles = function(targetUrl){
                return $.get(targetUrl, {count: 5}, null, 'json');
            };

            var getTweets = function(targetUrl){
                return $.get(targetUrl, {count: 5}, null, 'jsonp');
            };

            if (twitterApiQueryUrl === null){

                $.when(
                    getArticles(kpccApiQueryUrl)
                    //getTweets(twitterApiQueryUrl)
                ).done(function(articles){
                    $this.model[0].set('kpccApiArticles', articles.articles);
                    $this.render();
                });

            } else {

                $.when(
                    getArticles(kpccApiQueryUrl),
                    getTweets(twitterApiQueryUrl)
                ).done(function(articles, tweets){
                    $this.model[0].set('kpccApiArticles', articles[0].articles);
                    $this.model[0].set('twitterApiTweets', tweets[0]);
                    $this.render();
                });

            }

            console.log($this.model[0]);

            /*
            $.ajax({
                url: kpccApiQueryUrl,
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function(data){
                    $this.model[0].set('kpccApiArticles', data.articles);
                }
            });

            $.ajax({
                url: twitterApiQueryUrl,
                dataType: 'jsonp',
                async: false,
                success: function(data){
                    $this.model[0].set('twitterApiTweets', data);
                }
            });
            */

        } else {
            $this.render();
        }
    },

    render: function(){
        this.$el.html(this.template(this.model[0].toJSON()));
        return this;
    },
});