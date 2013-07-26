var jqueryNoConflict = jQuery;
var d;

jqueryNoConflict(document).ready(function() {
    d = new DataConverter();
    d.create();
});
