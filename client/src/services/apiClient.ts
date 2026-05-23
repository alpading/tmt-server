import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const ACCESS_TOKEN_KEY  = 'tmt_access_token';
const REFRESH_TOKEN_KEY = 'tmt_refresh_token';

// ─── 토큰 저장소 ──────────────────────────────────────────────────────────────
export const tokenStore = {
  getAccess:  () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY,  access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ─── Axios 인스턴스 ───────────────────────────────────────────────────────────
const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request 인터셉터: 모든 요청에 access token 주입
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response 인터셉터: 401 발생 시 refresh → retry
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (v: string) => void; reject: (e: any) => void }> = [];

const processPending = (error: any, token: string | null) => {
  pendingQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)));
  pendingQueue = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return instance(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refresh = tokenStore.getRefresh();
      if (!refresh) throw new Error('no refresh token');

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh });
      const newAccess: string = data.accessToken;

      tokenStore.set(newAccess, data.refreshToken ?? refresh);
      processPending(null, newAccess);

      original.headers.Authorization = `Bearer ${newAccess}`;
      return instance(original);
    } catch (refreshError) {
      processPending(refreshError, null);
      tokenStore.clear();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── 공통 response unwrap ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

function wrap<T>(res: AxiosResponse<T>): ApiResponse<T> {
  return { data: res.data, status: res.status };
}

// ─── API Client (기존 인터페이스 유지) ────────────────────────────────────────
class ApiClient {
  async request<T>(
    endpoint: string,
    options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; body?: any; headers?: Record<string, string> } = {},
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers } = options;
    const res = await instance.request<T>({ url: endpoint, method, data: body, headers });
    return wrap(res);
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return wrap(await instance.get<T>(endpoint, { headers }));
  }

  async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return wrap(await instance.post<T>(endpoint, body, { headers }));
  }

  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return wrap(await instance.put<T>(endpoint, body, { headers }));
  }

  async patch<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return wrap(await instance.patch<T>(endpoint, body, { headers }));
  }

  async delete<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return wrap(await instance.delete<T>(endpoint, { data: body, headers }));
  }
}

export const apiClient = new ApiClient();
export default instance;
