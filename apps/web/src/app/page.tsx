import { Button } from '@/components/ui/Button';

/*
  Foundation landing page.

  Its only job in Iteration 0 is to prove the scaffold renders and the design
  tokens work. It is intentionally minimal and contains NO application logic.
  The call-to-action buttons point at /register and /login, which are
  implemented in Iteration 1 (Authentication).

  HCI applied even here: a single clear headline (visual hierarchy), a short
  supporting line (minimalist), and exactly two next steps (Hick's Law — few,
  obvious choices).
*/
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-md bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
        HomeFixr
      </span>

      <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
        Connecting homeowners with trusted professionals
      </h1>

      <p className="mt-4 max-w-xl text-base text-neutral-600">
        Post a home maintenance job, receive competitive bids from verified
        providers, and hire with confidence.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/register" variant="primary">
          Get started
        </Button>
        <Button href="/login" variant="secondary">
          Sign in
        </Button>
      </div>
    </main>
  );
}
