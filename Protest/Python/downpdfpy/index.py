import requests

# url = 'http://download.redis.io/releases/redis-5.0.5.tar.gz' 
# r = requests.get(url)
# with open("demo3.zip", "wb") as code:
#   code.write(r.content)



# data = {'some': 'data'}
# headers = {'content-type': 'application/json',
#            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:22.0) Gecko/20100101 Firefox/22.0'}
 
# r = requests.post('https://api.github.com/some/endpoint', data=data, headers=headers)
# print(r.text)


import requests
import os
import time

def download(z, x, y, n):
    url1 = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v6/'
    url3 = '?sku=101QpzaqVFURD&access_token=pk.eyJ1IjoibWFvcmV5IiwiYSI6ImNqNWhrenIwcDFvbXUyd3I2bTJxYzZ4em8ifQ.KHZIehQuWW9AsMaGtATdwA'
    url2 = str(z)+'/'+str(x)+'/'+str(y)+'.vector.pbf'
    url = url1+url2+url3

    req = requests.get(url)
    # filename = str(n-y)+'.vector.pbf'
    filename = str(y)+'.vector.pbf'
    print(url.split('/')[-3]+'/'+url.split('/')[-2]+'/'+filename)
    if req.status_code != 200:
        print('下载异常')
        return False
    try:
        # 创建文件夹
        path = "f:/\china/map/"+url.split('/')[-3]+'/'+url.split('/')[-2]
        isExist = os.path.exists(path)
        if not isExist:
            os.makedirs(path)
        with open(path+'/'+filename, 'wb+') as f:
            # req.content为获取html的内容
            f.write(req.content)
            print('下载成功')
    except Exception as e:
        print(e)


if __name__ == '__main__':
    # y坐标逆序命名
    # x与y的值每层按指数递增，第z层，x,y取值范围都为0----2^z-1，center[-180,-90]为x,y最大处

    # # 第0到第5层的每个pbf矢量切片全下
    # for z in range(0, 6):
    #     for x in range(0, 2**z):
    #         for y in range(0, 2**z):
    #             download(z, x, y, 2**z-1)

    # # 第6层到第10层开始，下一部分（广东）的矢量切片
    # z = 6
    # n = 2**z-1
    # for x in range(44, 56):
    #     for y in range(24, 36):
    #         download(z, x, y, n)

    # z = 7
    # n = 2**z-1
    # for x in range(88, 112):
    #     for y in range(47, 64):
    #         download(z, x, y, n)
    # # 图层过多切片文件，可以多个python文件多线程分范围分别下载


    # z = 8
    # n = 2**z-1
    # for x in range(176, 224):
    #     time.sleep(10)
    #     for y in range(96, 128):
    #         download(z, x, y, n)

    # z = 9
    # n = 2**z-1
    # for x in range(352, 448):
    #     time.sleep(10)
    #     for y in range(192, 256):
    #         download(z, x, y, n)
    # z = 9
    # n = 2**z-1
    # for x in range(408, 448):
    #     time.sleep(6)
    #     for y in range(192, 256):
    #         time.sleep(1)
    #         download(z, x, y, n)

    # z = 10
    # n = 2**z-1
    # for x in range(800, 880):
    #     for y in range(400, 480):
    #         download(z, x, y, n)
    # # 第11层开始，下一部分（广州）的矢量切片
    # z = 11
    # n = 2**z-1
    # for x in range(1640, 1680):
    #     for y in range(860, 900):
    #         download(z, x, y, n)

    # z = 12
    # n = 2**z-1
    # for x in range(3320, 3350):
    #     for y in range(1760, 1800):
    #         download(z, x, y, n)

    # z = 13
    # n = 2**z-1
    # for x in range(6650, 6690):
    #     for y in range(3540, 3570):
    #         download(z, x, y, n)

    # z = 14
    # n = 2**z-1
    # for x in range(13320, 13370):
    #     for y in range(7090, 7130):
    #         download(z, x, y, n)

    z = 15
    n = 2**z-1
    for x in range(26640, 26720):
        time.sleep(10)
        for y in range(14180, 14240):
            time.sleep(2)
            download(z, x, y, n)

    # z = 16
    # n = 2**z-1
    # for x in range(53300, 53440):
    #     for y in range(28350, 28510):
    #         download(z, x, y, n)

