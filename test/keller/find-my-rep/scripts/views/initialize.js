// initialize the page
App.Views.Initialize = Backbone.View.extend({

    tagName: 'div',

    className: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',

    template: template('gather-location-details'),

    initialize: function(){
        this.render();
    },

    events: {
        'keyup :input': 'addressSearch',
        'click button#submit': 'submitData',
        'click a.findMe': 'findMe',
    },

    addressSearch: function(){
        $('input[id="addressSearch"]').geocomplete({
            details: 'form'
        });
    },

    findMe: function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $("input[id='latitudeSearch']").attr('value', position.coords.latitude);
                $("input[id='longitudeSearch']").attr('value', position.coords.longitude);
                $('button#submit').trigger('click');
            }, null);
        } else {
            alert('Sorry, we could not find your location.');
        }
    },

    submitData: function(){
        $('.progress').removeClass('hidden');
        var latitudeValue = $("input[id='latitudeSearch']").val();
        var longitudeValue = $("input[id='longitudeSearch']").val();
        var locationParams = latitudeValue + ',' + longitudeValue;
        var searchRouter = new App.Router();
        searchRouter.navigate('search?location=' + locationParams, {
            trigger: true,
            replace: false
        });
    },

    render: function(){
        this.$el.html((this.template));
        return this;
    },
});