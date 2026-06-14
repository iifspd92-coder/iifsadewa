/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Newspaper, ArrowLeft, Send, MessageSquare, AlertCircle, Plus, X } from 'lucide-react';
import { Berita, Komentar } from '../types';

interface BeritaViewProps {
  beritaList: Berita[];
  onAddBerita: (newBerita: Berita) => void;
  onAddKomentar: (beritaId: string, komentar: Komentar) => void;
  currentUser: any;
}

export default function BeritaView({
  beritaList,
  onAddBerita,
  onAddKomentar,
  currentUser,
}: BeritaViewProps) {
  const [activeBeritaId, setActiveBeritaId] = useState<string | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<'Semua' | 'Berita KKG' | 'Lomba & Turnamen' | 'Pengumuman Resmi'>('Semua');

  // Comment Form state
  const [commentName, setCommentName] = useState('');
  const [commentBody, setCommentBody] = useState('');

  // Post Article form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newKategori, setNewKategori] = useState<'Berita KKG' | 'Lomba & Turnamen' | 'Pengumuman Resmi'>('Berita KKG');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=800');

  // Filtered Articles list
  const filteredBerita = useMemo(() => {
    return beritaList.filter(b => selectedKategori === 'Semua' || b.kategori === selectedKategori);
  }, [beritaList, selectedKategori]);

  // Read single article
  const activeBerita = useMemo(() => {
    return beritaList.find(b => b.id === activeBeritaId);
  }, [beritaList, activeBeritaId]);

  // Submit dynamic comment inside article
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody) return;

    const authorName = currentUser?.nama || commentName || 'Pengunjung Anonim';
    const newComment: Komentar = {
      id: `C_MOCK_${Date.now()}`,
      nama: authorName,
      isi: commentBody,
      tanggal: new Date().toISOString().split('T')[0]
    };

    if (activeBeritaId) {
      onAddKomentar(activeBeritaId, newComment);
      setCommentBody('');
              // Prepopulate commenter name if guest
      if (!currentUser) setCommentName('');
    }
  };

  // Submit dynamic article posting
  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary || !newContent) {
      alert('Harap isi judul, ringkasan, dan konten berita.');
      return;
    }

    const newArticle: Berita = {
      id: `B_MOCK_${Date.now()}`,
      judul: newTitle,
      ringkasan: newSummary,
      isi: newContent,
      tanggal: new Date().toISOString().split('T')[0],
      kategori: newKategori,
      imageUrl: newImage,
      penulis: currentUser?.nama || 'Admin KKG PJOK',
      komentar: []
    };

    onAddBerita(newArticle);
    
    // reset states
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      
      {/* Article Detailed view */}
      {activeBerita ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* Back button */}
          <button
            onClick={() => setActiveBeritaId(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-glow-indigo" />
            Kembali ke Daftar Berita & Artikel
          </button>

          <article className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Banner block */}
            <div className="h-64 sm:h-[350px] w-full relative">
              <img
                src={activeBerita.imageUrl}
                alt={activeBerita.judul}
                className="w-full h-full object-cover grayscale-[10%]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 bg-amber-505 bg-amber-600/80 border border-amber-500/30 text-white font-bold rounded-lg text-[10px] uppercase font-mono tracking-wider">
                  {activeBerita.kategori}
                </span>
                <h2 className="text-xl sm:text-3xl font-bold font-display leading-tight tracking-tight mt-1">
                  {activeBerita.judul}
                </h2>
              </div>
            </div>

            {/* Author details bar */}
            <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex flex-wrap justify-between items-center text-xs text-slate-350 font-mono">
              <p>✒️ Diunggah oleh: <span className="font-bold text-white">{activeBerita.penulis}</span></p>
              <p>📆 Tanggal: <span className="font-bold text-white">{activeBerita.tanggal}</span></p>
            </div>

            {/* Structured Content body */}
            <div className="p-6 sm:p-10 text-slate-200 leading-relaxed text-xs sm:text-sm space-y-4 whitespace-pre-line border-b border-white/10">
              {activeBerita.isi}
            </div>

            {/* Interactive Comment Zone */}
            <div className="p-6 sm:p-10 space-y-6 bg-black/15">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wide">
                <MessageSquare className="w-4.5 h-4.5 text-emerald-400" />
                Kolom Komentar ({activeBerita.komentar.length})
              </h3>

              {/* List Comments */}
              <div className="space-y-4">
                {activeBerita.komentar.length > 0 ? (
                  activeBerita.komentar.map((com) => (
                    <div
                      key={com.id}
                      className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-inner space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center text-slate-405 font-mono text-[10px]">
                        <span className="font-bold text-white">{com.nama}</span>
                        <span className="text-slate-400">📆 {com.tanggal}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{com.isi}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs italic">Belum ada tanggapan untuk artikel ini. Silakan kirimkan komentar pertama Anda!</p>
                )}
              </div>

              {/* Leave comments form */}
              <form onSubmit={handleCommentSubmit} className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4 space-y-3">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Tulis Komentar Pertanyaan / Saran</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {!currentUser && (
                    <input
                      type="text"
                      placeholder="Nama Lengkap Anda..."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="p-2.5 glass-input rounded-xl text-xs"
                      required
                    />
                  )}
                  {currentUser && (
                    <div className="bg-white/15 p-2.5 border border-white/10 rounded-xl text-xs text-white font-bold flex items-center gap-1">
                      👤 {currentUser.nama} ({currentUser.role})
                    </div>
                  )}
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Tuliskan komentar konstruktif Anda terkait kegiatan atau pengumuman ini..."
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    rows={3}
                    className="w-full p-3 glass-input rounded-xl text-xs focus:outline-none"
                    required
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4.5 py-2 btn-sport text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Kirim Tanggapan
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </article>

        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Header & New Article Trigger */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Berita & Pengumuman Sekolah</h2>
              <p className="text-xs text-slate-300">
                Pusat penyebaran berita olahraga sekolah dasar, agenda lomba siswa, dan pengumuman kedinasan.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-4.5 py-2.5 btn-sport text-white font-bold rounded-xl text-xs transition-transform shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-sport-gold" />
              Tulis Artikel Baru
            </button>
          </div>

          {/* Collapsible Write Article Form */}
          {showAddForm && (
            <form onSubmit={handleArticleSubmit} className="glass-modal border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in text-white">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Newspaper className="w-4 h-4 text-emerald-400" />
                  Buat Berita / Pengumuman KKG Baru
                </h3>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-350 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Judul Artikel / Berita</label>
                  <input
                    type="text"
                    placeholder="Contoh: Seleksi Atletik O2SN Dibuka..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Kategori Berita</label>
                    <select
                      value={newKategori}
                      onChange={(e) => setNewKategori(e.target.value as any)}
                      className="w-full p-2.5 glass-input rounded-xl text-xs text-slate-200"
                    >
                      <option value="Berita KKG" className="bg-slate-900 text-white">Berita KKG</option>
                      <option value="Lomba & Turnamen" className="bg-slate-900 text-white">Lomba & Turnamen</option>
                      <option value="Pengumuman Resmi" className="bg-slate-900 text-white">Pengumuman Resmi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Foto Banner Cover URL</label>
                    <input
                      type="text"
                      placeholder="Masukkan URL foto olahraga..."
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="w-full p-2.5 glass-input rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Ringkasan Singkat (Muncul di Halaman Utama)</label>
                  <input
                    type="text"
                    placeholder="Tuliskan 1 kalimat ringkasan pancingan..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Isi Konten Berita Lengkap</label>
                  <textarea
                    placeholder="Tuliskan narasi berita olahraga Anda secara lengkap di kolom ini..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={6}
                    className="w-full p-3 glass-input rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-white/10 text-slate-300 rounded-xl text-xs font-bold hover:bg-white/10 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 btn-sport text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Publikasikan Berita
                </button>
              </div>
            </form>
          )}

          {/* Category Tabs filter */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
            {(['Semua', 'Berita KKG', 'Lomba & Turnamen', 'Pengumuman Resmi'] as const).map((kat) => (
              <button
                key={kat}
                onClick={() => setSelectedKategori(kat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedKategori === kat
                    ? 'bg-blue-600 border border-white/10 text-white font-bold'
                    : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          {/* News articles card lists layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBerita.map((item) => (
              <div
                key={item.id}
                className="glass-card hover:bg-slate-900/10 border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-white/20 transition-all text-white"
              >
                <div>
                  {/* Banner images */}
                  <div className="h-44 w-full relative bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover grayscale-[10%]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-wider border border-white/10">
                      {item.kategori}
                    </span>
                  </div>

                  {/* Body text details */}
                  <div className="p-5 space-y-2">
                    <div className="flex justify-between items-center text-[9.5px] text-slate-400 font-mono">
                      <span>📆 {item.tanggal}</span>
                      <span>💬 {item.komentar.length} Komentar</span>
                    </div>
                    <h3
                      onClick={() => setActiveBeritaId(item.id)}
                      className="font-bold text-white text-sm leading-snug line-clamp-2 hover:text-blue-400 transition-colors cursor-pointer font-display"
                    >
                      {item.judul}
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                      {item.ringkasan}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-white/5 flex justify-between items-center text-[10px]">
                  <span className="text-slate-405 font-mono">Penulis: {item.penulis.slice(0, 16)}</span>
                  <button
                    onClick={() => setActiveBeritaId(item.id)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer"
                  >
                    Buka Berita
                    <Send className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}

            {filteredBerita.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 glass-card border border-white/10 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm">Belum ada rilis berita atau pengumuman berkategori tersebut.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
