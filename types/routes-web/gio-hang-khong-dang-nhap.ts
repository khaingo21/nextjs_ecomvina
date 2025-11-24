// types/cart.ts

export interface CartResponse {
  status: boolean;
  message: string;
  data: CartItem[];
}

export interface CartItem {
  id_giohang: number;
  id_nguoidung: number;
  trangthai: string;
  bienthe: Variant | null;
  bienthe_quatang: VariantGift | null;
}

export interface Variant {
  soluong: number;
  giagoc: number;
  thanhtien: number;
  tamtinh: number;
  detail: VariantDetail;
}

export interface VariantGift {
  soluong: number;
  giagoc: number;
  thanhtien: number;
  tamtinh: number;
  detail: VariantGiftDetail;
}

export interface VariantDetail {
  thuonghieu: string;
  tensanpham: string;
  loaisanpham: string;
  giamgia: string;
  giagoc: number;
  giaban: number;
  hinhanh: string;
}

export interface VariantGiftDetail {
  thuonghieu: string;
  tensanpham: string;
  loaisanpham: string;
  giagoc: number;
  hinhanh: string;
}
