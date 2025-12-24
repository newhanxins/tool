import json
import os
import re
import random
import asyncio
import aiofiles
from typing import List, Dict, Optional, Union
import baidu_translate as fanyi
from decimal import Decimal



# 提取数字 返回数组
def extract_numbers(s):
    # 使用正则表达式匹配浮点数或整数
    pattern = r'\d+\.\d+|\d+'
    matches = re.findall(pattern, s)
    numbers = []
    for num_str in matches:
        if '.' in num_str:
            numbers.append(float(num_str))
        else:
            numbers.append(int(num_str))
    return numbers

# 提取一个数字
def extract_numberss(s):
    cleaned = re.sub(r"[^\d\-eE.]", "", s)  # 保留数字、负号、小数点和科学计数符号
    try:
        return int(cleaned)
    except ValueError:
        return float(cleaned)  # 精确表示浮点数

def extract_number(number, base: int):
    # 类型安全转换
    try:
        num = float(number)
    except ValueError:
        raise ValueError("输入必须为有效数值")

    # 核心计算逻辑
    result = num * base
    
    # 智能类型返回
    return int(result) if result.is_integer() else result

# 百度翻译模块需自行实现或安装SDK

def translate_name(chinese_name: str) -> str:
    """带重试机制的名称翻译"""
    if not isinstance(chinese_name, str):
        raise ValueError("业务名称必须是字符串类型")
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            result = fanyi.translate_text(chinese_name, to=fanyi.Lang.EN)
            if not result:
                print(f"翻译失败，使用默认值：{chinese_name}")
                return ""
            else:
                print(f"翻译成功：{chinese_name} -> {result}")
                return result
        except Exception as e:
            print(f"翻译尝试 {attempt+1} 失败: {str(e)}")
            if attempt == max_retries - 1:
                print(f"使用默认名称替代：{chinese_name}")
                return ""
    return chinese_name  # 保底返回原名称

def generate_light_color(existing_colors: set) -> str:
    """生成不重复的浅色十六进制颜色"""
    if not isinstance(existing_colors, set):
        existing_colors = set()
    
    for _ in range(100):  # 防止无限循环
        r = random.randint(0xB0, 0xFF)
        g = random.randint(0xB0, 0xFF)
        b = random.randint(0xB0, 0xFF)
        color = f"#{r:02X}{g:02X}{b:02X}"
        if color not in existing_colors:
            return color
    return "#FFFFFF"  # 保底返回白色

