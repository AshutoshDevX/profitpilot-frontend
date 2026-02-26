import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/predictions");
        setHistory(res.data);
        toast.success("Prediction history loaded");
      } catch (err) {
        toast.error("Failed to load prediction history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading history...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 text-white">
      {/* GLOW */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-2">Prediction History</h1>
        <p className="text-white/70 mb-8">
          View all your previous profit predictions
        </p>

        {/* TABLE CARD */}
        {history.length === 0 ? (
          <p className="text-white/80">No predictions found.</p>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20
                          rounded-2xl shadow-2xl overflow-hidden">

            <div className="overflow-x-auto max-h-[70vh]">
              <table className="min-w-full text-sm">

                {/* HEADER */}
                <thead className="sticky top-0 bg-slate-600 backdrop-blur-lg text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">State</th>
                    <th className="px-6 py-4 text-left">Model</th>
                    <th className="px-6 py-4 text-left">Predicted Profit</th>
                    <th className="px-6 py-4 text-left">R&D spend</th>
                    <th className="px-6 py-4 text-left">Administration</th>
                    <th className="px-6 py-4 text-left">Marketing spend</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {history.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-t border-white/10
                        hover:bg-white/10 transition
                        ${index % 2 === 0 ? "bg-white/5" : ""}`}
                    >
                      <td className="px-6 py-4">
                        {new Date(item.created_at).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        {item.state}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${
                              item.model === "Linear Regression"
                                ? "bg-indigo-600 text-indigo-100"
                                : "bg-purple-600 text-purple-100"
                            }`}
                        >
                          {item.model}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-left font-bold text-green-400">
                        ₹ {Number(item.predicted_profit).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {item.rd_spend}
                      </td>
                      <td className="px-6 py-4">
                        {item.administration}
                      </td>
                      <td className="px-6 py-4">
                        {item.marketing_spend}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
