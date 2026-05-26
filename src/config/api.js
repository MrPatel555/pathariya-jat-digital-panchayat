const LOCAL_API_URL = 'http://localhost:5000';

export const getApiUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;

  if (envApiUrl && !envApiUrl.includes('localhost') && !envApiUrl.includes('127.0.0.1')) {
    return envApiUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const { origin, hostname } = window.location;

    if (hostname.includes('railway.app')) {
      return origin;
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return LOCAL_API_URL;
    }
  }

  return envApiUrl || LOCAL_API_URL;
};

export const API_URL = getApiUrl();
