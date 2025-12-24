import json
import os

# 读取 GeoJSON 文件
file_path = './nigeria.json'  # 替换为你的 GeoJSON 文件路径
with open(file_path, 'r') as file:
    geojson_data = json.load(file)

# 确保输出目录存在
output_dir = './outjson'
os.makedirs(output_dir, exist_ok=True)

# 遍历每个 Feature 并生成相应的文件
for feature in geojson_data['features']:
    # 提取 Feature 名称
    feature_name = feature.get('properties', {}).get('name', 'Unknown')
    
    # 创建文件名，确保文件名合法
    feature_name = feature_name.replace('/', '_')  # 替换掉可能在文件名中引起问题的字符
    feature_filename = os.path.join(output_dir, f'{feature_name}.json')
    data = {
        "type": "FeatureCollection",
        "features": [feature]
    }
    # 写入 Feature 数据到文件中
    with open(feature_filename, 'w') as feature_file:
        json.dump(data, feature_file, indent=4)
