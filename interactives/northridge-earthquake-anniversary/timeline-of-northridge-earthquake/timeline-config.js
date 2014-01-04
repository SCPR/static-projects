var kpccTimelineConfig = {
    // choose spreadsheet or flat-file
    dataSource: 'spreadsheet',

    // example spreadsheet key
    key: '0Aq8qwSArzKP9dEFPeEZhQXRmTl9MWmxrYl9kQXo3d1E',

    // example path to file
    //sourceFile: 'data/moments-in-giants-godgers-rivalry_timeline.json',

    // name of sheet containing timeline entries
    sheetName: 'Posts',

    // name of sheet containing timeline meta
    sheetMeta: 'MetaData',

    // url of the timeline
    projectDirectory: 'http://projects.scpr.org/static/interactives/northridge-earthquake-anniversary/timeline-of-northridge-earthquake/',

    // newest or oldest
    defaultDirection: 'oldest',

    // collapsed or expanded
    defaultExpansion: 'expanded',

    // display social sharing links
    sharing: true,

    // groupSegmentByYear or groupSegmentByDecade
    groupFunction: 'groupSegmentByYear',

    // adjust timeline width
    width: '90%'
};