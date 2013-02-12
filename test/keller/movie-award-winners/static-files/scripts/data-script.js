var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function(){
    //retriveData();
    renderDataVisualsTemplate(testData);

});

// grab data
function retriveData(){
    var dataSource = 'static-files/data/movie-award-winners.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

var testData = {"objects": [{
    award_agency: "New York Film Critics",
        source_link: "http://www.nyfcc.com/awards/",
        awards: [
            {award: "Best Actor", winner: "Daniel Day-Lewis", movie: "(Lincoln)"},
            {award: "Best Actress", winner: "Rachel Weisz", movie: "(Deep Blue Sea)"},
            {award: "Best Director", winner: "Kathryn Bigelow", movie: "(Zero Dark Thirty)"},
            {award: "Best Film", winner: "Kathryn Bigelow", movie: "(Zero Dark Thirty)"}
        ]
    }, {
    award_agency: "LA Film Critics",
        source_link: "http://www.lafca.net/years/2012.html",
        awards: [
            {award: "Best Actor", winner: "Joaquin Phoenix", movie: "(The Master)"},
            {award: "Best Actress", winner: "Jennifer Lawrence/Emmanuelle Riva", movie: "Silver Linings Playbook/Amour)"},
            {award: "Best Director", winner: "Paul Thomas Anderson", movie: "(The Master)"},
            {award: "Best Film", winner: "Michael Haneke", movie: "(Amour)"}
        ]
    }, {
    award_agency: "European Film Awards",
        source_link: "http://www.europeanfilmacademy.org/News-detail.155.0.html?&tx_ttnews[tt_news]=88&cHash=b859c57aafcfa00d80f829301a1e03ec",
        awards: [
            {award: "Best Actor", winner: "Jean-Louis Trintignant", movie: "(Amour)"},
            {award: "Best Actress", winner: "Emmanuelle Riva", movie: "(Amour)"},
            {award: "Best Director", winner: "Michael Haneke", movie: "(Amour)"},
            {award: "Best Film", winner: "Michael Haneke", movie: "(Amour)"}
        ]
    }, {
    award_agency: "Critics' Choice",
        source_link: "http://www.criticschoice.com/movie-awards/",
        awards: [
            {award: "Best Actor", winner: "Daniel Day-Lewis", movie: "(Lincoln)"},
            {award: "Best Actress", winner: "Jessica Chastain", movie: "(Zero Dark Thirty)"},
            {award: "Best Director", winner: "Ben Affleck", movie: "(Argo)"},
            {award: "Best Film", winner: "Ben Affleck", movie: "(Argo)"}
        ]
    }, {
    award_agency: "Golden Globes",
        source_link: "www.goldenglobes.org/",
        awards: [
            {award: "Best Actor", winner: "Daniel Day-Lewis", movie: "(Lincoln)"},
            {award: "Best Actress", winner: "Jessica Chastain", movie: "(Zero Dark Thirty)"},
            {award: "Best Director", winner: "Ben Affleck", movie: "(Argo)"},
            {award: "Best Film", winner: "Ben Affleck", movie: "(Argo)"}
        ]
    }, {
    award_agency: "London Film Critics",
        source_link: "http://www.criticscircle.org.uk/",
        awards: [
            {award: "Best Actor", winner: "Joaquin Phoenix", movie: "(The Master)"},
            {award: "Best Actress", winner: "Emmanuelle Riva", movie: "(Amour)"},
            {award: "Best Director", winner: "Ang Lee", movie: "(Life of Pi)"},
            {award: "Best Film", winner: "Michael Haneke ", movie: "(Amour)"}
        ]
    }, {
    award_agency: "Directors Guild of America",
        source_link: "http://www.dga.org/Awards/Annual.aspx",
        awards: [
            {award: "Best Actor", winner: "--", movie: ""},
            {award: "Best Actress", winner: "--", movie: ""},
            {award: "Best Director", winner: "Ben Affleck", movie: "(Argo)"},
            {award: "Best Film", winner: "--", movie: ""}
        ]
    }, {
    award_agency: "Screen Actors Guild",
        source_link: "http://www.sagawards.org/awards/nominees-and-recipients/19th-annual-screen-actors-guild-awards",
        awards: [
            {award: "Best Actor", winner: "Daniel Day-Lewis", movie: "(Lincoln)"},
            {award: "Best Actress", winner: "Jennifer Lawrence", movie: "(Silver Linings Playbook)"},
            {award: "Best Director", winner: "--", movie: ""},
            {award: "Best Film", winner: "Ensemble Cast", movie: "(Argo)"}
        ]
    }, {
    award_agency: "Baftas",
        source_link: "http://www.bafta.org/film/awards/",
        awards: [
            {award: "Best Actor", winner: "Daniel Day-Lewis", movie: "(Lincoln)"},
            {award: "Best Actress", winner: "Emmanuelle Riva", movie: "(Amour)"},
            {award: "Best Director", winner: "Ben Affleck", movie: "(Argo)"},
            {award: "Best Film", winner: "Ben Affleck", movie: "(Argo)"}
        ]
    }, {
    award_agency: "Writers Guild of America",
        source_link: "http://www.wga.org/awards/awardssub.aspx?id=59",
        awards: [
            {award: "Best Actor", winner: "", movie: ""},
            {award: "Best Actress", winner: "", movie: ""},
            {award: "Best Director", winner: "", movie: ""},
            {award: "Best Film", winner: "", movie: ""}
        ]
    }, {
    award_agency: "Academy Awards",
        source_link: "http://oscar.go.com/",
        awards: [
            {award: "Best Actor", winner: "", movie: ""},
            {award: "Best Actress", winner: "", movie: ""},
            {award: "Best Director", winner: "", movie: ""},
            {award: "Best Film", winner: "", movie: ""}
        ]
    }

]}

// render compiled handlebars template
function renderDataVisualsTemplate(testData){
    handlebarsDebugHelper();
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', testData);
};

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
};

// function to compile handlebars template
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/flu-clinics/iframe.html';

    jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"600px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};