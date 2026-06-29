import axios from 'axios';

/**
 * Lấy base URL theo thứ tự ưu tiên:
 * 1. localStorage 'serverUrl' (người dùng tự cấu hình - dành cho Android)
 * 2. VITE_API_URL từ .env (dành cho web browser trên PC)
 * 3. Fallback cứng
 */
const getBaseUrl = () => {
  try {
    const saved = localStorage.getItem('serverUrl');
    if (saved && saved.startsWith('http')) return saved;
  } catch {}
  
  // import.meta.env chỉ hoạt động trên web build, không hoạt động trong Capacitor bundle
  try {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return envUrl;
  } catch {}

  return 'http://192.168.1.24:5050/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 giây timeout để tránh treo app khi mất mạng
});

// Cập nhật baseURL trước mỗi request (xử lý khi user đổi IP sau khi app khởi động)
api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

export default api;
