import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokenFromGoogle } = useAuth() as any;
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      if (typeof setTokenFromGoogle === 'function') {
        setTokenFromGoogle(token).then(() => {
          navigate('/dashboard', { replace: true });
        }).catch(() => {
          navigate('/login?error=InvalidToken', { replace: true });
        });
      } else {
        // Fallback if setTokenFromGoogle is not yet implemented natively in AuthContext
        localStorage.setItem('auth_token', token);
        // Force a window reload to let AuthContext initialize with the new token
        window.location.href = '/dashboard';
      }
    } else {
      navigate('/login?error=NoTokenProvided', { replace: true });
    }
  }, [location, navigate, setTokenFromGoogle]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-alt">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-text-muted font-medium">Authenticating with Google...</p>
    </div>
  );
}
