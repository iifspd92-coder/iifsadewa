/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Guru, Kegiatan, Galeri, Berita, Dokumen, ForumMessage } from './types';

export const INITIAL_GURU: Guru[] = [];

export const INITIAL_KEGIATAN: Kegiatan[] = [
  {
    id: 'K001',
    judul: 'Rapat Kerja Rutin KKG PJOK Luwuk Timur',
    deskripsi: 'Evaluasi program mengajar PJOK semester genap dan persiapan Olimpiade Olahraga Siswa Nasional (O2SN) tingkat Kecamatan.',
    tanggal: '2026-06-20',
    waktu: '09:00 WITA - Selesai',
    lokasi: 'Aula SDN 1 Hunduhon',
    kategori: 'Rapat KKG'
  },
  {
    id: 'K002',
    judul: 'Pelatihan Implementasi SKJ 2026 & Kebugaran Mandiri',
    deskripsi: 'Sosialisasi dan pelatihan Senam Kebugaran Jasmani (SKJ) edisi terbaru untuk seluruh Guru PJOK SD se-Kecamatan Luwuk Timur.',
    tanggal: '2026-07-04',
    waktu: '08:00 WITA - 13:00 WITA',
    lokasi: 'Lapangan Serbaguna SDN Kayutanyo',
    kategori: 'Pelatihan'
  },
  {
    id: 'K003',
    judul: 'Turnamen Sepak Bola Mini SD se-Kecamatan Luwuk Timur',
    deskripsi: 'Turnamen tahunan memperebutkan Piala KKG PJOK Luwuk Timur untuk mengasah bakat sepak bola usia dini tingkat SD.',
    tanggal: '2026-07-25',
    waktu: '07:30 WITA - Selesai',
    lokasi: 'Lapangan Boyou, Luwuk Timur',
    kategori: 'Turnamen Olahraga'
  },
  {
    id: 'K004',
    judul: 'Seleksi Atletik Kids O2SN Luwuk Timur',
    deskripsi: 'Seleksi cabang olahraga atletik kids (Kanga\'s escape, formula one) kompetisi O2SN tingkat kecamatan sebelum dikirim ke Kabupaten.',
    tanggal: '2026-08-08',
    waktu: '08:00 WITA - 12:00 WITA',
    lokasi: 'Lapangan SDN Louk',
    kategori: 'Kegiatan Siswa'
  }
];

export const INITIAL_GALERI: Galeri[] = [
  {
    id: 'GL001',
    judul: 'Turnamen Sepak Bola Mini KKG PJOK Luwuk Timur',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
    tahun: 2026,
    kategori: 'Turnamen'
  },
  {
    id: 'GL002',
    judul: 'Pelatihan Guru PJOK - Penerapan Senam Sehat Gembira',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    tahun: 2026,
    kategori: 'Pelatihan'
  },
  {
    id: 'GL003',
    judul: 'Rapat Kerja Pengurus KKG PJOK di Ruang Pertemuan Hunduhon',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    tahun: 2026,
    kategori: 'Rapat KKG'
  },
  {
    id: 'GL004',
    judul: 'Senam Massal Bersama Siswa dan Guru SD se-Kecamatan Luwuk Timur',
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800',
    tahun: 2025,
    kategori: 'Senam Bersama'
  },
  {
    id: 'GL005',
    judul: 'Lomba Lari Atletik Kids Tingkat Kecamatan - Cabang O2SN',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800',
    tahun: 2025,
    kategori: 'Turnamen'
  },
  {
    id: 'GL006',
    judul: 'Pemberian Piagam Penghargaan Kelompok Guru PJOK Berprestasi Luwuk',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
    tahun: 2024,
    kategori: 'Pelatihan'
  }
];

