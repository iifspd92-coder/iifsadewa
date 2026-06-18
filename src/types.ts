/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Guru {
  id: string;
  nama: string;
  nip: string;
  sekolah: string;
  kecamatan: string;
  noHp: string;
  email: string;
  status: 'Aktif' | 'Nonaktif' | 'Mutasi';
  jabatan: string;
  password?: string;
}

export interface Kegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string; // Format: YYYY-MM-DD
  waktu: string;
  lokasi: string;
  kategori: 'Rapat KKG' | 'Pelatihan' | 'Turnamen Olahraga' | 'Kegiatan Siswa';
}

export interface Galeri {
  id: string;
  judul: string;
  imageUrl: string;
  videoUrl?: string;
  tahun: number;
  kategori: 'Turnamen' | 'Pelatihan' | 'Rapat KKG' | 'Senam Bersama';
}

export interface Komentar {
  id: string;
  nama: string;
  isi: string;
  tanggal: string;
}

export interface Berita {
  id: string;
  judul: string;
  isi: string;
  ringkasan: string;
  tanggal: string;
  kategori: 'Berita KKG' | 'Lomba & Turnamen' | 'Pengumuman Resmi';
  imageUrl: string;
  penulis: string;
  komentar: Komentar[];
}

export interface Dokumen {
  id: string;
  judul: string;
  kategori: 'Modul SD' | 'Silabus' | 'RPP' | 'Dokumen Lomba' | 'Sertifikat' | 'Lainnya';
  ukuran: string;
  tipe: 'pdf' | 'docx' | 'xlsx' | 'zip';
  tanggalUpload: string;
  url: string;
}

export interface ForumMessage {
  id: string;
  nama: string;
  sekolah: string;
  pesan: string;
  tanggal: string;
}

export interface User {
  username: string;
  nama: string;
  role: 'admin' | 'bendahara' | 'guru' | 'pengunjung';
  sekolah?: string;
}

export interface TransaksiKeuangan {
  id: string;
  tanggal: string;
  keterangan: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  jumlah: number;
  kategori: 'Iuran Kas' | 'Sponsorship' | 'Dana Pembinaan' | 'Konsumsi' | 'Peralatan' | 'Biaya Acara' | 'Transport' | 'Lainnya';
  penulis: string;
}
