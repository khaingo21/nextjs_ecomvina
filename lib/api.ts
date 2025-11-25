// lib/api.ts
const BASE_URL = process.env.SERVER_API || process.env.NEXT_PUBLIC_SERVER_API || "http://148.230.100.215";

if (!BASE_URL) {
  console.warn("⚠️ BASE_URL chưa được khai báo trong .env");
}

/**
 * Định nghĩa các tùy chọn có thể được sử dụng khi thực hiện một yêu cầu fetch.
 *
 * @property method - Phương thức HTTP sẽ sử dụng cho yêu cầu (ví dụ: 'GET', 'POST').
 * @property body - Nội dung (body) của yêu cầu. Thường được sử dụng với các phương thức 'POST' hoặc 'PUT'.
 * @property cache - Chỉ định cách yêu cầu tương tác với bộ nhớ đệm HTTP của trình duyệt.
 * @property headers - Một đối tượng chứa các tiêu đề (header) của yêu cầu.
 * @property credentials - Chính sách về thông tin xác thực (credentials) sẽ được sử dụng cho yêu cầu.
 */
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  cache?: RequestCache;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

/**
 * Gửi một yêu cầu HTTP đến một endpoint cụ thể bằng cách sử dụng `fetch`.
 * Hàm này tự động xử lý việc chuyển đổi body thành JSON, đặt các header mặc định,
 * và xử lý lỗi cho các phản hồi không thành công.
 *
 * @template T - Kiểu dữ liệu mong đợi của dữ liệu phản hồi JSON. Mặc định là `any`.
 * @param {string} endpoint - Đường dẫn API cần gọi (sẽ được nối vào `BASE_URL`).
 * @param {FetchOptions} [options={}] - Một đối tượng tùy chọn cho `fetch`, bao gồm `method`, `headers`, `body`, `cache`, v.v.
 * @returns {Promise<T>} Một promise sẽ phân giải thành dữ liệu JSON từ phản hồi.
 * @throws {Error} Ném ra một lỗi nếu yêu cầu mạng thất bại hoặc nếu máy chủ trả về một mã trạng thái không thành công (ví dụ: 4xx, 5xx).
 */
async function request<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      cache: options.cache || "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers ?? {}),
      },
      credentials: options.credentials,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`❌ API Request failed: ${endpoint}`, error);
    throw error;
  }
}


/**
 * API utility object providing HTTP request methods.
 * 
 * @remarks
 * This object provides convenient methods for making HTTP requests with type safety.
 * All methods return promises that resolve to the specified generic type.
 * 
 * @example
 * ```typescript
 * // GET request with type safety
 * const data = await api.get<User>('/api/users/1');
 * 
 * // POST request with data
 * const newUser = await api.post<User>('/api/users', { name: 'John' });
 * 
 * // PUT request to update data
 * const updated = await api.put<User>('/api/users/1', { name: 'Jane' });
 * 
 * // DELETE request
 * await api.delete('/api/users/1');
 * ```
 */
/**
 * Một đối tượng helper chứa các phương thức để tương tác với API.
 * Các phương thức này là các trình bao bọc (wrapper) xung quanh hàm `request`
 * để đơn giản hóa việc thực hiện các yêu cầu HTTP GET, POST, PUT, và DELETE.
 *
 * @example
 * ```typescript
 * // Lấy danh sách sản phẩm
 * const products = await api.get<Product[]>('/products');
 *
 * // Tạo một sản phẩm mới
 * const newProduct = await api.post<Product>('/products', { name: 'New Product', price: 100 });
 * ```
 */
export const api = {
  get: <T = any>(endpoint: string, cache: RequestCache = "no-store") =>
    request<T>(endpoint, { method: "GET", cache }),

  post: <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, { method: "POST", body: data }),

  put: <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, { method: "PUT", body: data }),

  delete: <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};

// ============================================
// Homepage API Types & Functions
// ============================================

// ===== Hot Keywords =====
export interface HotKeyword {
  id: number;
  tukhoa: string;
  luottruycap: number;
  lienket: string;
}

// ===== Banners =====
export interface HomeBanner {
  id: number;
  vitri: string;
  hinhanh: string;
  lienket: string;
  mota: string;
  trangthai: string;
  thutu?: number; // Optional field for banner order
}

// ===== Categories =====
export interface HotCategory {
  id: number;
  ten: string;
  slug: string;
  logo: string;
  total_luotban: string;
  lienket: string;
}

// ===== Products =====
export interface HomeHotSaleProduct {
  id: number;
  slug: string;
  ten: string;
  hinh_anh: string;
  thuonghieu: string;
  rating: {
    average: number;
    count: number;
  };
  sold_count: string;
  gia: {
    current: number;
    before_discount: number;
    discount_percent: number;
  };
  have_gift: boolean;
}

// ===== Gift Events =====
export interface GiftEvent {
  id: number;
  tieude: string;
  dieukien: string;
  thongtin: string;
  hinhanh: string;
  luotxem: number;
  ngaybatdau: string;
  ngayketthuc: string;
  thoigian_conlai: string;
  chuongtrinh: {
    id: number;
    tieude: string;
    hinhanh: string;
  };
}

// ===== Top Categories with Products =====
export interface HomeTopCategoryWithProducts {
  id: number;
  ten: string;
  slug: string;
  total_sold: number;
  sanpham: HomeHotSaleProduct[];
}

