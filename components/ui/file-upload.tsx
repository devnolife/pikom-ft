'use client';

import * as React from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type FileUploadProps = {
  value?: string | null;
  onChange: (url: string | null) => void;
  kategori: 'surat' | 'aturan' | 'nota' | 'umum';
  accept?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export function FileUpload({
  value,
  onChange,
  kategori,
  accept = 'image/*,application/pdf',
  disabled,
  className,
  label = 'Unggah file',
}: FileUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kategori', kategori);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Upload gagal' }));
        throw new Error(error || 'Upload gagal');
      }
      const data = await res.json();
      onChange(data.url);
      toast.success('File berhasil diunggah');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const isImage = value && /\.(png|jpe?g|webp|gif)$/i.test(value);
  const filename = value?.split('/').pop()?.replace(/^[0-9a-f-]{36}-/, '');

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-glass-overlay p-2.5">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={filename} className="h-12 w-12 rounded object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-bg-alt">
              <FileText size={18} className="text-fg-muted" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-medium hover:underline"
            >
              {filename}
            </a>
            <p className="text-[11px] text-fg-muted font-mono">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="rounded p-1.5 text-fg-muted hover:bg-bg-alt hover:text-destructive"
            aria-label="Hapus file"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-glass-overlay py-4 text-sm text-fg-secondary transition hover:border-accent hover:text-fg',
            (disabled || uploading) && 'pointer-events-none opacity-50'
          )}
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span>{uploading ? 'Mengunggah…' : label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <p className="text-[10px] text-fg-muted font-mono">Maks 5 MB · PNG, JPG, WEBP, GIF, atau PDF</p>
    </div>
  );
}