#business.json文件路径
business_file_path = "business1.json"
business_data=[]
# 处理business.json文件
def get_business_file():
    """获取business.json文件路径"""
    if os.path.exists(business_file_path):
        with open(business_file_path, "r+", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
    else:
        data = []
    
    return data

async def process_business(chinese_name: str) -> int:
    """异步安全的业务处理主逻辑"""
    if not chinese_name or not isinstance(chinese_name, str):
        raise ValueError("无效的业务名称")
    try:
        # 异步读取文件
        async with aiofiles.open(business_file_path, "r+", encoding="utf-8") as f:
            content = await f.read()
            data = json.loads(content) if content else []
            if not isinstance(data, list):
                data = []
            
            # 检查现有记录
            existing_ids = [b["business_id"] for b in data if isinstance(b, dict)]
            existing_colors = {b["color"] for b in data if isinstance(b, dict)}
            
            # 查找重复项
            for biz in data:
                if not isinstance(biz, dict):
                    continue
                for lang in biz.get("language", []):
                    if lang.get("name") == chinese_name:
                        print(f"业务'{chinese_name}'已存在，ID: {biz['business_id']}")
                        return biz["business_id"]

            # 生成新记录
            new_id = max(existing_ids) + 1 if existing_ids else 1
            new_color = generate_light_color(existing_colors)
            english_name = translate_name(chinese_name)

            new_business = {
                "business_id": new_id,
                "color": new_color,
                "language": [
                    {"code": 2052, "name": chinese_name},
                    {"code": 1033, "name": english_name}
                ]
            }

            data.append(new_business)
            business_data=data
            # 异步写入
            await f.seek(0)
            await f.truncate()
            await f.write(json.dumps(data, indent=2, ensure_ascii=False))
            
            print(f"成功创建业务: ID={new_id}, 名称={chinese_name}/{english_name}")
            return new_id

    except FileNotFoundError:
        # 文件不存在时创建新文件
        async with aiofiles.open(business_file_path, "w", encoding="utf-8") as f:
            initial_data = [{
                "business_id": 1,
                "color": "#B0E0E6",
                "language": [
                    {"code": 2052, "name": chinese_name},
                    {"code": 1033, "name": translate_name(chinese_name)}
                ]
            }]
            business_data=initial_data
            await f.write(json.dumps(initial_data, indent=2, ensure_ascii=False))
            return 1

async def convert_freq_data(
    input_file: str, 
    output_file: str, 
    scale_factor: int = 1_000_000
) -> None:
    """带类型校验的频率数据转换器"""
    # def validate_band(band: Dict) -> bool:
    #     required_keys = {"startFreq", "stopFreq", "radioBusinessS"}
    #     return all(key in band for key in required_keys)

    try:
        # 异步读取输入文件
        async with aiofiles.open(input_file, "r", encoding="utf-8") as f:
            content = await f.read()
            original_data = json.loads(content)
        
        
        new_data = []
        count = 0
        print(f"{len(original_data)}")
        for band in original_data:
            # if not validate_band(band):
            #     print("无效的频段数据格式，跳过处理")
            #     continue
            count += 1
            # if count>20:
            #     break
            business_arr = []
            for business in band.get("radioBusinessS", []):
                try:
                    biz_name = str(business["business"])
                    biz_id = await process_business(biz_name)
                    print("dddd",business_data)
                    biz_obj={
                        "business_id": biz_id
                    }
                    if business.get("footnote"):
                        biz_obj["foot_note"]=business["footnote"]
                    business_arr.append(biz_obj)
                except KeyError:
                    print("业务记录缺少必要字段，跳过")
                    continue
            #print("business_arr",business_arr,band["footnoteS"])
            start_num=extract_number(band["startFreq"],scale_factor)
            end_num=extract_number(band["endFreq"],scale_factor)
            print(scale_factor,"开始频率:",start_num,"结束频率:",end_num)
            processed_band = {
                "start_freq": extract_number(band["startFreq"],scale_factor),
                "end_freq": extract_number(band["endFreq"],scale_factor),
                "business": business_arr,
                "foot_notes": band["footnoteS"] if band["footnoteS"] else [],
            }
            print(f"处理频段: {processed_band}")
            new_data.append(processed_band)

        # 异步写入输出文件
        async with aiofiles.open(output_file, "w", encoding="utf-8") as f:
            file_json={
                "table_name": "中国",
                "format_type": 1,
                "business_list": get_business_file(),
                "band_list": new_data,
                "notes_list": []
            }
            await f.write(json.dumps(file_json,ensure_ascii=False, indent=2))
            
        print(f"数据转换完成总共个数{count}，结果已保存至 {output_file}")

    except json.JSONDecodeError:
        print("输入文件格式错误，请检查JSON格式")
    except Exception as e:
        print(f"处理过程中发生未预期错误: {str(e)}")

# 示例用法
async def main():
    # 测试业务处理
    #await process_business("测试业务")
    
    # 测试数据转换
    await convert_freq_data("freqdata/khz.txt", "freqdata/khz.json",1000)
    await convert_freq_data("freqdata/mhz.txt", "freqdata/mhz.json",1000000)
    await convert_freq_data("freqdata/ghz.txt", "freqdata/ghz.json",1000000000)

if __name__ == "__main__":
    asyncio.run(main())
