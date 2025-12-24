// index.js
import 'ol/ol.css';
import * as ol from 'ol'; // 引入整个 OpenLayers 库
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import layerVector from 'ol/layer/Vector';
import sourceVector from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ';
import Overlay from 'ol/Overlay';
import { fromLonLat, transform } from 'ol/proj';
import Select from 'ol/interaction/Select';
/**coordinates
 * 封装 OpenLayers 地图功能的类
 */
class olMaps {

  /**
   * @param {string} targetId - HTML 元素的 ID，用于承载地图。
   * @param {Object} [options] - 可选的初始化参数。
   * @param {Array<number>} [options.center=[0, 0]] - 地图的初始中心点（经度, 纬度）。
   * @param {number} [options.zoom=2] - 地图的初始缩放级别。
   */
  static gaodeUrl="";
  
  constructor(targetId, options = {}) {
    this.map=null;//地图对象
    this.mapType=""//地图类型
    this.mapSatellite=false//地图是否卫星
    this.mapOnline=true
    this.mapUrl=""
    this.ol=ol;//ol对象
    this.overlay=null;//覆盖物对象
    this.targetId = null;//地图 元素 ID
    this.mapCenter = [103, 30];
    this.mapZoom = 9;//地图层级
    this.maxZoom=19;//地图最大层级
    this.minZoom=2;//地图最小层级
    this.mapLayers =[];
    this.mapLayer=null;//地图图层
    
  }
  /**
   * 初始加载地图
   * @param {*string} targetId 元素id
   * @param {*string} mapType 地图瓦片类型 baidu gaode google custom
   * @param {*boolean} mapSatellite 地图是否卫星在线 true false
   * @param {*boolean} mapOnline 地图是否在线 true false
   * @param {*object} options  - 可选的初始化参数
   * @param {*string} [options.mapUrl] 地图瓦片地址
   * @param {*string} [options.mapLayerSource]
   * @param {*Array} [options.mapCenter] 中心地图
   * @param {*number} [options.mapZoom] 加载地图层级
   * @param {*number} [options.maxZoom] 地图最大层级
   * @param {*number} [options.minZoom] 地图最小层级
   */
  initMap(targetId,mapType,mapSatellite,mapOnline,options={}) {
    this.targetId = targetId;
    this.mapType=mapType||gaode;
    this.mapOnline=mapOnline!==undefined?mapOnline:true;
    this.mapSatellite=mapSatellite||false;
    this.mapCenter = options.mapCenter || [103, 30];
    this.mapZoom=options.mapZoom||9;
    this.maxZoom=options.maxZoom||19;
    this.minZoom=options.minZoom||2;
    if(mapType=="custom"){
      this.mapLayer=new Tile({
        source: mapLayerSource
      })
    }else{
      var mapurl=this.getMapUrl(options)
      this.mapLayer=new Tile({
        source:new XYZ({
          url:mapurl
        })
      })
    }
    
    console.log(this.mapLayer)
    this.map = new Map({
      target: this.targetId,
      layers: [
        this.mapLayer
      ],
      view: new View({
        center: fromLonLat(this.mapCenter),
        zoom: this.mapZoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
      })
    });
  }
  getMapUrl(options){
    var mapUrls={
      "baidu":"",
      "gaode":'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
      "google":'http://www.google.com/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2sen-US!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0',
      "baiduSatellit":"",
      "gaodeSatellit":"http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}",
      "googleSatellit":"https://www.google.com/maps/vt?lyrs=y&hl=en&x={x}&y={y}&z={z}"
    }
    var urls=""
    // if(options.mapUrl){
    //   return options.mapUrl
    // }
    if(this.mapOnline){
      var names=this.mapType
      if(this.mapSatellite){
        names=names+"Satellit"
      }
      urls=mapUrls[names]
    }else {
      urls=options.mapUrl+'/{z}/{x}/{y}.png'
    }
    return urls
  }
  /**
   * 设置地图的中心点。
   * @param {Array<number>} coordinates - 要设置的中心点（经度, 纬度）。
   */

  setCenter(coordinates) {
    const view = this.map.getView();
    view.setCenter(fromLonLat(coordinates));
  }

