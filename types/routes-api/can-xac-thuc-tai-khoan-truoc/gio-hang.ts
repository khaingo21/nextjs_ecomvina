// Chi tiết sản phẩm (detail trong bienthe hoặc bienthe_quatang)
export interface ProductDetail {
  thuonghieu: string;
  tensanpham: string;
  loaisanpham: string;
  giamgia?: string; // Có thể null hoặc không có (vì quà tặng không có)
  giagoc: number;
  giaban?: number; // Không có trong bienthe_quatang
  hinhanh: string;
}

// Biến thể sản phẩm hoặc quà tặng
export interface BienThe {
  soluong: number;
  giagoc: number;
  thanhtien: number;
  tamtinh: number;
  detail: ProductDetail;
}

// Dữ liệu của từng sản phẩm trong giỏ
export interface GioHangItem {
  id_giohang: number;
  id_nguoidung: number;
  trangthai: string;
  bienthe: BienThe | null;
  bienthe_quatang: BienThe | null;
}

// Toàn bộ response API
export interface GioHangResponse {
  status: boolean;
  message: string;
  data: GioHangItem[];
}
