##Water use and income: methodology
Do wealthy Californians use more water than their poorer neighbors? It's a surprisingly difficult question to answer.

For our analysis, KPCC combined several sources of data:

*   The [geographies of Census places](https://www.census.gov/geo/maps-data/data/tiger-line.html), for 2013
*   The [geographies of California water districts](http://www.ehib.org/page.jsp?page_key=762), which are collected by the California Department of Public Health
*   The State Water Resources Control Board's [monthly urban water use report](http://www.swrcb.ca.gov/waterrights/water_issues/programs/drought/conservation_reporting_info.shtml) (we used the most recent available figures, released May 6; the most recent month they include data for is March 2015)
*   Census [household income data](http://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?pid=ACS_13_5YR_S1901&prodType=table) from the 2013 American Community Survey 5-year estimates
*   A table that contains the water use names used by the DPH and SWRCB (which frequently differ), created internally

That still only covers a fraction of Southern Californians, but data on 8,402,487 water users (per the SWRCB's data) or 2,715,557 households (as the census figures have it) is a decent place to start.

We focused our analysis on water districts that have areas that closely resemble a Census place.

To do that, we found which South Coast water district areas had at least 85% overlap with a census place. Then we did the reverse, determining if a census place had at least 85% overlap with a water district. If the place-district pair met both qualifications, we went forward with it. There are 44 place-district pairs in our dataset (174 districts classified by the SWRCB reported on water use in the most recent report).

A note about the water district shapefiles we used: the are imperfect. The collection and maintenance of district boundaries is neither mandated nor funded in California and the job fell to the Department of Public Health to begin collecting them. 

There are more than 8,000 public water systems in California, and the DPH's data only has a couple thousand entries; reporting is voluntary. But most of the larger water districts in the state make an appearance. The earliest entries in tool are from 2009, and a handful are from 2015\. There are often multiple entries for a single district.

Given that, we removed multiple entries for a single water district according to a criteria laid about by the DPH's Matt Conens.

We then joined the table of water boundary names to our water boundary shapes, in order to later join it to the SWRCB's monthly report. That table also included Hydrological Regions, and we limited our analysis to South Coast water districts in Southern California, which include more than half the state's population. I manually removed the entry for Sanger, which was classified as a South Coast district but fall outside the district.

The small sample size allowed me to individually examine water boundaries to make sure there was a close fit.

From there, we joined the census income and SWRCB water use data.