  /**
   * 地图XYZ瓦片处理方法。
   * @param {*object} options - 要设置的参数。
   * @param {*string} options.url 瓦片的 URL
   * @param {*string} options.attributions 图层的版权声明
   * @param {*number} options.maxZoom 最大缩放级别
   * @param {*number} options.minZoom 最小缩放级别
   * @param {*function} options.tileLoadFunction 自定义加载函数
   * @param {*number} options.tilePixelRatio 瓦片图像的像素比率
   * @param {*number} options.transition 切换瓦片时的过渡时间
   * @param {*Projection} options.projection 定义瓦片源使用的投影
   */
  XYZ(options){
    return new XYZ(options)
  }

  /**
   * 矢量数据的图层类
   * @param {*object} options - 要设置的参数。
   * @param {*string} options.source 矢量数据源，通常是 ol/source/Vector 实例，用于提供图层显示的矢量数据。
   * @param {*object} options.style 样式函数或样式对象，用于定义图层中要素的显示样式。
   * @param {*number} options.zIndex 图层的层叠顺序，较大的 zIndex 值会使图层显示在较小值的图层之上。
   * @param {*boolean} options.visible  布尔值，指定图层是否可见。
   * @param {*number} options.opacity 图层的透明度，范围从 0（完全透明）到 1（完全不透明）。
   * @param {*number} options.renderMode 渲染模式，可以是 'vector'（矢量）或 'image'（图像），用于图层的渲染策略
   */
  layerVector(options){
    if(options==""||options==null||options==undefined||typeof options == "object"&& JSON.stringify(obj) === '{}'){
      return new layerVector()
    }else{
      return new layerVector(options)
    }
  }

  /**
   * 矢量数据源类
   * @param {*object|{}} options - 要设置的参数。
   * @param {*Array.<ol.Feature>|undefined} options.features 初始的要素数组，用于加载预定义的矢量数据。
   * @param {*ol.format.Feature|undefined} options.format 数据格式，例如 ol.format.GeoJSON，用于解析数据。
   * @param {*ol.FeatureLoader|undefined} options.loader 自定义加载器函数，用于从外部源加载数据。
   * @param {*string|undefined} options.url 数据的 URL 地址，用于通过 AJAX 请求加载数据。
   * @param {*function} options.strategy 数据加载策略，如 ol/loadingstrategy.bbox，用于定义如何加载数据。
   * @param {*boolean|undefined} options.wrapX 布尔值，指定是否在横向上进行重复。
   */
  sourceVector(options){
    if(options==""||options==null||options==undefined||typeof options == "object"&& JSON.stringify(obj) === '{}'){
      return new sourceVector()
    }else{
      return new sourceVector(options)
    }
  }

  /**
   * 经纬度转换
   * @param {*Array<number>} coordinates 
   */
  fromLonLat(coordinates, projection = 'EPSG:4326'){
    return fromLonLat(coordinates,projection)
  }
  
  /**
   * 经纬度转换
   * @param {*Array<number>} coordinates 坐标数组
   * @param {*} source  源坐标系统的投影，例如 'EPSG:3857'（Web Mercator）
   * @param {*} destination 目标坐标系统的投影，例如 'EPSG:4326'（WGS84）
   * @returns 
   */
  transform(coordinates, source = 'EPSG:3857', destination = 'EPSG:4326'){
    return transform(coordinates,source,destination)
  }

  /**
   * 切换到卫星地图。
   */
  switchToSatellite() {
      this.map.getLayers().item(0).setSource(
          new XYZ({
          url: 'https://{a-c}.tile.stamen.com/terrain/{z}/{x}/{y}.png'
          })
      );
  }
  /**
   * 添加点击事件监听器。
   * @param {Function} callback - 点击事件发生时调用的函数，传入点击的坐标。
   */
  addClickListener(callback) {
    this.map.on('click', (event) => {
      const coordinate = event.coordinate;
      callback(coordinate);
    });
  }
    // Method to listen to map click events
    onMapClick(callback) {
        this.selectInteraction.on('select', (event) => {
        const features = event.target.getFeatures();
        callback(features);
        });
    }

  /**
   * 在指定坐标显示弹窗。
   * @param {Array<number>} coordinate - 弹窗显示的坐标（经度, 纬度）。
   * @param {string} content - 弹窗中显示的内容。
   */
  showPopup(coordinate, content) {
    if (this.overlay) {
      this.map.removeOverlay(this.overlay);
    }

    const element = document.createElement('div');
    element.className = 'popup';
    element.innerHTML = content;

    this.overlay = new Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10]
    });

    this.map.addOverlay(this.overlay);
    this.overlay.setPosition(coordinate);
  }
}
// Compatibility for ES5 environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = olMaps;
  }

export default olMaps;
