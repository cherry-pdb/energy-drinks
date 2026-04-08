import type { LoginRequest, LoginResponse } from '../types/auth';
import type { CreateEnergyDrinkRequest, EnergyDrink } from '../types/energy';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';
const TOKEN_KEY = 'energy_admin_token';
const USERNAME_KEY = 'energy_admin_username';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function saveAuth(auth: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(USERNAME_KEY, auth.username);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

async function apiFetch(path: string, init?: RequestInit, withAuth = false) {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Content-Type') && init?.body) headers.set('Content-Type', 'application/json');
  if (withAuth) {
    const token = getAuthToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (response.status === 401 && withAuth) {
    clearAuth();
  }
  return response;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Invalid username or password');
  return response.json();
}

export async function getEnergyDrinks(params?: {
  search?: string;
  brand?: string;
  isSugarFree?: boolean;
  onlyFull?: boolean;
}): Promise<EnergyDrink[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.brand) query.set('brand', params.brand);
  if (typeof params?.isSugarFree === 'boolean') query.set('isSugarFree', String(params.isSugarFree));
  if (typeof params?.onlyFull === 'boolean') query.set('onlyFull', String(params.onlyFull));

  const response = await apiFetch(`/energy-drinks?${query.toString()}`);
  if (!response.ok) throw new Error('Failed to load drinks');
  return response.json();
}

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export async function getEnergyDrinksPaged(params: {
  search?: string;
  brand?: string;
  isSugarFree?: boolean;
  onlyFull?: boolean;
  page: number;
  pageSize: number;
}): Promise<PagedResult<EnergyDrink>> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.brand) query.set('brand', params.brand);
  if (typeof params?.isSugarFree === 'boolean') query.set('isSugarFree', String(params.isSugarFree));
  if (typeof params?.onlyFull === 'boolean') query.set('onlyFull', String(params.onlyFull));
  query.set('page', String(params.page));
  query.set('pageSize', String(params.pageSize));

  const response = await apiFetch(`/energy-drinks/paged?${query.toString()}`);
  if (!response.ok) throw new Error('Failed to load drinks');
  return response.json();
}

export async function getBrands(): Promise<string[]> {
  const response = await apiFetch('/energy-drinks/brands');
  if (!response.ok) throw new Error('Failed to load brands');
  return response.json();
}

export async function createEnergyDrink(payload: CreateEnergyDrinkRequest): Promise<EnergyDrink> {
  const response = await apiFetch('/energy-drinks', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);

  if (!response.ok) throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to create drink');
  return response.json();
}

export async function updateEnergyDrink(id: string, payload: CreateEnergyDrinkRequest): Promise<EnergyDrink> {
  const response = await apiFetch(`/energy-drinks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, true);

  if (!response.ok) throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to update drink');
  return response.json();
}

export async function deleteEnergyDrink(id: string): Promise<void> {
  const response = await apiFetch(`/energy-drinks/${id}`, {
    method: 'DELETE',
  }, true);

  if (!response.ok) throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to delete drink');
}
