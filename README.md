# PIKOM FT — Pimpinan Komisariat IMM Fakultas Teknik

Website resmi Pimpinan Komisariat IMM Fakultas Teknik. Anggun dalam Moral, Unggul dalam Intelektual.

Stack: **Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS v4 · Auth.js v5 · Prisma + PostgreSQL · shadcn/ui**.

---

## ✨ Fitur Utama

- Landing page publik (`/`, `/bidang/[slug]`).
- Autentikasi NIM + password (Auth.js Credentials, JWT session).
- Dashboard berbasis role/jabatan: `ADMIN`, `PENGURUS` (Ketua Umum, Sekum, Bendum, Ketua/Anggota Bidang), dan `MAHASISWA`.
- Modul: Proker, Surat, Aturan (TOR/AD-ART/SOP), Transaksi, Kader, Progress.
- Upload lampiran dengan validasi MIME + ukuran (`/api/upload`).
- API healthcheck (`/api/health`) untuk liveness/readiness probe.

---

## 🚀 Quick Start (Local Development)

Prasyarat: **Node.js ≥ 20** dan **PostgreSQL** (lokal atau Neon/Supabase).

```bash
# 1. Install dependencies
npm install

# 2. Salin & isi environment
cp .env.example .env
# Edit DATABASE_URL dan AUTH_SECRET (openssl rand -base64 32)

# 3. Sinkronisasi schema + seed data awal
npm run db:push
npm run db:seed

# 4. Jalankan dev server
npm run dev
# → http://localhost:3077
```

### Akun seed (lihat `prisma/seed.ts`)

Cek file seed untuk kredensial default; **ganti semua password setelah deploy production**.

---

## 🧰 Skrip NPM

| Skrip                | Deskripsi                                              |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Dev server di port **3077**                            |
| `npm run build`      | `prisma generate` + production build                   |
| `npm start`          | Jalankan hasil build production                        |
| `npm run lint`       | ESLint                                                 |
| `npm run typecheck`  | TypeScript type-check (no emit)                        |
| `npm run db:push`    | Sinkronisasi schema (prototyping, **bukan untuk prod**) |
| `npm run db:migrate` | Buat migrasi dev (`prisma migrate dev`)                |
| `npm run db:deploy`  | Terapkan migrasi production (`prisma migrate deploy`)  |
| `npm run db:seed`    | Jalankan seed                                          |
| `npm run db:reset`   | Reset DB + seed ulang                                  |
| `npm run db:studio`  | Buka Prisma Studio                                     |

---

## 🏭 Production Deployment

### 1. Persiapan environment

Salin `.env.example` → `.env.production` di server, lalu isi:

```env
DATABASE_URL="postgresql://USER:PASS@HOST:5432/DB?schema=public&sslmode=require"
AUTH_SECRET="<openssl rand -base64 32>"
AUTH_URL="https://domainmu.id"
AUTH_TRUST_HOST="true"
NEXT_PUBLIC_SITE_URL="https://domainmu.id"
```

> Default port aplikasi adalah **3077** (dipilih agar tidak bentrok dengan port 3000/3001/3010-an yang sering dipakai dev server lain). Override dengan env `PORT=xxxx` atau flag `next start -p xxxx`.

### 2. Migrasi database (sekali per deploy)

```bash
npm ci
npx prisma migrate deploy
npm run build
npm start
```

> **Catatan:** gunakan `prisma migrate` (bukan `db push`) untuk production agar history schema tertelusur. Bila belum ada folder `prisma/migrations`, generate satu kali di dev: `npm run db:migrate -- --name init`.

### 3. Docker

```bash
docker build -t pikom-ft .
docker run -p 3077:3077 --env-file .env.production pikom-ft
```

Image menggunakan Next.js **standalone output**, multi-stage build, non-root user, dan healthcheck terhadap `/api/health`.

### 4. Vercel / Platform lain

- Set semua env di dashboard penyedia.
- Set build command: `npm run build`. Output adalah Next.js standar (standalone juga didukung Vercel tanpa konfigurasi tambahan).
- Tambahkan post-deploy step `npx prisma migrate deploy`.

---

## 🔒 Security & Production Notes

- **Security headers** sudah diset di `next.config.ts` (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- `poweredByHeader` dimatikan, `compress` aktif.
- Upload file:
  - Hanya role `ADMIN` / `PENGURUS`.
  - Whitelist MIME (png, jpeg, webp, gif, pdf) + maksimal **5 MB**.
  - Untuk skala production, ganti penyimpanan lokal ke object storage (S3/R2/Supabase Storage) — saat ini file ditulis ke `public/uploads/` di filesystem instance.
- Password di-hash dengan bcryptjs.
- Auth JWT (stateless) — pastikan `AUTH_SECRET` cukup acak & tidak pernah ter-commit.

---

## 🩺 Healthcheck

`GET /api/health` mengembalikan:

```json
{ "status": "ok", "db": "up", "uptime": 12.3, "responseTimeMs": 4, "timestamp": "..." }
```

HTTP `200` jika sehat, `503` jika DB tidak terjangkau.

---

## 📁 Struktur Singkat

```
app/                # App Router (routes, layouts, server actions)
  api/              # Route handlers (auth, upload, health)
  dashboard/        # Dashboard per role/jabatan
components/         # UI components (shadcn-based)
lib/                # auth, prisma, utils, server actions
prisma/             # schema.prisma + seed.ts
public/             # static assets + /uploads (gitignored)
middleware.ts       # Role/jabatan-based access guard
next.config.ts      # Security headers, image config, standalone output
```

---

## 🤝 Kontribusi

1. Buat branch dari `main`.
2. `npm run lint && npm run typecheck && npm run build` harus lulus.
3. Jangan commit `.env`, `*.db`, atau file di `public/uploads/`.

---

## 📜 Lisensi

Internal — Pimpinan Komisariat IMM Fakultas Teknik.
