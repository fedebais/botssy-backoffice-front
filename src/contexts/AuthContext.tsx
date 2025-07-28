"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as authService from "../service/conversations/auth/login";

interface AuthContextType {
  user: authService.User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJWT(token: string): authService.User | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<authService.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("botssy_token");
      if (token) {
        const userData = decodeJWT(token);
        if (userData && userData.exp && userData.exp * 1000 > Date.now()) {
          setUser(userData);
        } else {
          localStorage.removeItem("botssy_token");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token } = await authService.login(email, password);
      const userData = decodeJWT(token);
      if (!userData) throw new Error("Token inválido");

      localStorage.setItem("botssy_token", token);
      setUser(userData);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error desconocido" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("botssy_token");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}
