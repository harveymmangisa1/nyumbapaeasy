import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface ProfileForm {
  username?: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  role?: 'user' | 'landlord' | 'admin' | 'real_estate_agency';
  is_verified?: boolean;
  has_pending_verification?: boolean;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState<ProfileForm>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setForm({
          username: data.username ?? '',
          name: data.name ?? '',
          full_name: data.full_name ?? '',
          avatar_url: data.avatar_url ?? '',
          website: data.website ?? '',
          role: data.role,
          is_verified: data.is_verified,
          has_pending_verification: data.has_pending_verification,
        });
      }
    };
    load();
  }, [user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus(null);

    const updatePayload: any = { ...form };
    // role / verification should only be editable by admin; lock these if not admin
    const isAdmin = user?.profile?.role === 'admin';
    if (!isAdmin) {
      delete updatePayload.role;
      delete updatePayload.is_verified;
      delete updatePayload.has_pending_verification;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id);

    setSaving(false);
    setStatus(error ? `Save failed: ${error.message}` : 'Saved successfully');
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">Please sign in to view your profile.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="mb-4 text-sm text-gray-600">
        <div>User ID: {user.id}</div>
        <div>Email: {user.email}</div>
        <div>Role: {user.profile?.role}</div>
        <div>Verified: {user.profile?.is_verified ? 'Yes' : 'No'}</div>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input name="username" value={form.username ?? ''} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input name="name" value={form.name ?? ''} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input name="full_name" value={form.full_name ?? ''} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Website</label>
          <input name="website" value={form.website ?? ''} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Avatar URL</label>
          <input name="avatar_url" value={form.avatar_url ?? ''} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>

        {/* Admin-only controls */}
        {user.profile?.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded">
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select name="role" value={form.role ?? 'user'} onChange={onChange} className="w-full border rounded px-3 py-2">
                <option value="user">User</option>
                <option value="landlord">Landlord</option>
                <option value="real_estate_agency">Real Estate Agency</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_verified" checked={!!form.is_verified} onChange={onChange} />
              <label>Is Verified</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="has_pending_verification" checked={!!form.has_pending_verification} onChange={onChange} />
              <label>Has Pending Verification</label>
            </div>
          </div>
        )}

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? 'Saving...' : 'Save'}
        </button>
        {status && <div className="text-sm mt-2">{status}</div>}
      </form>
    </div>
  );
}
