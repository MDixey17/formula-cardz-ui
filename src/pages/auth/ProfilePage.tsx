import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Check, Trash2, X, UserCircle2, Crown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { ErrorBox } from '@/pages/auth/LoginPage';
import { Spinner } from '@/components/ui';
import type { UserProfile } from '@/types';

export function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [drivers, setDrivers] = useState<string[]>(user?.favoriteDrivers ?? []);
  const [constructors, setConstructors] = useState<string[]>(
    user?.favoriteConstructors ?? []
  );
  const [driverInput, setDriverInput] = useState('');
  const [constructorInput, setConstructorInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    (async () => {
      try {
        const p = await api.getUser(user.id);
        if (!active) return;
        setProfile(p);
        setUsername(p.username ?? user.username);
        setEmail(p.email ?? user.email);
        setDrivers(p.favoriteDrivers ?? []);
        setConstructors(p.favoriteConstructors ?? []);
      } catch {
        // ignore, keep auth values
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const save = async () => {
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await api.updateUser(user.id, {
        username,
        email,
        favoriteDrivers: drivers,
        favoriteConstructors: constructors,
      });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not save profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.deleteUser(user.id);
      logout();
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not delete account.'
      );
      setDeleting(false);
    }
  };

  const addTag = (v: string, list: string[], set: (v: string[]) => void) => {
    const t = v.trim();
    if (!t || list.includes(t)) return;
    set([...list, t]);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-6 md:py-10">
      <h1 className="font-display text-3xl font-extrabold text-carbon-950 mb-6 dark:text-white">
        Profile
      </h1>

      <div className="card p-5 md:p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="grid place-items-center h-16 w-16 rounded-full bg-carbon-100 text-carbon-400 dark:bg-carbon-800 dark:text-carbon-500">
            <UserCircle2 className="h-8 w-8" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-carbon-950 dark:text-white">
              {user.username}
            </p>
            <p className="text-sm text-carbon-500 dark:text-carbon-400">{user.email}</p>
            {user.hasPremium && (
              <span className="badge bg-amber-100 text-amber-800 mt-1">
                <Crown className="h-3 w-3" /> Premium
              </span>
            )}
          </div>
          {profile?.createdAt && (
            <p className="ml-auto text-xs text-carbon-400 text-right dark:text-carbon-500">
              Joined
              <br />
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="card p-5 md:p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-carbon-950 dark:text-white">
          Edit profile
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="p-username" className="label">
              Username
            </label>
            <input
              id="p-username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="p-email" className="label">
              Email
            </label>
            <input
              id="p-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
            />
          </div>
        </div>

        <TagField
          id="p-drivers"
          label="Favorite drivers"
          placeholder="Add a driver"
          values={drivers}
          input={driverInput}
          setInput={setDriverInput}
          onAdd={() =>
            addTag(driverInput, drivers, (v) => {
              setDrivers(v);
              setDriverInput('');
            })
          }
          onRemove={(i) => setDrivers(drivers.filter((_, j) => j !== i))}
        />
        <TagField
          id="p-constructors"
          label="Favorite constructors"
          placeholder="Add a constructor"
          values={constructors}
          input={constructorInput}
          setInput={setConstructorInput}
          onAdd={() =>
            addTag(constructorInput, constructors, (v) => {
              setConstructors(v);
              setConstructorInput('');
            })
          }
          onRemove={(i) =>
            setConstructors(constructors.filter((_, j) => j !== i))
          }
        />

        {error && <ErrorBox message={error} />}
        {success && (
          <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700 flex items-center gap-2">
            <Check className="h-4 w-4" /> Profile saved.
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={save}
            disabled={saving}
            className="btn-primary px-5 py-2.5"
          >
            {saving ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </div>

      <div className="card p-5 md:p-6 mt-6 border-redline-200 dark:border-redline-900">
        <h2 className="font-display text-lg font-bold text-redline-700">
          Delete account
        </h2>
        <p className="text-sm text-carbon-500 mt-1 dark:text-carbon-400">
          Permanently delete your account and collection data. This cannot be
          undone.
        </p>
        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="btn-danger mt-3 px-4 py-2 text-sm"
          >
            <Trash2 className="h-4 w-4" /> Delete my account
          </button>
        ) : (
          <div className="mt-4 rounded-xl bg-redline-50 border border-redline-200 p-4 space-y-3 animate-fade-in">
            <p className="text-sm font-semibold text-redline-800">
              Type <span className="font-mono">DELETE</span> to confirm.
            </p>
            <input
              className="input"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
            />
            <div className="flex gap-2">
              <button
                onClick={deleteAccount}
                disabled={deleting || deleteConfirm !== 'DELETE'}
                className="btn-danger px-4 py-2 text-sm"
              >
                {deleting ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                Confirm deletion
              </button>
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeleteConfirm('');
                }}
                className="btn-outline px-4 py-2 text-sm"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TagField({
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
        <button type="button" onClick={onAdd} className="btn-outline px-3 shrink-0">
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
