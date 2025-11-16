import React from 'react';

export default function MostInterestedSection() {
    return (
        <section className="trending-productss pt-16 overflow-hidden fix-scale-80">
            <div className="container container-lg px-0">
                <div className="">
                    <div className="section-heading mb-24">
                        <div className="flex-between flex-wrap gap-2">
                            <h6 className="mb-0 wow fadeInLeft" style={{ visibility: "visible", animationName: "fadeInLeft" }}>
                                <i className="ph-bold ph-hand-withdraw text-main-600"></i> Được quan tâm nhiều nhất
                            </h6>
                            <div className="border-bottom border-2 border-main-600 mb-3 mt-4" style={{ width: "75%" }}></div>
                        </div>
                    </div>

                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-all" role="tabpanel" aria-labelledby="pills-all-tab" tabIndex={0}>
                            <div className="row g-12">
                                {[
                                    { href: "hat-dieu-rang-muoi-loai-1-con-vo-lua-happy-nuts-500g", img: "hat-dieu-rang-muoi-loai-1-con-vo-lua-happy-nuts-500g-1.webp", name: "Hạt điều rang muối loại 1 (còn vỏ lụa) Happy Nuts 500g", sold: 782, price: "253.800 đ", discount: "-10%", oldPrice: "282.000 đ" },
                                    { href: "nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml", img: "nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml-1.webp", name: "Nước rửa bát Bio Formula - Bơ và Lô Hội (Túi 500ml)", sold: 142, price: "90.000 đ" },
                                    { href: "may-xong-khi-dung-cam-tay-kachi-ys35-giai-phap-ho-hap-linh-hoat-moi-luc-moi-noi", img: "may-xong-khi-dung-cam-tay-kachi-ys35-giai-phap-ho-hap-linh-hoat-moi-luc-moi-noi-1.webp", name: "Máy Xông Khí Dung Cầm Tay Kachi YS35: Giải Pháp Hô Hấp Linh Hoạt Mọi Lúc, Mọi Nơi", sold: 3, price: "799.000 đ" },
                                    { href: "tam-lot-abena-pad-45x45", img: "tam-lot-abena-pad-45x45-1.webp", name: "Tấm lót Abena Pad (45x45)", sold: 74, price: "290.000 đ" },
                                    { href: "bot-matcha-gao-rang-nhat-ban-onelife-goi-100g", img: "bot-matcha-gao-rang-nhat-ban-onelife-goi-100g-1.webp", name: "Bột Matcha Gạo Rang Nhật Bản ONELIFE (Gói 100g)", sold: 17, price: "220.800 đ" },
                                    { href: "tam-lot-giuong-abena-pad-giat-duoc-85x90cm", img: "tam-lot-giuong-abena-pad-giat-duoc-85x90cm-1.webp", name: "Tấm lót giường Abena Pad (giặt được) 85x90cm", sold: 193, price: "490.000 đ" },
                                    { href: "nuoc-rua-chen-sa-chanh-come-on-lam-sach-bat-dia-an-toan-da-tay-1-lit", img: "nuoc-rua-chen-sa-chanh-come-on-lam-sach-bat-dia-an-toan-da-tay-1-lit-1.webp", name: "Nước rửa chén sả chanh COME ON làm sạch bát đĩa, an toàn da tay 1 lít", sold: 76, price: "69.000 đ" },
                                    { href: "collagen-thuy-phan-ho-tro-da-mong-toc-acai-labs-marine-collagen-beauty-australia-90v", img: "collagen-thuy-phan-ho-tro-da-mong-toc-acai-labs-marine-collagen-beauty-australia-90v-1.webp", name: "Collagen thủy phân hỗ trợ Da Móng Tóc Acai Labs Marine Collagen Beauty Australia 90v", vendor: "ACACI LABS", sold: 10, price: "795.000 đ" },
                                    { href: "gang-lau-abena-wash-gloves-50-mienggoi", img: "gang-lau-abena-wash-gloves-50-mienggoi-1.webp", name: "Găng lau Abena Wash Gloves (50 miếng/gói)", sold: 67, price: "160.000 đ" },
                                    { href: "banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra", img: "banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-1.webp", name: "Bánh Trung Thu 2025 - Thu An Nhiên (bánh chay hộp 2 bánh 1 trà)", sold: 472, price: "110.700 đ", discount: "-70%", oldPrice: "369.000 đ" },
                                    { href: "hu-hit-thao-duoc-nhi-thien-duong-hu-5g", img: "hu-hit-thao-duoc-nhi-thien-duong-hu-5g-1.webp", name: "Hũ Hít Thảo Dược Nhị Thiên Đường - Hũ 5g", sold: 6, price: "42.000 đ" },
                                    { href: "thuc-pham-bao-ve-suc-khoe-midu-menaq7-180mcg", img: "thuc-pham-bao-ve-suc-khoe-midu-menaq7-180mcg-1.webp", name: "Thực phẩm bảo vệ sức khỏe: Midu MenaQ7 180mcg", sold: 30, price: "234.000 đ", discount: "-10%", oldPrice: "260.000 đ" },
                                    { href: "duong-mi-te-bao-goc-cchoi-bio-placenta-lash-serum", img: "duong-mi-te-bao-goc-cchoi-bio-placenta-lash-serum-1.webp", name: "Dưỡng mi tế bào gốc C'Choi - Bio Placenta Lash Serum", vendor: "C'CHOI", sold: 84, price: "231.000 đ", discount: "-30%", oldPrice: "330.000 đ" },
                                    { href: "keo-qua-sam-khong-duong-free-suger-ginseng-berry-s-candy-200g", img: "keo-qua-sam-khong-duong-free-suger-ginseng-berry-s-candy-200g-1.webp", name: "Kẹo Quả Sâm không đường Free Suger Ginseng Berry S candy 200g", sold: 187, price: "186.750 đ", discount: "-25%", oldPrice: "249.000 đ" },
                                    { href: "vien-uong-bishin-tripeptide-collagen-nhat-ban-60v", img: "vien-uong-bishin-tripeptide-collagen-nhat-ban-60v-1.webp", name: "Viên uống Bishin Tripeptide Collagen Nhật Bản 60v", sold: 134, price: "500.000 đ" },
                                    { href: "sam-ngoc-linh-truong-sinh-do-thung-24lon", img: "sam-ngoc-linh-truong-sinh-do-thung-24lon-1.webp", name: "Sâm Ngọc Linh trường sinh đỏ (Thùng 24lon)", sold: 23, price: "466.560 đ" },
                                    { href: "hahahaha", img: "sam-ngoc-linh-truong-sinh-do-thung-24lon-1.webp", name: "hahaha", sold: 0, price: "216.000 đ", discount: "-20%", oldPrice: "270.000 đ" },
                                    { href: "keo-ong-xanh-tracybee-propolis-mint-honey-giam-dau-rat-hong-ho-viem-hong-vi-bac-ha", img: "keo-ong-xanh-tracybee-propolis-mint-honey-giam-dau-rat-hong-ho-viem-hong-vi-bac-ha-1.webp", name: "Keo ong xanh Tracybee Propolis Mint & Honey – Giảm đau rát họng, ho, viêm họng (Vị Bạc Hà)", sold: 0, price: "243.000 đ", discount: "-10%", oldPrice: "270.000 đ" }
                                ].map((product, index) => (
                                    <div key={index} className="col-xxl-2 col-xl-3 col-lg-4 col-xs-6">
                                        <div className="product-card h-100 border border-gray-100 hover-border-main-600 rounded-6 position-relative transition-2">
                                            <a href={`san-pham/${product.href}`} className="flex-center rounded-8 bg-gray-50 position-relative">
                                                <img src={`assets/images/thumbs/${product.img}`} alt={product.name} className="w-100 rounded-top-2" />
                                            </a>
                                            <div className="product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex mt-10 px-10 pb-8">
                                                <div>
                                                    <div className="flex-align justify-content-between mt-5">
                                                        <div className="flex-align gap-4 w-100">
                                                            <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                                            <span className="text-gray-500 text-xs" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%", display: "inline-block" }} title={product.vendor || "Trung Tâm Bán Hàng Siêu Thị Vina"}>
                                                                {product.vendor || "Trung Tâm Bán Hàng Siêu Thị Vina"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <h6 className="title text-lg fw-semibold mt-2 mb-2">
                                                        <a href={`san-pham/${product.href}`} className="link text-line-2" tabIndex={0}>{product.name}</a>
                                                    </h6>
                                                    <div className="flex-align justify-content-between mt-2">
                                                        <div className="flex-align gap-6">
                                                            <span className="text-xs fw-medium text-gray-500">Đánh giá</span>
                                                            <span className="text-xs fw-medium text-gray-500">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                                                        </div>
                                                        <div className="flex-align gap-4">
                                                            <span className="text-xs fw-medium text-gray-500">{product.sold}</span>
                                                            <span className="text-xs fw-medium text-gray-500">Đã bán</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-card__price mt-5">
                                                    {product.discount && (
                                                        <div className="flex-align gap-4 text-main-two-600">
                                                            <i className="ph-fill ph-seal-percent text-sm"></i> {product.discount}
                                                            <span className="text-gray-400 text-sm fw-semibold text-decoration-line-through">
                                                                {product.oldPrice}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className="text-heading text-lg fw-semibold">
                                                        {product.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mx-auto w-100 text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="200">
                            <a href="san-pham?sortby=quantamnhieunhat" className="btn border-main-600 text-main-600 hover-bg-main-600 hover-border-main-600 hover-text-white rounded-8 px-32 py-12 mt-40">
                                Xem thêm sản phẩm
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
