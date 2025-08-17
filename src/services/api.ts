import { Faculty, Achievement, Event, Partner, Testimonial, HKI, Patent, IndustrialDesign } from '../types';

// API response types
interface APIResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

interface APIErrorResponse {
  success: false;
  error: string;
}

// Custom error classes
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008';
const DEFAULT_TIMEOUT = 30000;

// Remove id fields before sending to API
const sanitizeData = (data: any) => {
  if (data instanceof FormData) return data;
  const clone = { ...data };
  delete clone._id;
  delete clone.id;
  return clone;
};

// Handle request timeout
const fetchWithTimeout = async (
  resource: string,
  options?: RequestInit
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};

// Main fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      mode: 'cors',
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (_) {}
      throw new APIError(response.status, errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error instanceof APIError) throw error;
    if (error.name === 'AbortError') throw new NetworkError('Request timeout');
    if (!navigator.onLine) throw new NetworkError('No internet connection');
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new NetworkError(`Unable to connect to API at ${API_BASE_URL}`);
    }

    console.error('Unhandled API error:', error);
    throw new NetworkError('Unexpected error during API request');
  }
}

const prepareRequestData = (data: any) => {
  const clean = sanitizeData(data);
  return clean instanceof FormData ? clean : JSON.stringify(clean);
};

