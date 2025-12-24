import os
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ----------------------- 基础配置 -----------------------
SAVE_DIR = "website_assets"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/",
    "DNT": "1"
}

# ----------------------- 增强型下载会话 -----------------------
def create_session():
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=0.5,
        status_forcelist=[500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

# ----------------------- 资源分类与保存 -----------------------
def classify_and_save(url, base_folder):
    """按文件类型分类存储资源"""
    path = urlparse(url).path
    file_ext = os.path.splitext(path)[1][1:].lower() or "other"
    
    if file_ext in ["css", "scss"]:
        subdir = "css"
    elif file_ext in ["js", "mjs"]:
        subdir = "js"
    elif file_ext in ["png", "jpg", "jpeg", "gif", "webp"]:
        subdir = "images"
    else:
        subdir = "other"

    save_dir = os.path.join(base_folder, subdir)
    os.makedirs(save_dir, exist_ok=True)
    return os.path.join(subdir, os.path.basename(path))

# ----------------------- 资源下载逻辑 -----------------------
def download_resource(session, url):
    """带重试机制的下载"""
    try:
        response = session.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print(f"资源下载失败: {url} - {str(e)}")
        return None

# ----------------------- 资源处理 -----------------------
def process_assets(session, soup, base_url):
    """处理所有资源链接"""
    resource_map = {}
    
    for tag in soup.find_all(['link', 'script', 'img','style','video', 'audio']):
        attr = 'href' if tag.name == 'link' else 'src'
        if not tag.get(attr):
            continue

        # 构建绝对URL
        abs_url = urljoin(base_url, tag[attr])
        
        # 生成分类保存路径
        local_relative_path = classify_and_save(abs_url, SAVE_DIR)
        local_full_path = os.path.join(SAVE_DIR, local_relative_path)
        print(f"需要下载{local_full_path}")
        if os.path.exists(local_full_path):
            if os.path.isdir(local_full_path):  # 检测是否为目录
                print(f"跳过目录: {local_full_path}")
                continue
            elif os.path.isfile(local_full_path):  # 检测是否为文件
                print(f"文件已存在: {local_full_path}")
            else:
                print(f"未知类型: {local_full_path}")
                continue
         # 获取目录路径
        print(f"正在下载{local_full_path}")
        local_dir = os.path.dirname(local_full_path)

        # 如果目录不存在，则创建它
        if not os.path.exists(local_dir):
            os.makedirs(local_dir)
        
        
       
        # 下载资源
        response = download_resource(session, abs_url)
        if response:
            with open(local_full_path, 'wb') as f:
                f.write(response.content)
            resource_map[abs_url] = local_relative_path
            tag[attr] = local_relative_path  # 修正为相对路径
            time.sleep(1)  # 请求间隔防封禁

    return resource_map

# ----------------------- 主流程 -----------------------
def save_full_website(target_url):
    os.makedirs(SAVE_DIR, exist_ok=True)
    session = create_session()

    # 下载主页面
    main_response = session.get(target_url, headers=HEADERS)
    if main_response.status_code != 200:
        print(f"详细错误信息: 状态码={main_response.status_code}, 响应头={main_response.headers}")
        raise Exception("主页面下载失败")

    soup = BeautifulSoup(main_response.text, 'html.parser')
    process_assets(session, soup, target_url)

    # 保存处理后的HTML
    safe_filename = re.sub(r"[^\w\-]", "_", target_url) + ".html"
    with open(os.path.join(SAVE_DIR, safe_filename), 'w', encoding='utf-8') as f:
        f.write(str(soup))

if __name__ == "__main__":
    save_full_website("https://mcpcn.com/docs/quickstart/guide")
    print(f"网页已完整保存至 {SAVE_DIR} 目录")
