import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export default function Insights() {
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const res = await api.get("insights");
            setInsights(res.data);
        } catch (err) {
            toast.error("Failed to load insights");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Prepare chart data for budget allocation comparison
    const chartData = insights?.user_ratios?.has_data ? [
        {
            name: "R&D",
            yours: Math.round(insights.user_ratios.rd_ratio * 100),
            industry: Math.round(insights.industry_benchmarks.rd_ratio * 100),
        },
        {
            name: "Marketing",
            yours: Math.round(insights.user_ratios.marketing_ratio * 100),
            industry: Math.round(insights.industry_benchmarks.marketing_ratio * 100),
        },
        {
            name: "Admin",
            yours: Math.round(insights.user_ratios.admin_ratio * 100),
            industry: Math.round(insights.industry_benchmarks.admin_ratio * 100),
        },
    ] : [];

    return (
        <div className="min-h-screen pt-28 pb-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Personalized Insights
                        </h1>
                        <p className="text-gray-400">
                            AI-powered recommendations based on your prediction history
                        </p>
                    </div>
                    {insights?.industry && (
                        <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-xl px-4 py-2">
                            <span className="text-indigo-300 text-sm">Industry: </span>
                            <span className="text-white font-semibold">{insights.industry}</span>
                        </div>
                    )}
                </div>

                {/* Profile Completion Notice */}
                {!insights?.profile_complete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 flex items-center gap-4"
                    >
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                            <p className="text-yellow-200 font-medium">Complete Your Profile</p>
                            <p className="text-yellow-200/70 text-sm">
                                Fill in your company details to get industry-specific recommendations
                            </p>
                        </div>
                        <Link
                            to="/profile"
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-medium transition"
                        >
                            Update Profile
                        </Link>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Performance Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">📊 Performance Overview</h2>

                        {insights?.performance?.total_predictions > 0 ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <p className="text-gray-400 text-sm">Total Predictions</p>
                                        <p className="text-2xl font-bold text-white">
                                            {insights.performance.total_predictions}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <p className="text-gray-400 text-sm">Avg. ROI</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {insights.performance.avg_roi}%
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-gray-400 text-sm">Best Prediction</p>
                                    <p className="text-xl font-bold text-white">
                                        ${insights.performance.best_prediction?.profit?.toLocaleString()}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {insights.performance.best_prediction?.model} • {insights.performance.best_prediction?.date}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">Trend:</span>
                                    {insights.performance.trend === "improving" && (
                                        <span className="text-green-400 font-medium">📈 Improving</span>
                                    )}
                                    {insights.performance.trend === "declining" && (
                                        <span className="text-red-400 font-medium">📉 Declining</span>
                                    )}
                                    {insights.performance.trend === "stable" && (
                                        <span className="text-yellow-400 font-medium">➡️ Stable</span>
                                    )}
                                    {insights.performance.trend === "insufficient_data" && (
                                        <span className="text-gray-500 font-medium">Need more data</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">No predictions yet</p>
                                <Link
                                    to="/predict"
                                    className="inline-block mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-medium transition"
                                >
                                    Make Your First Prediction
                                </Link>
                            </div>
                        )}
                    </motion.div>

                    {/* Budget Allocation Comparison */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">
                            📈 Budget Allocation vs Industry
                        </h2>

                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData} barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" tickFormatter={(v) => `${v}%`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1F2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                        }}
                                        formatter={(value) => [`${value}%`]}
                                    />
                                    <Bar dataKey="yours" name="Your Allocation" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="industry" name="Industry Avg" fill="#6366F1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400">Make predictions to see comparison</p>
                            </div>
                        )}

                        <div className="flex gap-4 mt-4 justify-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-purple-500"></div>
                                <span className="text-gray-400">Your Allocation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-indigo-500"></div>
                                <span className="text-gray-400">Industry Average</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">💡 Recommendations</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights?.recommendations?.map((rec, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className={`bg-white/10 backdrop-blur-xl rounded-xl p-5 border ${rec.type === "warning" ? "border-yellow-500/50" :
                                    rec.type === "alert" ? "border-red-500/50" :
                                        rec.type === "success" ? "border-green-500/50" :
                                            "border-white/20"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{rec.icon}</span>
                                    <div>
                                        <h3 className="text-white font-semibold">{rec.title}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{rec.message}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {(!insights?.recommendations || insights.recommendations.length === 0) && (
                            <div className="col-span-2 text-center py-8 bg-white/5 rounded-xl">
                                <p className="text-gray-400">
                                    Complete your profile and make predictions to get personalized recommendations
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Industry Comparisons */}
                {insights?.comparison?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">🏭 Industry Comparison</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {insights.comparison.map((comp, index) => (
                                <div
                                    key={index}
                                    className={`bg-white/10 backdrop-blur-xl rounded-xl p-5 border ${comp.status === "above" ? "border-green-500/50" : "border-orange-500/50"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-medium">{comp.category}</h3>
                                            <p className="text-gray-400 text-sm mt-1">{comp.message}</p>
                                        </div>
                                        <span className={`text-lg font-bold ${comp.status === "above" ? "text-green-400" : "text-orange-400"
                                            }`}>
                                            {comp.difference}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
