require 'csv'
require 'json'

data = CSV.foreach('./datasets/Neighbourhood_Crime_Rates_Boundary_File.csv', headers: true).map(&:to_h)

minimum_crime_average = 0.0
maximum_crime_average = 0.0
final_result = {}

data.each do |datum|
  result_datum = {}
  keys_needed = ["Assault_2014", "Assault_2015", "Assault_2016", "Assault_2017", "Assault_2018", "Assault_2019", "Assault_AVG",
                 "AutoTheft_2014", "AutoTheft_2015", "AutoTheft_2016", "AutoTheft_2017", "AutoTheft_2018", "AutoTheft_2019", "AutoTheft_AVG",
                 "BreakandEnter_2014", "BreakandEnter_2015", "BreakandEnter_2016", "BreakandEnter_2017", "BreakandEnter_2018", "BreakandEnter_2019", "BreakandEnter_AVG",
                 "Homicide_2014", "Homicide_2015", "Homicide_2016", "Homicide_2017", "Homicide_2018", "Homicide_2019", "Homicide_AVG",
                 "Robbery_2014", "Robbery_2015", "Robbery_2016", "Robbery_2017", "Robbery_2018", "Robbery_2019", "Robbery_AVG",
                 "TheftOver_2014", "TheftOver_2015", "TheftOver_2016", "TheftOver_2017", "TheftOver_2018", "TheftOver_2019", "TheftOver_AVG"]
  sum_avg_count = 0
  keys_needed.grep(/_AVG/).each do |avg_key|
    sum_avg_count += datum[avg_key].to_f
  end

  minimum_crime_average = [sum_avg_count, minimum_crime_average].min
  maximum_crime_average = [sum_avg_count, maximum_crime_average].max

  result_datum["Hood_ID"] = datum["Hood_ID"].to_i
  result_datum["Crime_Count_Sum"] = sum_avg_count

  # keys_needed.grep(/_2014|_2015|_2016|_2017|_2018|_2019/).each do |data_key|
  #   result_datum[data_key] = datum[data_key].to_f
  # end

  final_result[datum["Hood_ID"].to_i] = result_datum
end

final_result.each do |_, hood_datum|
  hood_datum["Normalized_Value"] = (hood_datum["Crime_Count_Sum"] - minimum_crime_average).to_f / (maximum_crime_average - minimum_crime_average).to_f
end

final_result

s = File.read("./datasets/toronto_neighbourhoods.geojson")
data_hash = JSON.parse(s)

with_crime_stats = {}
with_crime_stats["type"] = data_hash["type"]
with_crime_stats["crs"] = data_hash["crs"]
feature_list = []

data_hash["features"].each do |feature|
  feature_datum = {}
  feature_datum["type"] = feature["type"]
  feature_datum["geometry"] = feature["geometry"]
  feature_datum["properties"] = final_result[feature["properties"]["AREA_SHORT_CODE"].to_i].merge("Area_Name" => feature["properties"]["AREA_NAME"])
  feature_list << feature_datum
end

with_crime_stats["features"] = feature_list

File.open("./processed_output/toronto_neighbourhoods.geojson", "w") do |f|
  f.write(with_crime_stats.to_json)
end
