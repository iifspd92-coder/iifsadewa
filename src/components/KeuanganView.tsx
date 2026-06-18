/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, Trash2, 
  Calendar as CalendarIcon, FileText, CheckCircle, AlertCircle, 
  Download, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TransaksiKeuangan, User } from '../types';

interface KeuanganViewProps {
  transaksiList: TransaksiKeuangan[];
  onAddTransaksi: (newTx: TransaksiKeuangan) => void;
  onDeleteTransaksi?: (id: string) => void; // Optional if we want allow deletion
  currentUser: User | null;
}

export default function KeuanganView({
  transaksiList,
  onAddTransaksi,
  onDeleteTransaksi,
  currentUser,
}: KeuanganViewProps) {
  const [filterType, setFilterType] = useState<'Semua' | 'Pemasukan' | 'Pengeluaran'>('Semua');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Form states for adding transactional log
  const [showForm, setShowForm] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [keterangan, setKeterangan] = useState('');
  const [tipe, setTipe] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [jumlah, setJumlah] = useState<number>(0);
  const [kategori, setKategori] = useState<TransaksiKeuangan['kategori']>('Iuran Kas');
  const [confirmDeleteTx, setConfirmDeleteTx] = useState<TransaksiKeuangan | null>(null);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Helper numbers
  const totals = useMemo(() => {
    let pemasukan = 0;
    let pengeluaran = 0;
    transaksiList.forEach(tx => {
      if (tx.tipe === 'Pemasukan') {
        pemasukan += tx.jumlah;
      } else {
        pengeluaran += tx.jumlah;
      }
    });
    return {
      pemasukan,
      pengeluaran,
      saldo: pemasukan - pengeluaran
    };
  }, [transaksiList]);

  // Unique categories for filtering
  const categoriesList = useMemo(() => {
    const categories = new Set(transaksiList.map(t => t.kategori));
    return ['Semua', ...Array.from(categories)];
  }, [transaksiList]);

  // Filtered transactions
  const filteredTransaksi = useMemo(() => {
    return transaksiList.filter(tx => {
      const matchType = filterType === 'Semua' || tx.tipe === filterType;
      const matchKategori = filterKategori === 'Semua' || tx.kategori === filterKategori;
      return matchType && matchKategori;
    });
  }, [transaksiList, filterType, filterKategori]);

  // Aggregate expenditures & income by category for Recharts
  const chartDataKategori = useMemo(() => {
    const sums: { [key: string]: { Pemasukan: number; Pengeluaran: number; name: string } } = {};
    transaksiList.forEach(tx => {
      if (!sums[tx.kategori]) {
        sums[tx.kategori] = { name: tx.kategori, Pemasukan: 0, Pengeluaran: 0 };
      }
      if (tx.tipe === 'Pemasukan') {
        sums[tx.kategori].Pemasukan += tx.jumlah;
      } else {
        sums[tx.kategori].Pengeluaran += tx.jumlah;
      }
    });
    return Object.values(sums);
  }, [transaksiList]);

  // Category Pie Data for Expenditures
  const chartDataExpenditurePie = useMemo(() => {
    const sums: { [key: string]: number } = {};
    transaksiList.forEach(tx => {
      if (tx.tipe === 'Pengeluaran') {
        sums[tx.kategori] = (sums[tx.kategori] || 0) + tx.jumlah;
      }
    });

    const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#14b8a6', '#64748b'];
    return Object.keys(sums).map((key, idx) => ({
      name: key,
      value: sums[key],
      color: colors[idx % colors.length]
    }));
  }, [transaksiList]);

  // Form submit handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keterangan || jumlah <= 0) {
      alert('Mohon isi keterangan dan jumlah uang yang valid.');
      return;
    }

    const newTx: TransaksiKeuangan = {
      id: `TR_MOCK_${Date.now()}`,
      tanggal,
      keterangan,
      tipe,
      jumlah,
      kategori,
      penulis: currentUser?.nama || 'Bendahara KKG',
    };

    onAddTransaksi(newTx);
    showNotification(`💸 Transaksi "${keterangan}" berhasil dicatat!`);

    // Reset forms
    setKeterangan('');
    setJumlah(0);
    setTipe('Pemasukan');
    setKategori('Iuran Kas');
    setShowForm(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    try {
      const headers = ['No', 'Tanggal', 'Keterangan', 'Jenis', 'Nominal (Rp)', 'Kategori', 'Petugas'];
      const rows = filteredTransaksi.map((tx, index) => [
        index + 1,
        tx.tanggal,
        `"${tx.keterangan.replace(/"/g, '""')}"`,
        tx.tipe,
        tx.jumlah,
        tx.kategori,
        `"${tx.penulis}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'Laporan_Keuangan_KKG_PJOK_Luwuk_Timur.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('📊 Laporan keuangan berhasil diunduh dalam format CSV!');
    } catch (e) {
      showNotification('❌ Gagal mengunduh file CSV.');
    }
  };

  // Print PDF
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Izinkan pop-up browser untuk mencatat riwayat print lapor.');
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Laporan Keuangan KKG PJOK Luwuk Timur</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
            h1 { text-align: center; margin-bottom: 5px; color: #1e3a8a; }
            h3 { text-align: center; margin-top: 0; color: #666; font-size: 14px; font-weight: normal; }
            .total-box { display: flex; justify-content: space-between; margin-top: 30px; margin-bottom: 30px; }
            .card { border: 1px solid #ddd; background-color: #fcfcfc; padding: 15px; width: 30%; border-radius: 8px; text-align: center; }
            .card h4 { margin: 0; color: #555; text-transform: uppercase; font-size: 11px; }
            .card p { margin: 10px 0 0 0; font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .tipe-pemasukan { color: #10b981; font-weight: bold; }
            .tipe-pengeluaran { color: #ef4444; font-weight: bold; }
            tr:nth-child(even) { background-color: #fafafa; }
            .footer-notes { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1 style="font-size: 20px;">LAPORAN KAS & KEUANGAN KKG PJOK</h1>
          <h3 style="margin-bottom: 25px;">Kecamatan Luwuk Timur, Kabupaten Banggai, Prov. Sulawesi Tengah</h3>
          <hr />

          <div class="total-box">
            <div class="card">
              <h4>Total Pemasukan</h4>
              <p style="color: #10b981;">Rp ${totals.pemasukan.toLocaleString('id-ID')}</p>
            </div>
            <div class="card">
              <h4>Total Pengeluaran</h4>
              <p style="color: #ef4444;">Rp ${totals.pengeluaran.toLocaleString('id-ID')}</p>
            </div>
            <div class="card">
              <h4>Saldo Anggaran Kas</h4>
              <p style="color: #3b82f6;">Rp ${totals.saldo.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <h3>Daftar Jurnal Buku Kas Transaksi</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 15%">Tanggal</th>
                <th style="width: 40%">Keterangan</th>
                <th style="width: 15%">Kategori</th>
                <th style="width: 10%">Jenis</th>
                <th style="width: 15%">Nominal</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransaksi.map((tx, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${tx.tanggal}</td>
                  <td>${tx.keterangan}</td>
                  <td>${tx.kategori}</td>
                  <td class="${tx.tipe === 'Pemasukan' ? 'tipe-pemasukan' : 'tipe-pengeluaran'}">${tx.tipe}</td>
                  <td>Rp ${tx.jumlah.toLocaleString('id-ID')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer-notes">
            <div>
              <p>Dicetak Pada: ${new Date().toLocaleDateString('id-ID')}</p>
            </div>
            <div style="text-align: right;">
              <p>Luwuk Timur, ${new Date().toLocaleDateString('id-ID')}</p>
              <br/><br/>
              <p><strong>Nurhasanah, S.Pd.</strong><br/>Bendahara KKG PJOK</p>
            </div>
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
  };

  const isAuthorizedToInput = currentUser?.role === 'admin' || currentUser?.role === 'bendahara';

  return (
    <div className="space-y-6 pb-20 text-slate-100 font-sans">
      
      {/* Action toast */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-white/15 text-white text-xs py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{actionMessage}</span>
        </div>
      )}

      {/* Hero Title and Summary */}
      <div className="glass-card border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden bg-gradient-to-br from-slate-950/40 via-slate-900/10 to-indigo-950/25">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase rounded-full font-mono">
              Keuangan KKG
            </span>
            <span className="text-slate-300 font-mono text-xs font-semibold">Buku Jurnal Kas Kasir</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">Informasi Transparansi Keuangan KKG PJOK</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            Sistem akuntansi dan pencatatan kas organisasi secara transparan untuk seluruh dewan guru olahraga Luwuk Timur. 
            Membina kredibilitas asosiasi dan kepengurusan yang sehat.
          </p>
        </div>

        {/* Totals displays */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4 hover:bg-emerald-500/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Total Pemasukan Kas</p>
              <h3 className="text-lg font-extrabold text-emerald-300 mt-1">Rp {totals.pemasukan.toLocaleString('id-ID')}</h3>
            </div>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex items-center gap-4 hover:bg-rose-500/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/20 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Total Pengeluaran Kas</p>
              <h3 className="text-lg font-extrabold text-rose-300 mt-1">Rp {totals.pengeluaran.toLocaleString('id-ID')}</h3>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-center gap-4 hover:bg-blue-500/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Sisa Saldo Buku Kas</p>
              <h3 className="text-lg font-extrabold text-blue-300 mt-1">Rp {totals.saldo.toLocaleString('id-ID')}</h3>
            </div>
          </div>

        </div>

        {/* Input trigger or Authorization Status info bar */}
        <div className="border-t border-white/5 pt-5 mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className={`w-4 h-4 ${isAuthorizedToInput ? 'text-emerald-400' : 'text-amber-400'}`} />
            <p className="text-slate-300">
              {isAuthorizedToInput ? (
                <span>Anda masuk sebagai <strong className="text-white">{currentUser?.nama}</strong> ({currentUser?.role}) dengan wewenang penuh mencatat kas.</span>
              ) : (
                <span>Hanya <strong className="text-amber-300">Admin Utama & Bendahara KKG</strong> yang memiliki hak akses untuk menambah data penganggaran.</span>
              )}
            </p>
          </div>

          {isAuthorizedToInput && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4.5 py-2.5 btn-green text-white font-bold rounded-xl text-xs shadow-md shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              Catat Transaksi Baru
            </button>
          )}
        </div>
      </div>

      {/* Add Transaction form collapse block */}
      {showForm && isAuthorizedToInput && (
        <form onSubmit={handleFormSubmit} className="glass-modal border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in text-white text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Menambahkan Log Transaksi Keuangan KKG
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-350 hover:text-white cursor-pointer">
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-white font-mono"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Keterangan / Keperluan Transaksi</label>
              <input
                type="text"
                required
                placeholder="Contoh: Belanja iuran air mineral konsumsi turnamen kids..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Mata Jenis Transaksi</label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value as any)}
                className="w-full p-2.5 glass-input rounded-xl text-slate-200 font-bold"
              >
                <option value="Pemasukan" className="bg-slate-900 text-white font-bold">📥 Pemasukan (Kas Masuk)</option>
                <option value="Pengeluaran" className="bg-slate-900 text-white font-bold">📤 Pengeluaran (Belanja/Keluar)</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Rupiah Anggaran (Jumlah Nominal Rp)</label>
              <input
                type="number"
                required
                min="1000"
                placeholder="Contoh: 500000"
                value={jumlah || ''}
                onChange={(e) => setJumlah(Number(e.target.value))}
                className="w-full p-2.5 glass-input rounded-xl text-white font-mono text-xs font-bold"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Kategori Transaksi</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full p-2.5 glass-input rounded-xl text-slate-200"
              >
                <option value="Iuran Kas" className="bg-slate-900 text-white">Iuran Kas</option>
                <option value="Sponsorship" className="bg-slate-900 text-white">Sponsorship</option>
                <option value="Dana Pembinaan" className="bg-slate-900 text-white">Dana Pembinaan</option>
                <option value="Konsumsi" className="bg-slate-900 text-white">Konsumsi</option>
                <option value="Peralatan" className="bg-slate-900 text-white">Peralatan</option>
                <option value="Biaya Acara" className="bg-slate-900 text-white">Biaya Acara</option>
                <option value="Transport" className="bg-slate-900 text-white">Transport</option>
                <option value="Lainnya" className="bg-slate-900 text-white">Lainnya</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Penginput Jurnal</label>
              <input
                type="text"
                disabled
                value={`${currentUser?.nama || 'Petugas'} (${currentUser?.role || 'Guest'})`}
                className="w-full p-2.5 bg-white/5 border border-white/5 font-mono text-[10px] rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4.5 py-2 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 btn-green text-white rounded-xl font-bold font-mono"
            >
              Simpan Buku Jurnal Kas
            </button>
          </div>
        </form>
      )}

      {/* Visual Analytics Recharts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Dynamic analytics bar chart (col-span-8) */}
        <div className="lg:col-span-7 glass-card border border-white/10 p-5 rounded-2xl shadow-md min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-sm flex items-center gap-1.5">
              📊 Grafik Total Anggaran per Kategori Kegiatan
            </h3>
            <p className="text-[10px] text-slate-350">Pengelompokan total dana masuk (pemasukan) dan dana keluar (pengeluaran) organisasi.</p>
          </div>

          <div className="flex-1 mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataKategori} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} strokeWidth={0.5} />
                <YAxis stroke="#94a3b8" fontSize={9} strokeWidth={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '11px' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic expenditure pie chart (col-span-4) */}
        <div className="lg:col-span-5 glass-card border border-white/10 p-5 rounded-2xl shadow-md min-h-[300px] flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-rose-405 text-rose-455 text-rose-300 font-mono font-bold block uppercase">Belanja Kas</span>
            <h3 className="font-display font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
              <PieChartIcon className="w-4 h-4 text-rose-450 text-rose-400" />
              Persentase Sebaran Pengeluaran KKG
            </h3>
            <p className="text-[10px] text-slate-355 text-slate-300">Distribusi dana keluar berdasarkan pos belanja.</p>
          </div>

          {chartDataExpenditurePie.length > 0 ? (
            <div className="flex-1 mt-4 h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartDataExpenditurePie}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartDataExpenditurePie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '11px' }} formatter={(v) => `Rp ${v.toLocaleString('id-ID')}`} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute right-0 bottom-0 text-[8.5px] max-h-32 overflow-y-auto space-y-1 bg-black/30 p-2 rounded-lg border border-white/10">
                {chartDataExpenditurePie.map((pc, i) => (
                  <div key={i} className="flex items-center gap-1.5 font-mono text-white">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: pc.color }} />
                    <span className="truncate max-w-28">{pc.name} (Rp {pc.value.toLocaleString('id-ID')})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-slate-400 py-8 text-xs italic">
              Tidak ada catatan pengeluaran kas saat ini.
            </div>
          )}
        </div>

      </div>

      {/* Filter and Jurnal Ledger Records Table */}
      <div className="glass-card border border-white/10 rounded-3xl shadow-xl overflow-hidden">
        
        {/* Controls block */}
        <div className="bg-black/25 px-5 py-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-bold text-xs uppercase font-mono text-white">Buku Jurnal Umum Kas</h4>
            <p className="text-[10.5px] text-slate-300">Riwayat pencatatan transaksi masuk dan keluar KKG PJOK.</p>
          </div>

          <div className="flex flex-wrap gap-2 items-center text-xs">
            {/* Type selector */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="p-2 py-1.5 glass-input rounded-xl text-slate-200"
            >
              <option value="Semua" className="bg-slate-900 text-white">Semua Jenis Jurnal</option>
              <option value="Pemasukan" className="bg-slate-900 text-white">📥 Jurnal Kas Masuk</option>
              <option value="Pengeluaran" className="bg-slate-900 text-white">📤 Jurnal Kas Keluar</option>
            </select>

            {/* Category selector */}
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="p-2 py-1.5 glass-input rounded-xl text-slate-200"
            >
              <option value="Semua" className="bg-slate-900 text-white">Semua Kategori</option>
              {categoriesList.filter(c => c !== 'Semua').map(cat => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="p-2 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/35 text-emerald-300 rounded-xl font-bold flex items-center gap-1 shadow cursor-pointer transition-colors"
              title="Unduh laporan excel"
            >
              <Download className="w-3.5 h-3.5" />
              Spreedsheet
            </button>

            <button
              onClick={handlePrintPDF}
              className="p-2 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/35 text-blue-300 rounded-xl font-bold flex items-center gap-1 shadow cursor-pointer transition-colors"
              title="Cetak PDF / Laporan cetak"
            >
              <FileText className="w-3.5 h-3.5" />
              Cetak PDF
            </button>
          </div>
        </div>

        {/* Ledger table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                <th className="py-3.5 px-5 w-12 text-center">No</th>
                <th className="py-3.5 px-4 w-28">Tanggal</th>
                <th className="py-3.5 px-4">Keterangan / Deskripsi Keperluan</th>
                <th className="py-3.5 px-4 w-28">Kategori</th>
                <th className="py-3.5 px-4 w-28">Jenis</th>
                <th className="py-3.5 px-4 w-32">Nominal (Rp)</th>
                <th className="py-3.5 px-4 w-28">Penginput</th>
                {onDeleteTransaksi && isAuthorizedToInput && <th className="py-3.5 px-4 w-12 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-200">
              {filteredTransaksi.length > 0 ? (
                filteredTransaksi.map((tx, idx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-5 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-350">{tx.tanggal}</td>
                    <td className="py-4 px-4 font-bold text-white">{tx.keterangan}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-white/10 text-slate-305 text-slate-300 rounded font-semibold text-[10px]">
                        {tx.kategori}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        tx.tipe === 'Pemasukan' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {tx.tipe === 'Pemasukan' ? '📥 Masuk' : '📤 Keluar'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-white text-[12px]">
                      Rp {tx.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4 font-mono text-[10.5px] text-slate-350 truncate max-w-[120px]" title={tx.penulis}>
                      {tx.penulis.split(',')[0]}
                    </td>
                    {onDeleteTransaksi && isAuthorizedToInput && (
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setConfirmDeleteTx(tx)}
                          className="text-rose-400 hover:text-rose-500 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={onDeleteTransaksi && isAuthorizedToInput ? 8 : 7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    Belum ada riwayat jurnal keuangan yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger total footer info */}
        <div className="bg-black/25 px-5 py-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Menampilkan {filteredTransaksi.length} dari total {transaksiList.length} postingan kas</span>
          <span>Buku Jurnal Kas KKG PJOK Luwuk Timur</span>
        </div>

      </div>

      <ConfirmationModal
        isOpen={!!confirmDeleteTx}
        title="Hapus Transaksi Keuangan"
        message={confirmDeleteTx ? `Semua entri keuangan bersifat final.\nApakah Anda yakin ingin menghapus logs riwayat transaksi "${confirmDeleteTx.keterangan}" sebesar Rp ${confirmDeleteTx.jumlah.toLocaleString('id-ID')}?` : ''}
        onConfirm={() => {
          if (confirmDeleteTx && onDeleteTransaksi) {
            onDeleteTransaksi(confirmDeleteTx.id);
            showNotification(`🗑️ Riwayat transaksi "${confirmDeleteTx.keterangan}" berhasil di hapus.`);
          }
          setConfirmDeleteTx(null);
        }}
        onCancel={() => setConfirmDeleteTx(null)}
      />

    </div>
  );
}