// ===== Top Brands =====
export interface TopBrand {
  id: number;
  ten: string;
  slug: string;
  logo: string;
  mota: string;
  total_sold: number;
}

// ===== Coupons =====
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

// ===== Main Response =====
export interface HomePageResponse {
  status: boolean;
  message: string;
  data: {
    hot_keywords: HotKeyword[];
    new_banners: HomeBanner[];
    hot_categories: HotCategory[];
    hot_sales: HomeHotSaleProduct[];
    hot_gift: GiftEvent[];
    top_categories: HomeTopCategoryWithProducts[];
    top_brands: TopBrand[];
    best_products: HomeHotSaleProduct[];
    new_coupon: Coupon[];
    new_launch: HomeHotSaleProduct[];
    most_watched: HomeHotSaleProduct[];
  };
}

/**
 * Fetch homepage data from the API server
 * @param headers - Optional custom headers
 * @param perPage - Number of products per category (default: 6)
 * @returns Promise with homepage data including banners, products, and categories
 */
export async function fetchHomePage(headers?: Record<string, string>, perPage: number = 6): Promise<HomePageResponse> {
  const HOME_API_URL = "http://148.230.100.215";
  const url = `${HOME_API_URL}/api/trang-chu${perPage !== 6 ? `?per_page=${perPage}` : ''}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Home API error: ${response.status}`);
  }

  return response.json() as Promise<HomePageResponse>;
}

// ============================================
// Product Detail API Types & Functions
// ============================================

export interface ProductDetail {
  id: number;
  slug: string;
  ten: string;
  hinh_anh?: string;
  mediaurl?: string;
  images?: string[];
  thuonghieu?: string;
  shop_name?: string;
  mota?: string;
  mo_ta?: string;
  thong_tin_chi_tiet?: string;
  rating?: {
    average: number;
    count: number;
  };
  sold_count?: string;
  sold?: number;
  gia: {
    current: number;
    before_discount?: number;
    discount_percent?: number;
  };
  selling_price?: number;
  original_price?: number;
  discount_percent?: number;
  variants?: unknown[];
  category?: string;
  tags?: string[];
  xuatxu?: string;
  sanxuat?: string;
}

export interface ProductDetailResponse {
  status: boolean;
  data: ProductDetail;
}

/**
 * Fetch product detail by slug from the API server
 * @param slug - Product slug
 * @returns Promise with product detail data
 */
export async function fetchProductDetail(slug: string): Promise<ProductDetailResponse> {
  const HOME_API_URL = "http://148.230.100.215";
  const url = `${HOME_API_URL}/api/san-pham/${slug}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Product detail API error: ${response.status}`);
  }

  return response.json() as Promise<ProductDetailResponse>;
}

// ============================================
// Search Products API Types & Functions
// ============================================

export interface SearchProduct {
  id: number;
  ten: string;
  slug: string;
  hinh_anh: string;
  mediaurl?: string;
  thuonghieu: string;
  danhmuc?: string;
  gia: {
    current: number;
    before_discount: number;
    discount_percent: number;
  };
  rating?: {
    average: number;
    count: number;
  };
  sold?: number;
  sold_count?: string;
}

export interface SearchProductsResponse {
  status: boolean;
  data: SearchProduct[];
}

/**
 * Search products by keyword from the API server
 * Since production API doesn't have a dedicated search endpoint,
 * we fetch all products from homepage and filter locally
 * @param query - Search query keyword
 * @returns Promise with search results
 */
export async function fetchSearchProducts(query: string): Promise<SearchProduct[]> {
  try {
    // Fetch all products from homepage API
    const homePage = await fetchHomePage();

    // Combine all product arrays INCLUDING top_categories products
    const allProducts: HomeHotSaleProduct[] = [
      ...(homePage.data.hot_sales || []),
      ...(homePage.data.best_products || []),
      ...(homePage.data.new_launch || []),
      ...(homePage.data.most_watched || []),
      // Add products from all top_categories
      ...(homePage.data.top_categories || []).flatMap(cat => cat.sanpham || []),
    ];

    // Remove duplicates by id
    const uniqueProducts = Array.from(
      new Map(allProducts.map(p => [p.id, p])).values()
    );

    // Filter by search query (case-insensitive)
    const lowerQuery = query.toLowerCase().trim();
    const filtered = lowerQuery
      ? uniqueProducts.filter(p =>
        p.ten?.toLowerCase().includes(lowerQuery) ||
        p.thuonghieu?.toLowerCase().includes(lowerQuery)
      )
      : uniqueProducts;

    // Convert to SearchProduct format
    return filtered.map(p => ({
      id: p.id,
      ten: p.ten,
      slug: p.slug,
      hinh_anh: p.hinh_anh,
      thuonghieu: p.thuonghieu,
      gia: {
        current: p.gia.current,
        before_discount: p.gia.before_discount,
        discount_percent: p.gia.discount_percent,
      },
      rating: {
        average: p.rating?.average || 0,
        count: p.rating?.count || 0,
      },
      sold: parseInt(p.sold_count || "0"),
      sold_count: p.sold_count,
    }));
  } catch (error) {
    console.error('Error fetching search products:', error);
    return [];
  }
}