import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black">
      <Navbar />

      {/* Content area below fixed navbar */}
      <main className="pt-28">
        {children}
      </main>
    </div>
  );
}