$.get("pasadenas-devils-gate-dam.csv", function(csv) {
    var tikTok = new TikTok({
        el: "#tik-tok-instance",
        projecturl: null,
        kicker: null,
        title: "Xxxxxxx",
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
