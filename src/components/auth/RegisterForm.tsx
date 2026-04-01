'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!username.trim()) next.username = 'Username is required';
    else if (username.trim().length < 3) next.username = 'At least 3 characters';
    if (!email.trim()) next.email = 'Email is required';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'At least 6 characters';
    if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      const { token, user } = res.data.data ?? res.data;
      setAuth(user, token);
      toast.success(`Welcome, ${user.username}! Account created.`);
      router.push('/lobby');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto" padding="lg">
      <h1 className="text-3xl font-bold font-heading text-center text-[var(--color-text)] mb-6">
        Create Account
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Username"
          placeholder="Pick a fun name"
          icon={<User size={18} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          icon={<Lock size={18} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          icon={<Lock size={18} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Register
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
          Log In
        </Link>
      </p>
    </Card>
  );
}
