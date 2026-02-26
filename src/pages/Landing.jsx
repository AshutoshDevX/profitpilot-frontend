import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.svg";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      {/* Glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Predict Startup Profits<br />with AI Intelligence
          </h1>

          <p className="text-lg text-white/90 mb-8">
           Helps entrepreneurs and analysts forecast startup profits
            using machine learning models and interactive analytics dashboards.
          </p>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold shadow hover:scale-105 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Get Started
            </Link>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center"
        >
          <img
            src={heroImg}
            alt="AI Analytics"
            className="max-w-md w-full drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* FEATURES SECTION */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">

        {[
          {
            title: "Machine Learning Models",
            desc: "Predict profits using Linear Regression and Random Forest algorithms.",
          },
          {
            title: "Interactive Dashboards",
            desc: "Visualize predictions, trends, and historical performance.",
          },
          {
            title: "Secure & Scalable",
            desc: "JWT authentication with role-ready backend architecture.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-white shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-white/90">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


