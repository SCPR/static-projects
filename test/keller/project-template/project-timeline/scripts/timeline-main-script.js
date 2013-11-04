/*
    Vertical timeline plugin for jQuery.
    Data powered by Google Docs.
    Sharing is using old APIs and breaks in some browsers.
*/

(function($, w, undefined) {
    $.fn.verticalTimeline = function(options) {
    // Configuration for timeline.  defaultDirection should be
    // "newest" or "oldest".  groupFunction is a function
    // to handle grouping

    var defaults = {
        key: 'https://docs.google.com/spreadsheet/pub?key=0AsmHVq28GtVJdG1fX3dsQlZrY18zTVA2ZG8wTXdtNHc&output=html',
        sheetName: 'Posts',
        defaultDirection: 'newest',
        defaultExpansion: 'expanded',
        groupFunction: 'groupSegmentByYear',
        sharing: false,
        //gutterWidth: 56,
        width: 'auto',
        handleResize: false,

        columnMapping: {
            'title': 'title',
            'date': 'date',
            'display_date': 'display date',
            'media_type': 'media type',
            'media_url': 'media url',
            'caption': 'caption',
            'body': 'body',
            'read_more_url': 'read more url',
            'title': 'title'
        },

        // templates for content
        postTemplate: ' \
        <div class="row"> \
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> \
                <div class="item post"> \
                        <div class="row inner"> \
                            {{#if media_type}} \
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6"> \
                                    <div class="timestamp">{{timestamp}}</div> \
                                    <div class="date kicker"><h5>{{display_date}}</h5></div> \
                                    <div class="title"><h4>{{title}}</h4></div> \
                                    <div class="body"> \
                                        {{#if body}} \
                                            <div class="text"><p>{{{body}}}</p></div> \
                                        {{/if}} \
                                    </div> \
                                </div> \
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6"> \
                                    <div class="body"> \
                                        {{#is media_type "image"}} \
                                            <img src="{{media_url}}" alt="{{title}}" class="responsive"> \
                                            {{#if caption}} \
                                                <div class="caption"><p>{{caption}}</p></div> \
                                            {{/if}} \
                                        {{else}} \
                                            <div> \
                                            {{{media_url}}} \
                                            </div> \
                                        {{/is}} \
                                    </div> \
                                </div> \
                                <div class="clearfix"> \
                                    {{#if read_more_url}} \
                                        <div class="btn-group btn-group-justified"> \
                                            <a target="_blank" class="btn btn-success" href="{{read_more_url}}">Read More</a> \
                                        </div> \
                                    {{/if}} \
                                </div> \
                            {{else}} \
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> \
                                    <div class="timestamp">{{timestamp}}</div> \
                                    <div class="date"><h4>{{display_date}}</h4></div> \
                                    <div class="title"><h5>{{title}}</h5></div> \
                                    <div class="body"> \
                                        {{#if body}} \
                                            <div class="text"><p>{{{body}}}</p></div> \
                                        {{/if}} \
                                    </div> \
                                </div> \
                                <div class="clearfix"> \
                                    {{#if read_more_url}} \
                                        <div class="btn-group btn-group-justified"> \
                                            <a target="_blank" class="btn btn-success" href="{{read_more_url}}">Read More</a> \
                                        </div> \
                                    {{/if}} \
                                </div> \
                            {{/if}} \
                        </div> \
                </div> \
            </div> \
        </div> \
        ',

        groupMarkerTemplate: ' \
        <div class="item group-marker item-group-{{id}}" data-id="{{id}}"> \
            <div class="inner"> \
                <div class="inner2"> \
                    <div class="timestamp">{{timestamp}}</div> \
                    <div class="group">{{groupDisplay}}</div> \
                </div> \
            </div> \
        </div> \
        ',

/*
        buttonTemplate: ' \
        <div class="row"> \
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> \
                <div class="btn-group btn-group-justified"> \
                    <a class="expand-all active btn btn-info" href="javascript:void(0)"><span>Expand all</span></a> \
                    <a class="collapse-all btn btn-info" href="javascript:void(0)"><span>Collapse all</span></a> \
                    <a class="sort-newest active btn btn-info" href="javascript:void(0)"><span>Newest first</span></a> \
                    <a class="sort-oldest btn btn-info" href="javascript:void(0)"><span>Oldest first</span></a> \
                </div> \
            </div> \
        </div> \
        ',
*/

        timelineTemplate: ' \
        <div class="vertical-timeline-timeline"> \
            <div class="line-container"> \
                <div class="line"></div> \
            </div> \
        </div> \
        '
    };

    // grouping function by decade
    var groupSegmentByDecade = function(segment, groups, direction) {

        // grouping by decade
        var year = new Date(segment.timestamp).getFullYear();
        var yearStr = year.toString();
        var id = yearStr.slice(0, -1);

        groups[id] = {
            id: id,
            groupDisplay: id + '0\s',
            timestamp: (direction == 'newest') ?
            Date.parse('December 31, ' + id + '9') :
            Date.parse('January 1, ' + id + '0'),
            timestampStart: Date.parse('January 1, ' + id + '0'),
            timestampEnd: Date.parse('December 31, ' + id + '9')
        };

        return groups;
    };

    // grouping function by year
    var groupSegmentByYear = function(segment, groups, direction) {
        var year = new Date(segment.timestamp).getFullYear();

        groups[year] = {
            id: year,
            groupDisplay: year,
            timestamp: (direction == 'newest') ?
            Date.parse('December 31, ' + year) :
            Date.parse('January 1, ' + year),
            timestampStart: Date.parse('January 1, ' + year),
            timestampEnd: Date.parse('December 31, ' + year)
        };

        return groups;
    };

    // mix defaults with options
    var timelineConfig = $.extend(defaults, options);

    // as a niceity, if the group function is a string referring to group function, then use that
    timelineConfig.groupFunction = (timelineConfig.groupFunction === 'groupSegmentByYear') ?
        groupSegmentByYear : timelineConfig.groupFunction;
    timelineConfig.groupFunction = (timelineConfig.groupFunction === 'groupSegmentByDecade') ?
        groupSegmentByDecade : timelineConfig.groupFunction;

    // go through each jquery object
    return this.each(function() {
        var $thisObj = $(this);
        var groups = {};
        var verticalTimeline = {};

        // add class to mark as processed
        $thisObj.addClass('vertical-timeline-container');

        // add in extra markup
        $thisObj.html(timelineConfig.buttonTemplate + timelineConfig.timelineTemplate);

        // handle data loaded in from tabletop or directly, then render
        verticalTimeline.setupTimeline = function(data, tabletop) {
            var postTemplate  = Handlebars.compile(timelineConfig.postTemplate);
            var groupMarkerTemplate  = Handlebars.compile(timelineConfig.groupMarkerTemplate);

            // Check for data
            if (tabletop) {
                data = tabletop.sheets(timelineConfig.sheetName).all();
            }

            // go through data from the sheet
            $.each(data, function(i, val) {

                // create groups by year or whatever
                groups = timelineConfig.groupFunction(val, groups, timelineConfig.defaultDirection);

                // add any other data
                val.sharing = timelineConfig.sharing;

                // add output to timeline
                $thisObj.find('.vertical-timeline-timeline').append(postTemplate(val));
            });

            // add a group marker for each group
            $.each(groups, function(i, group) {
                $thisObj.find('.vertical-timeline-timeline').append(groupMarkerTemplate(group));
            });

            verticalTimeline.handleSharing();
            verticalTimeline.handleExpanding();
            verticalTimeline.handleSorting();
            verticalTimeline.adjustWidth();
            verticalTimeline.handleResizing();



            // start rendering isotope goodness when images are loaded
            /*
            $thisObj.find('.vertical-timeline-timeline').imagesLoaded(function() {
                $thisObj.find('.vertical-timeline-timeline').isotope({
                    itemSelector : '.item',
                    transformsEnabled: true,
                    layoutMode: 'spineAlign',
                    spineAlign:{
                        gutterWidth: timelineConfig.gutterWidth
                    },
                    getSortData: {
                        timestamp: function($elem) {
                            return parseFloat($elem.find('.timestamp').text());
                        }
                    },
                    sortBy: 'timestamp',
                    sortAscending: (timelineConfig.defaultDirection == 'newest') ? false : true,
                    itemPositionDataEnabled: true,
                    onLayout: function($elems, instance) {
                        verticalTimeline.adjustLine();
                    }
                });
            });
        */

        };

        // handle sharing
        verticalTimeline.handleSharing = function() {

            // load scripts after all the html has been set
            if (timelineConfig.sharing) {
                $.getScript('//static.ak.fbcdn.net/connect.php/js/FB.Share');
                $.getScript('//platform.twitter.com/widgets.js');
                $thisObj.find('.vertical-timeline-timeline .post .share').hover(
                function() {
                    $(this).find('.share-trigger').addClass('over');
                    $(this).find('.share-popup').show();
                },
                function() {
                    $(this).find('.share-trigger').removeClass('over');
                    $(this).find('.share-popup').hide();
                });
            }
        };

        // handle post expanding/collapsing
        verticalTimeline.handleExpanding = function() {

            // Add open/close buttons to each post
            $thisObj.find('.vertical-timeline-timeline .item.post').each(function() {
                $(this).find('.inner').append('<a href="#" class="open-close"></a>');
            });

            // handle default state
            if (timelineConfig.defaultExpansion != 'expanded') {
                $thisObj.find('.vertical-timeline-timeline .item').each(function() {
                    var $this = $(this);
                    $this.find('.body').hide();
                    $this.find('.post').toggleClass('closed');
                });

                $thisObj.find('.expand-collapse-buttons a').removeClass('active');
                $thisObj.find('.expand-collapse-buttons a.collapse-all').addClass('active');
            };

            // Handle click of individual buttons.
            $thisObj.find('.vertical-timeline-timeline .item a.open-close').click(function(e) {
                $(this).siblings('.body').slideToggle(function() {
                    $thisObj.find('.vertical-timeline-timeline').isotope('reLayout');
                });
                $(this).parents('.post').toggleClass('closed');
                $thisObj.find('.expand-collapse-buttons a').removeClass('active');
                e.preventDefault();
            });

            $thisObj.find('.vertical-timeline-buttons a.expand-all').click(function(e) {
                $thisObj.find('.post .body').slideDown(function() {
                    $thisObj.find('.vertical-timeline-timeline').isotope('reLayout');
                });
                $thisObj.find('.post').removeClass('closed');
                $thisObj.find('.expand-collapse-buttons a').removeClass('active');
                $(this).addClass('active');
                e.preventDefault();

            });

            $thisObj.find('.vertical-timeline-buttons a.collapse-all').click(function(e) {
                $thisObj.find('.post .body').slideUp(function() {
                    $thisObj.find('.vertical-timeline-timeline').isotope('reLayout');
                });
                $thisObj.find('.post').addClass('closed');
                $thisObj.find('.expand-collapse-buttons a').removeClass('active');
                $(this).addClass('active');
                e.preventDefault();
            });
        };

        // handle sorting
        verticalTimeline.handleSorting = function() {

            // handle default sort direction
            if (timelineConfig.defaultDirection != 'newest') {
                $thisObj.find('.sort-buttons a').removeClass('active');
                $thisObj.find('.sort-buttons a.sort-oldest').addClass('active');
            }

            // handle buttons
            $thisObj.find('.sort-buttons a').click(function(e) {
                var $this = $(this);

                // don't proceed if already selected
                if ($this.hasClass('active')) {
                    return false;
                }

                $thisObj.find('.sort-buttons a').removeClass('active');
                $this.addClass('active');

                if ($this.hasClass('sort-newest')) {
                    verticalTimeline.updateGroupMarkers(false);
                    $thisObj.find('.vertical-timeline-timeline').isotope('reloadItems')
                    .isotope({sortAscending: false});
                } else {
                    verticalTimeline.updateGroupMarkers(true);
                    $thisObj.find('.vertical-timeline-timeline').isotope('reloadItems')
                    .isotope({sortAscending: true});
                }

                e.preventDefault();
            });
        };

        // handle resize.  uses "jquery resize event" plugin
        verticalTimeline.handleResizing = function() {
            if (timelineConfig.handleResize === true) {
                $thisObj.resize(function() {
                    verticalTimeline.adjustWidth();
                    verticalTimeline.adjustLine();
                });
            }
        };

        // Update group markers as they are an interval.
        verticalTimeline.updateGroupMarkers = function(direction) {
            $thisObj.find('.group-marker').each(function() {
                var $this = $(this);
                var id = $this.attr('data-id');
                var timestamp = (direction) ? groups[id].timestampStart : groups[id].timestampEnd;
                $this.find('.timestamp').text(timestamp);
            });
        };

        //  adjust width
        verticalTimeline.adjustWidth = function() {
            var w = timelineConfig.width;
            var containerW = $thisObj.width();
            var timelineW;
            var postW;

            if (timelineConfig.width === 'auto') {
                w = containerW + 'px';
            }

            // set timeline width
            $thisObj.find('.vertical-timeline-timeline').width(w);
            timelineW = $thisObj.find('.vertical-timeline-timeline').width();

            // set width on posts
            postW = (timelineW / 2) - (timelineConfig.gutterWidth / 2) - 4;
            $thisObj.find('.vertical-timeline-timeline .post').width(postW);
        };

        // keep the actual line from extending beyond the last item's date tab and keep centered
        verticalTimeline.adjustLine = function() {
            var $lastItem = $thisObj.find('.item.last');
            var itemPosition = $lastItem.data('isotope-item-position');
            var dateHeight = $lastItem.find('.date').height();
            var dateOffset = $lastItem.find('.date').position();
            var innerMargin = parseInt($lastItem.find('.inner').css('marginTop'));
            var top = (dateOffset == null) ? 0 : parseInt(dateOffset.top);
            var y = (itemPosition != null && itemPosition.y != null) ? parseInt(itemPosition.y) : 0;
            var lineHeight = y + innerMargin + top + (dateHeight / 2);
            //var $line = $thisObj.find('.line');
            //var $timeline = $thisObj.find('.vertical-timeline-timeline');
            //var xOffset = ($timeline.width() / 2) - ($line.width() / 2);
            //$line.height(lineHeight).css('left', xOffset + 'px');
        };

        // parse each row of data
        verticalTimeline.parseRow = function(el) {

            // map the columns.  tabletop removes spaces.
            $.each(timelineConfig.columnMapping, function(key, column) {
                column = column.split(' ').join('');
                if (el[column]) {
                    el[key] = el[column];
                }
            });

            // parse out the date
            el['timestamp'] = Date.parse(el['date']);
            return el;
        };


        // if data is provided directy, the process it manually, otherwise get data via tabletop and then start rendering.
        if ($.isArray(timelineConfig.data) && timelineConfig.data.length > 0) {
            data = [];
            $.each(timelineConfig.data, function(k, d) {
                data.push(verticalTimeline.parseRow(d));
            });
            verticalTimeline.setupTimeline(data, false);
        } else {
            Tabletop.init({
                key: timelineConfig.key,
                callback: verticalTimeline.setupTimeline,
                wanted: [timelineConfig.sheetName],
                postProcess: verticalTimeline.parseRow
            });
        }
    });
};


    // isotope custom layout mode spinealign (general)
    $.Isotope.prototype._spineAlignReset = function() {
        this.spineAlign = {
            colA: 0,
            colB: 0,
            lastY: -60
        };
    };


    $.Isotope.prototype._spineAlignLayout = function( $elems ) {
        var instance = this,
        props = this.spineAlign,
        gutterWidth = Math.round( this.options.spineAlign && this.options.spineAlign.gutterWidth ) || 0,
        centerX = Math.round(this.element.width() / 2);

        $elems.each(function(i, val) {
            var $this = $(this);
            $this.removeClass('last').removeClass('top');
            if (i == $elems.length - 1)
            $this.addClass('last');
            var x, y;
            if ($this.hasClass('group-marker')) {
                var width = $this.width();
                x = centerX - (width / 2);

                if (props.colA >= props.colB) {
                    y = props.colA;

                    if (y == 0) $this.addClass('top');
                        props.colA += $this.outerHeight(true);
                        props.colB = props.colA;
                } else {
                    y = props.colB;

                    if (y == 0) $this.addClass('top');
                        props.colB += $this.outerHeight(true);
                        props.colA = props.colB;
                }
            } else {
                //$this.removeClass('left').removeClass('right');
                var isColA = props.colB >= props.colA;
                if (isColA) {
                    $this.addClass('right');
                } else {
                    $this.addClass('right');
                }

                x = isColA ?
                centerX - ( $this.outerWidth(true) + gutterWidth / 2 ) : // left side
                centerX + (gutterWidth / 2); // right side
                y = isColA ? props.colA : props.colB;
                if (y - props.lastY <= 60) {
                    var extraSpacing = 60 - Math.abs(y - props.lastY);
                    $this.find('.inner').css('marginTop', extraSpacing);
                    props.lastY = y + extraSpacing;
                } else {
                    $this.find('.inner').css('marginTop', 0);
                    props.lastY = y;
                }
                props[( isColA ? 'colA' : 'colB' )] += $this.outerHeight(true);
            }

            instance._pushPosition( $this, x, y );
        });
    };

    $.Isotope.prototype._spineAlignGetContainerSize = function() {
        var size = {};
        size.height = this.spineAlign[( this.spineAlign.colB > this.spineAlign.colA ? 'colB' : 'colA' )];
        return size;
    };

    $.Isotope.prototype._spineAlignResizeChanged = function() {
        return true;
    };

})(jQuery, window);