export const INITIAL_BERITA: Berita[] = [
  {
    id: 'B001',
    judul: 'Owal Festival Olahraga & Sosialisasi O2SN SD Tingkat Luwuk Timur Sukses Digelar',
    ringkasan: 'Ratusan siswa dari berbagai SD se-Kecamatan Luwuk Timur berkumpul memeriahkan festival olahraga tahunan KKG PJOK dengan penuh antusiasme.',
    isi: 'Kecamatan Luwuk Timur baru saja sukses melangsungkan Festival Olahraga Siswa sekaligus sosialisasi format baru O2SN 2026. Acara pembuka dipimpin langsung oleh Ketua KKG PJOK Luwuk Timur, Bapak Iif Sadewa Goa, S.Pd., didampingi oleh Pengawas Sekolah Kecamatan.\n\nDalam sambutannya, Bapak Iif menekankan pentingnya menjunjung tinggi sportivitas sejak usia dini. Cabang olahraga yang disosialisasikan dan disimulasikan meliputi Atletik Kids, Bulutangkis, Renang, dan Pencak Silat. Festival ini juga menjadi wahana menyaring bibit atlet berbakat Kabupaten Banggai.\n\n"Kami bangga dengan semangat luar biasa dari anak-anak kita. Semoga di tahun bimbingan ini kita bisa menyumbang medali emas untuk kontingen Luwuk Timur ke tingkat Kabupaten Banggai bahkan ke Provinsi Sulawesi Tengah," ujar Hardianto, S.Pd selaku sekretaris kepanitiaan.',
    tanggal: '2026-06-10',
    kategori: 'Berita KKG',
    imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=800',
    penulis: 'Iif Sadewa Goa, S.Pd.',
    komentar: [
      {
        id: 'C01',
        nama: 'Ahmad Yani, S.Pd.',
        isi: 'Luar biasa, semoga kegiatan seperti ini terus berkelanjutan untuk memotivasi minat olahraga adik-adik kita!',
        tanggal: '2026-06-11'
      },
      {
        id: 'C02',
        nama: 'Susi Susanti, S.Pd.',
        isi: 'Anak-anak didik dari SDN Lamboti sangat senang ikut lomba lari kemarin, terima kasih KKG!',
        tanggal: '2026-06-11'
      }
    ]
  },
  {
    id: 'B002',
    judul: 'Penerapan Kurikulum Merdeka PJOK: KKG Gelar Pelatihan Bersama Pengawas Sekolah',
    ringkasan: 'KKG PJOK Luwuk Timur mengadakan bimbingan teknis khusus terkait penyusunan Alur Tujuan Pembelajaran (ATP) dan modul ajar PJOK berbasis Kurikulum Merdeka.',
    isi: 'Dalam meningkatkan mutu dan profesionalisme guru olahraga, Kelompok Kerja Guru (KKG) PJOK Kecamatan Luwuk Timur mengadakan Pelatihan Bersama Implementasi Kurikulum Merdeka.\n\nPelatihan yang diadakan di aula SDN Louk ini mengundang pemateri utama dari Dewan Pengawas Sekolah Dinas Pendidikan Kabupaten Banggai. Inti dari pelatihan ini adalah mengubah orientasi ajar PJOK agar tidak berfokus pada prestasi teoritis melainkan pada penguatan profil pelajar pancasila dan kegemaran bergerak aktif sepanjang hayat.\n\nDengan adanya bimbingan ini, dipastikan seluruh Guru PJOK di Luwuk Timur memiliki standardisasi Modul Ajar, RPP, dan model asesmen yang aplikatif dan inklusif bagi semua kondisi fisik siswa.',
    tanggal: '2026-05-24',
    kategori: 'Pengumuman Resmi',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    penulis: 'Admin KKG PJOK',
    komentar: [
      {
        id: 'C03',
        nama: 'Rudi Hermawan, S.Pd.',
        isi: 'Sangat terbantu dengan contoh RPP dan format modul ajar yang dibagikan. Sukses selalu tim KKG!',
        tanggal: '2026-05-25'
      }
    ]
  },
  {
    id: 'B003',
    judul: 'Pengumuman Turnamen Bulutangkis Antar Guru KKG PJOK Se-Kabupaten',
    ringkasan: 'Dalam rangka mempererat silaturahmi, akan diselenggarakan turnamen bulutangkis persahabatan antar guru olahraga se-Kabupaten Banggai.',
    isi: 'Disampaikan kepada seluruh guru PJOK di Kecamatan Luwuk Timur bahwa pendaftaran Turnamen Bulutangkis Persahabatan Antar Guru PJOK se-Kabupaten Banggai telah dibuka.\n\nTurnamen ini rencananya akan diadakan di GOR Luwuk pada akhir Juli 2026. KKG PJOK Luwuk Timur akan mengirimkan 2 tim ganda putra dan 1 tim ganda putri terbaik hasil seleksi internal.\n\nBagi rekan-rekan guru yang berminat mendaftar seleksi internal, silakan menghubungi Sekretaris KKG, Bapak Hardianto paling lambat tanggal 30 Juni 2026. Mari kita jaga stamina dan tunjukkan sportivitas guru Luwuk Timur!',
    tanggal: '2026-06-01',
    kategori: 'Lomba & Turnamen',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    penulis: 'Hardianto, S.Pd.',
    komentar: []
  }
];

