$.get("la-riots-25-years-later.csv", function(csv) {
    var tikTok = new TikTok({
        el: "#tik-tok-instance",
        projecturl: null,
        kicker: "Public Safety",
        title: "Timeline: The LA Riots, then and now",
        credits: "Associated Press",
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
