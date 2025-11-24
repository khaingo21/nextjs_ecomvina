// Interface cho chương trình sự kiện
export interface EventProgram {
  id: number;
  tieude: string;
  slug: string;
  hinhanh: string;
  noidung: string;
  trangthai: string;
}

// Interface cho link phân trang
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Interface cho thông tin phân trang
export interface EventPagination {
  current_page: number;
  data: EventProgram[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Interface phản hồi API chương trình sự kiện
export interface EventProgramResponse {
  status: boolean;
  message: string;
  data: EventPagination;
}