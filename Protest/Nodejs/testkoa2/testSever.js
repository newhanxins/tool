const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 初始化 Koa 应用和路由
const app = new Koa();
const router = new Router();

// MongoDB 连接字符串（请根据你的 MongoDB 配置修改）
const mongoUri = 'mongodb://localhost:27017/test'; // 示例连接字符串

// 连接到 MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// 定义用户模型
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// 中间件解析请求体
app.use(bodyParser());

// 登录接口
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  // 判断是否提供了用户名和密码
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { message: '用户名和密码不能为空' };
    return;
  }

  // 查找用户
  const user = await User.findOne({ username });
  if (!user) {
    ctx.status = 401;
    ctx.body = { message: '用户名或密码错误' };
    return;
  }

  // 检查密码是否正确
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    ctx.status = 401;
    ctx.body = { message: '用户名或密码错误' };
    return;
  }

  // 密码验证通过，生成 JWT token
  const payload = { userId: user._id, username: user.username };
  const secretKey = 'yourSecretKey'; // 在实际应用中，应该使用更安全的方式存储密钥
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // 1小时过期

  // 返回成功信息和 token
  ctx.body = {
    message: '登录成功',
    token,
  };
});

// 注册接口（用于演示用户注册过程）
router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { message: '用户名和密码不能为空' };
    return;
  }

  // 检查用户是否已存在
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    ctx.status = 400;
    ctx.body = { message: '用户名已存在' };
    return;
  }

  // 对密码进行加密
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 创建新用户
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  ctx.body = {
    message: '注册成功',
  };
});

// 挂载路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
