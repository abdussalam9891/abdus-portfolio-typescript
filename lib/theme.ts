export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs synchronously in <head>, before first paint, so the stored/system
 * theme is applied before any content renders (no light->dark flash on load).
 * Kept as a plain string (not a hook) so it can run as an inline script from
 * a Server Component — lib/theme.ts itself stays server-safe.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
