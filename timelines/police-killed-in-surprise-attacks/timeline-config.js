$.get("police-ambush-killings-data.csv", function(csv) {
    var tikTok = new TikTok({
        el: "#tik-tok-instance",
        projecturl: null,
        kicker: null,
        title: "Police killed in surprise attacks in the U.S. and its territories",
        credits: null,
        published: null,
        text: null,
        readmoreurl: null,
        sources: null,
        entries: csv,
        descending: true,
        groupBy: "years",
        dateDisplay: "MMMM D, YYYY"
    });
});
