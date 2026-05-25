export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
}
