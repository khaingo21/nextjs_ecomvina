// Script để update mock data với các trường cần thiết cho thuật toán search

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../mock/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Thêm các trường cho sản phẩm
if (db.sanphams && Array.isArray(db.sanphams)) {
    db.sanphams = db.sanphams.map((product, index) => {
        // Random data cho demo
        const baseScore = Math.random();

        return {
            ...product,
            // Mô tả sản phẩm
            mota: product.mota || `Mô tả chi tiết về ${product.ten}. Sản phẩm chất lượng cao, được nhiều khách hàng tin dùng. Giao hàng nhanh chóng, đảm bảo uy tín.`,

            // Hashtags
            hashtags: product.hashtags || ['chất lượng', 'giá tốt', product.ten.toLowerCase().split(' ')[0]],

            // Doanh số
            total_sold: product.total_sold || Math.floor(Math.random() * 5000) + 100,
            monthly_sold: product.monthly_sold || Math.floor(Math.random() * 500) + 10,
            view_count: product.view_count || Math.floor(Math.random() * 50000) + 1000,

            // Tỷ lệ
            conversion_rate: product.conversion_rate || Math.min(baseScore * 0.3 + 0.05, 0.25), // 5-25%
            shop_response_rate: product.shop_response_rate || (0.7 + Math.random() * 0.3), // 70-100%
            return_rate: product.return_rate || Math.random() * 0.05, // 0-5%
            cancel_rate: product.cancel_rate || Math.random() * 0.03, // 0-3%

            // Shop
            shop_rating: product.shop_rating || (4 + Math.random()), // 4-5
            is_mall: product.is_mall !== undefined ? product.is_mall : (index % 3 === 0),
            is_favorite: product.is_favorite !== undefined ? product.is_favorite : (index % 4 === 0),

            // Media
            has_video: product.has_video !== undefined ? product.has_video : (index % 5 === 0),
            image_count: product.image_count || (Math.floor(Math.random() * 8) + 3), // 3-10 ảnh

            // Marketing
            is_ad: product.is_ad !== undefined ? product.is_ad : (index % 6 === 0),
            is_flash_sale: product.is_flash_sale !== undefined ? product.is_flash_sale : (index % 7 === 0),
            flash_sale_priority: product.flash_sale_priority || (index % 7 === 0 ? Math.floor(Math.random() * 10) + 1 : 0),
        };
    });
}

// Ghi lại file
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Đã cập nhật mock data thành công!');
console.log(`   Số sản phẩm: ${db.sanphams.length}`);
