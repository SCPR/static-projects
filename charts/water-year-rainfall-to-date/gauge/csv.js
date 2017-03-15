var nino_csv = function()
{
    var parse = d3.time.format("%m/%d/%Y").parse;
    d3.csv("nino_to_date.csv", function(nino)
    {
        //prices is an array of json objects containing the data in from the csv
        console.log("pct_of_normal_total:", pct_of_normal_total)
        data = nino.map(function(d)
        {
            //each d is one line of the csv file represented as a json object
            console.log("d", d)
            day_of_water_year = +d.day_of_water_year
            pct_of_normal_total = +d.pct_of_normal_total
            return {
                //"winter": winter,
                //"summer": summer
                "value":pct_of_normal_total
            }
        })
        console.log("data", data)
        bars(data);
    })
}
