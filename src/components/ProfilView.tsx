/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, BookOpen, Award, Landmark, ShieldCheck } from 'lucide-react';

export default function ProfilView() {
  const pengurus = [
    {
      role: 'Ketua KKG',
      name: 'Iif Sadewa Goa, S.Pd.',
      nip: '199602292024211024',
      sekolah: 'SD Negeri Banpres Bantayan 2',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
      desc: 'Penanggung jawab utama seluruh program kepemimpinan, koordinasi eksternal dengan Pengawas Dinas Pendidikan, serta pengembangan kurikulum fisik dan KKG PJOK.'
    },
    {
      role: 'Sekretaris KKG',
      name: 'Hardianto, S.Pd.',
      nip: '19880724 201503 1 002',
      sekolah: 'SDN Kayutanyo',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300',
      desc: 'Mengelola persuratan resmi, laporan pertanggungjawaban kegiatan, arsip administrasi digital, serta komunikasi hubungan masyarakat.'
    },
    {
      role: 'Bendahara KKG',
      name: 'Nurhasanah, S.Pd.',
      nip: '19900918 202012 2 015',
      sekolah: 'SDN Louk',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      desc: 'Mencakup manajemen keuangan organisasi, iuran bulanan berkala kepengurusan, anggaran turnamen siswa, serta pelaporan kas transparan.'
    }
  ];

  return (
    <div className="space-y-12 pb-16 text-slate-100">
      
      {/* Profil Header Banner */}
      <div className="glass-card text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-3 relative overflow-hidden bg-gradient-to-r from-blue-900/25 to-indigo-950/25 border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl" />
        <h2 className="text-3xl font-extrabold font-display tracking-tight text-white">Profil KKG PJOK Luwuk Timur</h2>
        <p className="text-slate-350 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
          Mengenal lebih dekat visi, sejarah singkat, dan jajaran kepengurusan Kelompok Kerja Guru Pendidikan Jasmani, Olahraga, dan Kesehatan Kecamatan Luwuk Timur.
        </p>
      </div>

      {/* Sejarah Singkat */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center border">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Landmark className="w-5 h-5 text-sport-gold" />
            Sejarah Organisasi
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">
            Berawal dari Kepedulian Sehat & Aktifitas Siswa
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Kelompok Kerja Guru (KKG) Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK) Kecamatan Luwuk Timur didirikan atas inisiasi para guru olahraga se-Kecamatan Luwuk Timur, Kabupaten Banggai. Keinginan mulia kami adalah menyatukan persepsi pengajaran olahraga yang sering kali dianggap sekadar mata pelajaran pendukung di lingkungan sekolah.
          </p>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Seiring bergulirnya kurikulum baru nasional hingga Kurikulum Merdeka, KKG PJOK Luwuk Timur bertransformasi menjadi tulang punggung peningkatan profesionalisme guru. Kami menyelenggarakan bimtek berkelanjutan, mengorkestrasi turnamen mini olahraga siswa, serta memastikan kesehatan jasmani anak didik di Luwuk Timur tetap terjaga secara komparatif dan kondusif.
          </p>
        </div>
        <div className="md:col-span-4 bg-white/5 border border-white/10 p-6 rounded-2xl text-center space-y-4 shadow-inner">
          <Award className="w-16 h-16 text-sport-gold mx-auto animate-pulse" />
          <div>
            <p className="text-3xl font-display font-black text-white text-glow-green">100%</p>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Berlisensi Guru</p>
          </div>
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "Seluruh guru sekolah dasar yang tergabung dalam KKG PJOK secara berkala mengikuti sertifikasi dinas."
            </p>
          </div>
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Visi Card */}
        <div className="glass-card border-l-4 border-blue-500 p-6 sm:p-8 rounded-r-3xl shadow-md space-y-4 border-y border-r">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-lg text-white">Visi KKG PJOK</h4>
          </div>
          <p className="text-slate-350 text-xs sm:text-sm leading-relaxed italic">
            "Mewujudkan guru PJOK Kecamatan Luwuk Timur yang profesional, mandiri, dan berkarakter guna menghasilkan generasi anak didik yang bugar, berintegritas, serta berprestasi di tingkat daerah maupun nasional."
          </p>
        </div>

        {/* Misi Card */}
        <div className="glass-card border-l-4 border-emerald-400 p-6 sm:p-8 rounded-r-3xl shadow-md space-y-4 border-y border-r">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-lg text-white">Misi KKG PJOK</h4>
          </div>
          <ul className="space-y-2.5 text-slate-300 text-xs leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-450 mt-0.5">✔</span>
              <span>Menyelenggarakan forum diskusi periodik perihal implementasi praktik terbaik mata pelajaran PJOK.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-450 mt-0.5">✔</span>
              <span>Mengembangkan kualitas kompetensi mendidik guru secara inovatif lewat pelatihan alat peraga olahraga modifikasi.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-450 mt-0.5">✔</span>
              <span>Meningkatkan motivasi siswa dalam berprestasi di bidang non-akademik melalui kompetisi O2SN berkala.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-450 mt-0.5">✔</span>
              <span>Mempererat jalinan transparansi administrasi guru olahraga se-Kecamatan Luwuk Timur.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Struktur Organisasi Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-emerald-400 font-bold tracking-wider text-xs uppercase block">Structure Chart</span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">Pengurus Utama Periode 2024 - 2028</h3>
          <p className="text-slate-400 text-xs max-w-lg mx-auto">
            Dipilih berdasarkan musyawarah dewan guru olahraga Kecamatan Luwuk Timur dengan dedikasi kerja tulus.
          </p>
        </div>

        {/* Organigram Interactive Diagram CSS */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-lg border">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* 1. KETUA FIELD (Centered) */}
            <div className="flex justify-center">
              <div className="glass-card hover:bg-slate-900/60 transition-all border-blue-500/30 w-full max-w-sm p-5 rounded-2xl shadow-lg text-center relative border">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 bg-blue-600 border border-white/15 text-white text-[9px] font-bold uppercase rounded-full tracking-wider">
                  Ketua KKG
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-left">
                  <img
                    src={pengurus[0].image}
                    alt={pengurus[0].name}
                    className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-800 border border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sport-gold" />
                      {pengurus[0].name}
                    </h4>
                    <p className="text-[10px] text-blue-400 font-bold">{pengurus[0].sekolah}</p>
                    <p className="text-[10px] text-slate-400">NIP. {pengurus[0].nip}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-350 mt-3 text-left leading-relaxed font-serif italic border-t border-white/10 pt-2">
                  "{pengurus[0].desc}"
                </p>
              </div>
            </div>

            {/* Connecting lines for structural rendering */}
            <div className="hidden md:flex justify-center -my-10 h-10">
              <div className="w-1/2 border-x-2 border-dashed border-white/10 relative">
                <div className="absolute bottom-0 left-0 right-0 border-t-2 border-dashed border-white/10" />
              </div>
            </div>

            {/* 2. SEKRETARIS & BENDAHARA (Grid on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Sekretaris */}
              <div className="glass-card hover:bg-slate-900/60 transition-all border border-white/10 p-5 rounded-2xl shadow-md relative">
                <div className="absolute top-0 left-6 -translate-y-1/2 px-3 py-0.5 bg-slate-700 border border-white/10 text-white text-[9px] font-bold uppercase rounded-full tracking-wider">
                  Sekretaris KKG
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <img
                    src={pengurus[1].image}
                    alt={pengurus[1].name}
                    className="w-11 h-11 rounded-xl object-cover shadow-xs bg-slate-800 border border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">{pengurus[1].name}</h4>
                    <p className="text-[10px] text-slate-350 font-semibold">{pengurus[1].sekolah}</p>
                    <p className="text-[10px] text-slate-400">NIP. {pengurus[1].nip}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-350 mt-3 leading-relaxed border-t border-white/5 pt-2 italic">
                  {pengurus[1].desc}
                </p>
              </div>

              {/* Bendahara */}
              <div className="glass-card hover:bg-slate-900/60 transition-all border border-white/10 p-5 rounded-2xl shadow-md relative">
                <div className="absolute top-0 left-6 -translate-y-1/2 px-3 py-0.5 bg-slate-700 border border-white/10 text-white text-[9px] font-bold uppercase rounded-full tracking-wider">
                  Bendahara KKG
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <img
                    src={pengurus[2].image}
                    alt={pengurus[2].name}
                    className="w-11 h-11 rounded-xl object-cover shadow-xs bg-slate-800 border border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">{pengurus[2].name}</h4>
                    <p className="text-[10px] text-slate-350 font-semibold">{pengurus[2].sekolah}</p>
                    <p className="text-[10px] text-slate-400">NIP. {pengurus[2].nip}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-350 mt-3 leading-relaxed border-t border-white/5 pt-2 italic">
                  {pengurus[2].desc}
                </p>
              </div>

            </div>

            {/* Members section line */}
            <div className="text-center pt-4">
              <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 text-slate-200 text-xs font-bold rounded-xl shadow-md uppercase tracking-wider font-sans">
                👥 Seluruh Guru PJOK SD & SMP Luwuk Timur Sebagai Anggota Aktif
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
