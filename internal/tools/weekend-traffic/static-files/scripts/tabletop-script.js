    var jqueryNoConflict = jQuery;
    var dataConfig = dataConfig || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        dataConfig.initializeDataSource();
    });

    // begin data configuration object
    var dataConfig = {

        dataSpreadsheetKey: '0Aq8qwSArzKP9dC1pZ19wdU9Vc0gtd202NGZ2YUdVZ2c',

        initializeDataSource: function(){
            Tabletop.init({
                key: dataConfig.dataSpreadsheetKey,
                callback: dataConfig.processDataSource,
                parseNumbers: true,
                simpleSheet: true,
                debug: false
            });
        },

        arrayOfData: [],


        incidentsTrafficArray: [{
            location: "405 S",
            details: "Starting May 1, construction starts to aid wall 1921 construction at the southbound Skirball on-ramp. There will be intermittent full-ramp closures from X am to Z pm.", "url": "http://sv08data.dot.ca.gov/memos/files/comalert/042913_0.pdf?utm_source=dlvr.it&utm_medium=twitter"},{
            location: "405 S",
            details: "Starting May 1, construction starts to aid wall 1921 construction at the southbound Skirball on-ramp. There will be intermittent full-ramp closures from X am to Z pm.", "url": "http://sv08data.dot.ca.gov/memos/files/comalert/042913_0.pdf?utm_source=dlvr.it&utm_medium=twitter"}],

        processDataSource: function(data, tabletop){

            console.log(data);
            var categoryElement;

            jqueryNoConflict.each(data, function(i, record) {

                categoryElement = record.category;
                console.log(categoryElement);

                var locationElement = '<li><strong>' + record.location + '</strong>:';
                var detailsElement = record.details + '</li>';
                dataConfig.arrayOfData.push(locationElement, detailsElement);

            });

            var newTest = dataConfig.arrayOfData.join(' ');
            jqueryNoConflict('#data-details').html('<ul>' + newTest + '</ul>');
            jqueryNoConflict('#data-visuals').text('<ul>' + newTest + '</ul>');


            dataConfig.buildTrafficObject(categoryElement, dataConfig.incidentsTrafficArray);


        },




        buildTrafficObject: function(categoryTraffic, incidentsTrafficArray){

            var trafficCategoryObject = {
                category: categoryTraffic,
                incidents: incidentsTrafficArray
            };

            console.log(trafficCategoryObject);
        },


    }
    // end data configuration object