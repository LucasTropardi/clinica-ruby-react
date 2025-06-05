import { post } from './api';

interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  cellphone: string;
  address: string;
  nationality: string;
  document: string;
}

interface AuthResponse {
  token: string;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return await post<LoginData, AuthResponse>('/login', data);
}

export async function register(data: RegisterData): Promise<void> {
  await post<RegisterData>('/signup', data);
}
