import axios from "axios";

// Default to backend port 5001 (as the API docs & dev config often use port 5001); override with NEXT_PUBLIC_API_URL if set
let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// In development, prefer a runtime-based fallback pointing requests to port 5001 on localhost.
// This avoids stale pre-built values or env var mismatches that cause the front-end to call a different port than expected.
if (process.env.NODE_ENV === "development") {
    try {
        if (typeof window !== "undefined") {
            // If NEXT_PUBLIC_API_URL is not set, use current host with port 5001.
            if (!process.env.NEXT_PUBLIC_API_URL) {
                API_URL = `${window.location.protocol}//${window.location.hostname}:5001/api/v1`;
            } else if (process.env.NEXT_PUBLIC_API_URL.includes(":5001")) {
                // The env already points to 5001; keep it rather than replacing
                API_URL = process.env.NEXT_PUBLIC_API_URL;
            }
        }
    } catch {}
}

// Log the resolved API_URL at runtime to aid debugging (Next.js/Turbopack caches envs at build-time)
try {
    if (typeof window !== "undefined") {
        console.debug("[API Client] Resolved API_URL (at runtime):", API_URL);
    } else {
        // Some SSR logs may appear in server logs; keep output minimal
        console.debug("[API Client] Server-side API_URL:", API_URL);
    }
} catch {}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (process.env.NODE_ENV === "development") {
            try {
                // Mask token for logs; just show first 6 chars
                const masked = token ? `${token.slice(0, 6)}...` : "null";
                console.debug("API Request:", {
                    baseURL: API_URL,
                    url: config?.url,
                    method: config?.method,
                    token: masked,
                });
            } catch {}
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log any network/config error for easier debugging
        try {
            const fullUrl = `${error?.config?.baseURL || API_URL}${
                error?.config?.url || ""
            }`;
            console.error(
                "[API Error] fullUrl:",
                fullUrl,
                "method:",
                error?.config?.method,
                "message:",
                error?.message
            );
        } catch {}
        if (error.response?.status === 401) {
            try {
                console.error("API 401 Unauthorized", {
                    url: error.config?.url,
                    status: error.response?.status,
                    data: error.response?.data,
                });
            } catch {}

            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
export { api as apiClient };
