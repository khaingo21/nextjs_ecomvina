/**
 * Thuật toán tìm kiếm và xếp hạng sản phẩm theo tiêu chuẩn Shopee
 * 
 * Các yếu tố scoring:
 * 1. Mức độ liên quan (Relevance): 40%
 * 2. Hiệu suất bán hàng (Performance): 35%
 * 3. Tối ưu hóa (Optimization): 15%
 * 4. Marketing & Khuyến mãi: 10%
 */

export type Product = {
    id: number;
    ten: string;
    slug: string;
    mota?: string;
    hashtags?: string[];
    mediaurl?: string;
    selling_price: number;
    original_price: number;
    discount_amount?: number;
    discount_percent?: number;
    rating_average: number;
    rating_count: number;
    danhmuc_id: number;

    // Thêm các trường cho scoring
    total_sold?: number;           // Tổng đã bán
    monthly_sold?: number;          // Đã bán trong tháng
    conversion_rate?: number;       // Tỷ lệ chuyển đổi (0-1)
    view_count?: number;            // Lượt xem
    shop_response_rate?: number;    // Tỷ lệ phản hồi shop (0-1)
    return_rate?: number;           // Tỷ lệ trả hàng (0-1)
    cancel_rate?: number;           // Tỷ lệ hủy đơn (0-1)
    shop_rating?: number;           // Đánh giá shop (0-5)
    is_mall?: boolean;              // Shop Mall
    is_favorite?: boolean;          // Shop yêu thích
    has_video?: boolean;            // Có video
    image_count?: number;           // Số lượng ảnh
    is_ad?: boolean;                // Đang chạy quảng cáo
    is_flash_sale?: boolean;        // Đang flash sale
    flash_sale_priority?: number;   // Độ ưu tiên flash sale
};

export type SearchParams = {
    query: string;                  // Từ khóa tìm kiếm
    category_id?: number;           // Lọc theo danh mục
    min_price?: number;             // Giá tối thiểu
    max_price?: number;             // Giá tối đa
    min_rating?: number;            // Đánh giá tối thiểu
    sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'sales' | 'newest' | 'rating';
};

/**
 * Tính điểm liên quan dựa trên từ khóa
 * Trọng số: Tiêu đề (60%), Mô tả (25%), Hashtag (15%)
 */
function calculateRelevanceScore(product: Product, query: string): number {
    const keywords = query.toLowerCase().trim().split(/\s+/);
    let score = 0;

    // Tìm trong tiêu đề (quan trọng nhất)
    const title = product.ten.toLowerCase();
    let titleMatches = 0;
    keywords.forEach(kw => {
        if (title.includes(kw)) {
            titleMatches++;
            // Bonus nếu khớp chính xác từ đầu
            if (title.startsWith(kw)) titleMatches += 0.5;
        }
    });
    score += (titleMatches / keywords.length) * 0.6;

    // Tìm trong mô tả
    if (product.mota) {
        const desc = product.mota.toLowerCase();
        let descMatches = 0;
        keywords.forEach(kw => {
            if (desc.includes(kw)) descMatches++;
        });
        score += (descMatches / keywords.length) * 0.25;
    }

    // Tìm trong hashtags
    if (product.hashtags && product.hashtags.length > 0) {
        let tagMatches = 0;
        keywords.forEach(kw => {
            product.hashtags?.forEach(tag => {
                if (tag.toLowerCase().includes(kw)) tagMatches++;
            });
        });
        score += (tagMatches / keywords.length) * 0.15;
    }

    return Math.min(score, 1); // Normalize 0-1
}

/**
 * Tính điểm hiệu suất bán hàng
 * Bao gồm: Doanh số, tỷ lệ chuyển đổi, đánh giá, uy tín shop
 */
function calculatePerformanceScore(product: Product): number {
    let score = 0;

    // 1. Doanh số (30% của performance score)
    const totalSold = product.total_sold || 0;
    const monthlySold = product.monthly_sold || 0;
    const salesScore = Math.min((totalSold / 1000) * 0.5 + (monthlySold / 100) * 0.5, 1);
    score += salesScore * 0.3;

    // 2. Tỷ lệ chuyển đổi (25%)
    const cvr = product.conversion_rate || 0;
    score += cvr * 0.25;

    // 3. Đánh giá sản phẩm (25%)
    const ratingScore = (product.rating_average / 5) * 0.7 +
        Math.min((product.rating_count / 100), 1) * 0.3;
    score += ratingScore * 0.25;

    // 4. Uy tín shop (20%)
    let shopScore = 0;
    if (product.is_mall) shopScore += 0.4;
    if (product.is_favorite) shopScore += 0.3;
    shopScore += (product.shop_rating || 0) / 5 * 0.2;
    shopScore += (product.shop_response_rate || 0) * 0.1;
    score += shopScore * 0.2;

    // Trừ điểm nếu tỷ lệ hủy/trả cao
    const returnPenalty = (product.return_rate || 0) * 0.1;
    const cancelPenalty = (product.cancel_rate || 0) * 0.1;
    score = Math.max(score - returnPenalty - cancelPenalty, 0);

    return score;
}

