// =================
// HTTP 클라이언트
// =================
import { API_CONFIG } from './config';

export class APIClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      // API 응답 형태에 맞춘 처리
      return {
        success: data.isSuccess || response.ok,
        data: data.data || data,
        message: data.message || '',
        code: data.code,
        status: response.status
      };
    } catch (error) {
      console.error(`API 요청 실패: ${endpoint}`, error);
      return {
        success: false,
        message: error.name === 'AbortError' ? '요청 시간 초과' : '네트워크 오류',
        error
      };
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();