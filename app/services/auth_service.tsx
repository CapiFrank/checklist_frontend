import type { User } from "~/types/user";
import {
  request,
  getClientId,
  getClientSecret,
  type ApiResponse,
} from "./http_client";

interface TokenResponse {
  access_token: string;
}

export async function login(
  email: string,
  password: string
): Promise<ApiResponse<TokenResponse>> {
  return request<TokenResponse>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        client_id: getClientId(),
        client_secret: getClientSecret(),
      }),
    },
    true
  );
}

export async function register(data: User) {
  return request(
    "/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true
  );
}

export async function logout() {
  return request("/logout", {
    method: "POST",
  });
}
