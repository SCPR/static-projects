const neighborhood = [
  {"id":0,"sqft":2000,"beds_baths":"4 bed, 4 bath","type":"Triplex","occupancy":"Owner-occupied","market_value":"$915,000","assessed_value":"$259,096","property_taxes":"$5,010","property_tax_rate":"0.55%"},
  {"id":1,"sqft":"n/a","beds_baths":"n/a beds, n/a baths","type":"Multiple single-family homes","occupancy":"Rented","market_value":"n/a","assessed_value":"$673,107","property_taxes":"$10,427","property_tax_rate":"n/a"},
  {"id":2,"sqft":991,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$694,000","assessed_value":"$384,343","property_taxes":"$6,222","property_tax_rate":"0.90%"},
  {"id":3,"sqft":1832,"beds_baths":"4 bed, 3 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$842,000","assessed_value":"$332,861","property_taxes":"$5,528","property_tax_rate":"0.66%"},
  {"id":4,"sqft":1172,"beds_baths":"4 bed, 1.5 bath","type":"Single-family home","occupancy":"Rented","market_value":"$696,000","assessed_value":"$39,081","property_taxes":"$1,660","property_tax_rate":"0.24%"},
  {"id":5,"sqft":865,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$705,000","assessed_value":"$111,436","property_taxes":"$3,274","property_tax_rate":"0.46%"},
  {"id":6,"sqft":2151,"beds_baths":"3 bed, 3 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$850,000","assessed_value":"$682,914","property_taxes":"$10,249","property_tax_rate":"1.21%"},
  {"id":7,"sqft":"n/a","beds_baths":"n/a beds, n/a baths","type":"Triplex","occupancy":"Rented","market_value":"n/a","assessed_value":"$111,437","property_taxes":"$3,113","property_tax_rate":"n/a"},
  {"id":8,"sqft":4547,"beds_baths":"n/a beds, n/a baths","type":"Fourplex","occupancy":"Rented","market_value":"n/a","assessed_value":"$303,918","property_taxes":"$6,020","property_tax_rate":"n/a"},
  {"id":9,"sqft":1000,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Rented","market_value":"$728,000","assessed_value":"$282,934","property_taxes":"$4,949","property_tax_rate":"0.68%"},
  {"id":10,"sqft":855,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$728,000","assessed_value":"$755,000","property_taxes":"$11,221","property_tax_rate":"1.54%"},
  {"id":11,"sqft":1962,"beds_baths":"4 bed, 3 bath","type":"Single-family home","occupancy":"Rented","market_value":"$901,000","assessed_value":"$454,209","property_taxes":"$7,324","property_tax_rate":"0.81%"},
  {"id":12,"sqft":1129,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$730,000","assessed_value":"$92,521","property_taxes":"$2,287","property_tax_rate":"0.31%"},
  {"id":13,"sqft":1446,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$773,000","assessed_value":"$53,192","property_taxes":"$1,812","property_tax_rate":"0.23%"},
  {"id":14,"sqft":1276,"beds_baths":"4 bed, 2 bath","type":"Single-family home","occupancy":"Rented","market_value":"$743,000","assessed_value":"$394,823","property_taxes":"$6,458","property_tax_rate":"0.87%"},
  {"id":15,"sqft":1137,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$730,000","assessed_value":"$541,061","property_taxes":"$8,336","property_tax_rate":"1.14%"},
  {"id":16,"sqft":2490,"beds_baths":"n/a beds, n/a baths","type":"Triplex","occupancy":"Rented","market_value":"$877,000","assessed_value":"$633,743","property_taxes":"$10,212","property_tax_rate":"1.16%"},
  {"id":17,"sqft":1190,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$736,000","assessed_value":"$107,858","property_taxes":"$2,494","property_tax_rate":"0.34%"},
  {"id":18,"sqft":"n/a","beds_baths":"n/a beds, n/a baths","type":"Apartment building","occupancy":"Rented","market_value":"n/a","assessed_value":"$649,262","property_taxes":"$12,803","property_tax_rate":"n/a"},
  {"id":19,"sqft":2038,"beds_baths":"3 bed, 2 bath","type":"Duplex","occupancy":"Rented","market_value":"$811,000","assessed_value":"$187,446","property_taxes":"$3,871","property_tax_rate":"0.48%"},
  {"id":20,"sqft":2017,"beds_baths":"4 bed, 3 bath","type":"Triplex","occupancy":"Rented","market_value":"$886,000","assessed_value":"$357,026","property_taxes":"$6,470","property_tax_rate":"0.73%"},
  {"id":21,"sqft":820,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Rented","market_value":"$657,000","assessed_value":"$117,949","property_taxes":"$2,724","property_tax_rate":"0.41%"},
  {"id":22,"sqft":1351,"beds_baths":"6 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$757,000","assessed_value":"$46,054","property_taxes":"$1,660","property_tax_rate":"0.22%"},
  {"id":23,"sqft":2710,"beds_baths":"6 bed, 3 bath","type":"Triplex","occupancy":"Rented","market_value":"$936,000","assessed_value":"$43,624","property_taxes":"$2,254","property_tax_rate":"0.24%"},
  {"id":24,"sqft":775,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Rented","market_value":"$713,000","assessed_value":"$335,497","property_taxes":"$5,658","property_tax_rate":"0.79%"},
  {"id":25,"sqft":1374,"beds_baths":"3 bed, 2 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$765,000","assessed_value":"$337,301","property_taxes":"$5,588","property_tax_rate":"0.73%"},
  {"id":26,"sqft":1297,"beds_baths":"2 bed, 2 bath","type":"Single-family home","occupancy":"Rented","market_value":"$768,000","assessed_value":"$410,548","property_taxes":"$6,670","property_tax_rate":"0.87%"},
  {"id":27,"sqft":1981,"beds_baths":"4 bed, 2.5 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$998,000","assessed_value":"$738,311","property_taxes":"$11,038","property_tax_rate":"1.11%"},
  {"id":28,"sqft":1238,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Rented","market_value":"$741,000","assessed_value":"$70,455","property_taxes":"$2,084","property_tax_rate":"0.28%"},
  {"id":29,"sqft":1238,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$740,000","assessed_value":"$90,502","property_taxes":"$2,259","property_tax_rate":"0.31%"},
  {"id":30,"sqft":1320,"beds_baths":"3 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$723,000","assessed_value":"$41,828","property_taxes":"$1,168","property_tax_rate":"0.16%"},
  {"id":31,"sqft":1851,"beds_baths":"3 bed, 1.5 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$790,000","assessed_value":"$402,918","property_taxes":"$6,473","property_tax_rate":"0.82%"},
  {"id":32,"sqft":2496,"beds_baths":"5 bed, 2 bath","type":"Duplex","occupancy":"Rented","market_value":"$876,000","assessed_value":"$62,320","property_taxes":"$2,282","property_tax_rate":"0.26%"},
  {"id":33,"sqft":2028,"beds_baths":"4 bed, 3 bath","type":"Single-family home","occupancy":"Rented","market_value":"$882,000","assessed_value":"$238,093","property_taxes":"$4,344","property_tax_rate":"0.49%"},
  {"id":34,"sqft":1028,"beds_baths":"2 bed, 2 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$722,000","assessed_value":"$339,521","property_taxes":"$5,608","property_tax_rate":"0.78%"},
  {"id":35,"sqft":1520,"beds_baths":"n/a beds, n/a baths","type":"Duplex","occupancy":"Rented","market_value":"$768,000","assessed_value":"$238,370","property_taxes":"$4,558","property_tax_rate":"0.59%"},
  {"id":36,"sqft":1228,"beds_baths":"n/a, n/a","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$737,000","assessed_value":"$145,289","property_taxes":"$2,804","property_tax_rate":"0.38%"},
  {"id":37,"sqft":825,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Rented","market_value":"$630,000","assessed_value":"$591,494","property_taxes":"$9,110","property_tax_rate":"1.45%"},
  {"id":38,"sqft":1998,"beds_baths":"n/a, n/a bath","type":"Duplex","occupancy":"Owner-occupied","market_value":"$801,000","assessed_value":"$128,968","property_taxes":"$3,043","property_tax_rate":"0.38%"},
  {"id":39,"sqft":1013,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$660,000","assessed_value":"$535,291","property_taxes":"$8,209","property_tax_rate":"1.24%"},
  {"id":40,"sqft":2012,"beds_baths":"4 bed, 2 bath","type":"Single-family home","occupancy":"Owner-occupied","market_value":"$928,000","assessed_value":"$130,251","property_taxes":"$2,796","property_tax_rate":"0.30%"},
  {"id":41,"sqft":1034,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Rented","market_value":"$727,000","assessed_value":"$43,163","property_taxes":"$1,715","property_tax_rate":"0.24%"},
  {"id":42,"sqft":1034,"beds_baths":"2 bed, 1 bath","type":"Single-family home","occupancy":"Rented","market_value":"$731,000","assessed_value":"$87,003","property_taxes":"$2,307","property_tax_rate":"0.32%"},
  {"id":43,"sqft":2260,"beds_baths":"2 bed, 1 bath","type":"Duplex","occupancy":"Owner-occupied","market_value":"$809,000","assessed_value":"$376,870","property_taxes":"$6,331","property_tax_rate":"0.78%"},
  {"id":44,"sqft":3536,"beds_baths":"4 bed, 6 bath","type":"Fourplex","occupancy":"Owner-occupied","market_value":"n/a","assessed_value":"$276,340","property_taxes":"$5,554","property_tax_rate":"n/a"},
  {"id":45,"sqft":2134,"beds_baths":"5 bed, 3 bath","type":"Triplex","occupancy":"Rented","market_value":"$877,000","assessed_value":"$150,409","property_taxes":"$3,693","property_tax_rate":"0.42%"}
];

$(document).ready(function(){

  $('#houses rect, #houses polygon, #houses line').click(function(){
    const activeHouse = $(this).attr('data-name');
    console.log(activeHouse)

    // $('#houses rect, #houses polygon, #houses line').removeClass('selected-house');
    $(this).addClass('selected-house')

    	//Fill in with data from JSON array
      $('.property-type span').html(neighborhood[activeHouse].type);
      $('.size span').html(neighborhood[activeHouse].beds_baths);
      $('.sqft span').html(addCommas(neighborhood[activeHouse].sqft));
      $('.occupancy span').html(neighborhood[activeHouse].occupancy);
      $('.tax-rate span').html(neighborhood[activeHouse].property_tax_rate);
      $('.taxes-paid span').html(neighborhood[activeHouse].property_taxes);
  		$('.market-value span').html(neighborhood[activeHouse].market_value);
      $('.assessed-value span').html(neighborhood[activeHouse].assessed_value);
  });
});

  // function showTooltip(evt, text) {
  //   let tooltip = document.getElementById("tooltip");
  //   tooltip.innerHTML = text;
  //   tooltip.style.display = "block";
  //   tooltip.style.left = evt.pageX + 10 + 'px';
  //   tooltip.style.top = evt.pageY + 10 + 'px';
  // }
  //
  // function hideTooltip() {
  //   var tooltip = document.getElementById("tooltip");
  //   tooltip.style.display = "none";
  // }

  // $('.house').mouseover(function(event){ //when hover starts
  //
  //   $('.house').removeClass('selected-house');
  //   $(this).addClass('selected-house');
  //
	// 	//Get the ID of the current tooltip
	// 	const activeTooltip = $(this).attr('data-house');
  //
	// 	//Fill in with data from JSON array
  //   $('.property-type span').html(neighborhood[activeTooltip].type);
  //   $('.size span').html(neighborhood[activeTooltip].beds_baths);
  //   $('.sqft span').html(addCommas(neighborhood[activeTooltip].sqft));
  //   $('.occupancy span').html(neighborhood[activeTooltip].occupancy);
  //   $('.tax-rate span').html(neighborhood[activeTooltip].property_tax_rate);
  //   $('.taxes-paid span').html(neighborhood[activeTooltip].property_taxes);
	// 	$('.market-value span').html(neighborhood[activeTooltip].market_value);
  //   $('.assessed-value span').html(neighborhood[activeTooltip].assessed_value);
  //
  //   $('.tooltip').css('left',event.pageX);
  //   $('.tooltip').css('top',event.pageY);
  //   $('.tooltip').show();
  //   $('.tooltip').css("position", 'absolute');
  // });
  //
  // const offsetBlock = $(".the-block").offset().top;
  //
  // $(window).scroll(function() {
  //   const scrollTopBlock = $(window).scrollTop();
  //   const neighborhoodSection = $('.the-block').offset().top - $('#the-neighborhood').outerHeight();
  //
  //   // Pin block graphic div on scroll
  //   if (scrollTopBlock > offsetBlock) {
  //     $(".the-block").addClass("sticky");
  //   } else {
  //     $(".the-block").removeClass("sticky");
  //   }
  //
  //
  //   if($(this).scrollTop() >= neighborhoodSection && $(".the-block").hasClass("fixed")){
  //      $(".the-block").removeClass("sticky");

    // Remove "swtich candidate" div from view when bottom of page is reached
    // if ($('body').height() <= ($(window).height() + $(window).scrollTop())) {
    //   $("#the-neighborhood").hide();
    // }else{
    //   $(".switch-container").show();
    // }

  // });
// });
