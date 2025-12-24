// index.js
import 'ol/ol.css';
import ol from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
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
  constructor(targetId, options = {}) {
    this.map=null;//地图对象
    this.ols=null;//ol对象
    this.targetId = targetId;//地图 元素 ID
    this.center = options.center || [0, 0];
    this.zoom = options.zoom || 2;
    
    this.map = new ol.Map({
      target: this.targetId,
      layers: [
        new Tile({
          source: new XYZ({
            url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}`
          })
        })
      ],
      view: new View({
        center: fromLonLat(this.center),
        zoom: this.zoom
      })
    });
    this.ol=ol;
    this.overlay = null;
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
        this.map.on('dbclick', (event) => {
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
