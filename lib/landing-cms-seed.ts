/**
 * Idempotent seed untuk Landing CMS.
 * Diimpor & dipanggil dari `scripts/seed-landing.ts` (CLI) maupun dari API
 * `/api/admin/landing/seed` (admin trigger one-shot dari UI).
 *
 * Hanya membuat row jika belum ada — aman untuk dijalankan berulang kali.
 */

import type { PrismaClient } from '@prisma/client';

const PIMPINAN_DEFAULTS = [
  { slug: 'ketua-umum',      title: 'Ketua Umum',      role: 'Pimpinan Tertinggi',         nama: 'Ahmad Fauzi',   featured: true,  order: 0 },
  { slug: 'sekretaris-umum', title: 'Sekretaris Umum', role: 'Administrasi & Operasional', nama: 'Rina Lestari',  featured: false, order: 1 },
  { slug: 'bendahara-umum',  title: 'Bendahara Umum',  role: 'Manajemen Keuangan',         nama: 'Dian Prasetyo', featured: false, order: 2 },
  { slug: 'bendahara-1',     title: 'Bendahara 1',     role: 'Keuangan Internal',          nama: 'Fitri Amalia',  featured: false, order: 3 },
  { slug: 'bendahara-2',     title: 'Bendahara 2',     role: 'Keuangan Eksternal',         nama: 'Rizky Pratama', featured: false, order: 4 },
];

