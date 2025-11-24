// Interface cho mã giảm giá
export interface Voucher {
  id: number;
  magiamgia: number;
  dieukien: string;
  mota: string;
  giatri: number;
  ngaybatdau: string;
  ngayketthuc: string;
  trangthai: string;
}

// Interface cho phân trang
export interface VoucherMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Interface phản hồi API mã giảm giá
export interface VoucherResponse {
  status: boolean;
  message: string;
  data: Voucher[];
  meta: VoucherMeta;
}