import Cookies from 'js-cookie';

// Define common cookie options interface
export interface CookieOptions {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

const DEFAULT_OPTIONS: CookieOptions = {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
};

/**
 * Set a cookie
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options (merges with defaults)
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
    Cookies.set(name, value, { ...DEFAULT_OPTIONS, ...options });
};

/**
 * Get a cookie value
 * @param name Cookie name
 * @returns Cookie value or undefined
 */
export const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
};

/**
 * Get all cookies
 * @returns Object with all cookies
 */
export const getAllCookies = (): { [key: string]: string } => {
    return Cookies.get();
};

/**
 * Remove a cookie
 * @param name Cookie name
 * @param options Cookie options (path needs to match creation)
 */
export const removeCookie = (name: string, options: CookieOptions = {}) => {
    Cookies.remove(name, { ...DEFAULT_OPTIONS, ...options });
};
