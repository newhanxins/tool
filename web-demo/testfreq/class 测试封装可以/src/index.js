class CanvasDrawer {
  constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");

      this.scale = 1; // 初始缩放比例
      this.offsetX = 50; // X轴偏移
      this.offsetY = 50; // Y轴偏移
      this.isDragging = false; // 是否正在拖动
      this.startX = 0; // 鼠标/触摸开始拖动时的X位置
      this.startY = 0; // 鼠标/触摸开始拖动时的Y位置
      this.lastTouchDistance = 0; // 上次两个触摸点之间的距离
      this.lastTouchCenterX = 0; // 上次两个触摸点的中心X坐标

      this.touchStartX = 0;
      this.touchStartY = 0;
      this.isTouchDragging = false;

      // 初始化事件监听
      this.initEventListeners();

      // 初始化绘制
      this.drawAxis();
      this.drawRectangle();
  }

  // 绘制坐标轴
  drawAxis() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清空画布

      // 绘制 X 和 Y 坐标轴
      this.ctx.beginPath();
      this.ctx.moveTo(this.offsetX, this.offsetY + 300);
      this.ctx.lineTo(this.offsetX + 400, this.offsetY + 300);
      this.ctx.moveTo(this.offsetX, this.offsetY);
      this.ctx.lineTo(this.offsetX, this.offsetY + 300);
      this.ctx.stroke();

      // 绘制x轴刻度线
      for (let i = 0; i <= 100; i += 10) {
          let x = this.offsetX + i * 4 * this.scale; // x轴缩放
          this.ctx.moveTo(x, this.offsetY + 300);
          this.ctx.lineTo(x, this.offsetY + 310);
          this.ctx.stroke();

          // 绘制刻度文字
          this.ctx.fillText(i, x - 5, this.offsetY + 325); // 在每个刻度下方绘制文字
      }

      // 绘制y轴刻度线
      for (let i = 0; i <= 20; i += 2) {
          let y = this.offsetY + 300 - i * 15 * this.scale; // y轴缩放
          this.ctx.moveTo(this.offsetX, y);
          this.ctx.lineTo(this.offsetX - 10, y);
          this.ctx.stroke();

          // 绘制刻度文字
          this.ctx.fillText(i * 15, this.offsetX - 30, y + 5); // 在每个刻度左侧绘制文字
      }
  }

  // 绘制矩形
  drawRectangle() {
      const xStart = this.offsetX + 20 * 4 * this.scale; // 矩形x起始点
      const xEnd = this.offsetX + 50 * 4 * this.scale;   // 矩形x结束点
      const yStart = this.offsetY + 300 - (3 * 15 * this.scale); // 矩形y起始点
      const yEnd = this.offsetY + 300 - (6 * 15 * this.scale);   // 矩形y结束点

      // 绘制矩形
      this.ctx.fillStyle = 'rgba(0, 128, 255, 0.5)';
      this.ctx.fillRect(xStart, yStart, xEnd - xStart, yEnd - yStart);
  }

  // 计算两个触摸点之间的距离
  getDistance(touch1, touch2) {
      let dx = touch1.clientX - touch2.clientX;
      let dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
  }

  // 初始化事件监听
  initEventListeners() {
      // 处理鼠标按下事件
      this.canvas.addEventListener('mousedown', (e) => {
          this.isDragging = true;
          this.startX = e.clientX - this.offsetX; // 记录开始拖动的X位置
          this.startY = e.clientY - this.offsetY; // 记录开始拖动的Y位置
      });

      // 处理鼠标移动事件
      this.canvas.addEventListener('mousemove', (e) => {
          if (this.isDragging) {
              this.offsetX = e.clientX - this.startX; // 计算新的偏移量
              this.offsetY = e.clientY - this.startY; // 计算新的偏移量
              this.drawAxis();  // 重新绘制坐标系
              this.drawRectangle(); // 重新绘制矩形
          }
      });

      // 处理鼠标松开事件
      this.canvas.addEventListener('mouseup', () => {
          this.isDragging = false;
      });

      // 处理鼠标滚轮事件（缩放）
      this.canvas.addEventListener('wheel', (e) => {
          e.preventDefault(); // 阻止默认滚动行为
          const zoomFactor = 1.1;
          if (e.deltaY < 0) { // 放大
              this.scale *= zoomFactor;
          } else { // 缩小
              this.scale /= zoomFactor;
          }
          this.drawAxis(); // 重新绘制坐标系
          this.drawRectangle(); // 重新绘制矩形
      });

      // 手指拖动功能
      this.canvas.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (e.touches.length === 1) {
              this.isTouchDragging = true;
              this.touchStartX = e.touches[0].clientX - this.offsetX;
              this.touchStartY = e.touches[0].clientY - this.offsetY;
          } else if (e.touches.length === 2) {
              this.lastTouchDistance = this.getDistance(e.touches[0], e.touches[1]);
              this.lastTouchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2; // 计算两手指中心点的X坐标
          }
      });

      this.canvas.addEventListener('touchmove', (e) => {
          e.preventDefault();
          if (e.touches.length === 1 && this.isTouchDragging) {
              this.offsetX = e.touches[0].clientX - this.touchStartX;
              this.offsetY = e.touches[0].clientY - this.touchStartY;
              this.drawAxis();
              this.drawRectangle();
          } else if (e.touches.length === 2) {
              // 计算两个手指之间的距离
              let newTouchDistance = this.getDistance(e.touches[0], e.touches[1]);
              let scaleChange = newTouchDistance / this.lastTouchDistance;

              if (scaleChange !== 1) {
                  // 获取新的中心点X坐标
                  let newTouchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;

                  // 根据中心点X坐标来调整偏移量和缩放
                  letX = newTouchCenterX - this.lastTouchCenterX;
                  this.offsetX +=X;

                  // 调整缩放比例
                  this.scale *= scaleChange;

                  this.lastTouchDistance = newTouchDistance; // 更新上次的手指距离
                  this.lastTouchCenterX = newTouchCenterX;   // 更新上次的中心点X坐标

                  this.drawAxis();
                  this.drawRectangle();
              }
          }
      });

      this.canvas.addEventListener('touchend', (e) => {
          e.preventDefault();
          if (e.touches.length === 0) {
              this.isTouchDragging = false;
          }
      });
  }
}

// 初始化 CanvasDrawer 类
const drawer = new CanvasDrawer('myCanvas');
