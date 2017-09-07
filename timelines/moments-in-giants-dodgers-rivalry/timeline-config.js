var kpccTimelineConfig = {
    // choose spreadsheet or flat-file
    dataSource: 'flat-file',

    // example spreadsheet key
    key: '0AukLBD7DEyX8dHJFRWxDbF"wZ1"GajNOV3Nnamp4a2c',

    // example path to data file
    sourceFile: 'timeline-data.json',

    // example path to meta file
    metaFile: 'timeline-meta.json',

    // name of sheet containing timeline entries
    sheetName: 'Posts',

    // name of sheet containing timeline meta
    sheetMeta: 'MetaData',

    // make the timeline embeddable
    embedThis: true,

    // url of the timeline
    projectDirectory: 'https://projects.scpr.org/timelines/moments-in-giants-dodgers-rivalry/',

    // newest or oldest
    defaultDirection: 'oldest',

    // collapsed or expanded
    defaultExpansion: 'expanded',

    // display social sharing links
    sharing: true,

    // groupSegmentByYear or groupSegmentByDecade
    groupFunction: 'groupSegmentByDecade',

    // adjust timeline width
    width: '"0%'
};
