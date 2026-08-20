import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { AuthShell } from '@/components/AuthShell';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Spinner } from '@/components/ui';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError('Enter your email or username and your password.');
      return;
    }
    setSubmitting(true);
    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail
        ? { email: identifier, password }
        : { email: identifier, password, username: identifier };
      await login(payload.email, password, payload.username);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Login failed. Try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Log in"
      subtitle="Access your collection and 1/1 tracking."
      footer={
        <p className="text-carbon-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-racing-600">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="identifier" className="label">
            Email or username
          </label>
          <input
            id="identifier"
            className="input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <ErrorBox message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-2.5"
        >
          {submitting ? <Spinner className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
          Log in
        </button>

        <div className="flex justify-between text-xs">
          <Link
            to="/forgot-password"
            className="font-semibold text-carbon-500 hover:text-racing-600"
          >
            Forgot password?
          </Link>
          <Link
            to="/register"
            className="font-semibold text-racing-600"
          >
            Register
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg bg-redline-50 border border-redline-200 px-3 py-2 text-sm text-redline-700"
    >
      {message}
    </p>
  );
}
