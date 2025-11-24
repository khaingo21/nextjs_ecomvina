export interface Product {
  id: number;
  ten: string;
  slug: string;
  have_gift: boolean;
  hinh_anh: string;
  rating: {
    average: number;
    count: number;
  };
  luotxem: number;
  sold: {
    total_sold: number;
    total_quantity: number;
  };
  gia: {
    current: number;
    before_discount: number;
    discount_percent: number;
  };
  trangthai: {
    active: string;
    in_stock: boolean;
  };
}

export interface Category {
  id: number;
  ten: string;
  slug: string;
  logo: string;
  parent: string;
  trangthai: string;
  tong_sanpham: number;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number | null;
  value: string;
}

export interface Brand {
  id: number;
  ten: string;
  slug: string;
}

export interface ProductResponse {
  status: boolean;
  message: string;
  filters: {
    danhmucs: Category[];
    price_ranges: PriceRange[];
    thuonghieus: Brand[];
  };
  data: Product[];
}