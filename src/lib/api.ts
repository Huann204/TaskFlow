const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

interface RequestOptions extends RequestInit {
  data?: any;
}

export const apiRequest = async (
  endpoint: string,
  options: RequestOptions = {},
) => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  if (response.status === 401) {
    removeAuthToken();
    window.location.href = "/login";
  }
  let result;
  try {
    result = await response.json();
  } catch (err) {
    console.warn("Error parsing JSON response:", err);
  }

  if (!response.ok) {
    throw new Error(result?.message || "Something went wrong");
  }

  return result;
};
