var kpccTimelineConfig = {
    // choose spreadsheet or flat-file
    dataSource: "spreadsheet",

    // example spreadsheet key
    // key: "1wurBYSlWymWPJoSxzHjDK5fEai3IMb1vq9-xR_tGOOU",
    key: "172_nfNg5W9yeFCR49X4u0JoxlkjHfptb0Z5y0RHHNT0",

    // example path to data file
    // sourceFile: "timeline-data.json",

    // example path to meta file
   //  metaFile: "timeline-meta.json",

    // name of sheet containing timeline entries
    sheetName: "Posts",

    // name of sheet containing timeline meta
    sheetMeta: "MetaData",

    // make the timeline embeddable
    embedThis: true,

    // url of the timeline
    projectDirectory: "https://projects.scpr.org/timelines/ucla-shooting/",

    // newest or oldest
    defaultDirection: "newest",

    // collapsed or expanded
    defaultExpansion: "expanded",

    // display social sharing links
    sharing: true,

    // groupSegmentByYear or groupSegmentByDecade
    groupFunction: "groupSegmentByYear",

    // adjust timeline width
    width: "90%"
};