const BIDANG_DEFAULTS = [
  { slug: 'organisasi',         name: 'Organisasi',              icon: 'Network',        desc: 'Diarahkan pada tercapainya struktur, fungsi dan stabilitas organisasi serta mekanisme kepemimpinan yang mantap. Program konsolidasi gerakan IMM diarahkan pada terciptanya kekuatan gerak IMM baik kedalam maupun keluar sebagai modal penggerak.', ketua: 'Ahmad Fauzi',     sekretaris: 'Rina Lestari',     anggota: ['Budi Santoso','Hendra Wijaya','Fitri Amalia','Rizky Pratama'],     terlaksana: ['Musyawarah komisariat','Pelantikan pengurus'],         direncanakan: ['Konsolidasi komisariat seluruh prodi','Workshop kepemimpinan kader','Rapat kerja tahunan'] },
  { slug: 'kader',              name: 'Kader',                   icon: 'Users',          desc: 'Diarahkan pada penguatan tri kompetensi dasar (aqidah, intelektual dan humanitas) yang secara dinamis mampu menempatkan diri sebagai pelaku perubahan sosial masyarakat dan ikatan.', ketua: 'Dian Prasetyo',   sekretaris: 'Sari Dewi',        anggota: ['Irfan Maulana','Yuni Rahayu','Fajar Kurniawan','Mega Putri','Adi Nugroho'], terlaksana: ['DAD Angkatan 1','Forum kader muda'],                  direncanakan: ['Darul Arqam Dasar (DAD)','Pelatihan fasilitator','Kaderisasi informal bulanan'] },
  { slug: 'riset-pengembangan', name: 'Riset & Pengembangan',    icon: 'FlaskConical',   desc: 'Diarahkan pada penguatan basis metodologi riset dan pengembangan sinergisitas keilmuan kader di semua disiplin ilmu.', ketua: 'Wahyu Hidayat',   sekretaris: 'Lina Fitriani',    anggota: ['Reza Firmansyah','Nita Sari','Arif Rahman'],                                terlaksana: ['Bedah jurnal','Pelatihan SPSS'],                       direncanakan: ['Seminar riset teknologi','Workshop penulisan ilmiah','Kompetisi karya tulis internal'] },
  { slug: 'immawati',           name: 'Immawati',                icon: 'Flower2',        desc: 'Diarahkan pada upaya penguatan jati diri dan peran aktif potensi sumber daya putri dalam transformasi sosial menuju masyarakat utama berbasis pada paradigma Dakwah dan berkeadilan gender.', ketua: 'Nurul Hidayah',   sekretaris: 'Anisa Rahman',     anggota: ['Putri Wulandari','Dina Safitri','Aisyah Zahra','Ratna Sari'],               terlaksana: ['Kajian Immawati bulanan','Webinar peran perempuan dalam dakwah'], direncanakan: ['Forum Immawati regional','Workshop kesetaraan gender Islam','Pelatihan public speaking putri'] },
  { slug: 'hikmah',             name: 'Hikmah',                  icon: 'Landmark',       desc: 'Diarahkan pada penguatan peran sosial-politik IMM di tengah kehidupan berbangsa dan bernegara. Pemetaan basis data sosial politik, penguatan peran intelektual kader, dan laboratorium politik.', ketua: 'Muhamad Ilham',   sekretaris: 'Rini Agustina',    anggota: ['Galih Pratama','Eka Saputra','Taufik Hidayat'],                             terlaksana: ['Forum diskusi PEMILU','Audiensi rektorat'],            direncanakan: ['Diskusi kebijakan kampus','Sekolah politik kader','Kajian isu nasional'] },
  { slug: 'tabligh',            name: 'Tabligh',                 icon: 'BookOpen',       desc: 'Diarahkan pada gerakan dakwah Islam bernuansa pencerahan dan memakmurkan masjid kampus sebagai basis gerakan dakwah IMM.', ketua: 'Hafiz Abdullah',  sekretaris: 'Zahra Amelia',     anggota: ['Usman Hakim','Salma Khoiriyyah','Rizal Fahmi','Fadhilah Nur'],              terlaksana: ['Pengajian mingguan','Buka puasa bersama'],             direncanakan: ['Kajian rutin Jumat','Pesantren kilat Ramadan','Workshop dai muda'] },
  { slug: 'ekonomi-kewirausahaan', name: 'Ekonomi & Kewirausahaan', icon: 'TrendingUp',   desc: 'Diarahkan pada pengembangan kapasitas kewirausahaan kader dan organisasi guna mencapai cita-cita kemandirian organisasi.', ketua: 'Rangga Aditya',   sekretaris: 'Maya Indah',       anggota: ['Bayu Setiawan','Citra Dewi','Farhan Rizki'],                                terlaksana: ['Pelatihan desain produk','Koperasi kader'],            direncanakan: ['Bazar kewirausahaan','Workshop digital marketing','Inkubator bisnis kader'] },
  { slug: 'spm',                name: 'SPM',                     icon: 'HeartHandshake', desc: 'Diarahkan pada kemampuan institusi IMM melakukan kerja-kerja pemberdayaan masyarakat di akar rumput sebagai terjemahan humanitas kader, terintegrasi dengan dakwah Muhammadiyah.', ketua: 'Teguh Prabowo',   sekretaris: 'Indri Kartika',    anggota: ['Wawan Hermawan','Siska Amalia','Yusuf Maulana','Dewi Anggraini'],           terlaksana: ['Bersih kampus','Donor darah'],                         direncanakan: ['Bakti sosial masyarakat','Mengajar di daerah 3T','Penggalangan dana bencana'] },
  { slug: 'sbo',                name: 'SBO',                     icon: 'Palette',        desc: 'Diarahkan pada pembentukan paradigma multikultral sesuai nilai Ke-Muhammadiyahan dan aktualisasi kreatifitas seni, budaya dan olahraga sebagai bagian dari gerakan dakwah Islam.', ketua: 'Andi Saputra',    sekretaris: 'Nadia Putri',      anggota: ['Kevin Ardiansyah','Laras Sekar','Bagus Wicaksono'],                         terlaksana: ['Lomba futsal','Pentas seni milad'],                    direncanakan: ['Festival seni budaya IMM','Turnamen olahraga antar komisariat','Workshop fotografi & videografi'] },
  { slug: 'media-komunikasi',   name: 'Media & Komunikasi',      icon: 'Radio',          desc: 'Diarahkan pada terbangunnya sistem komunikasi internal dan eksternal IMM, pembangunan image IMM, media komunitas yang mumpuni, dan meningkatkan bargaining position.', ketua: 'Faisal Akbar',    sekretaris: 'Tiara Ramadhani',  anggota: ['Dimas Prasetyo','Aulia Rahma','Gilang Ramadhan','Shinta Maharani'],         terlaksana: ['Konten Instagram bulanan','Dokumentasi kegiatan'],     direncanakan: ['Redesign media sosial','Podcast IMM Teknik','Pelatihan jurnalistik'] },
];

