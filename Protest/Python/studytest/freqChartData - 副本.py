import json
import os
import random
import baidu_translate as fanyi

import asyncio
import aiofiles

#翻译
def translate_name(chinese_name):
    """简单中英翻译映射"""
    result = fanyi.translate_text(chinese_name, to=fanyi.Lang.EN)
    if not result:
        print(f"翻译失败，使用默认值：{chinese_name}")
        return ""
    else:
        print(f"翻译成功：{chinese_name} -> {result}")
        return result

# 生成不重复的浅色十六进制颜色
def generate_light_color(existing_colors):
    """生成不重复的浅色十六进制颜色"""
    while True:
        r = random.randint(176, 255)  # 浅色范围：B0-FF
        g = random.randint(176, 255)
        b = random.randint(176, 255)
        color = f"#{r:02X}{g:02X}{b:02X}"
        if color not in existing_colors:
            return color

    # 处理business.json文件
def process_business(chinese_name):
    # 文件路径
    file_path = "business.json"
    resultid=''
    # 读取或创建文件
    if os.path.exists(file_path):
        with open(file_path, "r+", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
    else:
        data = []
    
    # 检查是否已存在目标name
    need_add = True
    for business in data:
        for lang in business["language"]:
            if lang["name"] == chinese_name:
                resultid = business["business_id"]
                need_add = False
                break
        if not need_add:
            break
    
    if not need_add:
        print(f"'{chinese_name}'已存在，无需添加")
        return resultid

    
    # 更健壮的写法（处理data为None的情况）

    # 生成新 ID 和颜色
    new_id = max((b["business_id"] for b in data), default=0) + 1
    # 生成不重复颜色
    existing_colors = {b["color"] for b in data}
    new_color = generate_light_color(existing_colors)
    
    # 构建语言对象
    english_name = translate_name(chinese_name)
    languages = [
        {"code": 2052, "name": chinese_name},
        {"code": 1033, "name": english_name}
    ]
    
    # 创建新业务对象
    new_business = {
        "business_id": new_id,
        "color": new_color,
        "language": languages
    }
    
    data.append(new_business)
    
    # 写回文件
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"成功新增业务：{chinese_name}/{english_name}")

    return new_id




# 使用示例
# print(process_business("固定"))




async def convert_freq_data(input_file, output_file, scale_factor=1_000_000):
    """
    频率数据转换器（支持单位注释和可配置缩放参数）
    
    参数：
    input_file: 输入文件路径
    output_file: 输出文件路径
    scale_factor: 缩放系数（默认1000000，即MHz转Hz）^根据需求新增参数^
    """
    async with aiofiles.open(input_file, 'r', encoding='utf-8') as f:
        content = await f.read()
        original_data = json.loads(content)

    # business_mapping = {}
    # current_id = 1

    # # 构建业务类型映射表
    # for band in original_data:
    #     for business in band["radioBusinessS"]:
    #         biz_type = business["business"]
    #         if biz_type not in business_mapping:
    #             business_mapping[biz_type] = current_id
    #             current_id += 1

    new_data = []
    for band in original_data:
        # 原始数据转换（新增缩放系数参数）
        base_value = float(band["startFreq"])
        start_hz = int(base_value * scale_factor)
        end_hz = int(float(band["endFreq"]) * scale_factor)
        # 生成带中文注释的频率值（新增注释功能）
        freq_display = f"{base_value}MHz" if scale_factor == 1_000_000 else f"{base_value}GHz"
        business_arr=[]
        for business in band["radioBusinessS"]:
            # 业务名称翻译
            print(f"业务名称：{business['business']}")
            business_name = process_business(str(business["business"]))
            print(f"业务名称id：{business_name}")
            business_arr.append({"business_id": business_name})
        
        print(business_arr)
        new_data.append({
            "start_freq": start_hz,
            "end_freq": end_hz,
            "foot_notes": band.get("footNotes", []),
            "business": business_arr
        })

    async with aiofiles.open(output_file, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(new_data, indent=2, ensure_ascii=False))

    print("转换成功！生成文件:", output_file)
    #print("业务类型映射:", json.dumps(business_mapping, indent=2, ensure_ascii=False))

# 使用示例（支持不同缩放系数）
async def main():
    # 默认使用 MHz→Hz 转换（scale_factor=1000000）
    await convert_freq_data("freqdata/khz.txt", "freqdata/khz.json",1)
    
    # 也可以指定 GHz→Hz 转换（scale_factor=1000000000）
    # await convert_freq_data("input.json", "output_ghz.json", scale_factor=1_000_000_000)

if __name__ == "__main__":
    asyncio.run(main())