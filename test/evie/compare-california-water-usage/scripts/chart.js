$( document ).ready(function(){

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

var chart3 = c3.generate({
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

var chart4 = c3.generate({
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
