"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * freqChart 频率分布图控件
 *
 * @class freqChart
 */
var freqChart = /*#__PURE__*/function () {
  function freqChart(id, options, treedata) {
    var _this = this;
    _classCallCheck(this, freqChart);
    // this.devicePixelRatio = window.devicePixelRatio || 1;
    this.devicePixelRatio = 1;
    this.loadOptions = options;
    this.box = document.getElementById(id);
    this.box.style.position = "relative";
    this.box.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = "absolute";
    this.box.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = true; // 启用抗锯齿

    this.isDraw = true;
    this.languageCode = "2052"; //语言
    this.chartWidth = 0; //图表宽度
    this.chartHeight = 0; //图表高度
    this.xLabelGridInfo = []; //x轴标签网格信息
    this.inittreeData = {}; //初始数据

    // 图像数据
    this.isDragging = false; //是否拖动
    this.isZooming = false; //是否缩放
    this.offsetX = 0; //x轴偏移量
    this.offsetY = 0; //y轴偏移量
    this.scaleX = 1; //x轴缩放比例
    this.scaleY = 1; //y轴缩放比例
    this.scaleDirection = "x"; // 缩放方向x|y|both
    this.selectedArea = null; //选中区域
    // 手指触摸操作
    this.touchStartDist = 0;
    this.prevTouchDistance = 0;
    this.isTouching = false;
    this.yZoom = 1; //y轴缩放比例

    this.focusType = ""; //聚焦类型 grid|left|right|bottom|threshold|marker

    this.initOptions(options);
    this.setCanvasSize();
    if (treedata) {
      this.inittreeData = treedata;
      this.initData(treedata);
    }
    this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseup.bind(this));
    this.canvas.addEventListener('mousemove', this.mousemove.bind(this));
    this.canvas.addEventListener('mouseout', this.mouseout.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvas.addEventListener('dblclick', this.handleDblClick.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    window.addEventListener('keydown', this.handleKeydown.bind(this));
    window.addEventListener('keyup', this.handleKeyup.bind(this));
    // 监听窗口调整大小
    window.addEventListener('resize', function () {
      return _this.resizeCanvas();
    });
    //分布图数据
    this.treeData = [];

    //鼠标按下事件
    this.mousedownInfo = {
      isMouseDown: false,
      startX: 0,
      startY: 0,
      mouseupx: 0,
      mouseupy: 0,
      button: 0
    };
    //鼠标移动事件
    this.moveInfo = {
      isMove: false,
      preX: 0,
      preY: 0,
      moveX: 0,
      moveY: 0
    };
    this.drawChart();
  }
  /**
   * 设置图表大小
   */
  return _createClass(freqChart, [{
    key: "setCanvasSize",
    value: function setCanvasSize(widths, heights) {
      var width = widths || this.options.width;
      var height = heights || this.options.height;
      var containerWidth = this.box.clientWidth || 400;
      var containerHeight = this.box.clientHeight || 300;
      // 使用实际像素大小设置 Canvas
      this.canvas.width = width === "100%" ? containerWidth : width;
      this.canvas.height = height === "100%" ? containerHeight : height;

      // 设置 CSS 样式，确保 Canvas 在视觉上保持相应比例
      this.canvas.style.width = width === "100%" ? "".concat(containerWidth, "px") : "".concat(width, "px");
      this.canvas.style.height = height === "100%" ? "".concat(containerHeight, "px") : "".concat(height, "px");
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      //计算图表宽高
      this.chartWidth = Math.floor(this.width - this.options.grid.left - this.options.grid.right);
      this.chartHeight = Math.floor(this.height - this.options.grid.top - this.options.grid.bottom);
      this.options.grid.right = this.width - this.options.grid.left - this.chartWidth;
      this.options.grid.bottom = this.height - this.options.grid.top - this.chartHeight;

      // 更新字体大小以适应高分辨率
      //this.options.fontSize = `${parseInt(this.options.fontSize) * window.devicePixelRatio}px`;
    }
    /**
     * 初始化配置
     * @param {*} options
     * @memberof freqChart
     */
  }, {
    key: "initOptions",
    value: function initOptions(options) {
      var defaultOptions = {
        "type": "1",
        //图表类型 1 2
        "width": 400,
        //画布宽度
        "height": 300,
        //画布高度
        "background": "#CCCCCC",
        //背景色
        "center_freq": "",
        //中心频率
        "span": "",
        //显宽
        "grid": {
          //网格样式
          "left": 50,
          //左边距
          "top": 40,
          //上边距
          "bottom": 50,
          //下边距
          "right": 40,
          //右边距
          "color": "#B7B7B7",
          //网格线颜色
          "background": "transparent",
          //网格背景色
          "width": 1 //网格线宽度
        },
        "xaxis": {
          //X轴样式
          "decimals": "",
          //X轴刻度标签小数位数
          "unit": "",
          //单位MHz 为空不显示 
          "unit_right": 10,
          // x轴单位距离图表左侧距离
          "init_start_freq": 10000000,
          //X轴起始频率
          "init_end_freq": 200000000,
          //X轴结束频率
          "start_freq": 10000000,
          //X轴起始频率
          "end_freq": 200000000,
          //X轴结束频率
          "text_color": "#343434",
          //X轴文本颜色
          "text_font_size": 12,
          //X轴文本字体大小
          "text_font_family": "Arial",
          //X轴文本字体
          "color": "#333",
          //X轴线颜色
          "width": 1,
          //X轴线宽度
          "labels": [//*X轴刻度标签
          ],
          //X轴标签
          "label_angle": 90 //*X轴刻度标签角度
        },
        "tree_data": {} //数据
      };
      var mergedOptions = deepMerge({}, defaultOptions);
      this.options = deepMerge(mergedOptions, options);
      //初始化参数和DPR计算
      this.options.grid.left = Math.floor(this.options.grid.left * this.devicePixelRatio);
      this.options.grid.bottom = Math.floor(this.options.grid.bottom * this.devicePixelRatio);
      this.options.grid.top = Math.floor(this.options.grid.top * this.devicePixelRatio);
      this.options.grid.right = Math.floor(this.options.grid.right * this.devicePixelRatio);
      this.xLabelGridInfo = []; //x轴标签网格信息

      console.log("初始化配置", this.options);
    }
    //初始化数据
  }, {
    key: "initData",
    value: function initData(datas) {
      if (!datas) {
        return false;
      }
      var band_list = deepCopy(datas.band_list);
      var bandLeng = band_list.length;
      this.options.xaxis.init_start_freq = band_list[0].start_freq;
      this.options.xaxis.init_end_freq = band_list[bandLeng - 1].end_freq;
      this.options.xaxis.start_freq = band_list[0].start_freq;
      this.options.xaxis.end_freq = band_list[bandLeng - 1].end_freq;
      var darwData = this.getRegionData(band_list);
      //计算图表初始数据
      this.calculateItemData(darwData);
    }
    /**
     * 获取区域数据
     * @param {*} datas
     * @returns
     */
  }, {
    key: "getRegionData",
    value: function getRegionData(datas) {
      var regionData = [];
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        var start_freq = data.start_freq;
        var end_freq = data.end_freq;
        if (end_freq <= this.options.xaxis.end_freq && end_freq >= this.options.xaxis.start_freq) {
          regionData.push(data);
        }
      }
      //console.log("区域数据",regionData)
      return regionData;
    }
    /**
     * 计算项宽度数据
     */
  }, {
    key: "calculateItemData",
    value: function calculateItemData(datas) {
      var chartWidth = this.chartWidth;
      var freqdiff = this.options.xaxis.end_freq - this.options.xaxis.start_freq;
      var freqStep = chartWidth / freqdiff;
      var gridData = [];
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        var start_freq = data.start_freq;
        var end_freq = data.end_freq;
        var start_x = (start_freq - this.options.xaxis.start_freq) * freqStep;
        var end_x = (end_freq - this.options.xaxis.start_freq) * freqStep;
        var width = end_x - start_x;
        data.start_x = start_x;
        data.width = width;
        data.height = this.chartHeight * this.scaleY;
        data.type = "column";
        data.end_x = end_x;
        data.columnid = i;
        var rows = data.business;
        var rowHeight = this.chartHeight * this.scaleY / rows.length;
        //console.log("start_x",start_x,end_x,width,rowHeight)
        for (var j = 0; j < rows.length; j++) {
          var row = rows[j];
          row.type = "item";
          row.orderid = j;
          row.width = width;
          row.height = rowHeight;
          row.start_x = start_x;
          row.end_x = end_x;
          data.columnid = i;
          row.item_id = j;
          row.x = row.start_x + this.offsetX + this.options.grid.left;
          row.y = this.options.grid.top + rowHeight * j + this.offsetY;
          row.color = this.getItemColor(row.business_id);
          row.text = this.getItemText(row.business_id);
        }
        gridData.push(data);
      }
      this.treeData = gridData;
      //console.log("表格数据",this.treeData)
    }
    /**
    * 绘制图表
    */
  }, {
    key: "drawChart",
    value: function drawChart() {
      this.clearCanvas();
      this.initBackground();
      this.initData(this.inittreeData);
      this.drawAxis();
      this.drawGrid();
    }

    /**
     *清空画布
     */
  }, {
    key: "clearCanvas",
    value: function clearCanvas() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    /**
     * 初始化背景
     */
  }, {
    key: "initBackground",
    value: function initBackground() {
      this.ctx.fillStyle = this.options.background;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * 初始化图表
     */
  }, {
    key: "drawAxis",
    value: function drawAxis() {
      var _this2 = this;
      // 绘制x轴
      this.initdrawData();
      this.ctx.strokeStyle = this.options.xaxis.color;
      this.ctx.lineWidth = this.options.xaxis.width || 1;
      this.ctx.beginPath();
      this.ctx.moveTo(this.options.grid.left, this.height - this.options.grid.bottom);
      this.ctx.lineTo(this.width - this.options.grid.right, this.height - this.options.grid.bottom);
      this.ctx.stroke();

      // 绘制x轴标签
      this.ctx.fillStyle = this.options.xaxis.text_color;
      this.ctx.textBaseline = 'top';
      this.ctx.font = "".concat(this.options.xaxis.text_font_size * this.devicePixelRatio, "px ").concat(this.options.xaxis.text_font_family);
      this.options.xaxis.labels.forEach(function (data, index) {
        var x = 0;
        var y = _this2.height - _this2.options.grid.bottom + 8;
        var texts = truncateNumber(data.text / 1000000, _this2.options.xaxis.decimals);
        if (index == 0) {
          x = _this2.options.grid.left;
        } else {
          x = _this2.width - _this2.options.grid.right - _this2.ctx.measureText(texts).width;
        }
        _this2.ctx.fillText(texts, x, y);
      });
      //绘制X轴单位
      if (this.options.xaxis.unit !== "") {
        this.ctx.fillText(this.options.xaxis.unit, this.width - this.options.grid.right + this.options.xaxis.unit_right, this.height - this.options.grid.bottom + +this.options.xaxis.text_font_size + 8);
      }
      // this.ctx.save(); // 保存当前绘图状态
      //         this.ctx.translate(x, y); // 原点移动到移动到标签位置
      //         this.ctx.rotate(angleInRadians); // 应用旋转变换
      //         this.ctx.fillText(texts, 0, 0); // 绘制旋转后的文字
      //         this.ctx.restore(); // 恢复上下文状态
      // this.ctx.textAlign = 'center';
      // let halfWidth = this.ctx.measureText(texts).width / 2
    }
    /**
     * 初始绘制数据
     */
  }, {
    key: "initdrawData",
    value: function initdrawData() {
      //计算x轴标签底部
      var labelxaxis = [{
        offsetx: 0,
        text: this.options.xaxis.start_freq
      }, {
        offsetx: this.chartWidth + this.options.grid.left,
        text: this.options.xaxis.end_freq
      }];
      this.options.xaxis.labels = labelxaxis;
    }
    /**
     * 绘制网格
     */
  }, {
    key: "drawGrid",
    value: function drawGrid() {
      this.ctx.fillStyle = this.options.grid.background;
      this.ctx.fillRect(this.options.grid.left, this.options.grid.top, this.chartWidth, this.chartHeight);
      this.ctx.strokeStyle = this.options.grid.color;
      this.ctx.lineWidth = this.options.grid.width;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(this.options.grid.left, this.options.grid.top, this.chartWidth, this.chartHeight);
      // 裁剪谱线超过图表区域的部分
      this.ctx.clip();
      this.ctx.beginPath();
      var treeData = this.treeData;
      for (var i = 0; i < treeData.length; i++) {
        var widths = treeData[i].width;
        var itemArray = treeData[i].business;
        for (var j = 0; j < itemArray.length; j++) {
          var row = itemArray[j];
          var _x = row.x;
          var _y = row.y;
          var width = row.width;
          var height = row.height;
          this.ctx.fillStyle = row.color;
          this.ctx.fillRect(_x, _y, width, height);
          // 绘制区域边框
          this.ctx.strokeStyle = '#ddd';
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(_x - 0.5, _y - 0.5, width - 1, height - 1);
          // 绘制文字
          //console.log("绘制项",row)
          this.drawText(row.text, _x, _y, width, height);
        }
      }
      // 高亮选中的区域
      if (this.selectedArea) {
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 3;
        var x = this.selectedArea.x;
        var y = this.selectedArea.y;
        var _width = this.selectedArea.width;
        var _height = this.selectedArea.height;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x - 0.5, y - 0.5, _width - 1, _height - 1);
      }
      this.ctx.stroke();
      this.ctx.restore();
    }

    /**
     * 绘制线
     * @param {*} datas 谱线数据
     */
  }, {
    key: "drawLine",
    value: function drawLine(data) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(this.options.grid.left, this.options.grid.top, this.chartWidth, this.chartHeight);
      // 裁剪谱线超过图表区域的部分
      this.ctx.clip();
      this.ctx.beginPath();
      this.ctx.strokeStyle = data.color;
      this.ctx.lineWidth = data.width || 1;
      this.ctx.stroke();
      this.ctx.restore();
    }
    /**
     * 获取频谱图颜色
     * @param {*} id 
     */
  }, {
    key: "getItemColor",
    value: function getItemColor(id) {
      var listdata = this.inittreeData.business_list;
      var color = "#000000";
      for (var i = 0; i < listdata.length; i++) {
        if (listdata[i].business_id == id) {
          color = listdata[i].color;
          break;
        }
      }
      return color;
    }
    /**
     * 获取文字
     * @param {*} id 
     * @returns 
     */
  }, {
    key: "getItemText",
    value: function getItemText(id) {
      var listdata = this.inittreeData.business_list;
      var text = "";
      for (var i = 0; i < listdata.length; i++) {
        if (listdata[i].business_id == id) {
          var languagelist = listdata[i].language;
          for (var j = 0; j < languagelist.length; j++) {
            if (languagelist[j].code == this.languageCode) {
              text = languagelist[j].name;
              break;
            }
          }
        }
      }
      return text;
    }

    // 绘制区域中的文字
  }, {
    key: "drawText",
    value: function drawText(text, x, y, width, height) {
      var fontSize = 16;
      this.ctx.font = fontSize + "px Arial";
      this.ctx.fillStyle = 'black';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      var textWidth = this.ctx.measureText(text).width;

      // 文字显示方式
      if (width >= textWidth) {
        // 如果宽度足够，一行显示文字并居中
        this.ctx.fillText(text, x + width / 2, y + height / 2);
      } else if (width >= fontSize * 2) {
        // 如果宽度不足以显示一行文字但足够显示两行
        var lineHeight = fontSize * 1.2;
        var maxLines = Math.floor(height / lineHeight);
        var lines = splitText(text, width, maxLines);
        var totalHeight = lines.length * lineHeight;
        var startY = y + height / 2 - totalHeight / 2 + lineHeight / 2;
        for (var index = 0; index < lines.length; index++) {
          var line = lines[index];
          this.ctx.fillText(line, x + width / 2, startY + index * lineHeight);
        }
      } else {
        // 如果宽度不足以显示两行文字，文字竖直显示
        var maxHeight = height - 10; // 留点边距
        var maxLines = Math.floor(maxHeight / fontSize);
        if (maxLines == 0) {
          return;
        }
        var lines = this.splitText(text, fontSize, maxLines);
        var startY = y + height / 2 - lines.length * fontSize / 2;
        for (var _index = 0; _index < lines.length; _index++) {
          var _line = lines[_index];
          this.ctx.fillText(_line, x + width / 2, startY + _index * fontSize);
        }
      }
    }

    // 处理文本的拆分
  }, {
    key: "splitText",
    value: function splitText(text, maxWidth, maxLines) {
      var lines = [];
      var currentLine = '';
      for (var i = 0; i < text.length; i++) {
        var testLine = currentLine + text[i];
        var testWidth = this.ctx.measureText(testLine).width;
        if (testWidth > maxWidth) {
          if (currentLine.length > 0) {
            lines.push(currentLine);
          }
          currentLine = text[i]; // Start new line with the current character
        } else {
          currentLine = testLine;
        }
        if (lines.length >= maxLines) {
          break;
        }
      }
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      if (maxLines == 0) {
        lines.splice(0);
      }
      // 如果行数超过最大行数，截断并添加省略号
      if (lines.length > maxLines) {
        lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + '...';
        // 删除多余的行
        lines.splice(maxLines);
      }
      return lines;
    }
    /**
     * 加载数据
     * @param {*} id 谱线id
     * @param {*} data 谱线数据
     */
  }, {
    key: "onloadData",
    value: function onloadData(data) {
      this.inittreeData = data;
      this.drawChart(data);
    }
    /**
     * 设置频率数据
     * @param {*} id 谱线id
     * @param {*} data 谱线数据
     */
  }, {
    key: "setTreeData",
    value: function setTreeData(id, data) {
      this.isDraw = true;
      this.drawChart();
    }

    //监听手指触摸操作
    /**
     * 
     * @param {*} e 
     */
  }, {
    key: "touchstart",
    value: function touchstart(e) {
      if (e.touches.length == 2) {
        isTouching = true;
        var touch1 = e.touches[0];
        var touch2 = e.touches[1];
        touchStartDist = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
        prevTouchDistance = touchStartDist;
      }
    }
    //监听手指触摸移动
    /**
     * 移动
     * @param {*} e 
     */
  }, {
    key: "touchmove",
    value: function touchmove(e) {
      if (isTouching && e.touches.length == 2) {
        var touch1 = e.touches[0];
        var touch2 = e.touches[1];
        var touchDist = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);

        // 计算触摸移动的缩放因子
        var scaleChange = touchDist / prevTouchDistance;
        if (scaleDirection === 'x' || scaleDirection === 'both') {
          scaleX *= scaleChange;
        }
        if (scaleDirection === 'y' || scaleDirection === 'both') {
          scaleY *= scaleChange;
        }

        // 防止缩放过小或过大
        if (scaleX < 0.5) scaleX = 0.5;
        if (scaleX > 3) scaleX = 3;
        if (scaleY < 0.5) scaleY = 0.5;
        if (scaleY > 3) scaleY = 3;

        // 更新触摸的上一距离
        prevTouchDistance = touchDist;
        drawMap(); // 重新绘制地图
      }
    }
    //监听手指触摸结束
    /**
     * 触摸结束
     * @param {*} e
     */
  }, {
    key: "touchend",
    value: function touchend() {
      if (e.touches.length < 2) {
        isTouching = false;
        prevTouchDistance = 0;
      }
    }
  }, {
    key: "mousedown",
    value:
    //监听事件
    /**
     * 鼠标按下事件
     * @param {*} event 
     */
    function mousedown(event) {
      this.mousedownInfo = {
        isMouseDown: true,
        startX: event.offsetX,
        startY: event.offsetY,
        mouseupx: 0,
        mouseupy: 0,
        button: event.button
      };
      if (event.button === 0) {
        // 左键
        // isDragging = true;
        // startY = event.clientY;
        this.ctx.canvas.style.cursor = 'grabbing';
      } else if (event.button === 2) {
        // 右键
        this.ctx.canvas.style.cursor = 'grab';
      }
    }
    /**
     * 鼠标松开事件
     * @param {*} event
     */
  }, {
    key: "mouseup",
    value: function mouseup(event) {
      var mousedowinfo = {
        isMouseDown: false,
        mouseupx: event.offsetX,
        mouseupy: event.offsetY,
        button: event.button
      };
      this.mousedownInfo = _objectSpread(_objectSpread({}, this.mousedownInfo), mousedowinfo);
      this.ctx.canvas.style.cursor = 'default';
    }
    /**
     * 鼠标移动
     * @param {*} event 
     */
  }, {
    key: "mousemove",
    value: function mousemove(event) {
      var x = event.offsetX;
      var y = event.offsetY;
      if (this.mousedownInfo.isMouseDown) {
        if (this.moveInfo.preX == 0) {
          this.moveInfo.preX = this.mousedownInfo.startX;
          this.moveInfo.preY = this.mousedownInfo.startY;
        }
        var moveX = event.offsetX - this.moveInfo.preX;
        var moveY = this.moveInfo.preY - event.offsetY;
        var moveDirX = event.offsetX - this.mousedownInfo.startX;
        var moveDirY = event.offsetY - this.mousedownInfo.startY;
        var moveDir = "horizontally";
        // 判断移动方向
        if (Math.abs(moveDirX) > Math.abs(moveDirY)) {
          moveDir = "horizontally";
          var mouseVal = this.getMouseVal(event);
        } else {
          moveDir = "vertically";
        }
        // 鼠标按下移动
        if (this.mousedownInfo.button === 0) {// 左键
        } else if (this.mousedownInfo.button === 2) {// 右键
        }
      } else {
        // 鼠标移动
        var type = this.getMousePosition();
        if (type == "grid") {
          var point = this.getMousePoint(event);
          //设置鼠标移动坐标
          this.drawChart();
        } else {}
      }
      this.moveInfo = {
        isMove: true,
        preX: event.offsetX,
        preY: event.offsetY,
        moveX: event.offsetX,
        moveY: event.offsetY
      };
    }
    /**
     * 鼠标移出控件
     * @param {*} event 
     */
  }, {
    key: "mouseout",
    value: function mouseout(event) {
      event.preventDefault();
      this.mousedownInfo.isMouseDown = false;
      this.moveInfo = {
        isMove: false,
        preX: 0,
        preY: 0,
        moveX: 0,
        moveY: 0
      };
    }
    /**
     * 鼠标滚轮事件
     * @param {*} event
     * 
     */
  }, {
    key: "handleWheel",
    value: function handleWheel(event) {
      event.preventDefault(); // 阻止默认滚动行为
      var delta = event.deltaY < 0 ? 1 : -1; //下滚缩小，上滚放大
      //const delta = Math.sign(event.deltaY);
      this.handleZoom(event, delta);
    }
    /**
     * 双击事件
     * @param {*} event 
     */
  }, {
    key: "handleDblClick",
    value: function handleDblClick(event) {
      console.log("handleDblClick", event);
    }
    /**
     * 点击事件
     * @param {*} event 
     */
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      console.log("handleClick", event);
      var points = this.getMousePosition(event);
      console.log("points", points);
      var mouseX = event.offsetX;
      var mouseY = event.offsetY;
      var clickedArea = this.checkClick(mouseX, mouseY);
      if (clickedArea) {
        this.selectedArea = clickedArea;
        this.drawChart(); // 重新绘制地图并高亮选中区域
      } else {
        this.selectedArea = null;
        this.drawChart(); // 重新绘制地图并去掉高亮
      }
    }
    /**
     * 检查点击是否在区域内
     * @param {*} x 坐标
     * @param {*} y 坐标
     * @returns 
     */
  }, {
    key: "checkClick",
    value: function checkClick(x, y) {
      var areas = this.treeData;
      for (var index = 0; index < areas.length; index++) {
        var area = areas[index];
        var areaX = area.x;
        var areaY = area.y;
        var areaWidth = area.width;
        var areaHeight = area.height;
        if (x >= areaX && x <= areaX + areaWidth && y >= areaY && y <= areaY + areaHeight) {
          return area;
        }
        ;
      }
    }
    /*
     * 鼠标右键事件
     * @param {*} event
     */
  }, {
    key: "handleContextMenu",
    value: function handleContextMenu(event) {
      console.log("handleContextMenu", event);
    }
    /**
     * 按键按下事件
     * @param {*} event
     */
  }, {
    key: "handleKeydown",
    value: function handleKeydown(event) {
      //console.log("handleKeydown", event);
      switch (event.keyCode) {
        case 37:
          // 左箭头
          console.log("左箭头");
          break;
        case 38:
          // 上箭头
          console.log("上箭头");
          this.changeThreshold(+0.5);
          break;
        case 39:
          // 右箭头
          console.log("右箭头");
          break;
        case 40:
          // 下箭头
          this.changeThreshold(-0.5);
        default:
          break;
      }
    }
    /**
     * 按键松开事件
     * @param {*} event 
     */
  }, {
    key: "handleKeyup",
    value: function handleKeyup(event) {
      console.log("handleKeyup按键松开事件", event);
      switch (event.keyCode) {
        case 37:
          // 左箭头
          console.log("左箭头松开");
          break;
        case 38:
          // 上箭头
          console.log("上箭头松开");
          this.options.threshold.is_mouse = false;
          break;
        case 39:
          // 右箭头
          console.log("右箭头松开");
          break;
        case 40:
          // 下箭头
          console.log("下箭头松开");
          this.options.threshold.is_mouse = false;
        default:
          break;
      }
    }

    /**
     * 窗口大小改变事件
     */
  }, {
    key: "resizeCanvas",
    value: function resizeCanvas() {
      this.setCanvasSize(); // 重新设置 Canvas 尺寸
      this.drawChart(); // 重新绘制图表以适应新尺寸
    }
    /**
     * 设置图表大小
     * @param {*} widhts 宽度
     *  @param {*} heights 高度
     */
  }, {
    key: "setChartSize",
    value: function setChartSize(widths, heights) {
      if (widths && heights) {
        this.options.width = widths;
        this.options.height = heights;
      }
      this.setCanvasSize(widths, heights);
      this.drawChart(); // 重新绘制图表以适应新尺寸
    }

    /**
     * 缩放事件
     * @param {*} event 
     * @param {*} types 
     * @param {*} delta 
     * @returns 
     */
  }, {
    key: "handleZoom",
    value: function handleZoom(event, delta) {
      var type = this.getMousePosition();
      //console.log("handleZoom",event, delta,type);
      var zoomFactor = 1.1; // 缩放因子

      if (type == "left") {} else if (type == "bottom") {}
      this.drawChart();
    }
    /**
     * 获取鼠标位置对应的值
     * @param {*} event 
     * @returns 
     */
  }, {
    key: "getMouseVal",
    value: function getMouseVal(event) {
      // let pointx = event.offsetX;
      // let pointy = event.offsetY;
      var rect = this.canvas.getBoundingClientRect(); // 获取 Canvas 的位置和大小
      var pointx = event.clientX - rect.left; // 计算鼠标相对于 Canvas 的 X 坐标
      var pointy = event.clientY - rect.top; // 计算鼠标相对于 Canvas 的 Y 坐标
      var x = null; //x轴频率
      var y = null; //y轴频率
      var order = null; //x轴标签组序号

      return {
        x: x,
        y: y,
        order: order
      };
    }
    /**
     * 获取当前鼠标所在位置频率和强度
     * @param {*} event 
     */
  }, {
    key: "getMousePoint",
    value: function getMousePoint(event) {
      var rect = this.canvas.getBoundingClientRect(); // 获取 Canvas 的位置和大小
      var pointx = event.clientX - rect.left; // 计算鼠标相对于 Canvas 的 X 坐标
      var pointy = event.clientY - rect.top; // 计算鼠标相对于 Canvas 的 Y 坐标
      return {
        pointx: pointx,
        pointy: pointy
      };
    }

    /**
     * 获取鼠标当前区域
     * @param {*} event 
     * @returns 
     */
  }, {
    key: "getMousePosition",
    value: function getMousePosition(events) {
      var event = window.event;
      var rect = this.canvas.getBoundingClientRect(); // 获取 Canvas 的位置和大小
      var x = event.clientX - rect.left; // 计算鼠标相对于 Canvas 的 X 坐标
      var y = event.clientY - rect.top; // 计算鼠标相对于 Canvas 的 Y 坐标
      var result = "";
      // 检查鼠标是否在 Canvas 内部
      if (x < 0 || x > this.width || y < 0 || y > this.height) {
        result = null;
      } else if (x < this.options.grid.left) {
        result = "left";
      } else if (y < this.options.grid.top) {
        result = "top";
      } else if (x > this.canvas.width - this.options.grid.right) {
        result = "right";
      } else if (y > this.canvas.height - this.options.grid.bottom) {
        result = "bottom";
      } else {
        result = "grid";
      }
      this.focusType = result;
      return result;
    }
    /**
     * 获取配置
     */
  }, {
    key: "getOptions",
    value: function getOptions() {
      return this.options;
    }
    /**
     * 设置配置项
     * @param {*} options 
     */
  }, {
    key: "setOptions",
    value: function setOptions(options) {
      var newoptions = deepMerge(this.options, options);
      this.initOptions(newoptions);
    }
  }]);
}();
/**
 * 深度合并对象
 * @param {*} target 目标对象
 * @param {*} source 源对象
 * @returns 
 */
