App.Models.Legislator = Backbone.Model.extend({
    defaults: {
        age: null,
        bioguide_id: null,
        birthdate: null,
        chamber: null,
        congressoffice: null,
        congresspediaurl: null,
        contact_form: null,
        crpid: null,
        district: null,
        facebookid: null,
        fax: null,
        fecid: null,
        first_name: null,
        gender: null,
        govtrackid: null,
        icpsr_id: null,
        image_path: null,
        inoffice: null,
        last_name: null,
        middlename: null,
        name_suffix: null,
        nickname: null,
        ocdid: null,
        ocemail: null,
        officialrss: null,
        party: null,
        phone: null,
        senateclass: null,
        state: null,
        state_name: null,
        term_end: null,
        term_start: null,
        thomas_id: null,
        title: null,
        twitter_id: null,
        votesmart_id: null,
        website: null,
        youtubeurl: null,
        html: "",
        loaded: false,
        kpccApiQueryUrl: null,
        kpccApiArticles: null,
        twitterApiQueryUrl: null,
        twitterApiTweets: null,
    },
});