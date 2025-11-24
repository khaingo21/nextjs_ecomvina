// Interface cho địa chỉ người dùng
export interface UserAddress {
  id: number;
  hoten: string;
  sodienthoai: string;
  diachi: string;
  tinhthanh: string; // ở đây nó phải thuộc tên tỉnh như array tỉnh thành ở dưới đây
  trangthai: string;
}

// Interface cho thông tin người dùng
export interface User {
  id: number;
  username: string;
  sodienthoai: string;
  hoten: string;
  gioitinh: string;
  ngaysinh: string;
  avatar: string;
  vaitro: string;
  trangthai: string;
  diachi: UserAddress[];
}

// Interface phản hồi API thông tin người dùng
export interface UserInfoResponse {
  success: boolean;
  user: User;
}

// // đang dùng cái này nhé 63 tỉnh thành Việt Nam mới nhất
// return [
//     ['id' => 1, 'ten' => 'Thành phố Hà Nội', 'code' => '01', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 2, 'ten' => 'Tỉnh Hà Giang', 'code' => '02', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 3, 'ten' => 'Tỉnh Cao Bằng', 'code' => '04', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 4, 'ten' => 'Tỉnh Bắc Kạn', 'code' => '06', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 5, 'ten' => 'Tỉnh Tuyên Quang', 'code' => '08', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 6, 'ten' => 'Tỉnh Lào Cai', 'code' => '10', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 7, 'ten' => 'Tỉnh Điện Biên', 'code' => '11', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 8, 'ten' => 'Tỉnh Lai Châu', 'code' => '12', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 9, 'ten' => 'Tỉnh Sơn La', 'code' => '14', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 10, 'ten' => 'Tỉnh Yên Bái', 'code' => '15', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 11, 'ten' => 'Tỉnh Hoà Bình', 'code' => '17', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 12, 'ten' => 'Tỉnh Thái Nguyên', 'code' => '19', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 13, 'ten' => 'Tỉnh Lạng Sơn', 'code' => '20', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 14, 'ten' => 'Tỉnh Quảng Ninh', 'code' => '22', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 15, 'ten' => 'Tỉnh Bắc Giang', 'code' => '24', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 16, 'ten' => 'Tỉnh Phú Thọ', 'code' => '25', 'khuvuc' => 'Trung du và miền núi phía Bắc'],
//     ['id' => 17, 'ten' => 'Tỉnh Vĩnh Phúc', 'code' => '26', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 18, 'ten' => 'Tỉnh Bắc Ninh', 'code' => '27', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 19, 'ten' => 'Tỉnh Hải Dương', 'code' => '30', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 20, 'ten' => 'Thành phố Hải Phòng', 'code' => '31', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 21, 'ten' => 'Tỉnh Hưng Yên', 'code' => '33', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 22, 'ten' => 'Tỉnh Thái Bình', 'code' => '34', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 23, 'ten' => 'Tỉnh Hà Nam', 'code' => '35', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 24, 'ten' => 'Tỉnh Nam Định', 'code' => '36', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 25, 'ten' => 'Tỉnh Ninh Bình', 'code' => '37', 'khuvuc' => 'Đồng bằng sông Hồng'],
//     ['id' => 26, 'ten' => 'Tỉnh Thanh Hóa', 'code' => '38', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 27, 'ten' => 'Tỉnh Nghệ An', 'code' => '40', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 28, 'ten' => 'Tỉnh Hà Tĩnh', 'code' => '42', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 29, 'ten' => 'Tỉnh Quảng Bình', 'code' => '44', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 30, 'ten' => 'Tỉnh Quảng Trị', 'code' => '45', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 31, 'ten' => 'Tỉnh Thừa Thiên Huế', 'code' => '46', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 32, 'ten' => 'Thành phố Đà Nẵng', 'code' => '48', 'khuvuc' => 'Nam Trung Bộ'],
//     ['id' => 33, 'ten' => 'Tỉnh Quảng Nam', 'code' => '49', 'khuvuc' => 'Nam Trung Bộ'],
//     ['id' => 34, 'ten' => 'Tỉnh Quảng Ngãi', 'code' => '51', 'khuvuc' => 'Nam Trung Bộ'],
//     ['id' => 35, 'ten' => 'Tỉnh Bình Định', 'code' => '52', 'khuvuc' => 'Nam Trung Bộ'],
//     ['id' => 36, 'ten' => 'Tỉnh Phú Yên', 'code' => '54', 'khuvuc' => 'Nam Trung Bộ'],
//     ['id' => 37, 'ten' => 'Tỉnh Khánh Hòa', 'code' => '56', 'khuvuc' => 'Nam Trung Bộ'],
//     ['id' => 38, 'ten' => 'Tỉnh Ninh Thuận', 'code' => '58', 'khuvuc' => 'Nam Trung Bộ'],
//     ['id' => 39, 'ten' => 'Tỉnh Bình Thuận', 'code' => '60', 'khuvuc' => 'Nam Trung Bộ'],
//     ['id' => 40, 'ten' => 'Tỉnh Kon Tum', 'code' => '62', 'khuvuc' => 'Tây Nguyên'],
//     ['id' => 41, 'ten' => 'Tỉnh Gia Lai', 'code' => '64', 'khuvuc' => 'Tây Nguyên'],
//     ['id' => 42, 'ten' => 'Tỉnh Đắk Lắk', 'code' => '66', 'khuvuc' => 'Tây Nguyên'],
//     ['id' => 43, 'ten' => 'Tỉnh Đắk Nông', 'code' => '67', 'khuvuc' => 'Tây Nguyên'],
//     ['id' => 44, 'ten' => 'Tỉnh Lâm Đồng', 'code' => '68', 'khuvuc' => 'Tây Nguyên'],
//     ['id' => 45, 'ten' => 'Tỉnh Bình Phước', 'code' => '70', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 46, 'ten' => 'Tỉnh Tây Ninh', 'code' => '72', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 47, 'ten' => 'Tỉnh Bình Dương', 'code' => '74', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 48, 'ten' => 'Tỉnh Đồng Nai', 'code' => '75', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 49, 'ten' => 'Tỉnh Bà Rịa - Vũng Tàu', 'code' => '77', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 50, 'ten' => 'Thành phố Hồ Chí Minh', 'code' => '79', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 51, 'ten' => 'Tỉnh Long An', 'code' => '80', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 52, 'ten' => 'Tỉnh Tiền Giang', 'code' => '82', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 53, 'ten' => 'Tỉnh Bến Tre', 'code' => '83', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 54, 'ten' => 'Tỉnh Trà Vinh', 'code' => '84', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 55, 'ten' => 'Tỉnh Vĩnh Long', 'code' => '86', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 56, 'ten' => 'Tỉnh Đồng Tháp', 'code' => '87', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 57, 'ten' => 'Tỉnh An Giang', 'code' => '89', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 58, 'ten' => 'Tỉnh Kiên Giang', 'code' => '91', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 59, 'ten' => 'Thành phố Cần Thơ', 'code' => '92', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 60, 'ten' => 'Tỉnh Hậu Giang', 'code' => '93', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 61, 'ten' => 'Tỉnh Sóc Trăng', 'code' => '94', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 62, 'ten' => 'Tỉnh Bạc Liêu', 'code' => '95', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
//     ['id' => 63, 'ten' => 'Tỉnh Cà Mau', 'code' => '96', 'khuvuc' => 'Đồng bằng sông Cửu Long'],
// ];



