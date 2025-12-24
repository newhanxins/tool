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
    url3 = '?sku=101QpzaqVFURD&access_token=pk.eyJ1IjoiMTU1ODY1Mzc2MjMiLCJhIjoiY2t3MWllMGlzNzgwbDJ0bnVlbWRuanhxdyJ9.zkQDNm_ERrrQcfqhF1rbrw'
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
        path = "f:/MAPPBF/map/"+url.split('/')[-3]+'/'+url.split('/')[-2]
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
    # for x in range(205, 207):
    #     time.sleep(4)
    #     for y in range(114, 116):
    #         time.sleep(1)
    #         download(z, x, y, n)
    # time.sleep(10)

    # z = 9
    # n = 2**z-1
    # for x in range(410,414):
    #     time.sleep(10)
    #     for y in range(228,232):
    #         time.sleep(1)
    #         download(z, x, y, n)
    # time.sleep(10)

    # z = 10
    # n = 2**z-1
    # for x in range(820,828):
    #     time.sleep(4)
    #     for y in range(456,464):
    #         time.sleep(1)
    #         download(z, x, y, n)
    # time.sleep(10)
    # # 第11层开始，下一部分（广州）的矢量切片
    # z = 11
    # n = 2**z-1
    # for x in range(1640,1656):
    #     time.sleep(4)
    #     for y in range(912,928):
    #         time.sleep(1)
    #         download(z, x, y, n)
    # time.sleep(10)

    # z = 12
    # n = 2**z-1
    # for x in range(3280,3312):
    #     time.sleep(4)
    #     for y in range(1824,1856):
    #         time.sleep(1)
    #         download(z, x, y, n)
    # time.sleep(10)

    # z = 13
    # n = 2**z-1
    # for x in range(6576,6624):
    #     time.sleep(4)
    #     for y in range(3648,3712):
    #         time.sleep(1)
    #         download(z, x, y, n)
    # time.sleep(10)

    # z = 14
    # n = 2**z-1
    # for x in range(13120,13248):
    #     time.sleep(4)
    #     for y in range(7296,7424):
    #         time.sleep(1)
    #         download(z, x, y, n)
    # time.sleep(10)
# 1级
    
    z = 15
    n = 2**z-1
    for x in range(27495,27439):
        time.sleep(3)
        for y in range(10704,10752):
            download(z, x, y, n)
    time.sleep(10)
    z = 15
    n = 2**z-1
    for x in range(27496,27840):
        time.sleep(3)
        for y in range(10688,10752):
            download(z, x, y, n)
    time.sleep(10)
    # z = 16
    # n = 2**z-1
    # for x in range(52480,52992):
    #     time.sleep(4)
    #     for y in range(29184,29696):
    #         time.sleep(1)
    #         download(z, x, y, n)

