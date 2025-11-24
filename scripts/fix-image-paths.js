const fs = require('fs');
const path = require('path');

// Đọc db.json
const dbPath = path.join(__dirname, '../mock/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Danh sách các file hình ảnh thực tế có trong thư mục
const actualImages = [
    'banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-1.webp',
    'banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-2.webp',
    'banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-3.webp',
    'banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-4.webp',
    'banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-5.webp',
    'hat-dieu-rang-muoi-loai-1-con-vo-lua-happy-nuts-500g-1.webp',
    'nuoc-rua-chen-sa-chanh-come-on-lam-sach-bat-dia-an-toan-da-tay-1-lit-1.webp',
    'nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml-1.webp',
    'sam-ngoc-linh-truong-sinh-do-thung-24lon-1.webp',
    'collagen-thuy-phan-ho-tro-da-mong-toc-acai-labs-marine-collagen-beauty-australia-90v-1.webp',
    'vien-uong-bishin-tripeptide-collagen-nhat-ban-60v-1.webp',
    'duong-mi-te-bao-goc-cchoi-bio-placenta-lash-serum-1.webp',
    'bot-matcha-gao-rang-nhat-ban-onelife-goi-100g-1.webp',
    'sua-non-to-yen-papamilk-height-gain-giup-tang-can-tang-chieu-cao-cho-tre-tu-1-19-tuoi-lon-830g-1.webp',
    'keo-qua-sam-khong-duong-free-suger-ginseng-berry-s-candy-200g-1.webp',
    'keo-ong-xanh-tracybee-propolis-mint-honey-giam-dau-rat-hong-ho-viem-hong-vi-bac-ha-1.webp',
    'mat-ong-tay-bac-dong-trung-ha-thao-x3-hu-240g-1.webp',
    'thuc-pham-bao-ve-suc-khoe-midu-menaq7-180mcg-1.webp',
    'tinh-dau-tram-tu-nhien-eco-ho-tro-giam-ho-cam-cum-so-mui-cam-lanh-lo-30ml-1.webp',
    'hu-hit-thao-duoc-nhi-thien-duong-hu-5g-1.webp',
    'may-xong-khi-dung-cam-tay-kachi-ys35-giai-phap-ho-hap-linh-hoat-moi-luc-moi-noi-1.webp',
    'tam-lot-abena-pad-45x45-1.webp',
    'tam-lot-giuong-abena-pad-giat-duoc-85x90cm-1.webp',
    'gang-lau-abena-wash-gloves-50-mienggoi-1.webp',
];

let changeCount = 0;

// Hàm chuẩn hóa đường dẫn hình ảnh
function normalizeImagePath(imagePath) {
    if (!imagePath || imagePath.trim() === '') {
        return '/assets/images/thumbs/product-img10.png'; // Default image
    }

    // Nếu đã là URL đầy đủ với /assets/, giữ nguyên
    if (imagePath.startsWith('/assets/')) {
        return imagePath;
    }

    // Nếu bắt đầu bằng assets/ (không có /), thêm / vào đầu
    if (imagePath.startsWith('assets/')) {
        return '/' + imagePath;
    }

    // Nếu là URL external (http/https), giữ nguyên
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Nếu chỉ là tên file, thêm path đầy đủ
    return `/assets/images/thumbs/${imagePath}`;
}

// Hàm xử lý đệ quy để tìm và sửa tất cả các trường hình ảnh
function fixImagePaths(obj) {
    if (Array.isArray(obj)) {
        obj.forEach(item => fixImagePaths(item));
    } else if (obj && typeof obj === 'object') {
        // Sửa các trường hình ảnh phổ biến
        if (obj.hinh_anh !== undefined) {
            const oldPath = obj.hinh_anh;
            obj.hinh_anh = normalizeImagePath(oldPath);
            if (oldPath !== obj.hinh_anh) {
                changeCount++;
                console.log(`Fixed hinh_anh: ${oldPath} -> ${obj.hinh_anh}`);
            }
        }

        if (obj.mediaurl !== undefined) {
            const oldPath = obj.mediaurl;
            obj.mediaurl = normalizeImagePath(oldPath);
            if (oldPath !== obj.mediaurl) {
                changeCount++;
                console.log(`Fixed mediaurl: ${oldPath} -> ${obj.mediaurl}`);
            }
        }

        if (obj.image !== undefined) {
            const oldPath = obj.image;
            obj.image = normalizeImagePath(oldPath);
            if (oldPath !== obj.image) {
                changeCount++;
                console.log(`Fixed image: ${oldPath} -> ${obj.image}`);
            }
        }

        // Đệ quy cho các thuộc tính con
        Object.keys(obj).forEach(key => {
            if (key !== 'hinh_anh' && key !== 'mediaurl' && key !== 'image') {
                fixImagePaths(obj[key]);
            }
        });
    }
}

// Thực hiện sửa
console.log('🔧 Starting to fix image paths in db.json...\n');
fixImagePaths(db);

// Ghi lại file
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`\n✅ Done! Fixed ${changeCount} image paths.`);
console.log(`📝 Updated file: ${dbPath}`);
