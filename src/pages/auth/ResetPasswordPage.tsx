import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { AuthShell } from '@/components/AuthShell';
import { ErrorBox } from '@/pages/auth/LoginPage';
import { api, ApiError } from '@/lib/api';
import { Spinner } from '@/components/ui';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const id = params.get('id') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missingToken = !token || !id;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await api.resetPassword({ id, token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not reset password. The link may have expired.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (missingToken) {
    return (
      <AuthShell title="Reset password">
        <ErrorBox message="This reset link is missing required information. Use the link from your email, or request a new one." />
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="font-semibold text-racing-600 text-sm">
            Request a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={
        <p className="text-carbon-500">
          <Link to="/login" className="font-semibold text-racing-600">
            Back to log in
          </Link>
        </p>
      }
    >
      {done ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-4 text-sm text-emerald-800">
          Your password has been reset. You can now{' '}
          <Link to="/login" className="font-semibold underline">
            log in
          </Link>
          .
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="rp-password" className="label">
              New password
            </label>
            <input
              id="rp-password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="rp-confirm" className="label">
              Confirm password
            </label>
            <input
              id="rp-confirm"
              type="password"
              className="input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error && <ErrorBox message={error} />}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-2.5"
          >
            {submitting ? <Spinner className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
            Reset password
          </button>
        </form>
      )}
    </AuthShell>
  );
}
