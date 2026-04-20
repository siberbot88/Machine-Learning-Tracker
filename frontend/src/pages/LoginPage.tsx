import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Loader2, Code2, Rocket, Cpu } from 'lucide-react';

export default function LoginPage() {
  const [isLoginState, setIsLoginState] = useState(true);
  const [email, setEmail] = useState('admin@roadmap.test');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Simple parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position relative to center of screen (-1 to +1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginState) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        // Implement signup action here later. For now, simulate success:
        await new Promise((r) => setTimeout(r, 1000));
        await login(email, password); // Mock fallback to login API for demo
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface dark:bg-slate-950 overflow-hidden">
      {/* Left Panel - Branding/Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-center p-16 xl:p-24 perspective-1000">
        {/* Parallax Backgrounds */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-900 to-slate-900 transition-transform duration-700 ease-out"
          style={{ transform: `calc(${mousePos.x * -10}px) translateY(${mousePos.y * -10}px) scale(1.05)` }}
        />
        <div 
          className="absolute inset-0 opacity-20 transition-transform duration-700 ease-out" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '32px 32px',
            transform: `translateX(${mousePos.x * 20}px) translateY(${mousePos.y * 20}px) scale(1.05)` 
          }} 
        />

        {/* Decorative blobs */}
        <div 
          className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-primary/20 rounded-full mix-blend-screen filter blur-3xl translate-x-1/4 translate-y-1/4 animate-blob transition-transform duration-1000 ease-out" 
          style={{ transform: `translateX(calc(25% + ${mousePos.x * -30}px)) translateY(calc(25% + ${mousePos.y * -30}px))` }}
        />
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-3xl translate-x-1/3 -translate-y-1/3 animate-blob animation-delay-2000 transition-transform duration-1000 ease-out" 
          style={{ transform: `translateX(calc(33% + ${mousePos.x * 30}px)) translateY(calc(-33% + ${mousePos.y * 30}px))` }}
        />

        {/* Content */}
        <div 
          className="relative z-10 text-white max-w-lg transition-transform duration-500 ease-out animate-lazyFadeIn origin-left"
          style={{ transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)` }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-primary/30">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl xl:text-3xl font-extrabold mb-5 leading-snug tracking-tight">
            Structure your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              AI Learning Journey
            </span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-8 opacity-90">
            The complete 12-week roadmap tracking platform. Manage tasks, store submissions, and measure growth effectively.
          </p>

          <div className="flex flex-col gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center backdrop-blur-sm">
                <Code2 className="w-4 h-4 text-primary-400" />
              </div>
              <span>Code interactively</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center backdrop-blur-sm">
                <Rocket className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Accelerate your mastery</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center backdrop-blur-sm">
                <Cpu className="w-4 h-4 text-purple-400" />
              </div>
              <span>Connect complex ML models</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login/Register Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 bg-surface dark:bg-slate-950 z-10 shadow-2xl lg:shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="mx-auto w-full max-w-sm lg:w-96 animate-lazyFadeIn opacity-0 animation-delay-100">
          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-text">
              {isLoginState ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-xs text-text-muted mt-2">
              {isLoginState 
                ? 'Sign in to your account and resume your roadmap.' 
                : 'Sign up to begin your 12-week machine learning journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2 animate-fadeIn">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span> {error}
              </div>
            )}

            {!isLoginState && (
              <div className="animate-slideIn opacity-0">
                <label className="block text-xs font-medium text-text mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface-alt text-text text-sm focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="animate-slideIn opacity-0 animation-delay-100">
              <label className="block text-xs font-medium text-text mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface-alt text-text text-sm focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="admin@roadmap.test"
                required
              />
            </div>

            <div className="animate-slideIn opacity-0 animation-delay-100">
              <label className="block text-xs font-medium text-text mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface-alt text-text text-sm focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {isLoginState && (
              <div className="flex items-center justify-between pb-2 animate-slideIn opacity-0 animation-delay-300">
                <div className="flex items-center">
                  <input id="remember" type="checkbox" className="custom-checkbox w-4 h-4 rounded border-border text-primary" defaultChecked />
                  <label htmlFor="remember" className="ml-2 block text-xs text-text-muted cursor-pointer transition-colors hover:text-text">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 animate-slideIn opacity-0 animation-delay-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {isLoginState ? 'Authenticating...' : 'Creating account...'}
                </>
              ) : (
                isLoginState ? 'Sign In' : 'Sign Up'
              )}
            </button>

            <div className="relative flex items-center py-2 animate-slideIn opacity-0 animation-delay-300">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 px-4 text-xs text-text-muted">or</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:8000/api/auth/google/redirect');
                  const data = await response.json();
                  if (data.url) {
                    window.location.href = data.url;
                  }
                } catch (err) {
                  console.error('Google auth error', err);
                }
              }}
              className="w-full py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 shadow-sm animate-slideIn opacity-0 animation-delay-500"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          <div className="mt-6 text-center animate-slideIn opacity-0 animation-delay-500">
            <p className="text-xs text-text-muted">
              {isLoginState ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLoginState(!isLoginState)}
                className="font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer outline-none"
              >
                {isLoginState ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {isLoginState && (
            <div className="mt-8 pt-6 border-t border-border animate-slideIn opacity-0 animation-delay-500">
              <p className="text-[11px] text-text-muted text-center leading-relaxed">
                Demo credentials:<br />
                <code className="px-1.5 py-1 bg-surface-alt border border-border-light rounded font-mono text-text mt-1.5 inline-block">admin@roadmap.test</code> / <code className="px-1.5 py-1 bg-surface-alt border border-border-light rounded font-mono text-text mt-1.5 inline-block">password</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