export const INITIAL_DOKUMEN: Dokumen[] = [
  {
    id: 'D001',
    judul: 'Modul Ajar PJOK SD Kelas 1 Lengkap Kurikulum Merdeka',
    kategori: 'Modul SD',
    ukuran: '3.1 MB',
    tipe: 'pdf',
    tanggalUpload: '2026-02-15',
    url: '#'
  },
  {
    id: 'D002',
    judul: 'Modul Ajar PJOK SD Kelas 4 Fase B Kurikulum Merdeka',
    kategori: 'Modul SD',
    ukuran: '4.5 MB',
    tipe: 'pdf',
    tanggalUpload: '2026-02-15',
    url: '#'
  },
  {
    id: 'D003',
    judul: 'Silabus PJOK SD Semester Ganjil & Genap (Standard KKG)',
    kategori: 'Silabus',
    ukuran: '1.2 MB',
    tipe: 'docx',
    tanggalUpload: '2026-01-10',
    url: '#'
  },
  {
    id: 'D004',
    judul: 'Contoh Rencana Pelaksanaan Pembelajaran (RPP) Inspiratif PJOK',
    kategori: 'RPP',
    ukuran: '850 KB',
    tipe: 'docx',
    tanggalUpload: '2026-03-01',
    url: '#'
  },
  {
    id: 'D005',
    judul: 'Panduan Teknis O2SN (Olimpiade Olahraga Siswa) SD 2026',
    kategori: 'Dokumen Lomba',
    ukuran: '2.8 MB',
    tipe: 'pdf',
    tanggalUpload: '2026-05-18',
    url: '#'
  },
  {
    id: 'D006',
    judul: 'Sertifikat Pelatihan Pembuatan RPP Digital PJOK Luwuk Timur',
    kategori: 'Sertifikat',
    ukuran: '1.9 MB',
    tipe: 'pdf',
    tanggalUpload: '2026-05-30',
    url: '#'
  }
];

export const INITIAL_FORUM: ForumMessage[] = [
  {
    id: 'F001',
    nama: 'Ahmad Yani, S.Pd.',
    sekolah: 'SDN Goidang',
    pesan: 'Rekan-rekan, ada yang punya contoh asesmen alternatif untuk lempar turbo atletik kids? Siswa kami di Goidang agak kesulitan dengan alat lempar standar.',
    tanggal: '2026-06-13 15:30'
  },
  {
    id: 'F002',
    nama: 'Iif Sadewa Goa, S.Pd.',
    sekolah: 'SD Negeri Banpres Bantayan 2',
    pesan: 'Bisa dimodifikasi pak Ahmad, gunakan bilah bambu yang dilapisi busa atau botol bekas diisi pasir secukupnya agar aman. Untuk penilaian bisa fokus pada tahap awalan dan sudut tolakan.',
    tanggal: '2026-06-13 16:15'
  },
  {
    id: 'F003',
    nama: 'Rudi Hermawan, S.Pd.',
    sekolah: 'SDN Boyou',
    pesan: 'Pak Ahmad, kami di SDN Boyou juga modifikasi pakai selang plastik dipasang ekor kertas warna-warni. Anak-anak justru tambah gembira karena harganya murah dan bisa dibuat bareng-bareng.',
    tanggal: '2026-06-14 07:12'
  },
  {
    id: 'F004',
    nama: 'Nurhasanah, S.Pd.',
    sekolah: 'SDN Louk',
    pesan: 'Izin mengingatkan iuran rutin kas bulanan KKG PJOK Luwuk Timur untuk periode Juni 2026 bisa ditransfer atau diserahkan pas Rapat Kerja tanggal 20 nanti ya bapak ibu. Terima kasih banyak 🙏',
    tanggal: '2026-06-14 09:45'
  }
];
