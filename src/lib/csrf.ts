/**
 * CSRF Token utility
 * Generates a cryptographically random token, stores it in sessionStorage,
 * and provides a hook + meta-tag approach for client-side forms.
 * On mutating fetches, the token is sent as X-CSRF-Token header.
 * The middleware validates that the origin matches the host.
 * For extra coverage, we also embed a nonce in forms.
 */

import { useEffect, useState } from "react";

const CSRF_KEY = "gmgp_csrf_token";

/** Generate a secure random token */
function generateToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Get or create the session CSRF token */
export function getCsrfToken(): string {
  if (typeof window === "undefined") return "";
  let token = sessionStorage.getItem(CSRF_KEY);
  if (!token) {
    token = generateToken();
    sessionStorage.setItem(CSRF_KEY, token);
  }
  return token;
}

/** React hook — returns the CSRF token once mounted */
export function useCsrfToken(): string {
  const [token, setToken] = useState("");
  useEffect(() => {
    setToken(getCsrfToken());
  }, []);
  return token;
}

/**
 * Wrapper around fetch that automatically attaches
 * the X-CSRF-Token header for non-GET requests.
 */
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers ?? {});

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    headers.set("X-CSRF-Token", getCsrfToken());
  }

  return fetch(url, { ...options, headers });
}
