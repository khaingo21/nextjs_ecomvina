
export const getTrangThaiDonHang = (trang_thai: string | undefined | null): string => {
  if (!trang_thai) return 'Chưa rõ';
  switch (trang_thai.toLowerCase()) {
    case 'chờ xử lý':
    case 'pending':
    case 'chờ duyệt':
      return 'Chờ xử lý';
    case 'paid':
    case 'đã thanh toán':
      return 'Đã thanh toán';
    case 'cancelled':
      return 'Đã hủy';
    case 'delivered':
      return 'Đã giao hàng';
    default:
      return 'Chờ xử lý';
  }
};

/**
 * Ánh xạ phương thức thanh toán (Sử dụng tên trường Việt)
 */
export const getPhuongThucThanhToan = (id_phuongthuc: number | undefined | null): string => {
  switch (id_phuongthuc) {
    case 1:
      return 'Thanh toán qua VNPAY';
    case 2:
      return 'Thanh toán qua Ví điện tử';
    case 3: 
      return 'Thanh toán khi nhận hàng (COD)'; // ID 3 được dùng trong DOCX
    default:
      return 'Chưa rõ';
  }
};

// Bạn cần import và sử dụng các hàm này trong hoan-tat-thanh-toan/page.tsx và orders/page.tsx
// Ví dụ: {getTrangThaiDonHang(order.trangthai)}