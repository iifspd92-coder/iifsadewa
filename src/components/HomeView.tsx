/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Users, 
  School, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Megaphone, 
  Download, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Guru, Kegiatan, Berita } from '../types';

interface HomeViewProps {
  gurus: Guru[];
  kegiatans: Kegiatan[];
  beritas: Berita[];
  setActiveTab: (tab: string) => void;
  onLoginClick: () => void;
}

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200',
    title: 'Membangun Karakter Siswa Lewat Olahraga',
    subtitle: 'KKG PJOK Kecamatan Luwuk Timur berdedikasi menciptakan generasi muda yang sehat, cerdas, dan sportif se-Kabupaten Banggai.'
  },
  {
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
    title: 'Bimtek Kurikulum Merdeka PJOK',
    subtitle: 'Membekali guru olahraga Luwuk Timur dengan metode ajar modern, kolaboratif, dan inklusif sesuai standar nasional.'
  },
  {
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1200',
    title: 'O2SN Tingkat Kecamatan Luwuk Timur',
    subtitle: 'Pencarian bibit-bibit unggul atlet muda berprestasi di bidang atletik, senam, silat, dan bulutangkis.'
  }
];

export default function HomeView({
  gurus,
  kegiatans,
  beritas,
  setActiveTab,
  onLoginClick,
}: HomeViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const countSekolah = Array.from(new Set(gurus.map(g => g.sekolah))).length;

  return (
    <div className="space-y-12 pb-16 text-slate-100">
      
      {/* 1. Hero Sliders */}
      <div className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-slate-900/20 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-102 transition-transform duration-10000 group-hover:scale-105"
            />
            {/* Slide Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-20 max-w-4xl text-white">
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={currentSlide === index ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block px-3 py-1 bg-emerald-600/80 border border-white/20 text-[10px] font-bold rounded-full uppercase tracking-widest mb-3 shadow-md"
              >
                Kegiatan Unggulan 🏸
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={currentSlide === index ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md leading-tight text-white"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={currentSlide === index ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 block drop-shadow-sm max-w-2xl"
              >
                {slide.subtitle}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={currentSlide === index ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                <button
                  onClick={() => setActiveTab('agenda')}
                  className="flex items-center gap-1.5 px-5 py-2.5 btn-sport font-semibold rounded-xl text-xs transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-sport-gold" />
                  Lihat Agenda KKG
                </button>
                <button
                  onClick={() => setActiveTab('galeri')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 font-semibold rounded-xl text-xs transition-all backdrop-blur-md cursor-pointer text-white"
                >
                  Dokumentasi Foto
                </button>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white z-30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white z-30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-white/10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute right-8 bottom-8 flex gap-2 z-30">
          {SLIDES.map((_, i) => (
            <button
               key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === i ? 'bg-blue-500 w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Fast Access Buttons / Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Registrasi Guru',
            desc: 'Daftarkan data guru PJOK se-Luwuk Timur',
            icon: Users,
            color: 'from-blue-500/10 to-indigo-600/5 hover:border-blue-500/30 text-blue-300',
            iconBg: 'bg-blue-600/15 border-blue-500/20 text-blue-400',
            action: () => onLoginClick(),
            btnLabel: 'Klik login & daftar'
          },
          {
            title: 'Unduh RPP & Modul',
            desc: 'Kumpulan perangkat ajar PJOK kurikulum Merdeka',
            icon: Download,
            color: 'from-emerald-500/10 to-teal-600/5 hover:border-emerald-500/30 text-emerald-300',
            iconBg: 'bg-emerald-600/15 border-emerald-500/20 text-emerald-450',
            action: () => setActiveTab('download'),
            btnLabel: 'Download Center'
          },
          {
            title: 'Forum Diskusi',
            desc: 'Diskusikan metode ajar dan sarana olahraga',
            icon: MessageSquare,
            color: 'from-amber-500/10 to-orange-600/5 hover:border-amber-500/30 text-amber-300',
            iconBg: 'bg-amber-600/15 border-amber-500/20 text-amber-400',
            action: () => setActiveTab('forum'),
            btnLabel: 'Masuk Forum'
          },
          {
            title: 'Hubungi Pengurus',
            desc: 'Pusat bantuan & komunikasi administrasi',
            icon: Megaphone,
            color: 'from-rose-500/10 to-pink-600/5 hover:border-rose-500/30 text-rose-300',
            iconBg: 'bg-rose-600/15 border-rose-500/20 text-rose-400',
            action: () => setActiveTab('kontak'),
            btnLabel: 'Layanan Kontak'
          }
        ].map((act, i) => (
          <div
            key={i}
            className={`glass-card glass-card-hover bg-gradient-to-br ${act.color} p-5 rounded-2xl flex flex-col justify-between border relative overflow-hidden`}
          >
            <div className="space-y-3">
              <div className={`w-10 h-10 rounded-xl ${act.iconBg} flex items-center justify-center border shadow-inner`}>
                <act.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white font-display text-sm leading-tight">{act.title}</h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{act.desc}</p>
              </div>
            </div>
            <button
              onClick={act.action}
              className="mt-6 text-xs font-semibold flex items-center justify-between text-slate-300 hover:text-emerald-450 group/act cursor-pointer"
            >
              <span className="transition-colors group-hover/act:text-white">{act.btnLabel}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 transition-transform group-hover/act:translate-x-1" />
            </button>
          </div>
        ))}
      </div>

      {/* 3. Sambutan Ketua KKG PJOK */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 opacity-30 pointer-events-none blur-xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full -ml-24 -mb-24 opacity-30 pointer-events-none blur-xl" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          
          {/* Photos Frame */}
          <div className="w-40 sm:w-48 h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border-4 border-white/10 shadow-2xl flex-shrink-0 relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300"
              alt="Iif Sadewa Goa, S.Pd."
              className="w-full h-full object-cover saturate-75"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 text-white text-center py-1 text-[10px] font-semibold tracking-wide uppercase border-t border-white/5">
              Ketua KKG PJOK
            </div>
          </div>

          {/* Sambutan Content */}
          <div className="space-y-4 flex-1">
            <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase block">
              Sambutan Ketua KKG
            </span>
            <h3 className="text-2xl font-bold font-display text-white leading-tight">
              Selamat Datang di Portal Resmi KKG PJOK Luwuk Timur!
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-emerald-400 pl-4 bg-white/5 py-3 rounded-r-xl">
              "Salam Olahraga! Jaya! Kelompok Kerja Guru Pendidikan Jasmani, Olahraga, dan Kesehatan (KKG PJOK) Kecamatan Luwuk Timur hadir sebagai wadah inovasi, refleksi, dan kolaborasi bagi seluruh pendidik olahraga di wilayah kita. Website resmi ini didesain sebagai pusat data keanggotaan, agenda kolaboratif, serta sarana penyebaran dokumen penting. Mari kita terus tingkatkan kompetensi profesionalitas untuk mencetak generasi Luwuk Timur yang bugar, berkarakter, dan berprestasi unggul se-Kabupaten Banggai."
            </p>

            <div className="pt-2">
              <p className="font-bold font-display text-white text-sm">
                Iif Sadewa Goa, S.Pd.
              </p>
              <p className="text-[11px] text-slate-400">
                NIP. 199602292024211024 | Guru SD Negeri Banpres Bantayan 2
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Statistics Widget */}
      <div className="glass-card text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-emerald-900/10 border border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_50%)]" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto border border-white/10 shadow-inner">
              <Users className="w-6 h-6 text-sport-gold" />
            </div>
            <p className="text-4xl font-display font-black text-white text-glow-blue">{gurus.length}</p>
            <p className="text-[10px] font-bold text-slate-350 uppercase tracking-widest">Guru PJOK Aktif</p>
            <p className="text-[10px] text-slate-400">Tersebar se-Kecamatan</p>
          </div>

          <div className="space-y-2 border-y sm:border-y-0 sm:border-x border-white/15 py-6 sm:py-0">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto border border-white/10 shadow-inner">
              <School className="w-6 h-6 text-sport-gold" />
            </div>
            <p className="text-4xl font-display font-black text-white text-glow-green">{countSekolah}</p>
            <p className="text-[10px] font-bold text-slate-350 uppercase tracking-widest">Sekolah Binaan</p>
            <p className="text-[10px] text-slate-400">SD & SMP Negeri/Swasta</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto border border-white/10 shadow-inner">
              <Trophy className="w-6 h-6 text-sport-gold" />
            </div>
            <p className="text-4xl font-display font-black text-white text-glow">{kegiatans.length}</p>
            <p className="text-[10px] font-bold text-slate-350 uppercase tracking-widest">Kegiatan Tahunan</p>
            <p className="text-[10px] text-slate-400">Rapat, Lomba, Bimtek</p>
          </div>
        </div>
      </div>

      {/* 5. Latest News Section Banner */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <div>
            <h3 className="text-xl font-bold text-white font-display">Sorotan Berita Terbaru</h3>
            <p className="text-xs text-slate-300">Artikel kegiatan olahraga sekolah dan pengumuman KKG</p>
          </div>
          <button
            onClick={() => setActiveTab('berita')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
          >
            Semua Berita
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beritas.slice(0, 3).map((news) => (
            <div
              key={news.id}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border"
            >
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-slate-900 border-b border-white/10">
                  <img
                    src={news.imageUrl}
                    alt={news.judul}
                    className="w-full h-full object-cover grayscale-15 hover:grayscale-0 transition-all duration-300"
                  />
                  <span className="absolute bottom-3 left-3 px-2 py-1 bg-slate-950/80 text-white font-semibold rounded text-[9px] uppercase tracking-wider border border-white/10">
                    {news.kategori}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-[9.5px] font-semibold text-slate-400 font-mono">
                    📆 {news.tanggal} | ✒️ {news.penulis}
                  </p>
                  <h4 className="font-bold text-white text-sm leading-snug line-clamp-2 hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => setActiveTab('berita')}>
                    {news.judul}
                  </h4>
                  <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed">
                    {news.ringkasan}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-white/5">
                <button
                  onClick={() => setActiveTab('berita')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Baca Selengkapnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
