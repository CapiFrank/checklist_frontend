export interface Api {
  success: boolean;
  message: string;
  data: [] | {};
}
export interface ValidationErrors {
  [field: string]: string[];
}

export interface ApiErrorResponse {
  error: string;
  status: number;
  data?: ValidationErrors;
}
