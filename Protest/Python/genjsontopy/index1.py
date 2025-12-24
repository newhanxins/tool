import json
from pyproj import Proj, transform

# pip install pyproj -i https://mirrors.aliyun.com/pypi/simple/
# 读取 Highmaps JSON 文件
with open('ng-all.geo.json', 'r') as f:
    highmaps_data = json.load(f)

# 定义投影转换函数
def convert_coordinates(coordinates):
    in_proj = Proj(init='epsg:3857')  # Highmaps 使用的投影坐标系
    out_proj = Proj(init='epsg:4326')  # WGS84 坐标系
    return [transform(in_proj, out_proj, x, y) for x, y in coordinates]

# 转换坐标并创建 GeoJSON 数据
geojson_data = {
    "type": "FeatureCollection",
    "features": []
}

for feature in highmaps_data['features']:
    geometry = feature['geometry']
    if geometry['type'] == 'Polygon':
        geometry['coordinates'] = [convert_coordinates(geometry['coordinates'][0])]
    elif geometry['type'] == 'MultiPolygon':
        geometry['coordinates'] = [[convert_coordinates(coords[0]) for coords in geometry['coordinates'][0]]]
    else:
        continue

    geojson_data['features'].append({
        "type": "Feature",
        "geometry": geometry,
        "properties": feature['properties']
    })

# 将 GeoJSON 数据保存到文件中
with open('output.json', 'w') as f:
    json.dump(geojson_data, f)
