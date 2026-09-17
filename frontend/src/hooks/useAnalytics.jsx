import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "./useAuthContext";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

const getJson = async (res) => {
  const text = await res.text();
  try {
    const d = JSON.parse(text);
    if (!res.ok) throw new Error(d.error || `Request failed (${res.status})`);
    return d;
  } catch (e) {
    if (res.status === 404 || text.includes("Cannot GET")) {
      throw new Error("Analytics API not on server yet — redeploy backend, or set VITE_API_URL=http://localhost:4000 locally.");
    }
    throw e;
  }
};

export const useAnalytics = () => {
  const { user } = useAuthContext();
  const [summary, setSummary] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_URL;
      const [s, f, r] = await Promise.all([
        fetch(`${base}/api/analytics/summary`, { headers: authHeader(user.token) }).then(getJson),
        fetch(`${base}/api/analytics/funnel`, { headers: authHeader(user.token) }).then(getJson),
        fetch(`${base}/api/analytics/recommendations`, { headers: authHeader(user.token) }).then(getJson),
      ]);
      setSummary(s);
      setFunnel(f);
      setRecs(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { summary, funnel, recs, loading, error, refetch: fetchAll };
};

export const downloadCsv = async (token) => {
  const base = import.meta.env.VITE_API_URL;
  const res = await fetch(`${base}/api/analytics/export.csv`, {
    headers: authHeader(token),
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "phyjeecs-attempts.csv";
  a.click();
  URL.revokeObjectURL(url);
};
