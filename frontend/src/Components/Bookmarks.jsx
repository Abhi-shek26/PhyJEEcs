import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Bookmarks = () => {
  const { user } = useAuthContext();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (r) => {
        const text = await r.text();
        try {
          const d = JSON.parse(text);
          if (!r.ok) throw new Error(d.error || "Failed to load bookmarks");
          setItems(Array.isArray(d) ? d : d.data || []);
        } catch (e) {
          throw new Error(
            r.status === 404
              ? "Bookmarks API not on server yet — redeploy backend, or set VITE_API_URL=http://localhost:4000 for local testing."
              : e.message
          );
        }
      })
      .catch((e) => setError(e.message));
  }, [user]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem" }}>
      <h2>Bookmarks ({items.length})</h2>
      {error && <p className="error-message">{error}</p>}
      {!error && items.length === 0 && <p>No bookmarks yet — tap the bookmark icon on any question.</p>}
      {items.map((b) => (
        <div key={b._id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <strong>{b.questionId?.title}</strong>
          <span> · {b.questionId?.chapter} · {b.questionId?.category} · {b.questionId?.type}</span>
          {b.questionId?.imageUrl && (
            <div><img src={b.questionId.imageUrl} alt={b.questionId.title} style={{ maxWidth: "100%", marginTop: 8 }} /></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Bookmarks;