// // Trước khi sấp nhật 36 tỉnh/TP Việt Nam
// return [
//     // 6 Thành phố trực thuộc Trung ương
//     ['id' => 1, 'ten' => 'Thành phố Hà Nội', 'code' => 'HN', 'khuvuc' => 'Đồng bằng Sông Hồng'],
//     ['id' => 2, 'ten' => 'Thành phố Hồ Chí Minh', 'code' => 'HCM', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 3, 'ten' => 'Thành phố Hải Phòng', 'code' => 'HP', 'khuvuc' => 'Đồng bằng Sông Hồng'],
//     ['id' => 4, 'ten' => 'Thành phố Đà Nẵng', 'code' => 'ĐN', 'khuvuc' => 'Duyên hải Nam Trung Bộ'],
//     ['id' => 5, 'ten' => 'Thành phố Cần Thơ', 'code' => 'CT', 'khuvuc' => 'Đồng bằng Sông Cửu Long'],
//     ['id' => 6, 'ten' => 'Thành phố Huế', 'code' => 'HUE', 'khuvuc' => 'Bắc Trung Bộ'],

//     // Các tỉnh còn lại
//     ['id' => 7, 'ten' => 'Tỉnh Hà Giang', 'code' => 'HG', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 8, 'ten' => 'Tỉnh Cao Bằng', 'code' => 'CB', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 9, 'ten' => 'Tỉnh Lào Cai', 'code' => 'LC', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 10, 'ten' => 'Tỉnh Sơn La', 'code' => 'SL', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 11, 'ten' => 'Tỉnh Tuyên Quang', 'code' => 'TQ', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 12, 'ten' => 'Tỉnh Lai Châu', 'code' => 'LCU', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 13, 'ten' => 'Tỉnh Lạng Sơn', 'code' => 'LS', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 14, 'ten' => 'Tỉnh Yên Bái', 'code' => 'YB', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 15, 'ten' => 'Tỉnh Quảng Ninh', 'code' => 'QN', 'khuvuc' => 'Đồng bằng Sông Hồng'],
//     ['id' => 16, 'ten' => 'Tỉnh Bắc Giang', 'code' => 'BG', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 17, 'ten' => 'Tỉnh Phú Thọ', 'code' => 'PT', 'khuvuc' => 'Trung du & Miền núi phía Bắc'],
//     ['id' => 18, 'ten' => 'Tỉnh Vĩnh Phúc', 'code' => 'VP', 'khuvuc' => 'Đồng bằng Sông Hồng'],
//     ['id' => 19, 'ten' => 'Tỉnh Hải Dương', 'code' => 'HD', 'khuvuc' => 'Đồng bằng Sông Hồng'],
//     ['id' => 20, 'ten' => 'Tỉnh Thái Bình', 'code' => 'TB', 'khuvuc' => 'Đồng bằng Sông Hồng'],
//     ['id' => 21, 'ten' => 'Tỉnh Nam Định', 'code' => 'ND', 'khuvuc' => 'Đồng bằng Sông Hồng'],
//     ['id' => 22, 'ten' => 'Tỉnh Ninh Bình', 'code' => 'NB', 'khuvuc' => 'Đồng bằng Sông Hồng'],
//     ['id' => 23, 'ten' => 'Tỉnh Thanh Hóa', 'code' => 'TH', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 24, 'ten' => 'Tỉnh Nghệ An', 'code' => 'NA', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 25, 'ten' => 'Tỉnh Quảng Bình', 'code' => 'QB', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 26, 'ten' => 'Tỉnh Quảng Trị', 'code' => 'QT', 'khuvuc' => 'Bắc Trung Bộ'],
//     ['id' => 27, 'ten' => 'Tỉnh Quảng Nam', 'code' => 'QNM', 'khuvuc' => 'Duyên hải Nam Trung Bộ'],
//     ['id' => 28, 'ten' => 'Tỉnh Gia Lai', 'code' => 'GL', 'khuvuc' => 'Tây Nguyên'],
//     ['id' => 29, 'ten' => 'Tỉnh Đắk Lắk', 'code' => 'ĐL', 'khuvuc' => 'Tây Nguyên'],
//     ['id' => 30, 'ten' => 'Tỉnh Khánh Hòa', 'code' => 'KH', 'khuvuc' => 'Duyên hải Nam Trung Bộ'],
//     ['id' => 31, 'ten' => 'Tỉnh Lâm Đồng', 'code' => 'LĐ', 'khuvuc' => 'Tây Nguyên'],
//     ['id' => 32, 'ten' => 'Tỉnh Đồng Nai', 'code' => 'ĐN', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 33, 'ten' => 'Tỉnh Bình Dương', 'code' => 'BD', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 34, 'ten' => 'Tỉnh Bà Rịa - Vũng Tàu', 'code' => 'BRVT', 'khuvuc' => 'Đông Nam Bộ'],
//     ['id' => 35, 'ten' => 'Tỉnh Kiên Giang', 'code' => 'KG', 'khuvuc' => 'Đồng bằng Sông Cửu Long'],
//     ['id' => 36, 'ten' => 'Tỉnh Cà Mau', 'code' => 'CM', 'khuvuc' => 'Đồng bằng Sông Cửu Long'],
// ];


