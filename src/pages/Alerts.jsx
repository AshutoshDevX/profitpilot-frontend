import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/alerts");
        setAlerts(res.data);
      } catch (err) {
        toast.error("Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-6 text-white">

      {/* GLOW EFFECTS */}
      {/* <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" /> */}
      {/* <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" /> */}

      <div className="relative z-10">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-2">Alerts</h1>
        <p className="text-white/70 mb-10">
          Budget breaches and system warnings from your predictions
        </p>

        {/* EMPTY STATE */}
        {alerts.length === 0 ? (
          <div className="bg-green-500/20 border border-green-400/30
                          rounded-2xl p-8 text-green-300 text-center">
            ✅ No alerts detected. All predictions are within budget limits.
          </div>
        ) : (
          <div className="space-y-6">

            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-2xl p-6 border backdrop-blur-xl shadow-xl
                  ${
                    alert.severity === "high"
                      ? "bg-red-500/20 border-red-400/40"
                      : alert.severity === "warning"
                      ? "bg-yellow-500/20 border-yellow-400/40"
                      : "bg-blue-500/20 border-blue-400/40"
                  }`}
              >
                {/* HEADER ROW */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 font-semibold">

                    {alert.severity === "high" && (
                      <>
                        🚨 <span className="text-red-300">Critical Alert</span>
                      </>
                    )}

                    {alert.severity === "warning" && (
                      <>
                        ⚠️ <span className="text-yellow-300">Warning</span>
                      </>
                    )}

                    {alert.severity === "info" && (
                      <>
                        ℹ️ <span className="text-blue-300">Information</span>
                      </>
                    )}
                  </div>

                  <span className="text-xs text-white/60">
                    {new Date(alert.created_at).toLocaleString()}
                  </span>
                </div>

                {/* MESSAGE */}
                <p className="text-white/90 leading-relaxed">
                  {alert.message}
                </p>

                {/* TAG */}
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        alert.severity === "high"
                          ? "bg-red-600/80 text-red-100"
                          : alert.severity === "warning"
                          ? "bg-yellow-600/80 text-yellow-100"
                          : "bg-blue-600/80 text-blue-100"
                      }`}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