// -------- Faculty API --------
export const facultyAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI<APIResponse<Faculty[]>>('/api/faculties');
      return response.data;
    } catch (error) {
      console.error('Error fetching faculties:', error);
      return [];
    }
  },

  getById: async (_id: string) => {
    if (!_id) throw new Error('Faculty ID is required');
    try {
      const response = await fetchAPI<APIResponse<Faculty>>(`/api/faculties/${_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching faculty ${_id}:`, error);
      return undefined;
    }
  },

  create: async (data: any) => {
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Faculty>>('/api/faculties', {
      method: 'POST',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (_id: string, data: any) => {
    if (!_id) throw new Error('Faculty ID is required');
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Faculty>>(`/api/faculties/${_id}`, {
      method: 'PUT',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  delete: async (_id: string) => {
    if (!_id) throw new Error('Faculty ID is required');
    await fetchAPI<APIResponse<void>>(`/api/faculties/${_id}`, { method: 'DELETE' });
  },
};

// -------- Achievement API --------
export const achievementAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI<APIResponse<Achievement[]>>('/api/achievements');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },

  getById: async (_id: string) => {
    if (!_id) throw new Error('Achievement ID is required');
    try {
      const response = await fetchAPI<APIResponse<Achievement>>(`/api/achievements/${_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching achievement ${_id}:`, error);
      return undefined;
    }
  },

  create: async (data: any) => {
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Achievement>>('/api/achievements', {
      method: 'POST',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (_id: string, data: any) => {
    if (!_id) throw new Error('Achievement ID is required');
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Achievement>>(`/api/achievements/${_id}`, {
      method: 'PUT',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  delete: async (_id: string) => {
    if (!_id) throw new Error('Achievement ID is required');
    await fetchAPI<APIResponse<void>>(`/api/achievements/${_id}`, { method: 'DELETE' });
  },
};

// -------- Event API --------
export const eventAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI<APIResponse<Event[]>>('/api/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  getById: async (_id: string) => {
    if (!_id) throw new Error('Event ID is required');
    try {
      const response = await fetchAPI<APIResponse<Event>>(`/api/events/${_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${_id}:`, error);
      return undefined;
    }
  },

  create: async (data: any) => {
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Event>>('/api/events', {
      method: 'POST',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (_id: string, data: any) => {
    if (!_id) throw new Error('Event ID is required');
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Event>>(`/api/events/${_id}`, {
      method: 'PUT',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  delete: async (_id: string) => {
    if (!_id) throw new Error('Event ID is required');
    await fetchAPI<APIResponse<void>>(`/api/events/${_id}`, { method: 'DELETE' });
  },
};

// -------- Partner API --------
export const partnerAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI<APIResponse<Partner[]>>('/api/partners');
      return response.data;
    } catch (error) {
      console.error('Error fetching partners:', error);
      return [];
    }
  },

  getById: async (_id: string) => {
    if (!_id) throw new Error('Partner ID is required');
    try {
      const response = await fetchAPI<APIResponse<Partner>>(`/api/partners/${_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching partner ${_id}:`, error);
      return undefined;
    }
  },

  create: async (data: any) => {
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Partner>>('/api/partners', {
      method: 'POST',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (_id: string, data: any) => {
    if (!_id) throw new Error('Partner ID is required');
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Partner>>(`/api/partners/${_id}`, {
      method: 'PUT',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  delete: async (_id: string) => {
    if (!_id) throw new Error('Partner ID is required');
    await fetchAPI<APIResponse<void>>(`/api/partners/${_id}`, { method: 'DELETE' });
  },
};

// -------- Testimonial API --------
export const testimonialAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI<APIResponse<Testimonial[]>>('/api/testimonials');
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  getById: async (_id: string) => {
    if (!_id) throw new Error('Testimonial ID is required');
    try {
      const response = await fetchAPI<APIResponse<Testimonial>>(`/api/testimonials/${_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching testimonial ${_id}:`, error);
      return undefined;
    }
  },

  create: async (data: any) => {
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Testimonial>>('/api/testimonials', {
      method: 'POST',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (_id: string, data: any) => {
    if (!_id) throw new Error('Testimonial ID is required');
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Testimonial>>(`/api/testimonials/${_id}`, {
      method: 'PUT',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  delete: async (_id: string) => {
    if (!_id) throw new Error('Testimonial ID is required');
    await fetchAPI<APIResponse<void>>(`/api/testimonials/${_id}`, { method: 'DELETE' });
  },
};

// -------- HKI API --------
export const hkiAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI<APIResponse<HKI[]>>('/api/hki');
      return response.data;
    } catch (error) {
      console.error('Error fetching HKI:', error);
      return [];
    }
  },

  getById: async (_id: string) => {
    if (!_id) throw new Error('HKI ID is required');
    try {
      const response = await fetchAPI<APIResponse<HKI>>(`/api/hki/${_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching HKI ${_id}:`, error);
      return undefined;
    }
  },

  create: async (data: any) => {
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<HKI>>('/api/hki', {
      method: 'POST',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (_id: string, data: any) => {
    if (!_id) throw new Error('HKI ID is required');
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<HKI>>(`/api/hki/${_id}`, {
      method: 'PUT',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  delete: async (_id: string) => {
    if (!_id) throw new Error('HKI ID is required');
    await fetchAPI<APIResponse<void>>(`/api/hki/${_id}`, { method: 'DELETE' });
  },
};

// -------- Patent API --------
export const patentAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI<APIResponse<Patent[]>>('/api/patents');
      return response.data;
    } catch (error) {
      console.error('Error fetching patents:', error);
      return [];
    }
  },

  getById: async (_id: string) => {
    if (!_id) throw new Error('Patent ID is required');
    try {
      const response = await fetchAPI<APIResponse<Patent>>(`/api/patents/${_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patent ${_id}:`, error);
      return undefined;
    }
  },

  create: async (data: any) => {
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Patent>>('/api/patents', {
      method: 'POST',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (_id: string, data: any) => {
    if (!_id) throw new Error('Patent ID is required');
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<Patent>>(`/api/patents/${_id}`, {
      method: 'PUT',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  delete: async (_id: string) => {
    if (!_id) throw new Error('Patent ID is required');
    await fetchAPI<APIResponse<void>>(`/api/patents/${_id}`, { method: 'DELETE' });
  },
};

// -------- Industrial Design API --------
export const industrialDesignAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI<APIResponse<IndustrialDesign[]>>('/api/industrial-designs');
      return response.data;
    } catch (error) {
      console.error('Error fetching industrial designs:', error);
      return [];
    }
  },

  getById: async (_id: string) => {
    if (!_id) throw new Error('Industrial Design ID is required');
    try {
      const response = await fetchAPI<APIResponse<IndustrialDesign>>(`/api/industrial-designs/${_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching industrial design ${_id}:`, error);
      return undefined;
    }
  },

  create: async (data: any) => {
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<IndustrialDesign>>('/api/industrial-designs', {
      method: 'POST',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (_id: string, data: any) => {
    if (!_id) throw new Error('Industrial Design ID is required');
    const body = prepareRequestData(data);
    const response = await fetchAPI<APIResponse<IndustrialDesign>>(`/api/industrial-designs/${_id}`, {
      method: 'PUT',
      body,
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  delete: async (_id: string) => {
    if (!_id) throw new Error('Industrial Design ID is required');
    await fetchAPI<APIResponse<void>>(`/api/industrial-designs/${_id}`, { method: 'DELETE' });
  },
};

export { APIError, NetworkError };