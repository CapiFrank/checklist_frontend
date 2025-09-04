import {
  notifyGlobalLogout,
  notifyGlobalTokenUpdate,
} from "~/contexts/auth_context";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "";
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || "";
const MAX_RETRIES = 3;
let activeAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  activeAccessToken = token;
};

export const getClientId = () => CLIENT_ID;

export const getClientSecret = () => CLIENT_SECRET;

const buildHeaders = (
  skipAuth: boolean = false,
  extra: HeadersInit = {}
): HeadersInit => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  ...(activeAccessToken && !skipAuth
    ? { Authorization: `Bearer ${activeAccessToken}` }
    : {}),
  ...extra,
});

const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      notifyGlobalLogout();
      return false;
    }

    const { access_token } = await response.json();
    notifyGlobalTokenUpdate(access_token);
    return true;
  } catch (error) {
    console.error("No se pudo refrescar el token:", error);
    notifyGlobalLogout();
    return false;
  }
};

export async function request<T>(
  url: string,
  options: RequestInit = {},
  skipAuth = false,
  attempt = 1
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: buildHeaders(skipAuth, options.headers),
      credentials: "include",
    });
    if (response.status === 401 && !skipAuth && attempt <= MAX_RETRIES) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return request(url, options, skipAuth, attempt + 1);
      }
    }
    const contentType = response.headers.get("content-type");
    let body: any = null;

    if (contentType && contentType.includes("application/json")) {
      body = await response.json();
    } 

    if (!response.ok) {
      return {
        error: body?.message || response.statusText,
        status: response.status,
        data: body?.errors,
      };
    }
    return { data: body, status: response.status };
  } catch (e) {
    if (attempt < MAX_RETRIES) {
      return request(url, options, skipAuth, attempt + 1);
    }
    return { error: "Network error", status: 500 };
  }
}
