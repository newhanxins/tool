import os
import sys
import math
import glob
import logging
import geojson 
from osgeo import ogr,osr

#https://blog.csdn.net/qianxuantong/article/details/129137296
# 安装geojson库
# pip install geojson
# 安装osgeo库
#https://blog.csdn.net/weixin_45473052/article/details/136194162
# 'hc-transform'自定义参数坐标转换
def transform_XY(x,y,tf):
    jsonmarginX = tf.get('jsonmarginX', 0.0)
    jsonmarginY = tf.get('jsonmarginY', 0.0)
    jsonres = tf.get('jsonres', 1.0)
    xpan = tf.get('xpan', 0.0)
    ypan = tf.get('ypan', 0.0)
    scale = tf.get('scale', 1.0)
    xoffset = tf.get('xoffset', 0.0)
    yoffset = tf.get('yoffset', 0.0)
    rotation = tf.get('rotation')
    
    tempx = ((x - jsonmarginX)/jsonres - xpan)/scale + xoffset
    tempy = ((y - jsonmarginY)/jsonres + ypan)/scale + yoffset    
 
    if rotation is None:
        outx = tempx
        outy = tempy
    else:
        cosAngle = tf.get('cosAngle', math.cos(rotation))
        sinAngle = tf.get('sinAngle', math.sin(rotation))
        outx = tempx * cosAngle + tempy * (-sinAngle)
        outy = tempx * sinAngle + tempy * cosAngle    
    return outx,outy
 
 
 
infile = "./ng-all.geo.json"
ds = ogr.Open(infile)
if ds is None:
    print ('could not open')
    sys.exit(1)
   
with open(infile) as f:
    gj = geojson.load(f)
    if gj is None:
        print ('could not open')
        sys.exit(1)
hc_tfs = gj['hc-transform']
gsname = gj['title']
# print ('hc_tfs:', hc_tfs)
 
layer = ds.GetLayer(0) #根据下标来获取图层（对于shp而言只有一个图层）
geotype = layer.GetGeomType() #图层几何类型
# print ('geotype:', geotype)
 
layer.ResetReading() #重置内部feature指针，指向FID=0的要素
spatialRef_WGS84 = osr.SpatialReference()  
spatialRef_WGS84.ImportFromEPSG(4326)  #WGS 84，其编码为4326 
spatialRef_WGS84.SetAxisMappingStrategy(0); #经纬度互换
 
 
for key in hc_tfs.keys():
    spatialRef_Source = osr.SpatialReference()
    spatialRef_Source.ImportFromProj4(hc_tfs[key]['crs'])    
    hc_tfs[key]['co_tf'] = osr.CoordinateTransformation(spatialRef_Source, spatialRef_WGS84)
 
 
#创建输出矢量数据
outpath = "."    
outfile = outpath + "/" + gsname + ".geojson"
# print('outfile:',outfile)
# driver = ds.GetDriver()
driver=ogr.GetDriverByName("GeoJSON")
# driver=ogr.GetDriverByName("ESRI Shapefile")
print("driver name:",driver.name)
data_out=driver.CreateDataSource(outfile)
layer_out=data_out.CreateLayer(gsname,srs=spatialRef_WGS84,geom_type=geotype)
 
#读取矢量
layer_defn=layer.GetLayerDefn()
field_count=layer_defn.GetFieldCount()
#给输出图层定义一个属性表,并创建字段
for i in range(field_count):
    field_defn=layer_defn.GetFieldDefn(i)
    layer_out.CreateField(field_defn)  #创建字段
layer_out_defn=layer_out.GetLayerDefn()
 
 
feat = layer.GetNextFeature()
mykey = 'default'
try:
    while feat:
        fname = feat.GetField('name') 
        print(fname)
        
        if not (fname is None): 
            for key in hc_tfs.keys():
                if fname.lower() in key.lower():
                    mykey = key
        else:
            break
        # print('mykey:',mykey)
        geomRef = feat.GetGeometryRef()
        for k in range(geomRef.GetGeometryCount()):
            geom = geomRef.GetGeometryRef(k)
            print(geom.GetGeometryType(),geom.GetGeometryName())
            if(geom.GetGeometryType() == 3):
                geom = geom.GetGeometryRef(0)
        
            for i in range(geom.GetPointCount()):
                x,y = transform_XY(geom.GetX(i),geom.GetY(i),hc_tfs[mykey])
                geom.SetPoint_2D(i,x,y)
                
        geomRef.Transform(hc_tfs[mykey]['co_tf'])
 
        feature_out=ogr.Feature(layer_out_defn)
        feature_out.SetGeometry(geomRef)
        
        for j in range(field_count):
                field_defn=layer_defn.GetFieldDefn(j)
                name=field_defn.name
                # print(name)
                field_value=feat.GetField(name)
                feature_out.SetField(name,field_value)
        layer_out.CreateFeature(feature_out)
    
        feat.Destroy() #关闭
        feature_out.Destroy() #关闭
        feat = layer.GetNextFeature()
        mykey = 'default'
 
    ds.Destroy() #关闭
    data_out.Destroy() #关闭
    del ds,data_out # 删除datasource
 
except:
    print('error!')
 
 
 
 
 
 
 
 