const PERIODE_DEFAULTS = [
  { periode: '2024–2025', ketua: 'Ahmad Fauzi',      order: 0 },
  { periode: '2023–2024', ketua: 'Muhammad Rizki',   order: 1 },
  { periode: '2022–2023', ketua: 'Andi Pratama',     order: 2 },
  { periode: '2021–2022', ketua: 'Ilham Saputra',    order: 3 },
];

interface ContentDef {
  key: string;
  value: string;
  groupName: string;
  label?: string;
  multiline?: boolean;
  order: number;
}

const CONTENT_DEFAULTS: ContentDef[] = [
  // Hero
  { key: 'hero.eyebrow',   value: 'Periode 2025–2026', groupName: 'Hero', label: 'Eyebrow (di atas judul hero)', order: 0 },
  { key: 'hero.title.1',   value: 'Pikom',             groupName: 'Hero', label: 'Judul baris 1',                  order: 1 },
  { key: 'hero.title.2',   value: 'Teknik',            groupName: 'Hero', label: 'Judul baris 2',                  order: 2 },
  { key: 'hero.tagline',   value: 'Pimpinan Komisariat IMM di lingkup Fakultas Teknik. Membangun kader berintelektual, berhumanitas, dan beraqidah kuat.', groupName: 'Hero', label: 'Tagline hero', multiline: true, order: 3 },
  { key: 'hero.cta.primary',   value: 'Jelajahi Struktur', groupName: 'Hero', label: 'Tombol CTA primary',     order: 4 },
  { key: 'hero.cta.secondary', value: 'Masuk Dashboard',   groupName: 'Hero', label: 'Tombol CTA sekunder',    order: 5 },
  { key: 'hero.stat.sejak.label',  value: 'Sejak',  groupName: 'Hero', label: 'Stat 1 label', order: 6 },
  { key: 'hero.stat.sejak.value',  value: '1964',   groupName: 'Hero', label: 'Stat 1 nilai', order: 7 },
  { key: 'hero.stat.kader.label',  value: 'Kader',  groupName: 'Hero', label: 'Stat 2 label', order: 8 },
  { key: 'hero.stat.kader.value',  value: '120+',   groupName: 'Hero', label: 'Stat 2 nilai', order: 9 },
  { key: 'hero.stat.bidang.label', value: 'Bidang', groupName: 'Hero', label: 'Stat 3 label', order: 10 },
  { key: 'hero.stat.bidang.value', value: '10',     groupName: 'Hero', label: 'Stat 3 nilai', order: 11 },

  // Stats strip
  { key: 'stats.bidang.value',    value: '10',  groupName: 'Stats Strip', label: 'Bidang — angka',         order: 0 },
  { key: 'stats.pimpinan.value',  value: '5',   groupName: 'Stats Strip', label: 'Pimpinan Inti — angka',  order: 1 },
  { key: 'stats.kader.value',     value: '120', groupName: 'Stats Strip', label: 'Kader Aktif — angka',    order: 2 },
  { key: 'stats.kader.suffix',    value: '+',   groupName: 'Stats Strip', label: 'Kader Aktif — suffix',   order: 3 },
  { key: 'stats.periode.value',   value: '4',   groupName: 'Stats Strip', label: 'Periode Aktif — angka',  order: 4 },

  // About
  { key: 'about.eyebrow',     value: 'Tentang PIKOM',                                                                                       groupName: 'About', label: 'Eyebrow',                  order: 0 },
  { key: 'about.title',       value: 'Anggun dalam Moral, Unggul dalam Intelektual',                                                        groupName: 'About', label: 'Judul section',            order: 1 },
  { key: 'about.description', value: 'Ikatan Mahasiswa Muhammadiyah (IMM) Pimpinan Komisariat Fakultas Teknik adalah organisasi mahasiswa otonom di bawah Muhammadiyah yang bergerak di bidang keagamaan, kemahasiswaan, dan kemasyarakatan.', groupName: 'About', label: 'Deskripsi section', multiline: true, order: 2 },
  { key: 'about.quote',       value: 'IMM untuk kemanusiaan, IMM untuk ilmu, IMM untuk agama. Kami hadir sebagai wadah pengkaderan mahasiswa muslim yang berkarakter.', groupName: 'About', label: 'Quote utama', multiline: true, order: 3 },
  { key: 'about.quote.source', value: 'Falsafah Gerakan IMM',                                                                              groupName: 'About', label: 'Sumber quote',            order: 4 },
  { key: 'about.value.1.label', value: 'Visi',     groupName: 'About Values', label: 'Card 1 — label', order: 0 },
  { key: 'about.value.1.body',  value: 'Terbentuknya akademisi Islam berkarakter, menjalankan amal dakwah di tengah masyarakat.',           groupName: 'About Values', label: 'Card 1 — body', multiline: true, order: 1 },
  { key: 'about.value.2.label', value: 'Misi',     groupName: 'About Values', label: 'Card 2 — label', order: 2 },
  { key: 'about.value.2.body',  value: 'Membina keimanan, memperjuangkan nilai keilmuan, menggerakkan kemanusiaan.',                       groupName: 'About Values', label: 'Card 2 — body', multiline: true, order: 3 },
  { key: 'about.value.3.label', value: 'Nilai',    groupName: 'About Values', label: 'Card 3 — label', order: 4 },
  { key: 'about.value.3.body',  value: 'Religiusitas, intelektualitas, humanitas — tiga pilar kader IMM.',                                 groupName: 'About Values', label: 'Card 3 — body', multiline: true, order: 5 },
  { key: 'about.value.4.label', value: 'Arah',     groupName: 'About Values', label: 'Card 4 — label', order: 6 },
  { key: 'about.value.4.body',  value: 'Menjawab tantangan zaman dengan basis iman, ilmu, dan aksi nyata.',                                groupName: 'About Values', label: 'Card 4 — body', multiline: true, order: 7 },

  // Footer / CTA
  { key: 'cta.title.before', value: 'Siap',         groupName: 'CTA Footer', label: 'Judul (sebelum gold)', order: 0 },
  { key: 'cta.title.gold',   value: 'Bergerak?',    groupName: 'CTA Footer', label: 'Judul (gold)',         order: 1 },
  { key: 'cta.description',  value: 'Jadilah bagian dari perubahan. Mari bersama-sama mewujudkan cita-cita Ikatan Mahasiswa Muhammadiyah di Fakultas Teknik.', groupName: 'CTA Footer', label: 'Deskripsi CTA', multiline: true, order: 2 },
  { key: 'cta.button.primary',   value: 'Masuk Dashboard', groupName: 'CTA Footer', label: 'Tombol primary',  order: 3 },
  { key: 'cta.button.secondary', value: 'Pelajari Lebih',  groupName: 'CTA Footer', label: 'Tombol sekunder', order: 4 },
  { key: 'footer.copyright', value: '© 2026 PIKOM TEKNIK IMM', groupName: 'CTA Footer', label: 'Copyright',  order: 5 },
  { key: 'footer.link.1', value: 'Instagram', groupName: 'CTA Footer', label: 'Link 1', order: 6 },
  { key: 'footer.link.2', value: 'Twitter',   groupName: 'CTA Footer', label: 'Link 2', order: 7 },
  { key: 'footer.link.3', value: 'Email',     groupName: 'CTA Footer', label: 'Link 3', order: 8 },

  // Section headers
  { key: 'section.struktur.eyebrow',     value: 'Kepemimpinan',                                                                            groupName: 'Section Headers', label: 'Struktur — eyebrow', order: 0 },
  { key: 'section.struktur.description', value: 'Struktur kepengurusan tingkat komisariat yang menjadi motor penggerak utama. Ketua Umum memimpin, didampingi Sekretaris dan tiga Bendahara.', groupName: 'Section Headers', label: 'Struktur — deskripsi', multiline: true, order: 1 },
  { key: 'section.bidang.eyebrow',       value: '10 Bidang',                                                                                groupName: 'Section Headers', label: 'Bidang — eyebrow',   order: 2 },
  { key: 'section.bidang.description',   value: 'Setiap bidang dipimpin oleh Ketua Bidang, dibantu oleh Sekretaris Bidang, dan menaungi departemen-departemen spesifik.', groupName: 'Section Headers', label: 'Bidang — deskripsi', multiline: true, order: 3 },
  { key: 'section.periode.eyebrow',      value: 'Jejak Kepemimpinan',                                                                       groupName: 'Section Headers', label: 'Periode — eyebrow',  order: 4 },
  { key: 'section.periode.description',  value: 'Estafet kepemimpinan PIKOM Fakultas Teknik dari periode ke periode.',                       groupName: 'Section Headers', label: 'Periode — deskripsi', multiline: true, order: 5 },
];

