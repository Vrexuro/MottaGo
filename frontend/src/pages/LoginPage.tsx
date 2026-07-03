import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { AuthCard } from '../components/organisms/AuthCard';
import { AuthLayout } from '../layouts/AuthLayout';
import { TextInput } from '../components/atoms/TextInput';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { supabase } from '../lib/supabase';
import { ROUTES } from '../router/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const syntheticEmail = `${username.trim().toLowerCase()}@mottago.internal`;

    const { error } = await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      navigate(ROUTES.ROOT);
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-text-primary">Masuk ke Akun Anda</h1>
          <p className="mt-1 text-sm text-text-secondary">Masuk untuk melanjutkan ke MottaGo</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField label="Username" htmlFor="username" required>
            <TextInput
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username Anda"
              autoComplete="username"
              required
              disabled={loading}
            />
          </FormField>

          <FormField label="Password" htmlFor="password" required>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </FormField>

          {errorMessage && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-md bg-error-bg border border-error-border px-3 py-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-error-text" />
              <p className="text-sm text-error-text">{errorMessage}</p>
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full mt-2">
            Masuk
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
