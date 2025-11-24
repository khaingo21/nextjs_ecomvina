// Interface chung cho cả đăng nhập và đăng ký
export interface AuthResponse {
  success: boolean;
  token: string;
  message: string;
}

// res nó gần giống đăng nhập

// req
// {
//     "hoten": "userdemodangky",
//     "username": "userdemodangky",
//     "password": "123456",
//     "password_confirmation": "123456",
//     "sodienthoai": "1234567890"
// }