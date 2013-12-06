App.Views.DetailView = Backbone.View.extend({

    tagName: 'div',

    id: 'representative-profile',

    template: template('detail-template'),

    events: {
        "click a.findMe": "navigate",
        "click a.searchMe": "navigate"
    },

    navigate: function(){
        window.app.navigate('', true);
    },

    setModel: function(model){

        $('.progress-detail').removeClass('hidden');

        this.model = model;

        var $this = this;

        if ($this.model[0].attributes.birthday != null){
            var age = this.calculateAge(moment($this.model[0].attributes.birthday).format('MM/DD/YYYY'));
            $this.model[0].set('age', age);
        } else {
            $this.model[0].set('age', null);
        };

        var kpccApiQuery = $this.model[0].attributes.first_name + '+' + $this.model[0].attributes.last_name;

        var kpccApiQueryUrl = "http://www.scpr.org/api/v3/articles?types=news,blogs&limit=5&query=" + kpccApiQuery;

        $this.model[0].set('kpccApiQueryUrl', kpccApiQueryUrl);

        var twitterApiQuery = $this.model[0].attributes.twitter_id;

        var twitterApiQueryUrl;

        if (twitterApiQuery === null){
            twitterApiQueryUrl = null
        } else {
            twitterApiQueryUrl = "https://socal-political-tweets.herokuapp.com/1.1/statuses/user_timeline.json?count=5&screen_name=" + twitterApiQuery + "&callback=?";
        };

        $this.model[0].set('twitterApiQueryUrl', twitterApiQueryUrl);

        if (!$this.model[0].get('loaded')) {

            $this.model[0].set('loaded', true);

            var getArticles = function(targetUrl){
                return $.get(targetUrl, {count: 5}, null, 'json');
            };

            var getTweets = function(targetUrl){
                return $.get(targetUrl, {count: 5}, null, 'jsonp');
            };

            var IE8 = (navigator.userAgent.toString().toLowerCase().indexOf('trident/4.0') != -1);
            var IE9 = navigator.userAgent.toString().toLowerCase().indexOf("trident/5")>-1;

            if (IE8 === true || IE9 === true){
                $this.render();
            } else {
                if (twitterApiQueryUrl === null){
                    $.when(
                        getArticles(kpccApiQueryUrl)
                    ).done(function(articles){
                        $this.model[0].set('kpccApiArticles', articles.articles);
                        $this.render();
                    });
                } else {
                    $.when(
                        getArticles(kpccApiQueryUrl),
                        getTweets(twitterApiQueryUrl)
                    ).done(function(articles, tweets){
                        if (articles[0].articles.length === 0){
                            $this.model[0].set('kpccApiArticles', null);
                        } else {
                            $this.model[0].set('kpccApiArticles', articles[0].articles);
                        };
                        $this.model[0].set('twitterApiTweets', tweets[0]);

                        $this.render();
                    });
                }
            }
        } else {
            $this.render();
        };
    },

    calculateAge: function(birthday){
        var birth = new Date(birthday);
        var today = moment().format('MM/DD/YYYY');
        var check = new Date(today);
        var milliDay = 1000 * 60 * 60 * 24;
        var ageInDays = (check-birth)/milliDay;
        var ageInYears =  Math.floor(ageInDays / 365 );
        return ageInYears;
    },

    render: function(){
        this.$el.html(this.template(this.model[0].toJSON()));
        $('#representative-articles img').addClass('responsive');
        $('.progress-detail').addClass('hidden');
        return this;
    },
});