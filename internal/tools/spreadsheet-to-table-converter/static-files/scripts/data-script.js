var jqueryNoConflict = jQuery;
var d;

jqueryNoConflict(document).ready(function() {
    d = new DataConverter();
    d.create();
    $("#dataInput").on("paste", function (e){
        var checkExist = setInterval(function() {
            if ($(".kpcc-table").length) {
                createTableMark();
                clearInterval(checkExist);
            }
        }, 1000);
    });
});

function createTableMark(){

    console.log("table!");
    $(".kpcc-table").each(function(){
        $("tbody tr").each(function(){
            $(this).find("td").each(function(){
                var myLabel = $(this).index() + 1;
                myLabel = $(this).closest("table").find("thead th:nth-child(" + myLabel + ")").text();
                $(this).prepend("<mark>" + myLabel + "</mark>");
            });
        });
    });

};