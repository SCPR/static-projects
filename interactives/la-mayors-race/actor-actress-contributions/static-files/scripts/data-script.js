var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function(){
    renderTestTemplate();
});

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

var celebrityData = {
    "objects": [{
        candidate: "Austin Beutner",
            donors: [
                {donorName: "Annabeth Gish", donorContribution: "250"},
                {donorName: "Christa B. Lawrence", donorContribution: "1000"},
                {donorName: "Debra Messing", donorContribution: "1000"},
                {donorName: "Heidi Tappis", donorContribution: "500"},
                {donorName: "Josh Brolin", donorContribution: "1000"},
                {donorName: "Kristen Vogelsong", donorContribution: "1000"},
                {donorName: "Robert Maschio", donorContribution: "100"}
            ]
        }, {
        candidate: "Eric Garcetti",
            donors: [
                {donorName: "Alicia Mitchell", donorContribution: "1300"},
                {donorName: "Aliza Lesser", donorContribution: "180"},
                {donorName: "Amy Aquino", donorContribution: "1000"},
                {donorName: "Amy Poehler", donorContribution: "1300"},
                {donorName: "Amy Smart", donorContribution: "750"},
                {donorName: "Andres Faucher", donorContribution: "200"},
                {donorName: "Ben Weber", donorContribution: "500"},
                {donorName: "Blanca Soto", donorContribution: "100"},
                {donorName: "Buckley Norris", donorContribution: "1000"},
                {donorName: "Danay Garcia", donorContribution: "500"},
                {donorName: "Donna Mills", donorContribution: "100"},
                {donorName: "Ed Begley Jr.", donorContribution: "250"},
                {donorName: "Elizabeth Kennedy", donorContribution: "250"},
                {donorName: "Emily Foy", donorContribution: "1300"},
                {donorName: "Evan Arnold", donorContribution: "1300"},
                {donorName: "Faith Salie", donorContribution: "500"},
                {donorName: "Ginna Carter", donorContribution: "250"},
                {donorName: "Gregg Henry", donorContribution: "200"},
                {donorName: "Harry J. Lennix", donorContribution: "1300"},
                {donorName: "Heather Thomas", donorContribution: "1050"},
                {donorName: "Hill Harper", donorContribution: "1000"},
                {donorName: "Hollie Stenson", donorContribution: "100"},
                {donorName: "Holly Maples", donorContribution: "100"},
                {donorName: "Ian Roberts", donorContribution: "1300"},
                {donorName: "J.K. Simmons", donorContribution: "1000"},
                {donorName: "Jake Gyllenhaal", donorContribution: "1000"},
                {donorName: "James Denton", donorContribution: "1000"},
                {donorName: "Jamie Lee Curtis Guest", donorContribution: "500"},
                {donorName: "Jon Kean", donorContribution: "1000"},
                {donorName: "Jonathan Del Arco", donorContribution: "250"},
                {donorName: "June Sattler", donorContribution: "100"},
                {donorName: "Kate Danson", donorContribution: "500"},
                {donorName: "Kimberly Selby", donorContribution: "1300"},
                {donorName: "Kristina Stonebreaker", donorContribution: "250"},
                {donorName: "Laura Giacomo", donorContribution: "250"},
                {donorName: "Lawrence Clarke", donorContribution: "500"},
                {donorName: "Lena Georgas", donorContribution: "300"},
                {donorName: "Lenore Douglas", donorContribution: "500"},
                {donorName: "Leo Marks", donorContribution: "200"},
                {donorName: "Leonora Gershman", donorContribution: "100"},
                {donorName: "Lisa Brenner", donorContribution: "500"},
                {donorName: "Lisa Edelstein", donorContribution: "1300"},
                {donorName: "Lloyd Gordon", donorContribution: "100"},
                {donorName: "Marg Helgenberger", donorContribution: "500"},
                {donorName: "Margaret Priest", donorContribution: "100"},
                {donorName: "Marie Georgas", donorContribution: "250"},
                {donorName: "Martha Hackett", donorContribution: "500"},
                {donorName: "Mary Mcdonnell", donorContribution: "250"},
                {donorName: "Matthew Carmony", donorContribution: "250"},
                {donorName: "Matthew Walsh", donorContribution: "1300"},
                {donorName: "Meera Narasimhan", donorContribution: "100"},
                {donorName: "Michael O'malley", donorContribution: "1000"},
                {donorName: "Monica H. Rosenthal", donorContribution: "1300"},
                {donorName: "Phillip Keene", donorContribution: "1000"},
                {donorName: "Rachel Nichols", donorContribution: "100"},
                {donorName: "Robert Gossett", donorContribution: "1000"},
                {donorName: "Russell Steinberg", donorContribution: "500"},
                {donorName: "Sal Iacono", donorContribution: "400"},
                {donorName: "Salma Hayek", donorContribution: "1000"},
                {donorName: "Sarah Chalke", donorContribution: "500"},
                {donorName: "Steven Klein", donorContribution: "150"},
                {donorName: "Talulah Riley", donorContribution: "500"},
                {donorName: "Tanya Mcqueen Forman", donorContribution: "1300"},
                {donorName: "Tiffany Sweet", donorContribution: "150"},
                {donorName: "Timothy Olyphant", donorContribution: "1300"},
                {donorName: "Tony Denison", donorContribution: "1300"},
                {donorName: "Vincent Kartheiser", donorContribution: "250"},
                {donorName: "William Brochtrup", donorContribution: "100"},
                {donorName: "Yasmine Johnson", donorContribution: "1000"}
            ]
        }, {
        candidate: "Wendy Greuel",
            donors: [
                {donorName: "Alan Mandell", donorContribution: "1300"},
                {donorName: "Alexandra Mcleod", donorContribution: "1300"},
                {donorName: "Ann Hall", donorContribution: "150"},
                {donorName: "Ann Lopez", donorContribution: "1000"},
                {donorName: "Barry Karas", donorContribution: "100"},
                {donorName: "Brandon Routh", donorContribution: "500"},
                {donorName: "Edward J. Begley", donorContribution: "500"},
                {donorName: "Eva Longoria", donorContribution: "1300"},
                {donorName: "Gabriel A. Gonzales", donorContribution: "1300"},
                {donorName: "Jill Kenny", donorContribution: "250"},
                {donorName: "Jillian Bartels", donorContribution: "200"},
                {donorName: "Jo Ciampafarrell", donorContribution: "500"},
                {donorName: "Julie Kagan", donorContribution: "1000"},
                {donorName: "Kate Capshaw", donorContribution: "1300"},
                {donorName: "Kevin Kendrick", donorContribution: "100"},
                {donorName: "Leonard Nimoy", donorContribution: "500"},
                {donorName: "Marg Helgenberger", donorContribution: "100"},
                {donorName: "Mariska Hargitay", donorContribution: "1000"},
                {donorName: "Michael Sutton", donorContribution: "500"},
                {donorName: "Monica Rosenthal", donorContribution: "1300"},
                {donorName: "Nancy Stephens", donorContribution: "500"},
                {donorName: "Nancy Travis", donorContribution: "500"},
                {donorName: "Penny Peyser", donorContribution: "360"},
                {donorName: "Rita Wilson", donorContribution: "1300"},
                {donorName: "Susan Nimoy", donorContribution: "500"},
                {donorName: "Teddi Cole", donorContribution: "350"},
                {donorName: "Theresa Davis", donorContribution: "500"},
                {donorName: "Tobey Maguire", donorContribution: "1300"},
                {donorName: "Tom Hanks", donorContribution: "1300"},
                {donorName: "Tom Kenny", donorContribution: "250"}
            ]
        }, {
        candidate: "Kevin James",
            donors: [
                {donorName: "Blake Edward Boyd", donorContribution: "1300"},
                {donorName: "Clint Howard", donorContribution: "400"},
                {donorName: "Donna Scott", donorContribution: "1300"},
                {donorName: "Erica Brettler", donorContribution: "250"},
                {donorName: "Gary Sinise", donorContribution: "250"},
                {donorName: "Jennifer Massey", donorContribution: "300"},
                {donorName: "Michelle Stafford", donorContribution: "1000"},
                {donorName: "Ruth Ann Geoghan", donorContribution: "100"}
            ]
        }, {
        candidate: "Jan Perry",
            donors: [
                {donorName: "Amy Poehler", donorContribution: "1300"},
                {donorName: "Elizabeth Cheap", donorContribution: "500"},
                {donorName: "George H. Takei", donorContribution: "1300"},
                {donorName: "Ian Roberts", donorContribution: "1300"},
                {donorName: "Matthew Walsh", donorContribution: "1300"},
                {donorName: "T'Keyah Crystal Keymah", donorContribution: "100"},
                {donorName: "William Pullman", donorContribution: "1000"}
            ]
        }
    ]
};

    // render flat file data
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', celebrityData);