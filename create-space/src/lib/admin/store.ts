// Tiny localStorage CRUD helpers for dummy modules (customers, quotations, invoices, settings).
const PREFIX = "zv_admin_";

export const loadList = <T>(key: string, seed: T[]): T[] => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) {
      localStorage.setItem(PREFIX + key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
};

export const saveList = <T>(key: string, list: T[]) => {
  localStorage.setItem(PREFIX + key, JSON.stringify(list));
};

export const loadObj = <T>(key: string, seed: T): T => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) {
      localStorage.setItem(PREFIX + key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
};

export const saveObj = <T>(key: string, obj: T) => {
  localStorage.setItem(PREFIX + key, JSON.stringify(obj));
};

export const newId = () => "id_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
