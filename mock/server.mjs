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
server.use(rewriter);
server.use(router);

const PORT = 8000; // hoặc 4000 nếu bạn thích
server.listen(PORT, () => {
  console.log(`JSON Server running on http://127.0.0.1:${PORT}`);
});
