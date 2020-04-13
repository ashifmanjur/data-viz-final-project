require 'csv'
require 'json'

data = CSV.foreach('./datasets/Neighbourhood_Crime_Rates_Boundary_File.csv', headers: true).map(&:to_h)

data.each do |datum|
  keys_needed = ["Assault_2014", "Assault_2015", "Assault_2016", "Assault_2017", "Assault_2018", "Assault_2019",
                 "AutoTheft_2014", "AutoTheft_2015", "AutoTheft_2016", "AutoTheft_2017", "AutoTheft_2018", "AutoTheft_2019",
                 "BreakandEnter_2014", "BreakandEnter_2015", "BreakandEnter_2016", "BreakandEnter_2017", "BreakandEnter_2018", "BreakandEnter_2019",
                 "Homicide_2014", "Homicide_2015", "Homicide_2016", "Homicide_2017", "Homicide_2018", "Homicide_2019",
                 "Robbery_2014", "Robbery_2015", "Robbery_2016", "Robbery_2017", "Robbery_2018", "Robbery_2019",
                 "TheftOver_2014", "TheftOver_2015", "TheftOver_2016", "TheftOver_2017", "TheftOver_2018", "TheftOver_2019"]

  CSV.open("./#{datum["Hood_ID"].to_i}_crime_details.csv", "wb") do |csv|
    csv << ['hood_id', 'crime', 'year', 'count']
    keys_needed.grep(/_2014/).each do |key|
      crime_name, year = key.split("_")
      csv << [datum["Hood_ID"].to_i, crime_name, year.to_i, datum[key]]
    end

    keys_needed.grep(/_2015/).each do |key|
      crime_name, year = key.split("_")
      csv << [datum["Hood_ID"].to_i, crime_name, year.to_i, datum[key]]
    end

    keys_needed.grep(/_2016/).each do |key|
      crime_name, year = key.split("_")
      csv << [datum["Hood_ID"].to_i, crime_name, year.to_i, datum[key]]
    end

    keys_needed.grep(/_2017/).each do |key|
      crime_name, year = key.split("_")
      csv << [datum["Hood_ID"].to_i, crime_name, year.to_i, datum[key]]
    end

    keys_needed.grep(/_2018/).each do |key|
      crime_name, year = key.split("_")
      csv << [datum["Hood_ID"].to_i, crime_name, year.to_i, datum[key]]
    end

    keys_needed.grep(/_2019/).each do |key|
      crime_name, year = key.split("_")
      csv << [datum["Hood_ID"].to_i, crime_name, year.to_i, datum[key]]
    end
  end
end

