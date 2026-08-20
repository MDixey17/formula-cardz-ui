import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthShell } from '@/components/AuthShell';
import { ErrorBox } from '@/pages/auth/LoginPage';
import { api, ApiError } from '@/lib/api';
import { Spinner } from '@/components/ui';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      // Per PRD: avoid exposing whether email is registered.
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We'll send a reset link to your email."
      footer={
        <p className="text-carbon-500">
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-racing-600">
            Back to log in
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-4 text-sm text-emerald-800">
          If an account exists for <strong>{email}</strong>, a reset link is on
          its way. Check your inbox and spam folder.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="fp-email" className="label">
              Email
            </label>
            <input
              id="fp-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoCapitalize="none"
            />
          </div>
          {error && <ErrorBox message={error} />}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-2.5"
          >
            {submitting ? <Spinner className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
