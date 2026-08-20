import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, X } from 'lucide-react';
import { AuthShell } from '@/components/AuthShell';
import { ErrorBox } from '@/pages/auth/LoginPage';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Spinner } from '@/components/ui';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [drivers, setDrivers] = useState<string[]>([]);
  const [constructors, setConstructors] = useState<string[]>([]);
  const [driverInput, setDriverInput] = useState('');
  const [constructorInput, setConstructorInput] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addTag = (
    value: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    const v = value.trim();
    if (!v || list.includes(v)) return;
    setter([...list, v]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) return setError('Username is required.');
    if (!email.trim() || !email.includes('@'))
      return setError('A valid email is required.');
    if (password.length < 6)
      return setError('Password must be at least 6 characters.');
    if (drivers.length === 0)
      return setError('Add at least one favorite driver.');

    setSubmitting(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        favoriteDrivers: drivers,
        favoriteConstructors: constructors,
        ...(profileImageUrl.trim() ? { profileImageUrl: profileImageUrl.trim() } : {}),
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Registration failed. Try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking your Formula 1 card collection."
      footer={
        <p className="text-carbon-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-racing-600">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="reg-username" className="label">
            Username
          </label>
          <input
            id="reg-username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="reg-email" className="label">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoCapitalize="none"
          />
        </div>
        <div>
          <label htmlFor="reg-password" className="label">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <TagInput
          id="fav-drivers"
          label="Favorite drivers"
          placeholder="e.g. Lando Norris"
          values={drivers}
          onAdd={() => {
            addTag(driverInput, drivers, (v) => {
              setDrivers(v);
              setDriverInput('');
            });
          }}
          input={driverInput}
          setInput={setDriverInput}
          onRemove={(i) => setDrivers(drivers.filter((_, j) => j !== i))}
        />

        <TagInput
          id="fav-constructors"
          label="Favorite constructors (optional)"
          placeholder="e.g. McLaren"
          values={constructors}
          onAdd={() => {
            addTag(constructorInput, constructors, (v) => {
              setConstructors(v);
              setConstructorInput('');
            });
          }}
          input={constructorInput}
          setInput={setConstructorInput}
          onRemove={(i) =>
            setConstructors(constructors.filter((_, j) => j !== i))
          }
        />

        <div>
          <label htmlFor="profile-url" className="label">
            Profile image URL (optional)
          </label>
          <input
            id="profile-url"
            type="url"
            className="input"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>

        {error && <ErrorBox message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-2.5"
        >
          {submitting ? <Spinner className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          Create account
        </button>
      </form>
    </AuthShell>
  );
}

function TagInput({
  id,
  label,
  placeholder,
  values,
  input,
  setInput,
  onAdd,
  onRemove,
}: {
  id: string;
  label: string;
  placeholder?: string;
  values: string[];
  input: string;
  setInput: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onAdd}
          className="btn-outline px-3 shrink-0"
        >
          Add
        </button>
      </div>
      {values.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <li
              key={v}
              className="chip bg-racing-50 text-racing-700 border border-racing-100"
            >
              {v}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-racing-400 hover:text-redline-600"
                aria-label={`Remove ${v}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
