import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const profileSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  industry_type: z.string().min(1, "Industry is required"),
  company_stage: z.string().min(1, "Company stage is required"),
  annual_turnover: z.coerce.number().min(0, "Must be a positive number"),
});

const industries = [
  "Tech",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Other"
];

const stages = [
  "Early",
  "Seed",
  "Series A",
  "Series B",
  "Growth",
  "Established"
];

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ predictions: 0, joinDate: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      company_name: "",
      industry_type: "",
      company_stage: "",
      annual_turnover: 0,
    },
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("profile");
      setUser(res.data);
      reset({
        company_name: res.data.company_name || "",
        industry_type: res.data.industry_type || "",
        company_stage: res.data.company_stage || "",
        annual_turnover: res.data.annual_turnover || 0,
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("export/summary");
      setStats({
        predictions: res.data.total_predictions,
        joinDate: res.data.date_range?.from,
      });
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await api.post("profile", data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400 mb-8">Manage your account and company information</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <div className="text-indigo-400 text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-white">{stats.predictions}</div>
            <div className="text-gray-400 text-sm">Total Predictions</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <div className="text-green-400 text-4xl mb-2">📅</div>
            <div className="text-xl font-bold text-white">{stats.joinDate || "N/A"}</div>
            <div className="text-gray-400 text-sm">First Prediction</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <div className="text-purple-400 text-4xl mb-2">🏢</div>
            <div className="text-xl font-bold text-white truncate">
              {user?.company_name || "Not Set"}
            </div>
            <div className="text-gray-400 text-sm">Company</div>
          </motion.div>
        </div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Company Information</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  {...register("company_name")}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3
                           text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500
                           transition"
                  placeholder="Enter company name"
                />
                {errors.company_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.company_name.message}</p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Industry
                </label>
                <select
                  {...register("industry_type")}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3
                           text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="" className="bg-gray-900">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind} className="bg-gray-900">{ind}</option>
                  ))}
                </select>
                {errors.industry_type && (
                  <p className="text-red-400 text-sm mt-1">{errors.industry_type.message}</p>
                )}
              </div>


              {console.log("Register", register)}
              {/* Company Stage */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company Stage
                </label>
                <select
                  {...register("company_stage")}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3
                           text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="" className="bg-gray-900">Select Stage</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage} className="bg-gray-900">{stage}</option>
                  ))}
                </select>
                {errors.company_stage && (
                  <p className="text-red-400 text-sm mt-1">{errors.company_stage.message}</p>
                )}
              </div>

              {/* Annual Turnover */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Annual Turnover ($)
                </label>
                <input
                  type="number"
                  {...register("annual_turnover")}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3
                           text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500
                           transition"
                  placeholder="e.g., 500000"
                />
                {errors.annual_turnover && (
                  <p className="text-red-400 text-sm mt-1">{errors.annual_turnover.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600
                       hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-semibold
                       transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
