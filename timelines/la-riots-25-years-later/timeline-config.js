$.get("la-riots-25-years-later.csv", function(csv) {
    var tikTok = new TikTok({
        el: "#tik-tok-instance",
        projecturl: null,
        kicker: "Public Safety",
        title: "Timeline: Rodney King and the LA Riots",
        credits: "Associated Press",
        published: null,
        text: null,
        readmoreurl: null,
        sources: null,
        entries: csv,
        descending: false,
        groupBy: "months",
        dateDisplay: "MMMM D, YYYY"
    });
});
