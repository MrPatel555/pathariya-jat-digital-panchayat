const LOCAL_API_URL = 'http://localhost:5000';
const PRODUCTION_API_URL = 'https://web-production-472a78.up.railway.app';

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

    if (hostname.includes('vercel.app')) {
      return PRODUCTION_API_URL;
    }
  }

  return envApiUrl || PRODUCTION_API_URL;
};

export const API_URL = getApiUrl();
