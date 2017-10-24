# documentation here: http://cirrus.ucsd.edu/~pierce/kpbs/REAME_PRECIP_INDICES_FILE_FORMATS_V6
# installing each package in this script just to be safe

# get rainfall data
rainfall <- read.table("http://cirrus.ucsd.edu/~pierce/kpbs/make_indices_v7.LA_basin.365.out.cumul.txt",header=FALSE, sep="", na.strings="NA", dec=".", strip.white=TRUE, stringsAsFactors = FALSE)

# Rename all the columns at once
colnames(rainfall) <- c("water_year", "day_of_water_year", "calendar_date", "pct_of_normal_total", "record_low_value", "date_of_record_low", "typical_low_value_for_this_day", "median_value_for_this_day", "typical_high_value_for_this_day", "record_high_value_for_this_day", "date_of_record_hi", "string_day_one", "current_one_day_chng", "fiftieth_percentile_for_one_day_chng", "ninetieth_percentile_for_one_day_chng", "ninety_fifth_percentile_for_one_day_chng", "ninety_ninth_percentile_for_one_day_chng", "record_hi_one_day_chng", "record_hi_one_day_chng_date", "string_day_two", "current_two_day_chng", "fiftieth_percentile_for_two_day_chng", "ninetieth_percentile_for_two_day_chng", "ninety_fifth_percentile_for_two_day_chng", "ninety_ninth_percentile_for_two_day_chng", "record_hi_two_day_chng", "record_hi_two_day_chng_date", "string_day_three", "current_three_day_chng", "fiftieth_percentile_for_three_day_chng", "ninetieth_percentile_for_three_day_chng", "ninety_fifth_percentile_for_three_day_chng", "ninety_ninth_percentile_for_three_day_chng", "record_hi_three_day_chng", "record_hi_three_day_chng_date")

# what do this year and the median year look like?
this_yr <- subset(rainfall, rainfall$water_year  == "2018")
this_yr <- data.frame(this_yr$water_year, this_yr$day_of_water_year, this_yr$pct_of_normal_total)
colnames(this_yr) <- c("water_year", "day_of_water_year", "pct_of_normal_total")

# subset just the normal pct, this could be any year
install.packages("sqldf")
library(sqldf)
median_yr <- sqldf("select day_of_water_year, median_value_for_this_day from rainfall group by day_of_water_year")
median_yr$water_year <- "median"
colnames(median_yr)[2] <- "pct_of_normal_total"

# combine
this_yr <- rbind(median_yr, this_yr)

# what if i want the median for previous la niña years?
# according to dave pierce's chart
nina_years <- subset(rainfall, rainfall$water_year  == "1974" | rainfall$water_year == "2000" | rainfall$water_year  == "1989" | rainfall$water_year == "1999" | rainfall$water_year  == "1976")
nina_years <- data.frame(nina_years$water_year, nina_years$day_of_water_year, nina_years$pct_of_normal_total)
colnames(nina_years) <- c("water_year", "day_of_water_year", "pct_of_normal_total")

# make wide
install.packages("tidyr")
library(tidyr)
data_wide <- spread(nina_years, water_year, pct_of_normal_total)

# get nina medians
data_wide_nums <- data_wide
data_wide_nums$day_of_water_year <- NULL
data_wide_nums$nina_years_median <- apply(data_wide_nums,1,median)

# get year num and make long
data_wide_nums$day_of_water_year <- as.numeric(rownames(data_wide_nums))
nina_years <- gather(data_wide_nums, water_year, pct_of_normal_total, -day_of_water_year)

#ready to export these nina years, first create thing that includes the nina years, medians, and this year
rain <- rbind(nina_years, this_yr)

#now subset
rain <- subset(rain, rain$water_year  == "median" | rain$water_year  == "nina_years_median" | rain$water_year  == "2018")

# transform structure for highcharts
rain_for_chart <- spread(rain, water_year, pct_of_normal_total)

# grab water year dates for highcharts
# update path here
calendarday_waterday <- read.csv("PATH_TO/calendarday_waterday_winter.csv", stringsAsFactors=FALSE)

# imp update for 2017-2018 dates
install.packages("lubridate")
library(lubridate)
calendarday_waterday$calendar_date <- as.Date(calendarday_waterday$calendar_date, format = '%m/%d/%y') + years(1)

# now merge
rain_for_chart <- merge(calendarday_waterday, rain_for_chart, by="day_of_water_year")
rain_for_chart$day_of_water_year <- NULL

# change col names
colnames(rain_for_chart) <- c("Date", "2017-2018", "Median year", "La Niña years")

# reorder vectors so we don't have to mess w highcharts z index
rain_for_chart <- rain_for_chart[,c(1,3,4,2)]

# write out with vanilla filename to upload
# update path here
write.csv(rain_for_chart, "LOCATION", row.names=FALSE, na="", quote=FALSE)
