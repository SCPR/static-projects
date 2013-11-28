App.Views.DetailView = Backbone.View.extend({

    template: template('detail-template'),

    setModel: function(model){

        this.model = model;
        var $this = this;

        console.log(this.model[0].attributes);
        //console.log($this.model[0].attributes);

        if (!this.model[0].get('loaded')) {
            $this.model[0].set('loaded', true);
            $this.render();
        } else {
            $this.render();
        }
    },

    render: function(){
        this.$el.html(this.template(this.model[0].toJSON()));
        return this;
    },

});