/**
 * Tính điểm tối ưu hóa
 * Chất lượng nội dung: ảnh, video, mô tả đầy đủ
 */
function calculateOptimizationScore(product: Product): number {
    let score = 0;

    // Có video: +40%
    if (product.has_video) score += 0.4;

    // Số lượng ảnh (max 30%)
    const imageCount = product.image_count || 1;
    score += Math.min(imageCount / 10, 0.3);

    // Mô tả đầy đủ: +20%
    if (product.mota && product.mota.length > 100) score += 0.2;

    // Hashtags: +10%
    if (product.hashtags && product.hashtags.length > 0) score += 0.1;

    return Math.min(score, 1);
}

/**
 * Tính điểm Marketing
 * Quảng cáo, Flash Sale, Khuyến mãi
 */
function calculateMarketingScore(product: Product): number {
    let score = 0;

    // Đang chạy quảng cáo: +40%
    if (product.is_ad) score += 0.4;

    // Flash Sale: +50%
    if (product.is_flash_sale) {
        score += 0.5;
        // Bonus theo độ ưu tiên
        if (product.flash_sale_priority) {
            score += (product.flash_sale_priority / 10) * 0.1;
        }
    }

    // Có giảm giá: +10%
    const hasDiscount = (product.discount_amount || 0) > 0 || (product.discount_percent || 0) > 0;
    if (hasDiscount) score += 0.1;

    return Math.min(score, 1);
}

/**
 * Tính tổng điểm sản phẩm
 * Trọng số: Relevance 40%, Performance 35%, Optimization 15%, Marketing 10%
 */
export function calculateProductScore(product: Product, query: string): number {
    const relevanceScore = calculateRelevanceScore(product, query);
    const performanceScore = calculatePerformanceScore(product);
    const optimizationScore = calculateOptimizationScore(product);
    const marketingScore = calculateMarketingScore(product);

    const totalScore =
        relevanceScore * 0.40 +
        performanceScore * 0.35 +
        optimizationScore * 0.15 +
        marketingScore * 0.10;

    return totalScore;
}

/**
 * Tìm kiếm và xếp hạng sản phẩm
 */
export function searchProducts(products: Product[], params: SearchParams): Product[] {
    let results = [...products];

    // 1. Lọc cơ bản
    if (params.query && params.query.trim()) {
        const query = params.query.toLowerCase().trim();
        results = results.filter(p => {
            const inTitle = p.ten.toLowerCase().includes(query);
            const inDesc = p.mota?.toLowerCase().includes(query);
            const inTags = p.hashtags?.some(tag => tag.toLowerCase().includes(query));
            return inTitle || inDesc || inTags;
        });
    }

    if (params.category_id) {
        results = results.filter(p => p.danhmuc_id === params.category_id);
    }

    if (params.min_price) {
        results = results.filter(p => p.selling_price >= params.min_price!);
    }

    if (params.max_price) {
        results = results.filter(p => p.selling_price <= params.max_price!);
    }

    if (params.min_rating) {
        results = results.filter(p => p.rating_average >= params.min_rating!);
    }

    // 2. Tính điểm và sắp xếp
    const query = params.query || '';
    const productsWithScore = results.map(p => ({
        product: p,
        score: calculateProductScore(p, query)
    }));

    // 3. Sắp xếp theo sort_by hoặc relevance
    switch (params.sort_by) {
        case 'price_asc':
            productsWithScore.sort((a, b) => a.product.selling_price - b.product.selling_price);
            break;
        case 'price_desc':
            productsWithScore.sort((a, b) => b.product.selling_price - a.product.selling_price);
            break;
        case 'sales':
            productsWithScore.sort((a, b) =>
                (b.product.total_sold || 0) - (a.product.total_sold || 0)
            );
            break;
        case 'rating':
            productsWithScore.sort((a, b) => {
                if (b.product.rating_average !== a.product.rating_average) {
                    return b.product.rating_average - a.product.rating_average;
                }
                return b.product.rating_count - a.product.rating_count;
            });
            break;
        case 'relevance':
        default:
            // Sắp xếp theo điểm tổng (mặc định)
            productsWithScore.sort((a, b) => b.score - a.score);
            break;
    }

    return productsWithScore.map(item => item.product);
}
