/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, FileText, Download, SlidersHorizontal, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Guru } from '../types';

interface DataGuruViewProps {
  gurus: Guru[];
  onAddTeacherClick?: () => void; // Optional admin hook
}

export default function DataGuruView({ gurus, onAddTeacherClick }: DataGuruViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSekolah, setSelectedSekolah] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [showFilters, setShowFilters] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // List unique schools for filtering options
  const sekolahList = useMemo(() => {
    const list = new Set(gurus.map((g) => g.sekolah));
    return ['Semua', ...Array.from(list)];
  }, [gurus]);

  // Filtered teachers list based on criteria
  const filteredGurus = useMemo(() => {
    return gurus.filter((g) => {
      const matchSearch =
        g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.jabatan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSekolah = selectedSekolah === 'Semua' || g.sekolah === selectedSekolah;
      const matchStatus = selectedStatus === 'Semua' || g.status === selectedStatus;

      return matchSearch && matchSekolah && matchStatus;
    });
  }, [gurus, searchTerm, selectedSekolah, selectedStatus]);

  // Simulate Excel Export via CSV download link
  const handleExportCSV = () => {
    try {
      const headers = ['No', 'Nama Lengkap', 'NIP', 'Sekolah', 'Kecamatan', 'Jabatan', 'No HP', 'Email', 'Status'];
      const rows = filteredGurus.map((g, index) => [
        index + 1,
        `"${g.nama}"`,
        `"${g.nip}"`,
        `"${g.sekolah}"`,
        `"${g.kecamatan}"`,
        `"${g.jabatan}"`,
        `"${g.noHp}"`,
        `"${g.email}"`,
        `"${g.status}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'data_guru_kkg_pjok_luwuk_timur.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerNotification('📊 Data Berhasil Diexport ke CSV (Bisa dibuka di Excel / Sheets)!');
    } catch (e) {
      triggerNotification('❌ Gagal mengunduh file CSV.');
    }
  };

  // Simulate PDF export via print styling helper
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerNotification('⚠️ Izinkan pop-up browser untuk mendownload PDF!');
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Data Guru KKG PJOK Kecamatan Luwuk Timur</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #333; }
            h1 { text-align: center; margin-bottom: 5px; color: #0b57d0; font-size: 22px; }
            h3 { text-align: center; margin-top: 0; color: #666; font-size: 14px; font-weight: normal; }
            table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 11px; }
            th, td { border: 1px solid #ddd; padding: 10px 8px; text-align: left; }
            th { background-color: #f5f5f5; color: #111; font-weight: bold; }
            tr:nth-child(even) { background-color: #fafafa; }
            .footer { margin-top: 40px; text-align: right; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>KELOMPOK KERJA GURU (KKG) PJOK KECAMATAN LUWUK TIMUR</h1>
          <h3>Kabupaten Banggai, Provinsi Sulawesi Tengah | Laporan Data Guru</h3>
          <hr />
          <table>
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 25%">Nama Lengkap</th>
                <th style="width: 15%">NIP</th>
                <th style="width: 20%">Sekolah Asal</th>
                <th style="width: 15%">Jabatan / Tugas</th>
                <th style="width: 10%">No WhatsApp</th>
                <th style="width: 10%">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredGurus.map((g, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td><strong>${g.nama}</strong></td>
                  <td>${g.nip}</td>
                  <td>${g.sekolah}</td>
                  <td>${g.jabatan}</td>
                  <td>${g.noHp}</td>
                  <td>${g.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Luwuk Timur</p>
            <p style="margin-top: 50px;"><strong>Iif Sadewa Goa, S.Pd.</strong><br/>Ketua KKG PJOK</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    triggerNotification('🖨️ Membuka jendela print PDF Guru PJOK...');
  };

  const triggerNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSekolah('Semua');
    setSelectedStatus('Semua');
    triggerNotification('🔄 Filter pencarian berhasil direset.');
  };

  return (
    <div className="space-y-6 pb-16 text-slate-100">
      
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-white/15 text-white text-xs py-3 px-5 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Title block */}
      <div className="px-1">
        <h2 className="text-xl font-bold text-white font-display">Database Guru PJOK</h2>
        <p className="text-xs text-slate-300">
          Sistem administrasi, integrasi data, dan koordinasi se-Kecamatan Luwuk Timur.
        </p>
      </div>

      {/* Controls: Search & Filtering Bar */}
      <div className="glass-card border border-white/10 p-5 rounded-2xl shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
            <input
              type="text"
              placeholder="Cari guru berdasarkan nama, NIP, email, jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showFilters
                  ? 'bg-white/15 border-white/20 text-emerald-450 shadow-inner'
                  : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced Filter
            </button>
            
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              title="Ekspor ke Excel/CSV"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              title="Cetak PDF/Laporan"
            >
              <FileText className="w-4 h-4" />
              Cetak PDF
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 bg-black/15 p-4 rounded-xl">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">Sekolah</label>
              <select
                value={selectedSekolah}
                onChange={(e) => setSelectedSekolah(e.target.value)}
                className="w-full p-2.5 glass-input rounded-lg text-xs"
              >
                {sekolahList.map((sch) => (
                  <option key={sch} value={sch} className="bg-slate-900 text-white">{sch}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">Status Kepegawaian</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2.5 glass-input rounded-lg text-xs"
              >
                <option value="Semua" className="bg-slate-900 text-white">Semua Status</option>
                <option value="Aktif" className="bg-slate-900 text-white">Aktif</option>
                <option value="Nonaktif" className="bg-slate-900 text-white">Non-Aktif</option>
                <option value="Mutasi" className="bg-slate-900 text-white">Mutasi</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 rounded-lg text-xs font-bold cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Semua Filter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Teachers Database Table Layout */}
      <div className="glass-card border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] font-bold text-slate-200 uppercase tracking-wider font-mono">
                <th className="py-4 px-5 w-12 text-center">No</th>
                <th className="py-4 px-4">Nama Lengkap & NIP</th>
                <th className="py-4 px-4">Asal Sekolah</th>
                <th className="py-4 px-4">Jabatan Organisasi</th>
                <th className="py-4 px-4">Info Kontak</th>
                <th className="py-4 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-200">
              {filteredGurus.length > 0 ? (
                filteredGurus.map((g, index) => (
                  <tr key={g.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-5 text-center font-mono text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-white text-sm sm:text-xs">{g.nama}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {g.nip === '-' ? 'NIP: - (Honorer)' : `NIP: ${g.nip}`}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="font-semibold text-white">{g.sekolah}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                        Kec. Luwuk Timur
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        g.jabatan.includes('Ketua') || g.jabatan.includes('Sekretaris') || g.jabatan.includes('Bendahara')
                          ? 'bg-blue-500/15 border border-blue-500/20 text-blue-300'
                          : 'bg-white/10 border border-white/10 text-slate-300'
                      }`}>
                        {g.jabatan}
                      </span>
                    </td>
                    <td className="py-4 px-4 space-y-1 text-[11px] sm:text-xs">
                      <p className="text-white">📞 <a href={`https://wa.me/${g.noHp}`} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-emerald-400 font-mono text-emerald-300 font-semibold">{g.noHp}</a></p>
                      <p className="text-slate-400 font-mono break-all hover:text-white transition-colors">{g.email}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        g.status === 'Aktif'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                          : g.status === 'Nonaktif'
                          ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          g.status === 'Aktif' 
                            ? 'bg-emerald-450' 
                            : g.status === 'Nonaktif' 
                            ? 'bg-rose-400' 
                            : 'bg-amber-400'
                        }`} />
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 bg-black/10">
                    <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    Tidak ada data guru yang mencocoki filter pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table footer count info */}
        <div className="bg-black/20 px-5 py-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Menampilkan {filteredGurus.length} dari total {gurus.length} guru terdaftar</span>
          <span className="hidden sm:inline">Pusat Data KKG PJOK Luwuk Timur</span>
        </div>
      </div>
      
    </div>
  );
}
