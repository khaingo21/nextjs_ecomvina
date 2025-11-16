# HỆ THỐNG TÌM KIẾM VÀ XẾP HẠNG SẢN PHẨM

## Tổng quan
Hệ thống tìm kiếm được xây dựng theo tiêu chuẩn của các sàn TMĐT lớn như Shopee, với thuật toán scoring dựa trên 4 yếu tố chính.

## Kiến trúc hệ thống

### 1. Thuật toán Scoring (`lib/searchAlgorithm.ts`)

#### Công thức tính điểm tổng:
```
Total Score = Relevance (40%) + Performance (35%) + Optimization (15%) + Marketing (10%)
```

#### A. Mức độ liên quan (Relevance) - 40%

**Công thức:**
```
Relevance Score = Title Match (60%) + Description Match (25%) + Hashtag Match (15%)
```

**Chi tiết:**
- **Tìm trong tiêu đề (60%)**:
  - Tính tỷ lệ từ khóa khớp trong tiêu đề
  - Bonus nếu từ khóa xuất hiện ở đầu tiêu đề
  - Ví dụ: Tìm "tai nghe" → "Tai nghe XYZ" score cao hơn "XYZ tai nghe"

- **Tìm trong mô tả (25%)**:
  - Kiểm tra từ khóa trong mô tả sản phẩm
  - Giúp tìm được sản phẩm liên quan gián tiếp

- **Tìm trong hashtags (15%)**:
  - Match với các tag đã gắn cho sản phẩm
  - Hỗ trợ tìm kiếm ngữ cảnh

#### B. Hiệu suất bán hàng (Performance) - 35%

**Công thức:**
```
Performance = Sales (30%) + CVR (25%) + Rating (25%) + Shop Reputation (20%)
```

**Chi tiết:**

1. **Doanh số (30%)**:
   ```
   Sales Score = (total_sold/1000) × 0.5 + (monthly_sold/100) × 0.5
   ```
   - Ưu tiên sản phẩm bán nhiều và bán đều
   - Cân bằng giữa lịch sử lâu dài và xu hướng hiện tại

2. **Tỷ lệ chuyển đổi - CVR (25%)**:
   ```
   CVR = số đơn hàng / số lượt xem
   ```
   - Sản phẩm có CVR cao = sản phẩm đúng nhu cầu
   - Thường dao động 5-25%

3. **Đánh giá sản phẩm (25%)**:
   ```
   Rating Score = (rating_average/5) × 0.7 + (rating_count/100) × 0.3
   ```
   - Ưu tiên sao trung bình cao
   - Bonus cho số lượng đánh giá nhiều (độ tin cậy)

4. **Uy tín Shop (20%)**:
   ```
   Shop Score = Mall Badge (40%) + Favorite Badge (30%) 
              + Shop Rating (20%) + Response Rate (10%)
   ```
   - Shop Mall/Yêu thích được ưu tiên cao
   - Phản hồi chat nhanh = dịch vụ tốt

**Penalty**:
```
Final Score -= return_rate × 0.1 + cancel_rate × 0.1
```
- Trừ điểm nếu tỷ lệ hủy/trả hàng cao

#### C. Tối ưu hóa (Optimization) - 15%

**Công thức:**
```
Optimization = Video (40%) + Images (30%) + Description (20%) + Hashtags (10%)
```

**Chi tiết:**
- **Video (40%)**: Có video demo = +40%
- **Số lượng ảnh (30%)**: Tối đa 10 ảnh, min(image_count/10, 0.3)
- **Mô tả đầy đủ (20%)**: Mô tả > 100 ký tự
- **Hashtags (10%)**: Có gắn hashtag

#### D. Marketing & Khuyến mãi (Marketing) - 10%

**Công thức:**
```
Marketing = Advertising (40%) + Flash Sale (50%) + Discount (10%)
```

**Chi tiết:**
- **Quảng cáo CPC (40%)**: Sản phẩm chạy ads được boost
- **Flash Sale (50%)**: Sản phẩm trong chương trình flash sale
  - Có priority level: thêm bonus (priority/10) × 10%
- **Có giảm giá (10%)**: Có discount_amount hoặc discount_percent

### 2. API Endpoints

#### `/api/sanphams`
Lấy toàn bộ danh sách sản phẩm với đầy đủ trường scoring

#### Search Frontend (`/search`)
- URL: `http://localhost:3000/search?q=<keyword>&category_id=<id>&sort=<type>`
- Query params:
  - `q`: Từ khóa tìm kiếm
  - `category_id`: Lọc theo danh mục (optional)
  - `sort`: relevance | sales | price_asc | price_desc | rating

### 3. Components

#### `SearchBox.tsx`
- Auto-suggest từ khóa từ API `tukhoas`
- Lưu lịch sử tìm kiếm
- Chuyển hướng đến `/search?q=<keyword>`

#### `ProductCardSearch.tsx`
- Hiển thị sản phẩm với badges: Mall, Flash Sale, Discount
- Hiển thị rating và đã bán
- Responsive grid layout

#### `app/search/page.tsx`
- Sidebar filters:
  - Danh mục
  - Khoảng giá
  - Đánh giá tối thiểu
- Sort bar: Liên quan, Bán chạy, Giá, Đánh giá
- Grid sản phẩm responsive

### 4. Database Schema

Các trường bắt buộc cho scoring:

