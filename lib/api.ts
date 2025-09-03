const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.86.137:8081';

const DEBUG = process.env.API_DEBUG === '1' || process.env.NODE_ENV === 'test';

function debugLogRequest(url: string, options: RequestInit, headers: Record<string, string>) {
  if (!DEBUG) return;
  let bodyPreview: unknown = undefined;
  const body = options.body as any;
  if (body instanceof FormData) {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of body.entries()) {
      if (value instanceof Blob) {
        obj[key] = {
          type: 'File',
          name: (value as any).name,
          size: value.size,
          mime: value.type,
        };
      } else {
        obj[key] = value;
      }
    }
    bodyPreview = obj;
  } else if (typeof body === 'string') {
    try {
      bodyPreview = JSON.parse(body);
    } catch {
      bodyPreview = body;
    }
  }

  // eslint-disable-next-line no-console
  console.log('[API REQUEST]', {
    url,
    method: (options.method || 'GET').toUpperCase(),
    headers,
    body: bodyPreview,
  });
}

function debugLogResponse(url: string, status: number, json: unknown) {
  if (!DEBUG) return;
  // eslint-disable-next-line no-console
  console.log('[API RESPONSE]', { url, status, json });
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
  meta?: unknown;
}

async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {};
  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      if (value !== undefined) {
        headers[key] = value as string;
      }
    }
  }

  // FormData의 경우 Content-Type을 설정하지 않음
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  debugLogRequest(url, config, headers);

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `An error occurred: ${response.statusText}`;
    try {
      const errorBody: ApiResponse<never> = await response.json();
      debugLogResponse(url, response.status, errorBody);
      if (errorBody.error?.message) {
        errorMessage = errorBody.error.message;
      }
    } catch {
      // 응답이 JSON이 아닐 경우 무시
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return Promise.resolve(undefined as T);
  }
  
  const result: ApiResponse<T> = await response.json();
  debugLogResponse(url, response.status, result);

  if (result.error) {
    throw new Error(result.error.message || 'An unknown API error occurred.');
  }

  if (result.data !== undefined) {
    return result.data as T;
  } else {
    return result as T; // Return the whole result object
  }
}

export default api;
