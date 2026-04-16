import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const adminPassword = await hash('admin123', 12);
  const pengurusPassword = await hash('pengurus123', 12);
  const mhsPassword = await hash('mhs123', 12);

  const admin = await prisma.user.upsert({
    where: { nim: 'ADMIN001' },
    update: {},
    create: {
      nim: 'ADMIN001',
      name: 'Super Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const pengurus = await prisma.user.upsert({
    where: { nim: 'PENGURUS001' },
    update: {},
    create: {
      nim: 'PENGURUS001',
      name: 'Ahmad Fauzi',
      password: pengurusPassword,
      role: 'PENGURUS',
      bidang: 'Organisasi',
    },
  });

  const mhs = await prisma.user.upsert({
    where: { nim: '2024001' },
    update: {},
    create: {
      nim: '2024001',
      name: 'Budi Santoso',
      password: mhsPassword,
      role: 'MAHASISWA',
    },
  });

  // Create sample progress for mahasiswa
  await prisma.progress.createMany({
    data: [
      { userId: mhs.id, title: 'Darul Arqam Dasar (DAD)', status: 'selesai' },
      { userId: mhs.id, title: 'Pelatihan Kepemimpinan', status: 'proses' },
      { userId: mhs.id, title: 'Musyawarah Komisariat', status: 'belum' },
      { userId: mhs.id, title: 'Workshop Penulisan Ilmiah', status: 'belum' },
    ],
  });

  // Create sample proker
  await prisma.proker.createMany({
    data: [
      { bidang: 'Organisasi', title: 'Musyawarah Komisariat', status: 'terlaksana' },
      { bidang: 'Organisasi', title: 'Pelantikan Pengurus', status: 'terlaksana' },
      { bidang: 'Organisasi', title: 'Workshop Kepemimpinan Kader', status: 'direncanakan' },
      { bidang: 'Kader', title: 'DAD Angkatan 1', status: 'terlaksana' },
      { bidang: 'Kader', title: 'Forum Kader Muda', status: 'terlaksana' },
      { bidang: 'Kader', title: 'Pelatihan Fasilitator', status: 'direncanakan' },
      { bidang: 'Riset & Pengembangan', title: 'Bedah Jurnal', status: 'terlaksana' },
      { bidang: 'Riset & Pengembangan', title: 'Seminar Riset Teknologi', status: 'direncanakan' },
      { bidang: 'Tabligh', title: 'Pengajian Mingguan', status: 'terlaksana' },
      { bidang: 'Tabligh', title: 'Pesantren Kilat Ramadan', status: 'direncanakan' },
    ],
  });

  console.log('✅ Seed complete!');
  console.log('');
  console.log('Test accounts:');
  console.log(`  ADMIN    → NIM: ADMIN001     | Password: admin123`);
  console.log(`  PENGURUS → NIM: PENGURUS001  | Password: pengurus123`);
  console.log(`  MAHASISWA → NIM: 2024001     | Password: mhs123`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
