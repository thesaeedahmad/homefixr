/**
 * Shared front-end types. The REST API is the source of truth for these shapes
 * (see docs/02-design/api.md); we mirror the parts the UI needs here.
 */
export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export type Job = {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  budgetHint: number | null;
  status: JobStatus;
  photos: string[];
  createdAt: string;
  customer?: { id: string; name: string };
};

export type Review = {
  id: string;
  jobId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export type PaymentStatus = 'HELD' | 'RELEASED' | 'REFUNDED';

export type Payment = {
  id: string;
  jobId: string;
  bidId: string;
  amount: number;
  status: PaymentStatus;
  workMarkedDoneAt: string | null;
  heldAt: string;
  releasedAt: string | null;
};

export type Message = {
  id: string;
  jobId: string;
  senderId: string;
  receiverId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
};

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type Bid = {
  id: string;
  hourlyRate: number;
  estimatedHours: number;
  equipmentCost: number;
  totalAmount: number;
  message: string | null;
  status: BidStatus;
  createdAt: string;
  provider?: {
    id: string;
    name: string;
    isVerified: boolean;
    providerProfile?: { ratingAvg: number; ratingCount: number } | null;
  };
  job?: { id: string; title: string; status: JobStatus };
};
