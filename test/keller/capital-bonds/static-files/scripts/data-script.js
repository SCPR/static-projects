   var jqueryNoConflict = jQuery;
   var chart;

    // begin main function
    jqueryNoConflict(document).ready(function(){
        retriveData();
        //drawChart();

    });
    // end

    // render handlebars templates via ajax
    function getTemplateAjax(path, callback) {
        var source;
        var template;

        jqueryNoConflict.ajax({
            url: path,
                success: function(data) {
                    source = data;
                    template = Handlebars.compile(source);
                        if (callback) callback(template);
                }
        });
    };
    //end

    // function to grab data
    function retriveData() {
        jqueryNoConflict.getJSON('static-files/data/cab_data.json', processData);

    };
    // end

    // function to build html display
    function buildTemplateWith(data){
        var source = getTemplateAjax('static-files/templates/debt-table.handlebars', function(template) {
            jqueryNoConflict('#school-debt-details').html(template(data));
        });
    };
    // end


    // create objects from json data
    function processData(data){

        // structure handlebars data like this
        /*
        var testData = {"testObjects": [{"cab_principal": "17441620", "debt_to_principal": "1.09", "maturity_date": "3/1/2009", "county": "Orange", "sale_date": "5/31/2007", "cab_interest": "1558380", "sale_year": "2007", "cab_debt": "19000000", "issuer": "Irvine Unified School District CFD No 06-1", "maturity_length": "1.8"}, {"cab_principal": "61577670", "debt_to_principal": "1.25", "maturity_date": "9/1/2011", "county": "Orange", "sale_date": "6/13/2007", "cab_interest": "15422330", "sale_year": "2007", "cab_debt": "77000000", "issuer": "Tustin Unified School District CFD No 07-1", "maturity_length": "4.2"}]};
        buildTemplateWith(testData);
        */

        var schoolDistrictValue;
        var bonds = data.objects;
        var testObjects = [];

        $('#school-district').change(function(){
            schoolDistrictValue = $('#school-district :selected').val();

                testObjects = [];

                for(var i=0; i<bonds.length; i++){

                    if (bonds[i].issuer === schoolDistrictValue) {

                        var myQueriedDataObject = {
                            cab_debt: bonds[i].cab_debt,
                            cab_interest: bonds[i].cab_interest,
                            cab_principal: bonds[i].cab_principal,
                            county: bonds[i].county,
                            debt_to_principal: bonds[i].debt_to_principal,
                            issuer: bonds[i].issuer,
                            maturity_date: bonds[i].maturity_date,
                            maturity_length: bonds[i].maturity_length,
                            sale_date: bonds[i].sale_date,
                            sale_year: bonds[i].sale_year
                        };

                        console.log(myQueriedDataObject);
                        testObjects.push(myQueriedDataObject);

                    }

                };

                var testData = {
                    objects: testObjects
                };

                buildTemplateWith(testData);

        });

    };
    // end