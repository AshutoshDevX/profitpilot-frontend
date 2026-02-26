import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

/* ---------------- VALIDATION ---------------- */
const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),

  company_name: z.string().min(2, "Company name required"),
  industry_type: z.string().min(2, "Industry required"),
  company_stage: z.string().min(2, "Company stage required"),
  annual_turnover: z.number().optional().transform(v => v || 0),
});

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
  try {
    const { name, email, password, ...profile } = data;

    await api.post("/auth/register", { name, email, password });
 
    const loginRes = await api.post("/auth/login", { email, password });

    const token = loginRes.data.access_token;
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", loginRes.data.refresh_token);

    
    await api.post("/profile", profile);

    toast.success("Account created successfully!");
    navigate("/dashboard");

  } catch (err) {
    toast.error(err.response?.data?.error || "Registration failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-indigo-900 via-slate-900 to-black px-4">

      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20
                      rounded-3xl shadow-2xl p-10 text-white my-10">

        <h2 className="text-4xl font-extrabold text-center mb-2">
          Create Account 🚀
        </h2>
        <p className="text-center text-white/60 mb-10">
          Join and predict smarter with AI insights
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="grid md:grid-cols-2 gap-10">

            {/* LEFT SIDE — PERSONAL */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-indigo-300">
                Personal Info
              </h3>

              <div>
                <input
                  {...register("name")}
                  placeholder="Full Name"
                  className="input-style"
                />
                {errors.name && <p className="error">{errors.name.message}</p>}
              </div>

              <div>
                <input
                  {...register("email")}
                  placeholder="Email Address"
                  className="input-style"
                />
                {errors.email && <p className="error">{errors.email.message}</p>}
              </div>

              <div>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className="input-style"
                />
                {errors.password && <p className="error">{errors.password.message}</p>}
              </div>
            </div>

            {/* RIGHT SIDE — BUSINESS */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-purple-300">
                Business Info
              </h3>

              <div>
                <input
                  {...register("company_name")}
                  placeholder="Company Name"
                  className="input-style"
                />
                {errors.company_name && <p className="error">{errors.company_name.message}</p>}
              </div>

              <div>
                <input
                  {...register("industry_type")}
                  placeholder="Industry (Tech, Retail, SaaS...)"
                  className="input-style"
                />
                {errors.industry_type && <p className="error">{errors.industry_type.message}</p>}
              </div>

              <div>
                <input
                  {...register("company_stage")}
                  placeholder="Startup Stage (Idea, Early, Growth...)"
                  className="input-style"
                />
                {errors.company_stage && <p className="error">{errors.company_stage.message}</p>}
              </div>

              <div>
                <input
                  type="number"
                  {...register("annual_turnover", { valueAsNumber: true })}
                  placeholder="Annual Turnover (₹)"
                  className="input-style"
                />
                {errors.annual_turnover && <p className="error">{errors.annual_turnover.message}</p>}
              </div>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full mt-10 bg-gradient-to-r from-green-500 to-emerald-600
                       py-4 rounded-xl text-lg font-semibold hover:scale-[1.02] transition"
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>

          <p className="text-center mt-6 text-sm text-white/70">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* STYLES */}
      <style>{`
        .input-style {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 12px 16px;
          border-radius: 10px;
          outline: none;
          transition: 0.2s;
        }
        .input-style:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99,102,241,0.3);
        }
        .error {
          color: #f87171;
          font-size: 13px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
