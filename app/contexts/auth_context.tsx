import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  login,
  register,
  logout as closeSession,
} from "../services/auth_service";
import {
  setAccessToken as setHttpClientToken,
  type ApiResponse,
} from "~/services/http_client";
import type { User } from "~/types/user";
import Swal from "sweetalert2";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiResponse>;
  register: (data: User) => Promise<ApiResponse>;
  logout: () => void;
}
let globalLogoutCallback: (() => void) | null = null;
let globalTokenUpdateCallback: ((token: string) => void) | null = null;

export const registerGlobalLogout = (cb: () => void) => {
  globalLogoutCallback = cb;
};

export const notifyGlobalLogout = () => {
  globalLogoutCallback?.();
};

export const registerGlobalTokenUpdate = (cb: (token: string) => void) => {
  globalTokenUpdateCallback = cb;
};

export const notifyGlobalTokenUpdate = (token: string) => {
  globalTokenUpdateCallback?.(token);
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    registerGlobalLogout(logout);
    registerGlobalTokenUpdate(updateAccessToken);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password);
    if (response.data?.access_token) {
      updateAccessToken(response.data.access_token);
    }
    return response;
  };

  const handleRegister = async (args: User) => {
    const response = await register(args);
    return response;
  };

  const updateAccessToken = (token: string) => {
    setAccessToken(token);
    setHttpClientToken(token);
  };

  const logout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Desea cerrar sesión?",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
    });
    if (isConfirmed) {
      closeSession();
      setAccessToken(null);
      setHttpClientToken(null);
    }
  };

  const value = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      isAuthenticated: !!accessToken,
      login: handleLogin,
      register: handleRegister,
      logout,
    }),
    [accessToken, setAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
