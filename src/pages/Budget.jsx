import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Budget() {
  const [form, setForm] = useState({
    max_rd_spend: "",
    max_marketing_spend: "",
    max_administration_cost: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing budget (if any)
    const fetchBudget = async () => {
      try {
        const res = await api.get("/budget");
        if (res.data) {
          setForm({
            max_rd_spend: res.data.max_rd_spend || "",
            max_marketing_spend: res.data.max_marketing_spend || "",
            max_administration_cost: res.data.max_administration_cost || "",
          });
        }
      } catch {
        // silently ignore if no budget exists
      }
    };

    fetchBudget();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/budget", form);
      toast.success("Budget constraints saved");
    } catch {
      toast.error("Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-2">
          Budget Constraints
        </h1>
        <p className="text-white/70 mb-10">
          Set spending limits to receive alerts when predictions exceed your budget
        </p>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20
                     rounded-2xl shadow-2xl p-8 space-y-6"
        >

          {/* R&D */}
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Max R&D Spend (₹)
            </label>
            <input
              type="number"
              name="max_rd_spend"
              value={form.max_rd_spend}
              onChange={handleChange}
              placeholder="e.g. 50000"
              className="w-full bg-white/20 text-white placeholder-white/50
                         border border-white/20 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* MARKETING */}
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Max Marketing Spend (₹)
            </label>
            <input
              type="number"
              name="max_marketing_spend"
              value={form.max_marketing_spend}
              onChange={handleChange}
              placeholder="e.g. 30000"
              className="w-full bg-white/20 text-white placeholder-white/50
                         border border-white/20 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* ADMIN */}
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Max Administration Cost (₹)
            </label>
            <input
              type="number"
              name="max_administration_cost"
              value={form.max_administration_cost}
              onChange={handleChange}
              placeholder="e.g. 20000"
              className="w-full bg-white/20 text-white placeholder-white/50
                         border border-white/20 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-indigo-500 to-purple-600
                       hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Save Budget Constraints"}
          </button>
        </form>
      </div>
    </div>
  );
}
