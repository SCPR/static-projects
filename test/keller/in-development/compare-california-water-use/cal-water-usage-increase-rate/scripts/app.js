$( document ).ready(function(){
	$("#title1").html("<h2>Compare by year (same month)</h2><p>July 2014 vs July 2013</p>");
	$("#subtitle1").html("<h3>Top 10 agencies with most increase</h3>");
	$("#subtitle2").html("<h3>Top 10 agencies with most decrease</h3>");
	$("#title2").html("<h2>Compare by month (same year)</h2><p>July 2014 vs June 2014</p>");
	$("#subtitle3").html("<h3>Top 10 agencies with most increase</h3>");
	$("#subtitle4").html("<h3>Top 10 agencies with most decrease</h3>");
});

var chart = c3.generate({
	bindto: '#chart1',
	data: {
		x: 'x',
		url: "data/highest-by-year.csv",
		type: "bar",
		onclick: function (d, i) { console.log("onclick", d, i); },
		labels: true
	},

	axis: {
		x: {
	        type: 'category',
		},

		y: {
		    label: {
		      text: "Rate (%)",
		      position: 'outer-middle'
		    }
		  },
		
		rotated: true,
	},

});

var chart2 = c3.generate({
	bindto: '#chart2',
	data: {
		x: 'x',
		url: "data/lowest-by-year.csv",
		type: "bar",
		onclick: function (d, i) { console.log("onclick", d, i); },
		labels: true,
	},

	axis: {
		x: {
	        type: 'category',
		},

		y: {
		    label: {
		      text: "Rate (%)",
		      position: 'outer-middle'
		    }
		  },
		
		rotated: true,
	},

});

var chart = c3.generate({
	bindto: '#chart3',
	data: {
		x: 'x',
		url: "data/highest-by-month.csv",
		type: "bar",
		onclick: function (d, i) { console.log("onclick", d, i); },
		labels: true,
	},

	axis: {
		x: {
	        type: 'category',
		},

		y: {
		    label: {
		      text: "Rate (%)",
		      position: 'outer-middle'
		    }
		  },
		
		rotated: true,
	},

});

var chart = c3.generate({
	bindto: '#chart4',
	data: {
		x: 'x',
		url: "data/lowest-by-month.csv",
		type: "bar",
		onclick: function (d, i) { console.log("onclick", d, i); },
		labels: true,
	},

	axis: {
		x: {
	        type: 'category',
		},

		y: {
		    label: {
		      text: "Rate (%)",
		      position: 'outer-middle'
		    }
		  },
		
		rotated: true,
	},

});
