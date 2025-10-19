import api from '../axios';

function joinUrl(base: string, suffix?: string | number) {
  if (suffix === undefined || suffix === null) return base.endsWith('/') ? base : base + '/';
  const b = base.endsWith('/') ? base : base + '/';
  return `${b}${suffix}`;
}

export class BaseAPI<T> {
  protected endpoint: string; // <-- was private
  constructor(endpoint: string) {
    this.endpoint = joinUrl(endpoint);
  }

  protected url(path?: string | number) {
    return joinUrl(this.endpoint, path);
  }

  getAll(): Promise<T[]> {
    return api.get<T[]>(this.endpoint).then(res => res.data);
  }

  getById(id: number): Promise<T> {
    return api.get<T>(`${this.endpoint}${id}`).then(res => res.data);
  }

  create(payload: Partial<T>): Promise<T> {
    return api.post<T>(this.endpoint, payload).then(res => res.data);
  }

  update(id: number, payload: Partial<T>): Promise<T> {
    return api.put<T>(`${this.endpoint}${id}`, payload).then(res => res.data);
  }

  delete(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`${this.endpoint}${id}`).then(res => res.data);
  }

  filter(params: Record<string, any>): Promise<T[]> {
    return api.get<{ items: T[] } | T[]>(this.endpoint, { params })
      .then(res => Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? []);
  }

  paginate(limit: number, offset = 0, params?: Record<string, any>): Promise<T[]> {
    return api.get<{ items: T[] } | T[]>(this.endpoint, {
      params: { limit, offset, ...(params || {}) },
    }).then(res => Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? []);
  }

  getMany(ids: number[]): Promise<T[]> {
    const clean = Array.from(new Set(ids.filter(n => Number.isFinite(n) && n > 0)));
    if (clean.length === 0) return Promise.resolve([]);
    return api
      .get<{ data?: T[] } | T[]>(this.endpoint, { params: { ids: clean.join(',') } })
      .then(res => Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? []);
  }
}
