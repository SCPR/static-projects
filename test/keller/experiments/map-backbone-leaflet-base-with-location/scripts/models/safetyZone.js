App.Models.SafetyZone = Backbone.Model.extend({
    defaults: {
        gang_name: null,
        url_to_injunction: null,
        document_cloud_url: null,
        case_filed: null,
        date_of_injunction: null,
        year_of_injunction: null,
        trial_date: null,
        judges_name: null,
        case_number: null,
        number_originally_targeted: null,
        notes: null,
    },
});