import { Product, ProductResponse } from "@/types/routes-api/cong-khai/sanpham-all";

/**
 * Hàm xử lý dữ liệu JSON sản phẩm trả về từ API.
 * - Lọc ra sản phẩm giảm giá
 * - Gom nhóm theo mức giá
 * - Trả về thống kê cơ bản
 */
export function parseProducts(response: ProductResponse) {
  if (!response?.status || !Array.isArray(response.data)) {
    throw new Error("Dữ liệu không hợp lệ từ API");
  }

  const products = response.data;

  // 1️⃣ Lọc ra sản phẩm có giảm giá
  const discounted = products.filter((p) => p.gia.discount_percent > 0);

  // 2️⃣ Gom nhóm sản phẩm theo mức giá
  const groups = {
    low: products.filter((p) => p.gia.current < 200000),
    medium: products.filter(
      (p) => p.gia.current >= 200000 && p.gia.current <= 500000
    ),
    high: products.filter((p) => p.gia.current > 500000),
  };

  // 3️⃣ Tạo danh sách rút gọn cho hiển thị
  const simplified = products.map((p) => ({
    id: p.id,
    name: p.ten,
    price: p.gia.current,
    discount: p.gia.discount_percent,
    sold: p.sold.total_sold,
    rating: p.rating.average,
    inStock: p.trangthai.in_stock,
  }));

  return {
    total: products.length,
    discountedCount: discounted.length,
    groups,
    simplified,
  };
}
