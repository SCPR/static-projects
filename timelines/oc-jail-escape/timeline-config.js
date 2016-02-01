var kpccTimelineConfig = {
    // choose spreadsheet or flat-file
    dataSource: "spreadsheet",

    // example spreadsheet key
    // key: "1wurBYSlWymWPJoSxzHjDK5fEai3IMb1vq9-xR_tGOOU",
    key: "1vL6mzs5TKn8gXVghUuiZ3RjwoPxy1YrIRQ-5cm3HQ4o",

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
    projectDirectory: "http://projects.scpr.org/timelines/oc-jail-escape/",

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
