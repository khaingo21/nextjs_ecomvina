// Interface cho từng danh mục
export interface Category {
  id: number;
  ten: string;
  slug: string;
  logo: string;
  parent: string;
  trangthai: string;
  so_luong_con: number;
  danhmuccon: CategoryChild[];
}

// Interface cho danh mục con (danhmuccon)
export interface CategoryChild {
  id: number;
  ten: string;
  slug: string;
  logo: string;
  parent: string;
  trangthai: string;
  so_luong_con: number;
  danhmuccon: CategoryChild[]; // đệ quy, nếu có danh mục con trong danh mục con
}

// Interface phản hồi API
export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}
