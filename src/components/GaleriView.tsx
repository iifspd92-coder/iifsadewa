/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { Camera, Image as ImageIcon, Plus, X, UploadCloud, ZoomIn, Check } from 'lucide-react';
import { Galeri } from '../types';

interface GaleriViewProps {
  galeriList: Galeri[];
  onUploadItem: (newItem: Galeri) => void;
  currentUser: any;
}

export default function GaleriView({ galeriList, onUploadItem, currentUser }: GaleriViewProps) {
  const [selectedYear, setSelectedYear] = useState<number | 'Semua'>('Semua');
  const [selectedKategori, setSelectedKategori] = useState<string | 'Semua'>('Semua');
  const [activeMedia, setActiveMedia] = useState<Galeri | null>(null);

  // Form states for uploading
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newKategori, setNewKategori] = useState<'Turnamen' | 'Pelatihan' | 'Rapat KKG' | 'Senam Bersama'>('Turnamen');
  const [newTahun, setNewTahun] = useState(2026);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const yearsList = useMemo(() => {
    return ['Semua', ...Array.from(new Set(galeriList.map(g => g.tahun))).sort((a,b) => b-a)];
  }, [galeriList]);

  const kategoriList = useMemo(() => {
    return ['Semua', ...Array.from(new Set(galeriList.map(g => g.kategori)))];
  }, [galeriList]);

  const filteredGaleri = useMemo(() => {
    return galeriList.filter(g => {
      const matchYear = selectedYear === 'Semua' || g.tahun === selectedYear;
      const matchKategori = selectedKategori === 'Semua' || g.kategori === selectedKategori;
      return matchYear && matchKategori;
    });
  }, [galeriList, selectedYear, selectedKategori]);

  // Handle Drag & Drop Upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Hanya diperbolehkan megunggah format gambar (JPG, PNG, GIF, dll).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBase64Image(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      alert('Harap isi judul dokumentasi.');
      return;
    }

    // Default illustration if no file was uploaded
    const imgUrl = base64Image || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800';

    const newItem: Galeri = {
      id: `GL_MOCK_${Date.now()}`,
      judul: newTitle,
      imageUrl: imgUrl,
      tahun: Number(newTahun),
      kategori: newKategori
    };

    onUploadItem(newItem);
    
    // Clear state
    setNewTitle('');
    setBase64Image(null);
    setShowUploadForm(false);
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Galeri & Dokumentasi Kegiatan</h2>
          <p className="text-xs text-slate-300">
            Arsip digital dokumentasi olahraga, pemaparan bimtek, dan potret turnamen KKG PJOK Luwuk Timur.
          </p>
        </div>

        {/* Upload Trigger button */}
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 btn-sport hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-sport-gold" />
          Kirim Dokumentasi Baru
        </button>
      </div>

      {/* Upload Form Box */}
      {showUploadForm && (
        <form 
          onSubmit={handleUploadSubmit}
          className="glass-modal rounded-3xl p-6 shadow-2xl border border-white/15 space-y-4 animate-fade-in text-white"
        >
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Camera className="w-4 h-4 text-emerald-400" />
              Upload Dokumentasi Foto Baru
            </h3>
            <button 
              type="button" 
              onClick={() => setShowUploadForm(false)}
              className="text-slate-350 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Title / Info */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Judul/Deskripsi Foto
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pembagian Hadiah Juara Bulutangkis Siswa..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                    Kategori Album
                  </label>
                  <select
                    value={newKategori}
                    onChange={(e) => setNewKategori(e.target.value as any)}
                    className="w-full p-2.5 glass-input rounded-xl text-xs"
                  >
                    <option value="Turnamen" className="bg-slate-900 text-white">Turnamen</option>
                    <option value="Pelatihan" className="bg-slate-900 text-white">Pelatihan</option>
                    <option value="Rapat KKG" className="bg-slate-900 text-white">Rapat KKG</option>
                    <option value="Senam Bersama" className="bg-slate-900 text-white">Senam Bersama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                    Tahun Kegiatan
                  </label>
                  <select
                    value={newTahun}
                    onChange={(e) => setNewTahun(Number(e.target.value))}
                    className="w-full p-2.5 glass-input rounded-xl text-xs"
                  >
                    <option value={2026} className="bg-slate-900 text-white">2026</option>
                    <option value={2025} className="bg-slate-900 text-white">2025</option>
                    <option value={2024} className="bg-slate-900 text-white">2024</option>
                  </select>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                <span>⚠️</span>
                <span>Foto yang dikirim akan secara otomatis tersimpan ke dalam album lokal web dan langsung muncul di bawah.</span>
              </div>
            </div>

            {/* Drag & Drop File Selector area */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-blue-400 bg-blue-500/10' 
                  : base64Image 
                  ? 'border-emerald-400 bg-emerald-500/5' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {base64Image ? (
                <div className="space-y-2 w-full flex flex-col items-center">
                  <img src={base64Image} alt="Preview" className="h-28 object-contain rounded-lg shadow-sm max-w-full" />
                  <p className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-glow-green" /> Gambar Terpilih! Klik untuk mengubah
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <p className="text-xs font-semibold text-white">Tarik gambar ke sini, atau klik untuk memilih</p>
                    <p className="text-[10px] text-slate-400 mt-1">Mendukung format JPG, PNG, WEBP (maksimal 4MB)</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-4 py-2 border border-white/10 text-slate-300 rounded-xl text-xs font-bold hover:bg-white/10 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 btn-sport text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              Simpan Dokumentasi
            </button>
          </div>
        </form>
      )}

      {/* Album Filters */}
      <div className="glass-card border border-white/10 p-4 rounded-2xl shadow-md flex flex-wrap gap-4 items-center justify-between">
        
        {/* Years Selector Tab */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10.5px] font-bold text-slate-350 uppercase tracking-widest mr-2 flex items-center gap-1 font-mono">
            📂 Album Tahun:
          </span>
          {yearsList.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedYear === yr
                  ? 'bg-blue-600 border border-white/10 text-white font-bold shadow-md'
                  : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Kategori Selector tab */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10.5px] font-bold text-slate-350 uppercase tracking-widest mr-2 flex items-center gap-1 font-mono">
            🏷️ Kategori:
          </span>
          {kategoriList.map((kt) => (
            <button
              key={kt}
              onClick={() => setSelectedKategori(kt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedKategori === kt
                  ? 'bg-emerald-600 border border-white/10 text-white font-bold shadow-md'
                  : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {kt}
            </button>
          ))}
        </div>

      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredGaleri.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveMedia(item)}
            className="group glass-card glass-card-hover border border-white/10 text-white rounded-2xl overflow-hidden shadow-md cursor-pointer relative"
          >
            {/* Image Frame */}
            <div className="h-48 w-full relative overflow-hidden bg-slate-900 border-b border-white/5 flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.judul}
                className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              {/* Cover overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>

              {/* Badges */}
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600 border border-white/10 text-white rounded text-[9px] font-bold">
                {item.tahun}
              </span>
              <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-slate-950/80 text-sport-gold rounded-full text-[9px] font-bold border border-white/10">
                {item.kategori}
              </span>
            </div>

            {/* Description */}
            <div className="p-4 bg-slate-900/10">
              <p className="text-white text-xs font-semibold line-clamp-2 leading-snug">
                {item.judul}
              </p>
            </div>
          </div>
        ))}

        {filteredGaleri.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 glass-card border border-white/10 rounded-3xl">
            <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300">Album terpilih kosong atau belum memiliki dokumentasi foto.</p>
          </div>
        )}
      </div>

      {/* Media lightbox modal view */}
      {activeMedia && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <button
            onClick={() => setActiveMedia(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-transform hover:scale-110 cursor-pointer border border-white/15"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full glass-modal rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 animate-fade-in text-white">
            
            {/* Visual Screen */}
            <div className="md:w-3/5 bg-black h-80 md:h-[450px] flex items-center justify-center relative border-r border-white/5">
              <img
                src={activeMedia.imageUrl}
                alt={activeMedia.judul}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Metadata sidebar */}
            <div className="md:w-2/5 p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
                    {activeMedia.tahun}
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
                    {activeMedia.kategori}
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white leading-snug">
                  {activeMedia.judul}
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed border-l border-white/10 pl-3">
                  Dokumentasi resmi ini diarsipkan secara tertib dalam database portal KKG PJOK Luwuk Timur guna melestarikan rekam jejak pembangunan kebugaran murid.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 text-[10px] text-slate-400 font-mono space-y-1">
                <p>📂 ID Arsip: {activeMedia.id}</p>
                <p>📍 Lokasi: Kecamatan Luwuk Timur, Kab Banggai</p>
                <button
                  onClick={() => setActiveMedia(null)}
                  className="mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-250 text-xs rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Tutup Dokumentasi
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
