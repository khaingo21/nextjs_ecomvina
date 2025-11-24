// Interface cho từ khóa
export interface Keyword {
  id: number;
  tukhoa: string;
  luottruycap: number;
}

// Interface cho phân trang
export interface KeywordMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

// Interface phản hồi API từ khóa
export interface KeywordResponse {
  status: boolean;
  message: string;
  data: Keyword[];
  meta: KeywordMeta;
}