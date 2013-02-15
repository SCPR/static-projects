jQuery(document).ready(function($) {

	var whereto;
	whereto = $(document).getUrlParam("dest");
	location.href = whereto;

});