// Interface cho danh mục trong bộ lọc
export interface SearchCategory {
  id: number;
  ten: string;
  slug: string;
  logo: string;
  parent: string;
  trangthai: string;
  tong_sanpham: number;
}

// Interface cho khoảng giá
export interface PriceRange {
  label: string;
  min: number;
  max: number | null;
  value: string;
}

// Interface cho thương hiệu
export interface Brand {
  id: number;
  ten: string;
  slug: string;
}

// Interface cho giá sản phẩm
export interface Price {
  current: number;
  before_discount: number;
  discount_percent: number;
}

// Interface cho đánh giá
export interface Rating {
  average: number;
  count: number;
}

// Interface cho sản phẩm trong kết quả tìm kiếm
export interface SearchProduct {
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

// Interface cho phân trang
export interface Meta {
  current_page: number;
  per_page: number;
  total: number;
}

// Interface cho bộ lọc tìm kiếm
export interface SearchFilters {
  danhmucs: SearchCategory[];
  price_ranges: PriceRange[];
  thuonghieus: Brand[];
}

// Interface phản hồi API tìm kiếm
export interface SearchResponse {
  status: boolean;
  message: string;
  filters: SearchFilters;
  data: SearchProduct[];
  meta: Meta;
}