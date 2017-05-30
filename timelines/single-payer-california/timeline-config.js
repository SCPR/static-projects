$.get("single-payer.csv", function(csv) {
    var tikTok = new TikTok({
        el: "#tik-tok-instance",
        projecturl: null,
        kicker: "Health",
        title: "Timeline: Single payer in California",
        credits: null,
        published: null,
        text: null,
        readmoreurl: null,
        sources: null,
        entries: csv,
        descending: true,
        groupBy: "years",
        dateDisplay: "YYYY"
    });
});
