### Overview, Walkthrough, Deploying, Publishing & Technical Specs for creating tabletop.js timelines

----
###### Created 11/19/2012 by [Chris Keller](ckeller@scpr.org)
###### Updated 12/7/2012 by [Chris Keller](ckeller@scpr.org)
----

#### Overview

In minutes we can create [vertical timelines](http://projects.scpr.org/static/timelines/black-friday-timeline/) for the website using a Google Spreadsheet, an index file and a script. Roughly 95 percent of the work takes place in the Google spreadsheet.

The template for these reside in /static-projects/timelines/timeline-templates.

#### Walkthrough

Create your Google spreadsheet by copying this [template](https://docs.google.com/spreadsheet/ccc?key=0An8W63YKWOsxdEVHUDliRmZFMC1ZOWZhVUZFMEp6TUE). You may be prompted to request sharing from Chris Keller. Don't worry, he'll approve you.

Please note that the date column should contain data in a Month, Day, Year format **(April 25, 2012)** for javascript to parse it. Also, all columns must be plain text format, including the two date columns.

Once you have some information in the spreadsheet go to *File* --> *Publish to the web* and choose *Start publishing*.

A URL will appear, and we're interested in the part between 'key=' and the '&' symbol. Here's an example URL:

    https://docs.google.com/spreadsheet/pub?key=0An8W63YKWOsxdFFSZjB5VV9aVmZGblQxSFhpZ1NFd3c&output=html

We'd want this portion of the timeline script:

    0An8W63YKWOsxdFFSZjB5VV9aVmZGblQxSFhpZ1NFd3c

We also want the name of the sheet you are using. In the example template, the sheet is called Posts. You may call yours anything.

What this does though is allow one spreadsheet to be used for multiple timelines, which is really cool if you're a beat reporter like to keep things nice and neat.

#### Deploying

Now duplicate the timeline-template directory (option-drag on a Mac) and rename it to match your topic. I wouldn't use more than three words separated by hyphens. **EXAMPLE: ** black-friday-timeline

In the new directory you created open the JavaScript file titled 'timeline-script.js.' This file contains the configuration variables and should be the only file you need to edit.

The configuration variables are at the top of the file. There are only three and they control the title, the spreadsheet key and the name of the sheet in the spreadsheet. If you don't feel comfortable doing this yourself, you can pass this information on to someone who is -- Chris K. -- and they can create these quickly.

The configuration portion looks like this:

    // below are the only variables you need to create the timeline
    // title to write to the #timeline-title div
    var timelineTitle = 'A Look a Black Friday';

    var timelineConfig = {

        // add the key of your spreadsheet after publishing it to the web
        key: '0An8W63YKWOsxdDdidzJtWlZGUXQ0S0MxR3A0RmZqbGc',

        // add the name of the spreadsheet  'sheet'
    	sheetName: 'Sheet1'
    }
    // above are the only variables you need to create the timeline


Once you add a title, the key to the spreadsheet and the name of the sheet on which the data resides, you have created a timeline.

#### Publishing

Alert Chris K. or Eric Z. and they will be able to publish the new directory to be live on the site.

When it comes time to add the timeline to a news story or blog post, we'll use an iframe, and we'll need the name of the directory you created the timeline in.

Simply create a new story, click to the HTML editor, copy this code, insert the folder name and paste:

    <iframe src="http://projects.scpr.org/static/timelines/NAME-OF-FOLDER-HERE" width="640px" height="900px" scrolling="no" frameborder="0" />

You have now created a timeline. Want to update your timeline with new information...? Here's the beautiful part: Just add more information to the Google Spreadsheet and will.

#### Technical Specs

In addition to the timeline-script.js used for configuration, timelines rely on static css, images and script files found in the following directories:

    http://projects.scpr.org/static/static-files/css/tabletop-timelines/
    http://projects.scpr.org/static/static-files/images/tabletop-timelines/
    http://projects.scpr.org/static/static-files/scripts/

In the scripts file, we're specifically looking at:

    http://projects.scpr.org/static/static-files/scripts/modernizr-2.5.3.min.js
    http://projects.scpr.org/static/static-files/scripts/handlebars-1.0.rc.1.js
    http://projects.scpr.org/static/static-files/scripts/tabletop.js
    http://projects.scpr.org/static/static-files/scripts/isotope-1.5.18.js

**Resources**

[GitHub repo](https://github.com/balancemedia/Timeline) for the scripts used in the Timeline code

[Modernizr](http://modernizr.com/)

[Handlebars.js](http://handlebarsjs.com/)

[Tabletop.js](https://github.com/jsoma/tabletop)

[Isotope](http://isotope.metafizzy.co/)

[License for Isotope](http://projects.scpr.org/static/static-files/scripts/isotope_commercial_license/isotope-commercial-license.txt) purchased by [Chris Keller](ckeller@scpr.org)