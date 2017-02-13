$.get("pasadenas-devils-gate-dam.csv", function(csv) {
    var tikTok = new TikTok({
        el: "#tik-tok-instance",
        projecturl: null,
        kicker: "Timeline",
        title: "Sediment buildup at Pasadena's Devil's Gate Dam",
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
