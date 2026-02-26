import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      reset();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-indigo-900 via-slate-900 to-black px-4">

      {/* GLOW */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />

      {/* CARD */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-md
                   bg-white/10 backdrop-blur-xl border border-white/20
                   rounded-2xl shadow-2xl p-8 space-y-5 text-white"
      >
        <h2 className="text-3xl font-extrabold text-center">
          Welcome Back 👋
        </h2>
        <p className="text-center text-white/70 text-sm">
          Login to continue
        </p>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full bg-white/10 border border-white/20
                       px-4 py-3 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full bg-white/10 border border-white/20
                       px-4 py-3 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600
                     py-3 rounded-xl font-semibold
                     hover:scale-[1.02] transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-white/80">
          No account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
