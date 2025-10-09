import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('mock/db.json'); // dữ liệu JSON giả
const middlewares = jsonServer.defaults();

// map /api/... -> resource trong db.json
const rewriter = jsonServer.rewriter({
  '/api/yeuthichs*': '/yeuthichs',
  '/api/bannerquangcaos*': '/bannerquangcaos',
  '/api/danhmucs-selection*': '/danhmucs_selection',
  '/api/sanphams-selection?selection=best_products*': '/api_sanphams_selection_best_products',
  '/api/sanphams-selection?selection=top_categories*': '/api_sanphams_selection_top_categories',
  '/api/sanphams-selection?selection=hot_sales*': '/api_sanphams_selection_hot_sales',
  '/api/sanphams-selection?selection=recommend*': '/api_sanphams_selection_recommend'
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mock endpoints cho AUTH để FE có thể đăng ký/đăng nhập
server.post('/auth/register', (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body || {};
  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Hai mật khẩu không trùng khớp' });
  }
  // Lưu user vào db.json qua lowdb của json-server
  const users = router.db.get('users');
  const exists = users.find({ email }).value();
  if (exists) return res.status(409).json({ message: 'Email đã tồn tại' });

  const newUser = { id: Date.now(), name, email, phone, password };
  users.push(newUser).write();
  return res.status(200).json({ message: 'Đăng ký thành công', user: newUser });
});

server.post('/auth/login', (req, res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
  }
  const users = router.db.get('users').value();
  const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password);
  if (!user) return res.status(401).json({ message: 'Sai thông tin đăng nhập' });
  return res.status(200).json({ token: 'mock.token.value', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

server.use(rewriter);
server.use(router);

const PORT = 8000; // hoặc 4000 nếu bạn thích
server.listen(PORT, () => {
  console.log(`JSON Server running on http://127.0.0.1:${PORT}`);
});