```typescript
type Product = {
  // Cơ bản
  id: number;
  ten: string;
  slug: string;
  mota?: string;
  hashtags?: string[];
  danhmuc_id: number;
  
  // Giá & Đánh giá
  selling_price: number;
  original_price: number;
  discount_amount?: number;
  discount_percent?: number;
  rating_average: number;
  rating_count: number;
  
  // Performance Metrics
  total_sold?: number;          // Tổng đã bán
  monthly_sold?: number;         // Bán trong tháng
  conversion_rate?: number;      // Tỷ lệ chuyển đổi (0-1)
  view_count?: number;           // Lượt xem
  
  // Shop Metrics
  shop_response_rate?: number;   // Tỷ lệ phản hồi (0-1)
  return_rate?: number;          // Tỷ lệ trả hàng (0-1)
  cancel_rate?: number;          // Tỷ lệ hủy (0-1)
  shop_rating?: number;          // Đánh giá shop (0-5)
  is_mall?: boolean;             // Shop Mall
  is_favorite?: boolean;         // Shop yêu thích
  
  // Content Quality
  has_video?: boolean;           // Có video
  image_count?: number;          // Số ảnh
  
  // Marketing
  is_ad?: boolean;               // Chạy quảng cáo
  is_flash_sale?: boolean;       // Flash sale
  flash_sale_priority?: number;  // Độ ưu tiên (1-10)
};
```

## Hướng dẫn sử dụng

### 1. Cập nhật mock data
```bash
node scripts/update-products.js
```

### 2. Test tìm kiếm
1. Mở `http://localhost:3000`
2. Nhập từ khóa vào search box (vd: "tai nghe", "kem dưỡng")
3. Xem kết quả tại `/search?q=<keyword>`

### 3. Test filters
- Click vào danh mục để lọc
- Điều chỉnh khoảng giá
- Chọn đánh giá tối thiểu
- Thử các sort options

### 4. Tùy chỉnh trọng số
Chỉnh trong `lib/searchAlgorithm.ts`:
```typescript
const totalScore = 
  relevanceScore * 0.40 +    // Thay đổi % ở đây
  performanceScore * 0.35 +
  optimizationScore * 0.15 +
  marketingScore * 0.10;
```

## Best Practices

### 1. SEO Optimization
- **Tiêu đề**: Đặt từ khóa quan trọng ở đầu
- **Mô tả**: Chi tiết, > 100 ký tự
- **Hashtags**: 3-5 tags liên quan

### 2. Nâng cao Performance Score
- Duy trì CVR cao: Ảnh đẹp, giá tốt, mô tả chi tiết
- Giảm return_rate: Chất lượng sản phẩm đúng mô tả
- Tăng shop_rating: Dịch vụ tốt, phản hồi nhanh

### 3. Content Quality
- Upload video demo sản phẩm (+40%)
- 5-8 ảnh chất lượng cao
- Mô tả đầy đủ specs, hướng dẫn sử dụng

### 4. Marketing Boost
- Chạy quảng cáo cho sản phẩm mới
- Tham gia Flash Sale trong các event lớn
- Giảm giá hợp lý để thu hút

## Ví dụ Scoring

### Sản phẩm A: "Tai nghe XYZ"
```
Tìm kiếm: "tai nghe"

Relevance: 0.95 (95%)
- Title match: 1.0 (100% - khớp chính xác)
- Description: 0.8
- Hashtags: 0.9

Performance: 0.72 (72%)
- Sales: 2500 sold → 0.85
- CVR: 15% → 0.75
- Rating: 4.5★ (80 reviews) → 0.70
- Shop: Mall + 4.8★ → 0.65
- Penalty: -0.02 (return rate 2%)

Optimization: 0.70 (70%)
- Has video: Yes (+40%)
- Images: 8 (+24%)
- Description: 150 chars (+20%)
- Hashtags: Yes (+10%)

Marketing: 0.60 (60%)
- Is Ad: Yes (+40%)
- Flash Sale: No
- Discount: 20% (+10%)

Total Score = 0.95×0.40 + 0.72×0.35 + 0.70×0.15 + 0.60×0.10
           = 0.38 + 0.252 + 0.105 + 0.06
           = 0.797 (79.7%)
```

### Sản phẩm B: "Kem dưỡng ABC"
```
Tìm kiếm: "tai nghe"

Relevance: 0.05 (5%)
- Không khớp tiêu đề, mô tả, hashtag

Performance: 0.80 (80%)
- Sales, rating tốt

Optimization: 0.50 (50%)

Marketing: 0.30 (30%)

Total Score = 0.05×0.40 + 0.80×0.35 + 0.50×0.15 + 0.30×0.10
           = 0.02 + 0.28 + 0.075 + 0.03
           = 0.405 (40.5%)

→ Sản phẩm A xếp hạng cao hơn nhiều
```

## Roadmap

### Phase 2 - Nâng cao
- [ ] Machine Learning cho personalized search
- [ ] Collaborative filtering (người mua X cũng mua Y)
- [ ] Image search (tìm bằng hình ảnh)
- [ ] Voice search
- [ ] Real-time analytics dashboard

### Phase 3 - Optimization
- [ ] Elasticsearch integration
- [ ] Redis caching cho hot keywords
- [ ] A/B testing cho trọng số scoring
- [ ] CDN cho images

## Kết luận

Hệ thống tìm kiếm đã được xây dựng với các yếu tố:
✅ Relevance matching với title, description, hashtags
✅ Performance metrics (sales, CVR, ratings)
✅ Content quality optimization
✅ Marketing boost (ads, flash sale)
✅ Filters và sorting đa dạng
✅ Responsive UI/UX

Có thể mở rộng và tùy chỉnh linh hoạt theo nhu cầu business.
