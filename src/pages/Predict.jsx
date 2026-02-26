import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Select from "react-select";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = z.object({
  rd_spend: z.number().positive("R&D Spend must be positive"),
  administration: z.number().positive("Administration must be positive"),
  marketing_spend: z.number().positive("Marketing Spend must be positive"),
  state: z.string().min(1, "State is required"),
  model: z.string().min(1, "Model selection is required"),
});

/* ---------------- SELECT STYLES (DARK THEME) ---------------- */
const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: state.isFocused ? "#6366f1" : "rgba(255,255,255,0.2)",
    boxShadow: "none",
    borderRadius: "8px",
    padding: ".4rem .6rem",
    margin: "0.2rem 0",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#4f46e5" : "#1e293b",
    color: "white",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "white" }),
  placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.6)" }),
  dropdownIndicator: (base) => ({ ...base, color: "white" }),
  indicatorSeparator: () => ({ display: "none" }),
};

/* ---------------- OPTIONS ---------------- */
const modelOptions = [
  { value: "Linear Regression", label: "Linear Regression" },
  { value: "Random Forest", label: "Random Forest" },
  { value: "XGBoost", label: "XGBoost" },
];

const stateOptions = [
  { value: "New York", label: "New York" },
  { value: "California", label: "California" },
  { value: "Florida", label: "Florida" },
];

/* ---------------- BAR COLORS ---------------- */
const BAR_COLORS = {
  "R&D Spend": "#2563eb",
  "Administration": "#7c3aed",
  "Marketing Spend": "#f97316",
  "Predicted Profit": "#16a34a",
};

/* ---------------- NORMALIZATION ---------------- */
const normalizeData = (data) => {
  const maxValue = Math.max(...data.map(d => Math.abs(d.value)));
  return data.map(d => ({
    ...d,
    normalizedValue: (Math.abs(d.value) / maxValue) * 100,
    isNegative: d.value < 0
  }));
};

export default function Predict() {
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
    try {
      const payload = {
        rd_spend: Number(data.rd_spend),
        administration: Number(data.administration),
        marketing_spend: Number(data.marketing_spend),
        state: data.state,
        model: data.model,
      };

      const res = await api.post("/predict", payload);
      setResult(res.data);

      const rawData = [
        { name: "R&D Spend", value: payload.rd_spend },
        { name: "Administration", value: payload.administration },
        { name: "Marketing Spend", value: payload.marketing_spend },
        { name: "Predicted Profit", value: res.data.predicted_profit },
      ];

      setChartData(normalizeData(rawData));
      toast.success("Prediction generated successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Prediction failed");
    }
  };

  const handleBack = () => {
    setResult(null);
    setChartData([]);
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 text-white flex justify-center">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Profit Prediction</h1>
          {result && (
            <button onClick={handleBack} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">
              Back
            </button>
          )}
        </div>

        <p className="text-white/70 mb-6">
          AI-powered startup profit estimation with ROI analysis
        </p>

        {!result && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* MODEL SELECT */}
            <div>
              <label className="text-sm text-white/80">Select Model</label>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={modelOptions}
                    styles={selectStyles}
                    placeholder="Select Model"
                    value={modelOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              {errors.model && <p className="text-red-400 text-sm mt-1">{errors.model.message}</p>}
            </div>

            {/* INPUT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["rd_spend", "R&D Spend","e.g. 50000"],
                ["administration", "Administration","e.g. 30000"],
                ["marketing_spend", "Marketing Spend","e.g. 20000"],
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className="text-sm text-white/80">{label}</label>
                  <input
                    type="number"
                    placeholder={placeholder}
                    {...register(key, { valueAsNumber: true })}
                    className="w-full mt-1 rounded-lg bg-white/10 border border-white/20 px-4 py-3"
                  />
                  {errors[key] && <p className="text-red-400 text-sm">{errors[key].message}</p>}
                </div>
              ))}

              {/* STATE SELECT */}
              <div>
                <label className="text-sm text-white/80">State</label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={stateOptions}
                      styles={selectStyles}
                      placeholder="Select State"
                      value={stateOptions.find(
                      (option) => option.value === field.value
                    )}
                      onChange={(selected) => field.onChange(selected?.value)}
                    />
                  )}
                />
                {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-xl font-semibold text-lg hover:scale-[1.02] hover:shadow-xl transition"
            >
              {isSubmitting ? "Predicting..." : "Predict Profit 🚀"}
            </button>
          </form>
        )}

        {result && (
          <>
            {/* ROI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 p-6 rounded-xl text-center">
                <p className="text-sm text-white/70">Predicted Profit</p>
                <p className="text-3xl font-bold text-green-400">
                  ₹ {Number(result.predicted_profit).toLocaleString()}
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl text-center">
                <p className="text-sm text-white/70">Total Investment</p>
                <p className="text-3xl font-bold text-indigo-300">
                  ₹ {Number(result.total_investment).toLocaleString()}
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl text-center">
                <p className="text-sm text-white/70">ROI</p>
                <p className={`text-3xl font-bold ${result.roi_percentage >= 0.5 ? "text-green-400" : "text-red-400"}`}>
                  {(result.roi_percentage).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* CHART */}
            <div className="bg-white rounded-xl p-6 text-black">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value, name, props) => [`₹ ${props.payload.value.toLocaleString()}`, name]} />
                  <Bar dataKey="normalizedValue">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.name === "Predicted Profit" && entry.isNegative ? "#dc2626" : BAR_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
