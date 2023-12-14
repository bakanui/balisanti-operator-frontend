export const getStorageValue = (key: string) => {
  const saved: any = localStorage.getItem(key);
  if (saved && saved != 'undefined') {
    const initial = JSON.parse(saved);
    return initial;
  }
  return null;
}

export const setStorageValue = (key: string, value: any) => {
  if (typeof value == 'string') {
    localStorage.setItem(key, value);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
}

export const removeStorage = (key: string) => {
  localStorage.removeItem(key);
}

export const clearStorage = (key: string) => {
  localStorage.clear();
}