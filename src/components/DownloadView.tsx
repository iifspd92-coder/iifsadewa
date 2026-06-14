/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { Download, FileText, Search, Plus, Trash2, CheckCircle, UploadCloud, FileSpreadsheet, FileVideo, Book, ShieldAlert, X } from 'lucide-react';
import { Dokumen } from '../types';

interface DownloadViewProps {
  dokumens: Dokumen[];
  onUploadDocument: (newDoc: Dokumen) => void;
  onDeleteDocument: (id: string) => void;
  currentUser: any;
}

export default function DownloadView({
  dokumens,
  onUploadDocument,
  onDeleteDocument,
  currentUser,
}: DownloadViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<'Semua' | 'Modul SD' | 'Silabus' | 'RPP' | 'Dokumen Lomba' | 'Sertifikat' | 'Lainnya'>('Semua');
  const [notif, setNotif] = useState<string | null>(null);

  // Upload Form states
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileKategori, setFileKategori] = useState<Dokumen['kategori']>('Modul SD');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [fileType, setFileType] = useState<Dokumen['tipe']>('pdf');
  const [dragActive, setDragActive] = useState(false);
  const fileSelectorRef = useRef<HTMLInputElement>(null);

  const filteredDocs = useMemo(() => {
    return dokumens.filter(d => {
      const matchSearch = d.judul.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKat = selectedKategori === 'Semua' || d.kategori === selectedKategori;
      return matchSearch && matchKat;
    });
  }, [dokumens, searchTerm, selectedKategori]);

  const showNotification = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  // Simulated download click with actual UX feedback
  const handleDownload = (doc: Dokumen) => {
    showNotification(`📥 Memulai unduhan file "${doc.judul}"...`);
    
    try {
      const blob = new Blob([`Simulated document content for ${doc.judul}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.judul.toLowerCase().replace(/\s+/g, '_')}.${doc.tipe}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      // Fallback
    }
  };

  // Drag and drop processing
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
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setFileName(file.name.replace(/\.[^/.]+$/, "")); // Strip extension for cleaner title input
    
    // Estimate size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setFileSize(`${sizeInMB} MB`);

    // Assign file type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') setFileType('pdf');
    else if (ext === 'docx' || ext === 'doc') setFileType('docx');
    else if (ext === 'xlsx' || ext === 'xls') setFileType('xlsx');
    else if (ext === 'zip' || ext === 'rar') setFileType('zip');
    else setFileType('pdf'); // default fallback
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    const newDoc: Dokumen = {
      id: `D_MOCK_${Date.now()}`,
      judul: fileName,
      kategori: fileKategori,
      ukuran: fileSize,
      tipe: fileType,
      tanggalUpload: new Date().toISOString().split('T')[0],
      url: '#'
    };

    onUploadDocument(newDoc);
    showNotification('✅ Perangkat ajar / dokumen baru sukses diunggah!');
    
    // Reset Form
    setFileName('');
    setShowForm(false);
  };

  const getIconForType = (type: Dokumen['tipe']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-rose-450 text-glow-red" />;
      case 'docx': return <Book className="w-5 h-5 text-blue-400" />;
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'zip': return <FileVideo className="w-5 h-5 text-amber-450" />;
    }
  };

  return (
    <div className="space-y-6 pb-16 text-slate-100 font-sans">
      
      {/* Visual notification banner */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-white/15 text-white text-xs py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-450" />
          <span>{notif}</span>
        </div>
      )}

      {/* Header and Trigger upload */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Download Center & Perpustakaan Digital</h2>
          <p className="text-xs text-slate-300">
            Akses cepat modul ajar PJOK kurikulum merdeka kelas 1-6 SD, silabus KKG, RPP, dan juknis O2SN.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 btn-sport text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-sport-gold" />
          Upload Berkas Pembelajaran
        </button>
      </div>

      {/* Upload Document Box */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-modal border border-white/15 p-6 rounded-3xl shadow-2xl space-y-4 animate-fade-in text-white">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wider">
              <UploadCloud className="w-4.5 h-4.5 text-emerald-400" />
              Unggah File Perangkat Ajar Baru
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-350 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Info */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5 font-mono">Nama / Judul File Dokumen</label>
                <input
                  type="text"
                  placeholder="Contoh: Modul Ajar PJOK Kelas 5 Bab Bola Basket..."
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2.5 glass-input rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5 font-mono">Kategori Dokumen</label>
                  <select
                    value={fileKategori}
                    onChange={(e) => setFileKategori(e.target.value as any)}
                    className="w-full p-2.5 glass-input rounded-xl text-xs text-slate-200"
                  >
                    <option value="Modul SD" className="bg-slate-900 text-white">Modul SD</option>
                    <option value="Silabus" className="bg-slate-900 text-white">Silabus</option>
                    <option value="RPP" className="bg-slate-900 text-white">RPP</option>
                    <option value="Dokumen Lomba" className="bg-slate-900 text-white">Dokumen Lomba</option>
                    <option value="Sertifikat" className="bg-slate-900 text-white">Sertifikat</option>
                    <option value="Lainnya" className="bg-slate-900 text-white">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5 font-mono">Format file</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full p-2.5 glass-input rounded-xl text-xs text-slate-200"
                  >
                    <option value="pdf" className="bg-slate-900 text-white">PDF</option>
                    <option value="docx" className="bg-slate-900 text-white">DOCX</option>
                    <option value="xlsx" className="bg-slate-900 text-white">XLSX</option>
                    <option value="zip" className="bg-slate-900 text-white">ZIP</option>
                  </select>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] text-slate-300 flex items-start gap-1.5 leading-relaxed">
                <ShieldAlert className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Dokumen yang diupload disarankan berupa bahan ajar resmi yang bermanfaat bagi jajaran Guru PJOK se-Kecamatan.</span>
              </div>
            </div>

            {/* Simulated Drag & drop file selection */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileSelectorRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-blue-400 bg-blue-500/10' 
                  : fileName 
                  ? 'border-emerald-400 bg-emerald-500/5' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <input
                ref={fileSelectorRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.zip,.rar"
                onChange={handleFileChange}
              />
              <UploadCloud className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="mt-2 text-xs">
                {fileName ? (
                  <p className="text-emerald-405 font-bold">Dokumen Siap Unggah! Klik untuk mengubah file</p>
                ) : (
                  <>
                    <p className="font-semibold text-white">Tarik berkas RPP / dokumen ke sini, atau klik untuk memilih</p>
                    <p className="text-[10px] text-slate-400 mt-1">Mendukung format PDF, Word, Excel, ZIP (max 10MB)</p>
                  </>
                )}
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-white/10 text-slate-300 rounded-xl text-xs font-bold hover:bg-white/10 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 btn-sport text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              Simpan File Unduhan
            </button>
          </div>
        </form>
      )}

      {/* Controls search & filter category tabs */}
      <div className="glass-card border border-white/10 p-4 rounded-2xl shadow-md flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search input */}
        <div className="relative flex-1 w-full text-white">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
          <input
            type="text"
            placeholder="Cari nama silabus, RPP, modul ajar, sertifikat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs"
          />
        </div>

        {/* Category Dropdowns filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {(['Semua', 'Modul SD', 'Silabus', 'RPP', 'Dokumen Lomba', 'Sertifikat', 'Lainnya'] as const).map((kt) => (
            <button
              key={kt}
              onClick={() => setSelectedKategori(kt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                selectedKategori === kt
                  ? 'bg-blue-600 border border-white/10 text-white shadow-md'
                  : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {kt}
            </button>
          ))}
        </div>

      </div>

      {/* Documents Grid / List */}
      <div className="glass-card border border-white/10 rounded-2xl shadow-xl divide-y divide-white/5 overflow-hidden text-white">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 shadow-md flex items-center justify-center shrink-0">
                  {getIconForType(doc.tipe)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight hover:text-blue-400 cursor-pointer" onClick={() => handleDownload(doc)}>
                    {doc.judul}
                  </h4>
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono mt-1.5 uppercase">
                    <span className="font-bold text-emerald-400">🏷️ {doc.kategori}</span>
                    <span>|</span>
                    <span>📦 UKURAN: {doc.ukuran}</span>
                    <span>|</span>
                    <span>💾 TANGGAL: {doc.tanggalUpload}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg text-xs border border-rose-500/20 cursor-pointer"
                    title="Hapus File"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                )}

                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  <Download className="w-4 h-4 text-sport-gold" />
                  Unduh Berkas
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="py-16 text-center text-slate-400 bg-black/15">
            <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm">Dokumen yang dicari tidak ditemukan.</p>
          </div>
        )}
      </div>

    </div>
  );
}