function deepMerge(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (_typeof(source[key]) === 'object' && source[key] !== null && !Array.isArray(source[key]) && !Array.isArray(target[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

//拷贝
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
/**
 * 获取设备像素比 (DPR)
 * @returns {number} 当前设备的设备像素比
 */
function getDevicePixelRatio() {
  return window.devicePixelRatio || 1; // 如果没有定义，则返回 1
}

/**
 * 截取数字的小数点后指定的位数（支持负数，且不足位数补零）
 * @param {number} num - 要格式化的数字
 * @param {number} decimalPlaces - 要保留的小数位数
 * @param {boolean} isnum - 是否为数字
 * @returns {number} 截取后的小数位数的数字
 */
function truncateNumber(num, decimalPlaces, isnum) {
  // 处理无效输入
  if (isNaN(num) || isNaN(decimalPlaces)) {
    console.log("ddd");
  }
  if (decimalPlaces === "") {
    return num;
  }
  // 确保小数位数为正整数
  decimalPlaces = Math.max(0, Math.floor(decimalPlaces));

  // 将数字乘以10的decimalPlaces次方并截取
  var factor = Math.pow(10, decimalPlaces);
  var truncated = Math.trunc(num * factor) / factor; // 截取
  if (isnum) {
    //返回浮点数，确保尾数正确
    return parseFloat(truncated.toFixed(decimalPlaces));
  } else {
    // 返回字符串，确保尾数正确
    return truncated.toFixed(decimalPlaces);
  }
}