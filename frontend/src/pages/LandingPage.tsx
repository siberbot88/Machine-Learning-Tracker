import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Target, Map, BookOpen, Layers, CheckCircle2, ArrowRight, Code } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // If user is already logged in, redirect to the app dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary-main selection:text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors animate-slideIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary-main/30">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Siberbot
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all shadow-sm shadow-primary/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden perspective-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Decorative shapes with parallax */}
          <div
            className="absolute top-0 -left-10 w-72 h-72 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob transition-transform duration-1000 ease-out"
            style={{ transform: `translate(calc(-10% + ${mousePos.x * -20}px), calc(-10% + ${mousePos.y * -20}px))` }}
          />
          <div
            className="absolute top-0 -right-10 w-72 h-72 bg-primary-main/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 transition-transform duration-1000 ease-out"
            style={{ transform: `translate(calc(10% + ${mousePos.x * 20}px), calc(-10% + ${mousePos.y * 20}px))` }}
          />
          <div
            className="absolute -bottom-10 left-20 w-72 h-72 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 transition-transform duration-1000 ease-out"
            style={{ transform: `translate(calc(10% + ${mousePos.x * -15}px), calc(10% + ${mousePos.y * 15}px))` }}
          />

          <div
            className="text-center relative z-10 max-w-3xl mx-auto transition-transform duration-500 ease-out"
            style={{ transform: `rotateY(${mousePos.x * 3}deg) rotateX(${mousePos.y * -3}deg)` }}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-tight mb-5 animate-lazyFadeIn">
              Master Machine Learning <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-emerald-500">
                One Week at a Time
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-9 leading-relaxed max-w-2xl mx-auto animate-lazyFadeIn opacity-0 animation-delay-100 mt-2">
              Siberbot is your intelligent learning companion, offering a precise 12-week roadmap application to structure your journey into AI, Deep Learning, and Data Science. Track submissions and conquer your goals efficiently.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-lazyFadeIn opacity-0 animation-delay-300">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 bg-primary text-white rounded-xl font-medium shadow-xl shadow-primary-main/25 hover:shadow-primary-main/40 hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
              >
                <Code className="w-5 h-5" /> View on GitHub
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 animate-slideIn">
            <h2 className="text-xs font-bold tracking-widest uppercase text-emerald-500 mb-3">Core Features</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Learn systematically</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all group animate-lazyFadeIn opacity-0 animation-delay-100">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/40 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                <Map className="w-6 h-6 text-primary-main font-bold dark:text-primary-light group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Structured Roadmap</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Follow a curated 12-week curriculum progressing from Python basics to advanced Neural Networks and MLOps.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-lg hover:-translate-y-1 transition-all group animate-lazyFadeIn opacity-0 animation-delay-300">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-500 transition-colors">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Task Management</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Break down weekly concepts into bite-sized tasks. Track statuses: Not Started, In Progress, Blocked, or Done.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:border-orange-500/40 hover:shadow-lg hover:-translate-y-1 transition-all group animate-lazyFadeIn opacity-0 animation-delay-500">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/40 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors">
                <Layers className="w-6 h-6 text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Submission Tracking</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload notebooks, repos, or PDFs. Save your answers right on the dashboard and keep a digital portfolio.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:border-purple-500/40 hover:shadow-lg hover:-translate-y-1 transition-all group animate-lazyFadeIn opacity-0 animation-delay-100">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/40 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-500 transition-colors">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Weekly Reflections</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Perform introspective weekly logs. Report difficulties, wins, and confidence levels to measure retention.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all group lg:col-span-2 animate-lazyFadeIn opacity-0 animation-delay-300">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">The edge over generic to-do apps</h4>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Accountability throughout 12 weeks.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Visibility of progression metrics & KPIs.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Personalized Theme & Localization.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Secure backend file & metadata storage.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            © {new Date().getFullYear()} Siberbot88. Engineered for consistency and long-term mastery.
          </p>
        </div>
      </footer>
    </div>
  );
}
