import { PrismaClient, Jabatan } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function upsertUser(
  nim: string,
  name: string,
  rawPassword: string,
  role: 'MAHASISWA' | 'PENGURUS' | 'ADMIN',
  jabatan?: Jabatan,
  bidang?: string
) {
  const password = await hash(rawPassword, 12);
  return prisma.user.upsert({
    where: { nim },
    update: { name, role, jabatan: jabatan ?? null, bidang: bidang ?? null },
    create: { nim, name, password, role, jabatan: jabatan ?? null, bidang: bidang ?? null },
  });
}

async function main() {
  console.log('Seeding database...');

  const admin = await upsertUser('ADMIN001', 'Super Admin', 'admin123', 'ADMIN');
  const ketua = await upsertUser('KETUA001', 'Ahmad Fauzi', 'ketua123', 'PENGURUS', 'KETUA_UMUM');
  const sekum = await upsertUser('SEKUM001', 'Rina Lestari', 'sekum123', 'PENGURUS', 'SEKRETARIS_UMUM');
  const bendahara = await upsertUser('BENDAHARA001', 'Dian Prasetyo', 'bendahara123', 'PENGURUS', 'BENDAHARA_UMUM');
  const ketuaBidang = await upsertUser('KETUABID001', 'Wahyu Hidayat', 'ketuabid123', 'PENGURUS', 'KETUA_BIDANG', 'Riset & Pengembangan');
  const anggota = await upsertUser('ANGGOTA001', 'Reza Firmansyah', 'anggota123', 'PENGURUS', 'ANGGOTA_BIDANG', 'Riset & Pengembangan');
  const mhs = await upsertUser('2024001', 'Budi Santoso', 'mhs123', 'MAHASISWA');

  void admin; void ketua;

  await prisma.progress.deleteMany({ where: { userId: mhs.id } });
  await prisma.progress.createMany({
    data: [
      { userId: mhs.id, title: 'Darul Arqam Dasar (DAD)', status: 'selesai' },
      { userId: mhs.id, title: 'Pelatihan Kepemimpinan', status: 'proses' },
      { userId: mhs.id, title: 'Musyawarah Komisariat', status: 'belum' },
      { userId: mhs.id, title: 'Workshop Penulisan Ilmiah', status: 'belum' },
    ],
  });

  await prisma.proker.deleteMany({});
  await prisma.proker.createMany({
    data: [
      { bidang: 'Organisasi', title: 'Musyawarah Komisariat', status: 'terlaksana' },
      { bidang: 'Organisasi', title: 'Pelantikan Pengurus', status: 'terlaksana' },
      { bidang: 'Organisasi', title: 'Workshop Kepemimpinan Kader', status: 'direncanakan' },
      { bidang: 'Kader', title: 'DAD Angkatan 1', status: 'terlaksana' },
      { bidang: 'Kader', title: 'Forum Kader Muda', status: 'terlaksana' },
      { bidang: 'Kader', title: 'Pelatihan Fasilitator', status: 'direncanakan' },
      { bidang: 'Riset & Pengembangan', title: 'Bedah Jurnal', status: 'terlaksana', createdById: ketuaBidang.id },
      { bidang: 'Riset & Pengembangan', title: 'Seminar Riset Teknologi', status: 'direncanakan', createdById: anggota.id },
      { bidang: 'Tabligh', title: 'Pengajian Mingguan', status: 'terlaksana' },
      { bidang: 'Tabligh', title: 'Pesantren Kilat Ramadan', status: 'direncanakan' },
    ],
  });

  await prisma.surat.deleteMany({});
  await prisma.surat.createMany({
    data: [
      { tipe: 'MASUK', nomor: '012/UMM/FT/III/2026', tanggal: new Date('2026-03-12'), perihal: 'Undangan Rapat Dekanat', pengirim: 'Dekanat Fakultas Teknik', createdById: sekum.id },
      { tipe: 'KELUAR', nomor: '021/IMM-FT/IV/2026', tanggal: new Date('2026-04-05'), perihal: 'Permohonan Izin Penggunaan Ruang Seminar', tujuan: 'Dekan Fakultas Teknik', createdById: sekum.id },
    ],
  });

  await prisma.aturan.deleteMany({});
  await prisma.aturan.createMany({
    data: [
      { judul: 'TOR Musyawarah Komisariat 2026', kategori: 'TOR', konten: '# TOR MUSYKOM 2026\n\nTerm of Reference pelaksanaan Musyawarah Komisariat IMM FT tahun 2026.\n\n## Tujuan\n- Evaluasi program kerja\n- Pemilihan pengurus baru', createdById: sekum.id },
      { judul: 'AD/ART IMM Komisariat FT', kategori: 'AD_ART', konten: '# AD/ART\n\nAnggaran Dasar dan Anggaran Rumah Tangga IMM Komisariat Fakultas Teknik.', createdById: sekum.id },
    ],
  });

  await prisma.transaksi.deleteMany({});
  await prisma.transaksi.createMany({
    data: [
      { tipe: 'PEMASUKAN', tanggal: new Date('2026-03-01'), kategori: 'Iuran Kader', jumlah: 1500000, deskripsi: 'Iuran bulan Maret 2026', pihak: 'Kader aktif', createdById: bendahara.id },
      { tipe: 'PEMASUKAN', tanggal: new Date('2026-03-15'), kategori: 'Donasi', jumlah: 2000000, deskripsi: 'Donasi alumni', pihak: 'Alumni IMM FT', createdById: bendahara.id },
      { tipe: 'PENGELUARAN', tanggal: new Date('2026-03-20'), kategori: 'Konsumsi', jumlah: 450000, deskripsi: 'Konsumsi rapat bulanan', pihak: 'Warung Pak Budi', bidang: 'Organisasi', createdById: bendahara.id },
      { tipe: 'PENGELUARAN', tanggal: new Date('2026-04-02'), kategori: 'Perlengkapan', jumlah: 350000, deskripsi: 'ATK + cetak modul DAD', bidang: 'Kader', createdById: bendahara.id },
    ],
  });

  console.log('Seed complete!');
  console.log('Accounts: ADMIN001/admin123, KETUA001/ketua123, SEKUM001/sekum123, BENDAHARA001/bendahara123, KETUABID001/ketuabid123, ANGGOTA001/anggota123, 2024001/mhs123');
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
