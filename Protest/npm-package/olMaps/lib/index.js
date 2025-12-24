"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("ol/ol.css");
var _Map = _interopRequireDefault(require("ol/Map"));
var _View = _interopRequireDefault(require("ol/View"));
var _Tile = _interopRequireDefault(require("ol/layer/Tile"));
var _OSM = _interopRequireDefault(require("ol/source/OSM"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // index.js
var olMaps = /*#__PURE__*/function () {
  function olMaps(targetId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, olMaps);
    this.map = new _Map["default"]({
      target: targetId,
      layers: [new _Tile["default"]({
        source: new _OSM["default"]()
      })],
      view: new _View["default"]({
        center: options.center || [0, 0],
        zoom: options.zoom || 2
      })
    });
  }
  return _createClass(olMaps, [{
    key: "setCenter",
    value: function setCenter(center) {
      this.map.getView().setCenter(center);
    }
  }, {
    key: "setZoom",
    value: function setZoom(zoom) {
      this.map.getView().setZoom(zoom);
    }
  }, {
    key: "addLayer",
    value: function addLayer(layer) {
      this.map.addLayer(layer);
    }
  }]);
}();
var _default = exports["default"] = olMaps;