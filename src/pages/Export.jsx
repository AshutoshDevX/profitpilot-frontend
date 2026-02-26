import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Export() {
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const res = await api.get("export/summary");
            setSummary(res.data);
        } catch (err) {
            toast.error("Failed to load export data");
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const res = await api.get("export/csv", {
                responseType: "blob",
            });

            // Create download link
            const blob = new Blob([res.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `profitpilot_predictions_${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("CSV exported successfully!");
        } catch (err) {
            toast.error("Failed to export CSV");
        } finally {
            setExporting(false);
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
                <h1 className="text-3xl font-bold text-white mb-2">Export Data</h1>
                <p className="text-gray-400 mb-8">
                    Download your prediction history for reports and presentations
                </p>

                {/* Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">📊 Export Summary</h2>

                    {summary?.total_predictions > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-gray-400 text-sm">Total Records</p>
                                <p className="text-2xl font-bold text-white">{summary.total_predictions}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-gray-400 text-sm">Total Investment</p>
                                <p className="text-2xl font-bold text-indigo-400">
                                    ${(summary.total_investment / 1000000).toFixed(2)}M
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-gray-400 text-sm">Total Profit</p>
                                <p className="text-2xl font-bold text-green-400">
                                    ${(summary.total_predicted_profit / 1000000).toFixed(2)}M
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-gray-400 text-sm">Avg. ROI</p>
                                <p className="text-2xl font-bold text-purple-400">{summary.average_roi}%</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No predictions to export yet</p>
                        </div>
                    )}

                    {summary?.date_range?.from && (
                        <div className="mt-4 text-center text-gray-400 text-sm">
                            Date range: {summary.date_range.from} to {summary.date_range.to}
                        </div>
                    )}
                </motion.div>

                {/* Export Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">📥 Export Options</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* CSV Export */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">📄</div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg">CSV Export</h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Download all predictions as a spreadsheet-compatible CSV file
                                    </p>
                                    <ul className="text-gray-500 text-xs mt-2 space-y-1">
                                        <li>• Date, Investment, Profit, ROI</li>
                                        <li>• Model used for each prediction</li>
                                        <li>• State/region information</li>
                                    </ul>
                                    <button
                                        onClick={handleExportCSV}
                                        disabled={exporting || summary?.total_predictions === 0}
                                        className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600
                             hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-semibold
                             transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {exporting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                Exporting...
                                            </>
                                        ) : (
                                            <>
                                                <span>⬇️</span> Download CSV
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Coming Soon - PDF */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 opacity-50">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">📑</div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg">PDF Report</h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Generate a professional PDF report with charts and insights
                                    </p>
                                    <div className="mt-4 px-4 py-3 bg-white/10 rounded-xl text-center">
                                        <span className="text-gray-400 text-sm">Coming Soon</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Data Preview */}
                {summary?.total_predictions > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">📋 Export Info</h2>

                        <div className="bg-white/5 rounded-xl p-4 font-mono text-sm">
                            <div className="text-gray-400 mb-2"># CSV columns included:</div>
                            <div className="text-indigo-300">
                                Date, R&D Spend, Administration, Marketing Spend, State, Model Used, Predicted Profit, Total Investment, ROI %
                            </div>
                            <div className="mt-4 text-gray-400 mb-2"># Statistics:</div>
                            <div className="text-green-300">
                                User: {summary.user_name}<br />
                                Records: {summary.total_predictions}<br />
                                Most used model: {summary.most_used_model}
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
