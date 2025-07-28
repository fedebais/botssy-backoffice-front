export const API_URL = "http://localhost:3000"; // Cambiá según tu backend

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator" | "viewer";
  avatar?: string;
  company?: string;
  createdAt?: string;
  lastLogin?: string;
  tenantId: number;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    // intenta parsear error JSON o leer texto plano
    let message = "Error en login";
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch {
      message = await res.text();
    }
    throw new Error(message);
  }

  // **Aquí no usamos res.json() porque la respuesta es texto plano (el token JWT)**
  const token = await res.text();

  return { token };
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}
