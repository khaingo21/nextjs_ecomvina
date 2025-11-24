// Interface phản hồi API đăng nhập
export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
}