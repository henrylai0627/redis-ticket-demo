"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [stats, setStats] = useState({
    queueDepth: 0,
    dbCount: 0,
    processedCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [bursting, setBursting] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendRequest = async () => {
    setLoading(true);
    await fetch("/api/queue", {
      method: "POST",
      body: JSON.stringify({
        message: `Single request at ${new Date().toISOString()}`,
      }),
    });
    setLoading(false);
    fetchStats();
  };

  const sendBurst = async () => {
    setBursting(true);
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        fetch("/api/queue", {
          method: "POST",
          body: JSON.stringify({
            message: `Burst ${i} at ${new Date().toISOString()}`,
          }),
        })
      );
    }
    await Promise.all(promises);
    setBursting(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-12 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            Customer Support Ticket System
          </h1>
          <p className="text-gray-400">
            Live Ticket Queue Dashboard (RabbitMQ + Redis + Postgres)
          </p>
        </header>

        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-gray-400 text-sm mb-2 uppercase tracking-wider">
              Customers Waiting
            </h2>
            <div
              className={`text-5xl font-bold ${
                stats.queueDepth > 10 ? "text-red-500" : "text-green-500"
              }`}
            >
              {stats.queueDepth}
            </div>
            <p className="text-xs text-gray-500 mt-2">Pending in RabbitMQ</p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-gray-400 text-sm mb-2 uppercase tracking-wider">
              Tickets Resolved
            </h2>
            <div className="text-5xl font-bold text-blue-500">
              {stats.processedCount}
            </div>
            <p className="text-xs text-gray-500 mt-2">Cached Stats (Redis)</p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-gray-400 text-sm mb-2 uppercase tracking-wider">
              Total Archived
            </h2>
            <div className="text-5xl font-bold text-purple-500">
              {stats.dbCount}
            </div>
            <p className="text-xs text-gray-500 mt-2">Saved to PostgreSQL</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-8 border-t border-gray-800">
          <button
            onClick={sendRequest}
            disabled={loading || bursting}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg transition"
          >
            {loading ? "Creating..." : "New Support Ticket"}
          </button>

          <button
            onClick={sendBurst}
            disabled={loading || bursting}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-lg transition"
          >
            {bursting
              ? "Flooding System..."
              : "🔥 Simulate Customer Surge (50)"}
          </button>
        </div>

        <div className="bg-gray-950 p-6 rounded-lg font-mono text-sm text-gray-400">
          <p className="mb-2 text-gray-300 font-bold">How to demo:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Click &quot;Simulate Customer Surge&quot; to flood the system.
            </li>
            <li>
              Watch &quot;Customers Waiting&quot; turn red as tickets pile up.
            </li>
            <li>
              Start the Support Agent Worker:{" "}
              <code className="bg-gray-800 px-1 rounded">npm run worker</code>
            </li>
            <li>
              Watch the Agent pick up tickets and resolve them one by one.
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
