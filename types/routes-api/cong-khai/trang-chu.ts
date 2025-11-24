export interface ApiResponse {
  status: boolean;
  message: string;
  data: HomeData;
}

export interface HomeData {
  hot_keywords: HotKeyword[];
  new_banners: Banner[];
  hot_categories: Category[];
  hot_sales: Product[];
  hot_gift: Gift[];
  top_categories: TopCategory[];
  top_brands: Brand[];
  best_products: Product[];
  new_coupon: Coupon[];
  new_launch: Product[];
  most_watched: Product[];
}

export interface HotKeyword {
  id: number;
  tukhoa: string;
  luottruycap: number;
  lienket: string;
}

export interface Banner {
  id: number;
  vitri: string;
  hinhanh: string;
  lienket: string;
  mota: string;
  trangthai: string;
}

export interface Category {
  id: number;
  ten: string;
  slug: string;
  logo: string;
  total_luotban: string;
  lienket: string;
}

export interface Price {
  current: number;
  before_discount: number;
  discount_percent: number;
}

export interface Rating {
  average: number;
  count: number;
}

export interface Product {
  id: number;
  ten: string;
  slug: string;
  hinh_anh: string;
  thuonghieu: string;
  gia: Price;
  rating: Rating;
  sold_count: string;
  have_gift: boolean;
}

export interface Gift {
  id: number;
  tieude: string;
  dieukien: string;
  thongtin: string;
  hinhanh: string;
  luotxem: number;
  ngaybatdau: string;
  ngayketthuc: string;
  thoigian_conlai: string;
  chuongtrinh: ChuongTrinh;
}

export interface ChuongTrinh {
  id: number;
  tieude: string;
  hinhanh: string;
}

export interface TopCategory {
  id: number;
  ten: string;
  slug: string;
  total_sold: number;
  sanpham: Product[];
}

export interface Brand {
  id: number;
  ten: string;
  slug: string;
  logo: string;
  mota: string;
  total_sold: number;
}

export interface Coupon {
  id: number;
  magiamgia: number;
  dieukien: string;
  mota: string;
  giatri: number;
  ngaybatdau: string;
  ngayketthuc: string;
  trangthai: string;
}