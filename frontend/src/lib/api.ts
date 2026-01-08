// API client for the screenshot generator backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// Templates API
export const templatesApi = {
  list: (category?: string) =>
    fetchApi<{ templates: any[]; total: number }>(
      `/templates${category ? `?category=${category}` : ''}`
    ),

  getCategories: () =>
    fetchApi<{ categories: { id: string; name: string }[] }>('/templates/categories'),

  get: (id: string) => fetchApi<any>(`/templates/${id}`),
};

// Devices API
export const devicesApi = {
  list: (category?: string) =>
    fetchApi<{ devices: any[]; total: number }>(
      `/devices${category ? `?category=${category}` : ''}`
    ),

  getColors: () => fetchApi<{ colors: Record<string, any[]> }>('/devices/colors'),

  getExportOptions: () => fetchApi<{ options: any[] }>('/devices/export-options'),

  get: (id: string) => fetchApi<any>(`/devices/${id}`),
};

// Locales API
export const localesApi = {
  list: () => fetchApi<{ locales: any[]; total: number }>('/locales'),

  get: (code: string) => fetchApi<any>(`/locales/${code}`),
};

// Upload API
export const uploadApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail);
    }

    return response.json();
  },

  delete: (fileId: string) =>
    fetchApi<{ status: string }>(`/upload/${fileId}`, { method: 'DELETE' }),

  removeBackground: (fileId: string, alphaMatting: boolean = false) =>
    fetchApi<{
      id: string;
      url: string;
      original_url: string;
      width: number;
      height: number;
      processing_time: number;
    }>('/upload/remove-background', {
      method: 'POST',
      body: JSON.stringify({ file_id: fileId, alpha_matting: alphaMatting }),
    }),

  getBackgroundRemovalStatus: () =>
    fetchApi<{ available: boolean; message: string }>('/upload/remove-background/status'),
};

// Generate API
export const generateApi = {
  preview: async (
    screenshot: any,
    locale: string = 'en',
    width: number = 1290,
    height: number = 2796
  ): Promise<Blob> => {
    const response = await fetch(`${API_BASE}/generate/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screenshot, locale, width, height }),
    });

    if (!response.ok) {
      throw new Error('Preview generation failed');
    }

    return response.blob();
  },

  export: (project: any, config: any) =>
    fetchApi<{ job_id: string; status: string }>('/generate/export', {
      method: 'POST',
      body: JSON.stringify({ project, config }),
    }),

  getStatus: (jobId: string) =>
    fetchApi<{
      job_id: string;
      status: string;
      progress: number;
      download_url?: string;
      error?: string;
    }>(`/generate/status/${jobId}`),

  download: (jobId: string) => `${API_BASE}/generate/download/${jobId}`,
};

// Health check
export const healthApi = {
  check: () => fetchApi<{ status: string; version: string }>('/health'),
};
