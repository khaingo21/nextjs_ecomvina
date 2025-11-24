// Interface cho tỉnh/thành phố
export interface Province {
  id: number;
  ten: string;
  code: string;
  khuvuc: string;
}

// Interface phản hồi API tỉnh thành
export interface ProvinceResponse {
  status: boolean;
  message: string;
  data: Province[];
}