'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiGet, apiUpload } from '@/lib/api';
import { getToken } from '@/lib/auth';

/*
  Provider identity verification (FR-5, FR-7).

  HCI applied:
   - Current status is always visible as a badge (Visibility of system status).
   - Plain guidance sets expectations ("An admin reviews documents…").
   - Upload form hidden once APPROVED (no needless action; minimalist).
   - Loading + success + error states on submit.
*/
type Status = 'PENDING' | 'APPROVED' | 'REJECTED';
type Verification = { verificationStatus: Status; documents: { id: string; type: string }[] } | null;

const STATUS_TONE: Record<Status, 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
};
const STATUS_LABEL: Record<Status, string> = {
  PENDING: 'Pending review',
  APPROVED: 'Verified',
  REJECTED: 'Rejected',
};

export default function VerificationPage() {
  const router = useRouter();
  const [verification, setVerification] = useState<Verification>(null);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function load() {
    apiGet<{ verification: Verification }>('/verification/me')
      .then((data) => setVerification(data.verification))
      .catch((err) => setAccessError(err instanceof Error ? err.message : 'Unable to load'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      const data = await apiUpload<{ verification: Verification }>('/verification', formData);
      setVerification(data.verification);
      setMessage('Documents submitted. An admin will review them shortly.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <p className="text-sm text-neutral-600">Loading verification status…</p>
      </main>
    );
  }

  if (accessError) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-neutral-900">Verification</h1>
        <p className="mt-2 text-sm text-danger-600">{accessError}</p>
      </main>
    );
  }

  const status = verification?.verificationStatus;
  const isApproved = status === 'APPROVED';

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">Identity verification</h1>
        {status && <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>}
        {!status && <Badge tone="neutral">Not submitted</Badge>}
      </div>
      <p className="mt-2 text-sm text-neutral-600">
        Verified providers earn a trust badge shown to customers. An admin reviews
        documents, usually within 24 hours.
      </p>

      {isApproved ? (
        <div className="mt-8 rounded-lg border border-success-600/30 bg-success-600/10 p-6">
          <p className="text-sm font-medium text-success-600">
            Your identity is verified. Customers will see your trust badge.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-5 rounded-lg border border-neutral-200 bg-white p-6"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="idDocument" className="text-sm font-medium text-neutral-900">
              ID document (image)
            </label>
            <input
              id="idDocument"
              name="idDocument"
              type="file"
              accept="image/*"
              required
              className="text-sm text-neutral-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="licenseDocument" className="text-sm font-medium text-neutral-900">
              Trade license (image)
            </label>
            <input
              id="licenseDocument"
              name="licenseDocument"
              type="file"
              accept="image/*"
              required
              className="text-sm text-neutral-600"
            />
          </div>

          {error && <p role="alert" className="text-sm text-danger-600">{error}</p>}
          {message && <p role="status" className="text-sm text-success-600">{message}</p>}

          <Button type="submit" loading={submitting}>
            {status === 'REJECTED' ? 'Resubmit documents' : 'Submit for review'}
          </Button>
        </form>
      )}
    </main>
  );
}
