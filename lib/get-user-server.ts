import { cookies } from "next/headers";
import { AuthUser } from "@/hooks/useAuth";

export async function getUserFromServer(): Promise<AuthUser | null> {
  // 1. Đọc cookie "access_token" ngay trên server Next.js
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    // 2. Gọi API Laravel để lấy thông tin user (Server-to-Server)
    // Lưu ý: Dùng URL trực tiếp của Laravel VPS
    const res = await fetch("http://148.230.100.215/api/auth/thong-tin-nguoi-dung", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store", // Quan trọng: Không cache để dữ liệu luôn mới
    });

    if (!res.ok) return null;

    const data = await res.json();
    
    // 3. Map dữ liệu từ API Laravel sang kiểu AuthUser của bạn
    // Cấu trúc API Laravel trả về: { success: true, user: { ... } }
    const rawUser = data?.user || null;

    if (!rawUser) return null;

    return {
      id: rawUser.id,
      username: rawUser.username ?? rawUser.email,
      hoten: rawUser.hoten ?? rawUser.name,
      sodienthoai: rawUser.sodienthoai ?? rawUser.phone,
      gioitinh: rawUser.gioitinh,
      ngaysinh: rawUser.ngaysinh,
      avatar: rawUser.avatar,
      diachi: rawUser.diachi,
    };
  } catch (error) {
    console.error("Error fetching user on server:", error);
    return null;
  }
}