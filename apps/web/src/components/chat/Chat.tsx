'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { apiGet, apiPost } from '@/lib/api';
import { getSocket } from '@/lib/socketClient';
import type { Message } from '@/lib/types';

/*
  One-to-one job chat (FR-20).

  HCI applied:
   - Own vs other messages are visually distinct (alignment + colour) so the
     conversation reads naturally (Gestalt, recognition).
   - Auto-scrolls to the latest message (visibility of system status).
   - Clear empty state and a "chat opens after hiring" state.
   - Real-time: messages arrive over Socket.io without refreshing.
*/
type Conversation = {
  available: boolean;
  otherParty: { id: string; name: string } | null;
  messages: Message[];
};

export function Chat({ jobId, meId }: { jobId: string; meId: string }) {
  const [conv, setConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Append a message unless we already have it (dedupe REST + socket).
  function addMessage(message: Message) {
    setConv((prev) =>
      prev && !prev.messages.some((m) => m.id === message.id)
        ? { ...prev, messages: [...prev.messages, message] }
        : prev,
    );
  }

  useEffect(() => {
    let active = true;
    apiGet<Conversation>(`/jobs/${jobId}/messages`)
      .then((data) => {
        if (active) setConv(data);
      })
      .catch(() => {
        if (active) setHidden(true); // 403: not a participant
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [jobId]);

  useEffect(() => {
    if (!conv?.available) return;
    const socket = getSocket();
    socket.emit('chat:join', jobId);
    const onMessage = (message: Message) => {
      if (message.jobId === jobId) addMessage(message);
    };
    socket.on('chat:message', onMessage);
    return () => {
      socket.off('chat:message', onMessage);
    };
  }, [conv?.available, jobId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.messages.length]);

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const { message } = await apiPost<{ message: Message }>(`/jobs/${jobId}/messages`, {
        body: text.trim(),
      });
      setText('');
      addMessage(message);
    } finally {
      setSending(false);
    }
  }

  if (hidden) return null;
  if (loading) return <p className="text-sm text-neutral-600">Loading chat…</p>;
  if (!conv) return null;

  if (!conv.available) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">
        Chat opens once a provider is hired.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-neutral-900">
        Chat with {conv.otherParty?.name}
      </h2>

      <div className="mt-4 flex max-h-80 flex-col gap-2 overflow-y-auto">
        {conv.messages.length === 0 && (
          <p className="text-sm text-neutral-600">No messages yet. Say hello!</p>
        )}
        {conv.messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${
              m.senderId === meId
                ? 'self-end bg-primary-600 text-white'
                : 'self-start border border-neutral-200 bg-neutral-50 text-neutral-900'
            }`}
          >
            {m.body}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          aria-label="Message"
          className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-600 focus:border-primary-600"
        />
        <Button type="submit" loading={sending}>Send</Button>
      </form>
    </div>
  );
}
