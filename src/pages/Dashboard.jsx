import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  BarChart,
  ScatterChart,
  Scatter,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roiData, setRoiData] = useState([]);
  const [alerts, setAlerts] = useState([]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          summaryRes,
          historyRes,
          metricsRes,
          // featureRes,
          roiRes,
          alertsRes
        ] = await Promise.all([
          api.get("/predictions/summary"),
          api.get("/predictions"),
          api.get("/models/metrics"),
          // api.get("/models/feature-importance"),
          api.get("/roi"),
          api.get("/alerts")
        ]);

        setSummary(summaryRes.data);
        setHistory(historyRes.data);
        setMetrics(metricsRes.data);
        // setFeatureImportance(featureRes.data);
        setRoiData(
          roiRes.data.map(item => ({
            investment: item.total_investment,
            roi: item.roi_percentage   
          }))
        );
        console.log("roiData", roiData)
        setAlerts(alertsRes.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No dashboard data available
      </div>
    );
  }

  console.log("history:", ...history);
  const chartData = [...history]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((item) => ({
      date: new Date(item.created_at).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
      profit: item.predicted_profit,
    }));

    console.log("chartData", chartData);
  // const featureData = featureImportance
  //   ? Object.entries(featureImportance).map(([name, value]) => ({
  //       feature: name,
  //       importance: Number((value * 100).toFixed(2)),
  //     }))
  //   : [];

  return (
    <div className="relative max-w-7xl mx-auto px-6 text-white">

      {/* GLOW EFFECTS */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative z-10">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-2">Dashboard</h1>
        <p className="text-white/70 mb-10">
          Overview of predictions, model performance, and feature impact
        </p>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-white/70">Total Predictions</p>
            <p className="text-4xl font-bold text-indigo-400 mt-2">
              {summary.total_predictions}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-white/70">Average Profit</p>
            <p className="text-4xl font-bold text-green-400 mt-2">
              ₹ {Number(summary.average_profit).toLocaleString()}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-white/70">Best Model</p>
            <p className="text-2xl font-semibold text-blue-200 mt-3">
              {summary.best_model || "N/A"}
            </p>
          </div>
        </div>

        {/* BUDGET BREACH INDICATOR */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4">
            Budget Alerts
          </h2>

          {alerts.length === 0 ? (
            <div className="bg-green-500/20 border border-green-400/30
                    rounded-xl p-6 text-green-300">
              ✅ All predictions are within budget limits
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl p-5 border backdrop-blur-lg
            ${alert.severity === "high"
                      ? "bg-red-500/20 border-red-400/40 text-red-300"
                      : alert.severity === "warning"
                        ? "bg-yellow-500/20 border-yellow-400/40 text-yellow-300"
                        : "bg-blue-500/20 border-blue-400/40 text-blue-300"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {alert.severity === "high" && "🚨 Critical Budget Breach"}
                      {alert.severity === "warning" && "⚠️ Budget Warning"}
                      {alert.severity === "info" && "ℹ️ Budget Info"}
                    </p>
                    <span className="text-xs opacity-70">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-2 text-sm">
                    {alert.message}
                  </p>
                </div>
              ))}

              {alerts.length > 3 && (
                <p className="text-sm text-white/50">
                  Showing latest 3 alerts. View all in Alerts page.
                </p>
              )}
            </div>
          )}
        </div>


        {/* MODEL METRICS */}
        {metrics && (
          <div className="mb-14">
            <h2 className="text-2xl font-semibold mb-4">
              Model Performance Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(metrics).map(([modelName, values]) => (
                <div
                  key={modelName}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
                >
                  <h3 className="text-lg font-semibold text-indigo-300 mb-4">
                    {modelName}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-white/80">R² Score:</span>{" "}
                      {values.r2.toFixed(4)}
                    </p>
                    <p>
                      <span className="font-medium text-white/80">RMSE:</span>{" "}
                      ₹ {Number(values.rmse).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium text-white/80">MAE:</span>{" "}
                      ₹ {Number(values.mae).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-white/50 mt-3">
              Metrics are calculated during training using a test dataset.
            </p>
          </div>
        )}

        {/* FEATURE IMPORTANCE
        {featureData.length > 0 && (
          <div className="mb-14 bg-white rounded-2xl p-8 shadow-2xl text-black">
            <h2 className="text-2xl font-semibold mb-1">
              Feature Importance (Random Forest)
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Contribution of each feature to profit prediction
            </p>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={featureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar
                  dataKey="importance"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )} */}

        {/* PROFIT CHART */}
        <div className="bg-slate-900/50 rounded-2xl p-8 shadow-2xl text-white">
          <h2 className="text-2xl font-semibold mb-1">
            Profit Over Time
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Track how predicted profit changes over time
          </p>

          {chartData.length === 0 ? (
            <p className="text-gray-500">
              No prediction data available for chart.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ROI vs Investment */}
        <div className="mt-14 bg-slate-900 rounded-2xl p-8 shadow-2xl text-white">
          <h2 className="text-2xl font-semibold mb-1">
            ROI vs Total Investment
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Understand how ROI changes with different investment levels
          </p>

          {roiData.length === 0 ? (
            <p className="text-gray-500">No ROI data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="investment"
                  name="Investment"
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="number"
                  dataKey="roi"
                  name="ROI"
                  unit="%"
                  domain={[-100, 200]}
                />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "ROI"
                        ? [`${value.toFixed(2)}`, "ROI"]
                        : [`₹${value.toLocaleString()}`, "Investment"]
                    }
                  />
                <Scatter
                  data={roiData}
                  fill="#6366f1"
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>


      </div>
    </div>
  );
}