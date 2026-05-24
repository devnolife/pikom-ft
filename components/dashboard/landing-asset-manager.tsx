'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload, Trash2, Loader2, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SlotState {
  key: string;
  label: string;
  group: string;
  aspect: 'wide' | 'portrait' | 'square';
  url: string | null;
  alt: string | null;
}

interface LandingAssetManagerProps {
  initial: SlotState[];
  groups: string[];
}

const aspectClass: Record<SlotState['aspect'], string> = {
  wide: 'aspect-[16/9]',
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
};

export function LandingAssetManager({ initial, groups }: LandingAssetManagerProps) {
  const [slots, setSlots] = useState<SlotState[]>(initial);
  const [filter, setFilter] = useState<string>('Semua');

  const visible = useMemo(
    () => (filter === 'Semua' ? slots : slots.filter((s) => s.group === filter)),
    [filter, slots]
  );

  const update = (key: string, patch: Partial<SlotState>) => {
    setSlots((prev) => prev.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  };

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {['Semua', ...groups].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setFilter(g)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-colors',
              filter === g
                ? 'bg-accent text-[color:var(--color-selection-text)] border-accent'
                : 'glass border-border hover:bg-white/5'
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {visible.map((slot) => (
          <SlotCard key={slot.key} slot={slot} onUpdate={update} />
        ))}
      </div>
    </div>
  );
}

function SlotCard({
  slot,
  onUpdate,
}: {
  slot: SlotState;
  onUpdate: (key: string, patch: Partial<SlotState>) => void;
}) {
  const [busy, setBusy] = useState<'upload' | 'delete' | null>(null);
  const [altDraft, setAltDraft] = useState(slot.alt ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setBusy('upload');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('key', slot.key);
    if (altDraft.trim()) fd.append('alt', altDraft.trim());

    try {
      const res = await fetch('/api/admin/landing-assets', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Upload gagal');
        return;
      }
      onUpdate(slot.key, { url: data.asset.url, alt: data.asset.alt });
      toast.success('Berhasil di-upload');
    } catch {
      toast.error('Jaringan error');
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus gambar untuk ${slot.label}?`)) return;
    setBusy('delete');
    try {
      const res = await fetch(
        `/api/admin/landing-assets?key=${encodeURIComponent(slot.key)}`,
        { method: 'DELETE' }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Gagal menghapus');
        return;
      }
      onUpdate(slot.key, { url: null, alt: null });
      setAltDraft('');
      toast.success('Dihapus');
    } catch {
      toast.error('Jaringan error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col">
      <div className={cn('relative bg-surface', aspectClass[slot.aspect])}>
        {slot.url ? (
          <Image
            src={slot.url}
            alt={slot.alt || slot.label}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-fg-muted">
            <ImageOff size={24} aria-hidden="true" className="opacity-50" />
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] opacity-70">
              Belum ada
            </p>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
            {slot.group}
          </p>
          <h3 className="text-sm font-bold leading-tight mt-1">{slot.label}</h3>
          <p className="text-[11px] font-mono text-fg-muted mt-1 break-all">
            {slot.key}
          </p>
        </div>

        <Input
          value={altDraft}
          onChange={(e) => setAltDraft(e.target.value)}
          placeholder="Alt text (opsional)"
          className="text-xs"
          disabled={busy !== null}
        />

        <div className="flex gap-2 mt-auto">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={busy !== null}
            className="flex-1"
          >
            {busy === 'upload' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {slot.url ? 'Ganti' : 'Upload'}
          </Button>
          {slot.url && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={busy !== null}
            >
              {busy === 'delete' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
