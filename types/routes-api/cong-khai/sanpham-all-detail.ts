export interface ProductImage {
  id: number;
  hinhanh: string;
  trangthai: string;
}

export interface ProductCategory {
  id_danhmuc: number;
  ten: string;
  slug: string;
}

export interface ProductRating {
  average: number;
  count: number;
  sao_5: number;
  sao_4: number;
  sao_3: number;
  sao_2: number;
  sao_1: number;
}

export interface ProductSold {
  total_sold: number;
  total_quantity: number;
}

export interface ProductTrangThai {
  active: string;
  in_stock: boolean;
}

export interface ProductLoaiBienThe {
  id_loaibienthe: number;
  ten: string;
  trangthai: string;
}

export interface ProductBienThe {
  id_bienthe: number;
  loai_bien_the: number;
  giagoc: number;
  giamgia: number;
  giahientai: number;
  luotban: number;
}

export interface ProductDanhGia {
  id: number;
  diem: number;
  noidung: string;
  hoten: string;
}

/** Dữ liệu chi tiết của 1 sản phẩm */
export interface ProductDetail {
  id: number;
  ten: string;
  slug: string;
  have_gift: boolean;
  danhmuc: ProductCategory[];
  rating: ProductRating;
  sold: ProductSold;
  luotxem: number;
  xuatxu: string;
  sanxuat: string;
  trangthai: ProductTrangThai;
  loai_bien_the: ProductLoaiBienThe[];
  bienthe_khichon_loaibienthe_themvaogio: ProductBienThe[];
  anh_san_pham: ProductImage[];
  danh_gia: ProductDanhGia[];
  mota: string;
}

/** Dữ liệu sản phẩm tương tự */
export interface RelatedProduct {
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

/** Phản hồi API chi tiết sản phẩm */
export interface ProductDetailResponse {
  data: ProductDetail;
  sanpham_tuongtu: RelatedProduct[];
}