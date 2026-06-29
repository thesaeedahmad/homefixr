'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiGet, apiPatch } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';

/*
  Profile & Settings screen (FR-4, FR-31).

  HCI applied:
   - Guards itself: if there is no token, redirect to /login (User control).
   - Loading state while fetching (Visibility of system status).
   - Separate, clearly-labelled sections for Profile and Password (chunking,
     Gestalt grouping) so the two tasks don't blur together.
   - Inline success and error messages for each form (Help users recover;
     dialog closure / feedback).
*/
type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');

  // Password form state
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<{ user: Profile }>('/users/me')
      .then((data) => setProfile(data.user))
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    setSavingProfile(true);
    const form = new FormData(event.currentTarget);
    try {
      const data = await apiPatch<{ user: Profile }>('/users/me', {
        name: form.get('name'),
        phone: form.get('phone') || undefined,
        location: form.get('location') || undefined,
      });
      setProfile(data.user);
      setProfileMsg('Profile updated.');
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');
    setSavingPassword(true);
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    try {
      await apiPatch('/users/me/password', {
        currentPassword: form.get('currentPassword'),
        newPassword: form.get('newPassword'),
      });
      setPasswordMsg('Password changed.');
      formEl.reset();
    } catch (err) {
      setPasswordErr(err instanceof Error ? err.message : 'Could not change password');
    } finally {
      setSavingPassword(false);
    }
  }

  function handleLogout() {
    clearToken();
    router.replace('/login');
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <p className="text-sm text-neutral-600">Loading your settings…</p>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>
        <Button variant="secondary" onClick={handleLogout}>Sign out</Button>
      </div>
      <p className="mt-1 text-sm text-neutral-600">
        {profile.email} · {profile.role.toLowerCase()}
      </p>

      <section className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Profile</h2>
        <form onSubmit={handleProfileSave} className="mt-4 flex flex-col gap-4">
          <Input label="Full name" name="name" defaultValue={profile.name} required />
          <Input label="Phone" name="phone" defaultValue={profile.phone ?? ''} placeholder="Optional" />
          <Input
            label="Location"
            name="location"
            defaultValue={profile.location ?? ''}
            placeholder="Optional"
          />
          {profileErr && (
            <p role="alert" className="text-sm text-danger-600">{profileErr}</p>
          )}
          {profileMsg && (
            <p role="status" className="text-sm text-success-600">{profileMsg}</p>
          )}
          <Button type="submit" loading={savingProfile}>Save changes</Button>
        </form>
      </section>

      <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Change password</h2>
        <form onSubmit={handlePasswordChange} className="mt-4 flex flex-col gap-4">
          <Input
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
          <Input
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          {passwordErr && (
            <p role="alert" className="text-sm text-danger-600">{passwordErr}</p>
          )}
          {passwordMsg && (
            <p role="status" className="text-sm text-success-600">{passwordMsg}</p>
          )}
          <Button type="submit" loading={savingPassword}>Update password</Button>
        </form>
      </section>
    </main>
  );
}
