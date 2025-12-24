const WebSocket = require('ws'); // 引入 ws 库
const http = require('http');

// 创建一个 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running.');
});

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

// 监听 WebSocket 连接事件
wss.on('connection', (ws) => {
  console.log('New client connected!');

  // 监听消息事件
  ws.on('message', (message) => {
    console.log('Received:', message);
    let result = {
        jsonrpc: '2.0',
        id: "3",
        result: {
          data: "22222222222222",
          status: 200,
          message: 'success'
        }
      }
    // 发送回消息
    ws.send(JSON.stringify(result));
  });

  // 监听客户端断开连接事件
  ws.on('close', () => {
    console.log('Client disconnected!');
  });

  // 发送欢迎消息给客户端
  ws.send('Welcome to WebSocket server on port 3002!');
});

// 让服务器监听 3002 端口
server.listen(3002, () => {
  console.log('WebSocket server is running on ws://localhost:3002');
});
