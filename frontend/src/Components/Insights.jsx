import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useAnalytics, downloadCsv } from "../hooks/useAnalytics";
import { useAuthContext } from "../hooks/useAuthContext";
import "./Insights.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#8dd1e1"];

const Insights = () => {
  const { summary, funnel, recs, loading, error } = useAnalytics();
  const { user } = useAuthContext();

  if (loading) return <p>Loading insights...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!summary) return <p>No data yet — attempt some questions first.</p>;

  const { kpis, byChapter = [], byType = [], byDifficulty = [], trend = [], weakestChapters = [] } = summary;

  const typePie = byType.map((t) => ({ name: t.type, value: t.attempted }));
  const trendChart = trend.map((d) => ({ ...d, accuracy: d.attempted ? Math.round((d.correct / d.attempted) * 100) : 0 }));
  const chapterChart = [...byChapter].sort((a, b) => b.attempted - a.attempted).slice(0, 10);

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h2>Insights — one view for SDE · DA · PA · AI</h2>
        <button className="filter-button" onClick={() => downloadCsv(user.token)}>
          Export CSV (EDA)
        </button>
      </div>

      {/* DA: KPI cards */}
      <div className="kpi-grid">
        <div className="kpi-card"><span>Accuracy</span><strong>{Math.round(kpis.accuracy * 100)}%</strong></div>
        <div className="kpi-card"><span>Attempted</span><strong>{kpis.total}</strong></div>
        <div className="kpi-card"><span>Avg time / Q</span><strong>{kpis.avgTime}s</strong></div>
        <div className="kpi-card"><span>Streak</span><strong>{kpis.streak} day(s)</strong></div>
        <div className="kpi-card"><span>Bookmarks</span><strong>{kpis.bookmarks}</strong></div>
      </div>

      {/* PA: funnel strip */}
      {funnel && (
        <div className="funnel-strip">
          <div>Activated: <strong>{funnel.me?.activated ? "Yes" : "No"}</strong></div>
          <div>Power user (10+): <strong>{funnel.me?.powerUser ? "Yes" : "No"}</strong></div>
          <div>Active days: <strong>{funnel.me?.activeDays}</strong></div>
          {funnel.global && (
            <>
              <div>Global users: <strong>{funnel.global.users}</strong></div>
              <div>Activation rate: <strong>{Math.round(funnel.global.activationRate * 100)}%</strong></div>
            </>
          )}
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-card">
          <h4>Attempts by chapter (top 10)</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chapterChart}>
              <XAxis dataKey="chapter" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attempted" fill="#8884d8" />
              <Bar dataKey="correct" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h4>14-day trend</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="attempted" stroke="#8884d8" />
              <Line type="monotone" dataKey="correct" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h4>Split by question type</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={typePie} dataKey="value" nameKey="name" outerRadius={90} label>
                {typePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h4>Accuracy by difficulty</h4>
          <ul className="plain-list">
            {byDifficulty.map((d) => (
              <li key={d.difficulty}>{d.difficulty}: {d.correct}/{d.attempted} ({Math.round(d.accuracy * 100)}%)</li>
            ))}
            {byDifficulty.length === 0 && <li>No data</li>}
          </ul>
        </div>
      </div>

      {/* DA: weakest table */}
      <div className="chart-card">
        <h4>Weakest chapters (lowest accuracy)</h4>
        <table className="insights-table">
          <thead><tr><th>Chapter</th><th>Category</th><th>Attempted</th><th>Accuracy</th><th>Avg time</th></tr></thead>
          <tbody>
            {weakestChapters.map((w, i) => (
              <tr key={i}>
                <td>{w.chapter}</td><td>{w.category}</td><td>{w.attempted}</td>
                <td>{Math.round(w.accuracy * 100)}%</td><td>{w.avgTime}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI: recommendations */}
      {recs && (
        <div className="chart-card">
          <h4>Recommended next (weakest-first + spaced repetition)</h4>
          <p className="muted">Strategy: {recs.strategy}</p>
          <p className="muted">Weak: {recs.weakestChapters?.map((w) => `${w.chapter} (${Math.round(w.accuracy * 100)}%)`).join(", ") || "—"}</p>
          <div className="rec-grid">
            {(recs.recommended || []).map((q) => (
              <div key={q._id} className="rec-card">
                <strong>{q.title}</strong>
                <span>{q.chapter} · {q.category} · {q.type} · {q.difficulty}</span>
              </div>
            ))}
          </div>
          {(recs.reviewDue || []).length > 0 && (
            <>
              <h4>Review due (incorrect &gt; 3 days ago)</h4>
              <div className="rec-grid">
                {recs.reviewDue.map((q) => (
                  <div key={q._id} className="rec-card review">
                    <strong>{q.title}</strong>
                    <span>{q.chapter} · {q.category}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Insights;
