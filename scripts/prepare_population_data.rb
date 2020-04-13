require 'csv'
require 'json'

population_data = {}
CSV.foreach('./datasets/neighbourhood-profiles-2016-csv.csv', headers: true) do |row|
  if row["Category"].strip == "Population" && row["Topic"] == "Population and dwellings"
    datum = row.to_h
    datum.delete("_id")
    datum.delete("Category")
    datum.delete("Topic")
    datum.delete("Data Source")
    datum.delete("City of Toronto")
    key = datum["Characteristic"]
    datum.delete("Characteristic")
    population_data[key] = datum
  end
end

result = {}
nids = JSON.load(File.read("./toronto_neighbourhoods_names.json"))

nids.each do |hood_name, hood_id|
  result[hood_id] = {"Hood_ID" => hood_id, "Area_Name" => hood_name}
end

population_data.each do |key, datum|
  if key == "Population density per square kilometre"
    max_val = datum.values.map {|v| v.delete(',')}.map(&:to_f).max
    min_val = datum.values.map {|v| v.delete(',')}.map(&:to_f).min

    datum.each do |neighbourhoood_name, density|
      density_val = density.delete(',').to_f
      result[nids[neighbourhoood_name]].merge!("Population_Density" => density_val, "Normalized_Value" => (density_val - min_val).to_f / (max_val - min_val).to_f)
    end
  end

  if key == "Population, 2016"
    datum.each do |neighbourhoood_name, p_size|
      result[nids[neighbourhoood_name]].merge!("Population_Size" => p_size.delete(',').to_i)
    end
  end
end

s = File.read("./datasets/toronto_neighbourhoods.geojson")
data_hash = JSON.parse(s)

population_stats = {}
population_stats["type"] = data_hash["type"]
population_stats["crs"] = data_hash["crs"]
feature_list = []

data_hash["features"].each do |feature|
  feature_datum = {}
  feature_datum["type"] = feature["type"]
  area_code = feature["properties"]["AREA_SHORT_CODE"]
  feature_datum["properties"] = result[area_code.to_i]
  feature_datum["geometry"] = feature["geometry"]
  feature_list << feature_datum
end

population_stats["features"] = feature_list

File.open("./toronto_neighbourhood_population.geojson", "w") do |f|
  f.write(population_stats.to_json)
end


