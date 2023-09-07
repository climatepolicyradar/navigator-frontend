export const getSessionStorage = (key: string) => {
  const cachedSearch = window.sessionStorage.getItem(key);
  return cachedSearch === null || undefined ? null : JSON.parse(cachedSearch);
};

export const setSessionStorage = (key: string, value: any) => {
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

export const clearSessionStorage = () => {
  window.sessionStorage.clear();
};