export async function seedLandingCMS(prisma: PrismaClient): Promise<{
  pimpinan: number;
  bidang: number;
  periode: number;
  content: number;
}> {
  let pimpinanCount = 0;
  for (const p of PIMPINAN_DEFAULTS) {
    const existing = await prisma.landingPimpinan.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await prisma.landingPimpinan.create({ data: p });
      pimpinanCount++;
    }
  }

  let bidangCount = 0;
  for (const b of BIDANG_DEFAULTS) {
    const existing = await prisma.landingBidang.findUnique({ where: { slug: b.slug } });
    if (existing) continue;
    await prisma.landingBidang.create({
      data: {
        slug: b.slug,
        name: b.name,
        icon: b.icon,
        desc: b.desc,
        ketua: b.ketua,
        sekretaris: b.sekretaris,
        order: BIDANG_DEFAULTS.indexOf(b),
        anggota: { create: b.anggota.map((nama, i) => ({ nama, order: i })) },
        proker: {
          create: [
            ...b.terlaksana.map((title, i) => ({
              title, status: 'TERLAKSANA' as const, order: i,
            })),
            ...b.direncanakan.map((title, i) => ({
              title, status: 'DIRENCANAKAN' as const, order: i,
            })),
          ],
        },
      },
    });
    bidangCount++;
  }

  let periodeCount = 0;
  for (const p of PERIODE_DEFAULTS) {
    const existing = await prisma.landingPeriode.findFirst({
      where: { periode: p.periode },
    });
    if (!existing) {
      await prisma.landingPeriode.create({ data: p });
      periodeCount++;
    }
  }

  let contentCount = 0;
  for (const c of CONTENT_DEFAULTS) {
    const existing = await prisma.landingContent.findUnique({ where: { key: c.key } });
    if (!existing) {
      await prisma.landingContent.create({
        data: {
          key: c.key,
          value: c.value,
          groupName: c.groupName,
          label: c.label ?? null,
          multiline: c.multiline ?? false,
          order: c.order,
        },
      });
      contentCount++;
    }
  }

  return { pimpinan: pimpinanCount, bidang: bidangCount, periode: periodeCount, content: contentCount };
}
