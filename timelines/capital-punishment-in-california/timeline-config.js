var kpccTimelineConfig = {
    // choose spreadsheet or flat-file
    dataSource: "flat-file",

    // example spreadsheet key
    key: "0Aq8qwSArzKP9dFVzVlAzdkt0OWNDT1dnNXdIMHlPMnc",

    // example path to data file
    sourceFile: "timeline-data.json",

    // example path to meta file
    metaFile: "timeline-meta.json",

    // name of sheet containing timeline entries
    sheetName: "Posts",

    // name of sheet containing timeline meta
    sheetMeta: "MetaData",

    // make the timeline embeddable
    embedThis: true,

    // url of the timeline
    projectDirectory: "http://projects.scpr.org/static/timelines/capital-punishment-in-california",

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