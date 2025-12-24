
// 获取 canvas 元素和上下文
var canvas=""
var ctx=""
window.onload=function(){
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
  ctx.fillRect(20, 10, 200, 110);

// 示例数据：省份和市区的坐标 (假设为矩形区域，实际应用可根据数据调整)
var areas = [
  { id: 1, name: 'City 1', x: 50, y: 50, width: 150, height: 100 },
  { id: 2, name: 'City 1111111111111111111111111111112', x: 200, y: 50, width: 150, height: 30 },
  { id: 3, name: 'City 3', x: 50, y: 150, width: 150, height: 100 },
  { id: 4, name: 'City 4', x: 200, y: 150, width: 150, height: 100 },
  { id: 5, name: '水上移动', x: 200, y: 350, width: 150, height: 100 },
];

var selectedArea = null;
var offsetX = 0, offsetY = 0;
var scaleX = 1, scaleY = 1; // X轴和Y轴分别独立缩放
var scaleDirection = 'x'; // 缩放方向，'x'：只缩放X轴，'y'：只缩放Y轴，'both'：同时缩放X轴和Y轴


// 绘制地图
var startdrawdom=document.getElementById("startdraw")
startdrawdom.onclick=function(){
  drawMap()
}
function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清空画布
  
  // 绘制所有区域
  areas.forEach(function(area){
    // 根据缩放比例调整区域位置和尺寸
    var x = area.x * scaleX + offsetX;
    var y = area.y * scaleY + offsetY;
    var width = area.width * scaleX;
    var height = area.height * scaleY;

    // 绘制区域矩形
    ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
    ctx.fillRect(x, y, width, height);

    // 绘制区域边框
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // 绘制文字
    drawText(area, x, y, width, height);
  });

  // 高亮选中的区域
  if (selectedArea) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    var x = selectedArea.x * scaleX + offsetX;
    var y = selectedArea.y * scaleY + offsetY;
    var width = selectedArea.width * scaleX;
    var height = selectedArea.height * scaleY;
    ctx.strokeRect(x, y, width, height);
  }
}


// 检查点击是否在区域内
function checkClick(x, y) {
  var isok=false
  for (var index = 0; index < areas.length; index++) {
    var area=areas[index]
    var areaX = area.x * scaleX + offsetX;
    var areaY = area.y * scaleY + offsetY;
    var areaWidth = area.width * scaleX;
    var areaHeight = area.height * scaleY;
    if(x >= areaX && x <= areaX + areaWidth && y >= areaY && y <= areaY + areaHeight){
      return area
    };
    
  }

// return areas.find(function(area){
//     var areaX = area.x * scaleX + offsetX;
//     var areaY = area.y * scaleY + offsetY;
//     var areaWidth = area.width * scaleX;
//     var areaHeight = area.height * scaleY;
//     return x >= areaX && x <= areaX + areaWidth && y >= areaY && y <= areaY + areaHeight;
//   });
}

// 处理鼠标点击事件
canvas.addEventListener('click', function(e) {
  var mouseX = e.offsetX;
  var mouseY = e.offsetY;
  var clickedArea = checkClick(mouseX, mouseY);
  if (clickedArea) {
    selectedArea = clickedArea;
    drawMap(); // 重新绘制地图并高亮选中区域
  } else {
    selectedArea = null;
    drawMap(); // 重新绘制地图并去掉高亮
  }
});

// 处理鼠标滚轮缩放
canvas.addEventListener('wheel', function(e){
  e.preventDefault();  // 阻止默认滚动行为
  var zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;  // 放大或缩小
console.log(zoomFactor,scaleDirection)
  if (scaleDirection === 'x' || scaleDirection === 'both') {
    scaleX *= zoomFactor;  // 调整X轴的缩放比例
  }
  if (scaleDirection === 'y' || scaleDirection === 'both') {
    scaleY *= zoomFactor;  // 调整Y轴的缩放比例
  }

  // 防止缩放过小或过大
  if (scaleX < 0.5) scaleX = 0.5;
  if (scaleX > 3) scaleX = 3;
  if (scaleY < 0.5) scaleY = 0.5;
  if (scaleY > 3) scaleY = 3;

  drawMap();  // 重新绘制地图
});

// 处理拖动功能
var isDragging = false;
var startX = 0;
var startY = 0;

canvas.addEventListener('mousedown', function(e) {
  isDragging = true;
  startX = e.offsetX - offsetX;
  startY = e.offsetY - offsetY;
});

canvas.addEventListener('mousemove', function(e) {
  if (isDragging) {
    offsetX = e.offsetX - startX;
    offsetY = e.offsetY - startY;
    drawMap();  // 重新绘制地图
  }
});

canvas.addEventListener('mouseup', function(){
  isDragging = false;
});

canvas.addEventListener('mouseleave', function(){
  isDragging = false;
});

// 手指触摸操作
var touchStartDist = 0;
var prevTouchDistance = 0;
var isTouching = false;

canvas.addEventListener('touchstart', function(e) {
  if (e.touches.length == 2) {
    isTouching = true;
    var touch1 = e.touches[0];
    var touch2 = e.touches[1];
    touchStartDist = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
    prevTouchDistance = touchStartDist;
  }
});

canvas.addEventListener('touchmove', function(e){
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
    drawMap();  // 重新绘制地图
  }
});

canvas.addEventListener('touchend', function(){
  if (e.touches.length < 2) {
    isTouching = false;
    prevTouchDistance = 0;
  }
});
// 通过键盘切换缩放方向
window.addEventListener('keydown', function(e){
  if (e.key === 'x') {
    scaleDirection = 'x'; // 只缩放X轴
  } else if (e.key === 'y') {
    scaleDirection = 'y'; // 只缩放Y轴
  } else if (e.key === 'b') {
    scaleDirection = 'both'; // 同时缩放X轴和Y轴
  }
});
function showconsole(data){
    var nowdragtimes=new Date().getTime()
    var reqdata=JSON.stringify(data)
    var texts='<p><span>'+nowdragtimes+'</span>'+reqdata+'</p>'
    $("#consolelogs").append(texts)
}

window.addEventListener('error',function(errorMessage, scriptURI, lineNo, columnNo, error){
    var texts="message:"+errorMessage.message+",line:"+errorMessage.lineno+",filename:"+errorMessage.filename+",error"+JSON.stringify(errorMessage)
    var reqdata = '{"request_type":"map_log报错","name":"代码报错报错报错","request_data":'+texts+'}';
    showconsole(reqdata)
}, true);
}