// Interface cho banner quảng cáo
export interface Banner {
  id: number;
  vitri: string;
  hinhanh: string;
  lienket: string;
  mota: string;
  trangthai: string;
}

// Interface phản hồi API banner
export interface BannerResponse {
  status: boolean;
  message: string;
  data: Banner[];
}