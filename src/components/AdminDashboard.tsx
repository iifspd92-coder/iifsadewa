/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, School, Calendar, FileText, Plus, Trash2, Edit2, 
  CheckCircle, BarChart3, Settings, ShieldAlert, X
} from 'lucide-react';
import { Guru, Kegiatan, Berita, Dokumen } from '../types';

interface AdminDashboardProps {
  gurus: Guru[];
  onAddGuru: (newGuru: Guru) => void;
  onEditGuru: (updatedGuru: Guru) => void;
  onDeleteGuru: (id: string) => void;
  kegiatans: Kegiatan[];
  onAddKegiatan: (newK: Kegiatan) => void;
  onDeleteKegiatan: (id: string) => void;
  beritas: Berita[];
  onAddBerita: (newB: Berita) => void;
  onDeleteBerita: (id: string) => void;
  dokumens: Dokumen[];
  onUploadDocument: (newDoc: Dokumen) => void;
  onDeleteDokumen: (id: string) => void;
}

export default function AdminDashboard({
  gurus,
  onAddGuru,
  onEditGuru,
  onDeleteGuru,
  kegiatans,
  onAddKegiatan,
  onDeleteKegiatan,
  beritas,
  onAddBerita,
  onDeleteBerita,
  dokumens,
  onUploadDocument,
  onDeleteDokumen,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'guru' | 'agenda' | 'arsip'>('stats');
  const [showAddGuruForm, setShowAddGuruForm] = useState(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'guru' | 'kegiatan' | 'berita' | 'dokumen';
    id: string;
    name: string;
  } | null>(null);

  // Form states for adding/editing Guru
  const [formNama, setFormNama] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formSekolah, setFormSekolah] = useState('');
  const [formHp, setFormHp] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<Guru['status']>('Aktif');
  const [formJabatan, setFormJabatan] = useState('Guru PJOK');
  const [formPassword, setFormPassword] = useState('');

  // Form states for adding Agenda
  const [agendaJudul, setAgendaJudul] = useState('');
  const [agendaDesk, setAgendaDesk] = useState('');
  const [agendaTanggal, setAgendaTanggal] = useState('');
  const [agendaWaktu, setAgendaWaktu] = useState('08:00 WITA - Selesai');
  const [agendaLokasi, setAgendaLokasi] = useState('');
  const [agendaKat, setAgendaKat] = useState<Kegiatan['kategori']>('Rapat KKG');
  const [showAddAgendaForm, setShowAddAgendaForm] = useState(false);

  // Form states for adding News Article inside Dashboard
  const [newsJudul, setNewsJudul] = useState('');
  const [newsRingkasan, setNewsRingkasan] = useState('');
  const [newsIsi, setNewsIsi] = useState('');
  const [newsKategori, setNewsKategori] = useState<Berita['kategori']>('Berita KKG');
  const [newsImage, setNewsImage] = useState('');
  const [showAddNewsForm, setShowAddNewsForm] = useState(false);

  // Form states for adding Document inside Dashboard
  const [docJudul, setDocJudul] = useState('');
  const [docKategori, setDocKategori] = useState<Dokumen['kategori']>('Modul SD');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docType, setDocType] = useState<Dokumen['tipe']>('pdf');
  const [showAddDocForm, setShowAddDocForm] = useState(false);

  const [notif, setNotif] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  // ----------------------------------------------------
  // STATISTIK & RECHARTS DATA AGGREGATIONS
  // ----------------------------------------------------
  
  // Teachers per school
  const chartDataSekolah = useMemo(() => {
    const counts: { [key: string]: number } = {};
    gurus.forEach(g => {
      counts[g.sekolah] = (counts[g.sekolah] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key.replace('SDN ', '').replace('SMPN ', ''),
      'Jumlah Guru': counts[key]
    }));
  }, [gurus]);

  // Teachers per status
  const chartDataStatus = useMemo(() => {
    const counts = { Aktif: 0, Nonaktif: 0, Mutasi: 0 };
    gurus.forEach(g => {
      if (g.status === 'Aktif') counts.Aktif++;
      else if (g.status === 'Nonaktif') counts.Nonaktif++;
      else if (g.status === 'Mutasi') counts.Mutasi++;
    });
    return [
      { name: 'Aktif', value: counts.Aktif, color: '#10b981' }, // Emerald
      { name: 'Nonaktif', value: counts.Nonaktif, color: '#ef4444' }, // Red
      { name: 'Mutasi', value: counts.Mutasi, color: '#f59e0b' } // Amber
    ];
  }, [gurus]);

  const uniqueSchoolsCount = useMemo(() => {
    return Array.from(new Set(gurus.map(g => g.sekolah))).length;
  }, [gurus]);

  // Handle teacher submission
  const handleGuruSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama) return;

    if (editingGuru) {
      // Editing
      const updated: Guru = {
        ...editingGuru,
        nama: formNama,
        nip: formNip || '-',
        sekolah: formSekolah,
        noHp: formHp || '08',
        email: formEmail || `${formNama.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        status: formStatus,
        jabatan: formJabatan,
        password: formPassword || undefined
      };
      onEditGuru(updated);
      showNotification(`✅ Data guru "${formNama}" berhasil diupdate!`);
      setEditingGuru(null);
    } else {
      // Adding new
      const newG: Guru = {
        id: `G_MOCK_${Date.now()}`,
        nama: formNama,
        nip: formNip || '-',
        sekolah: formSekolah,
        kecamatan: 'Luwuk Timur',
        noHp: formHp || '081234567890',
        email: formEmail || `${formNama.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        status: formStatus,
        jabatan: formJabatan,
        password: formPassword || undefined
      };
      onAddGuru(newG);
      showNotification(`✅ Guru "${formNama}" sukses ditambahkan ke database!`);
    }

    // Reset forms
    setFormNama('');
    setFormNip('');
    setFormSekolah('');
    setFormHp('');
    setFormEmail('');
    setFormStatus('Aktif');
    setFormJabatan('Guru PJOK');
    setFormPassword('');
    setShowAddGuruForm(false);
  };

  const handleEditTrigger = (guru: Guru) => {
    setEditingGuru(guru);
    setFormNama(guru.nama);
    setFormNip(guru.nip);
    setFormSekolah(guru.sekolah);
    setFormHp(guru.noHp);
    setFormEmail(guru.email);
    setFormStatus(guru.status);
    setFormJabatan(guru.jabatan);
    setFormPassword(guru.password || '');
    setShowAddGuruForm(true);
  };

  const handleDeleteGuruTrigger = (id: string, name: string) => {
    setDeleteTarget({ type: 'guru', id, name });
  };

  const executeConfirmedDelete = () => {
    if (!deleteTarget) return;
    const { type, id, name } = deleteTarget;
    setDeleteTarget(null);

    if (type === 'guru') {
      onDeleteGuru(id);
      showNotification(`🗑️ Data guru "${name}" berhasil dihapus.`);
    } else if (type === 'kegiatan') {
      onDeleteKegiatan(id);
      showNotification(`🗑️ Agenda "${name}" berhasil dibatalkan.`);
    } else if (type === 'berita') {
      onDeleteBerita(id);
      showNotification('🗑️ Berita sukses diarsipkan/dihapus.');
    } else if (type === 'dokumen') {
      onDeleteDokumen(id);
      showNotification('🗑️ Berkas berhasil dihilangkan.');
    }
  };

  // Agenda submit
  const handleAgendaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaJudul || !agendaTanggal || !agendaLokasi) return;

    const newAgenda: Kegiatan = {
      id: `K_MOCK_${Date.now()}`,
      judul: agendaJudul,
      deskripsi: agendaDesk || 'Agenda kerja / Bimtek guru olahraga Kecamatan Luwuk Timur.',
      tanggal: agendaTanggal,
      waktu: agendaWaktu,
      lokasi: agendaLokasi,
      kategori: agendaKat
    };

    onAddKegiatan(newAgenda);
    showNotification(`📅 Agenda "${agendaJudul}" sukses dijadwalkan!`);
    
    // Reset Form
    setAgendaJudul('');
    setAgendaDesk('');
    setAgendaTanggal('');
    setAgendaWaktu('08:00 WITA - Selesai');
    setAgendaLokasi('');
    setShowAddAgendaForm(false);
  };

  // Handle News Submission
  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsJudul || !newsRingkasan || !newsIsi) {
      alert('Harap lengkapi judul, ringkasan, dan isi berita.');
      return;
    }

    const newArticle: Berita = {
      id: `B_MOCK_${Date.now()}`,
      judul: newsJudul,
      ringkasan: newsRingkasan,
      isi: newsIsi,
      tanggal: new Date().toISOString().split('T')[0],
      kategori: newsKategori,
      imageUrl: newsImage || 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80',
      penulis: 'Admin KKG PJOK',
      komentar: []
    };

    onAddBerita(newArticle);
    showNotification(`📰 Artikel berita "${newsJudul}" sukses ditambahkan!`);

    // Reset news form
    setNewsJudul('');
    setNewsRingkasan('');
    setNewsIsi('');
    setNewsImage('');
    setShowAddNewsForm(false);
  };

  // Handle Document Submission
  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docJudul) {
      alert('Harap isi judul berkas/dokumen.');
      return;
    }

    const mockSizes = ['1.2 MB', '850 KB', '2.4 MB', '4.1 MB', '620 KB'];
    const randomSize = mockSizes[Math.floor(Math.random() * mockSizes.length)];

    const newDoc: Dokumen = {
      id: `DOC_MOCK_${Date.now()}`,
      judul: docJudul,
      kategori: docKategori,
      ukuran: randomSize,
      tipe: docType,
      tanggalUpload: new Date().toISOString().split('T')[0],
      url: docFileUrl || '#'
    };

    onUploadDocument(newDoc);
    showNotification(`💾 File "${docJudul}" berhasil diunggah ke perpustakaan digital!`);

    // Reset doc form
    setDocJudul('');
    setDocFileUrl('');
    setShowAddDocForm(false);
  };

  return (
    <div className="space-y-8 pb-20 text-slate-100 font-sans">
      
      {/* Toast Notif */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-950 border border-white/15 text-white text-xs py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
          <span className="font-bold">{notif}</span>
        </div>
      )}

      {/* Hero Title Row */}
      <div className="glass-card border border-white/10 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden bg-slate-950/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase rounded-full font-mono">
              Sistem Admin
            </span>
            <span className="text-slate-350 font-mono text-xs font-semibold">Pusat Kendali</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">Dashboard Pengurus KKG PJOK</h2>
          <p className="text-xs text-slate-350 leading-relaxed max-w-2xl">
            Selamat datang, Administrator. Kelola basis data guru, rilis berita olahraga, file RPP, dan kalender kegiatan terstruktur se-Kecamatan Luwuk Timur.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono font-bold z-10 shadow-md">
          <Settings className="w-4 h-4 text-sport-gold animate-spin" />
          <span>Sesi Keamanan Maksimal</span>
        </div>
      </div>

      {/* Tab Navigation buttons */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'stats', label: '📊 Grafik & Statistik' },
          { id: 'guru', label: '👥 Kelola Database Guru' },
          { id: 'agenda', label: '🗓️ Kelola Agenda Kerja' },
          { id: 'arsip', label: '📰 Kelola Berita & Berkas' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id !== 'guru') {
                setEditingGuru(null);
                setShowAddGuruForm(false);
              }
            }}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-605 bg-blue-600 border-blue-500 text-white shadow-md'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ----------------------------------------------------
          TAB 1: STATS & GRAPHS VIEW
          ---------------------------------------------------- */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          
          {/* Main quick stats count grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Guru PJOK Terdaftar', val: gurus.length, icon: Users, sub: `${gurus.filter(g => g.status === 'Aktif').length} berstatus Aktif`, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
              { label: 'Sekolah Terintegrasi', val: uniqueSchoolsCount, icon: School, sub: 'SD / SMP Luwuk Timur', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Kegiatan Teragenda', val: kegiatans.length, icon: Calendar, sub: 'Rapat, Bimtek, Seleksi', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
              { label: 'Rilis Pengumuman & Berkas', val: beritas.length + dokumens.length, icon: FileText, sub: 'Arsip berita dan unduhan', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
            ].map((stat, i) => (
              <div key={i} className="glass-card border border-white/10 p-5 rounded-2xl shadow-lg flex gap-4 items-center bg-white/5 hover:bg-white/10 transition-colors">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${stat.color}`}>
                  <stat.icon className="w-5 h-5 shadow-sm" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold">{stat.label}</p>
                  <p className="text-2xl font-bold font-display text-white mt-0.5">{stat.val}</p>
                  <p className="text-[10px] text-slate-350">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Recharts blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
            
            {/* School distribution bar count (col-span-8) */}
            <div className="lg:col-span-8 glass-card border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col justify-between min-h-[350px]">
              <div>
                <h3 className="font-display font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                  <BarChart3 className="w-4.5 h-4.5 text-blue-400" />
                  Grafik Distribusi Jumlah Guru Per Sekolah
                </h3>
                <p className="text-[11px] text-slate-350">Menampilkan beban persediaan tenaga pengajar olahraga dasar se-Kecamatan Luwuk Timur.</p>
              </div>

              <div className="flex-1 mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataSekolah} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="Jumlah Guru" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status distribution PieChart (col-span-4) */}
            <div className="lg:col-span-4 glass-card border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col justify-between min-h-[350px]">
              <div>
                <h3 className="font-display font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                  🎯 Persentase Status Keaktifan Guru
                </h3>
                <p className="text-[11px] text-slate-350">Total sebaran NIP Aktif vs Nonaktif / Mutasi dinas.</p>
              </div>

              <div className="flex-1 mt-4 h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartDataStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute right-1 bottom-1 text-[9.5px] space-y-1 bg-white/5 p-2 rounded-lg border border-white/10">
                  {chartDataStatus.map((st, i) => (
                    <div key={i} className="flex items-center gap-1.5 font-mono text-white">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                      <span>{st.name} ({st.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="bg-white/5 p-4 border border-white/10 rounded-xl text-xs text-slate-300 flex items-start gap-2 max-w-3xl leading-relaxed mt-4 shadow-inner">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Informasi Sinkronisasi Otomatis:</p>
              <p>Setiap penambahan, pengeditan, atau penghapusan data guru, agenda, ataupun rilis berita yang Anda lakukan saat ini akan secara otomatis disimpan ke sistem cache browser lokal, sehingga data tetap akurat setiap kali guru lain memuat halaman web ini.</p>
            </div>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: TEACHERS MANAGEMENT VIEW
          ---------------------------------------------------- */}
      {activeTab === 'guru' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 p-4 border border-white/10 rounded-xl text-white gap-3.5">
            <div>
              <h4 className="font-bold text-xs text-white uppercase font-mono tracking-wider">Manajemen Entri Data Guru PJOK</h4>
              <p className="text-[11px] text-slate-350 mt-0.5">Memelihara kelengkapan data NIP, alamat email, instansi sekolah dan status aktif.</p>
            </div>
            
            <button
              onClick={() => {
                setEditingGuru(null);
                setFormNama('');
                setFormNip('');
                setFormHp('');
                setFormEmail('');
                setFormStatus('Aktif');
                setFormJabatan('Guru PJOK');
                setShowAddGuruForm(!showAddGuruForm);
              }}
              className="flex items-center gap-1.5 px-4.5 py-2.5 btn-sport text-white font-bold rounded-xl text-xs shadow-md cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-sport-gold" />
              Tambah Guru PJOK Baru
            </button>
          </div>

          {/* Form write/edit inline collapsible block */}
          {showAddGuruForm && (
            <form onSubmit={handleGuruSubmit} className="glass-modal border border-white/15 p-6 rounded-3xl shadow-2xl space-y-4 animate-fade-in text-xs text-white">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-1">
                  👤 {editingGuru ? `Koreksi Data Guru: "${editingGuru.nama}"` : 'Unggah Profil Guru Baru KKG'}
                </span>
                <button type="button" onClick={() => setShowAddGuruForm(false)} className="text-slate-350 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                
                {/* Info row */}
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Hartono, S.Pd."
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">NIP (atau '-' jika honorer)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 19970312 202401 1 004"
                    value={formNip}
                    onChange={(e) => setFormNip(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Instansi Sekolah Asal</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SD Negeri Banpres Bantayan 2"
                    value={formSekolah}
                    onChange={(e) => setFormSekolah(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                  />
                </div>

                {/* Contacts Row */}
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">No Handphone / WA</label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={formHp}
                    onChange={(e) => setFormHp(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Surel / Email Belajar.id</label>
                  <input
                    type="email"
                    placeholder="Contoh: budi@guru.sd.belajar.id"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Status Aktif Kehormatan</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 glass-input rounded-xl text-slate-200"
                  >
                    <option value="Aktif" className="bg-slate-900 text-white">Aktif</option>
                    <option value="Nonaktif" className="bg-slate-900 text-white">Non-aktif</option>
                    <option value="Mutasi" className="bg-slate-900 text-white">Mutasi Dinas</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Jabatan / Peran KKG</label>
                  <input
                    type="text"
                    placeholder="Contoh: Guru PJOK"
                    value={formJabatan}
                    onChange={(e) => setFormJabatan(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                  />
                </div>

                {/* Login credentials options row */}
                <div className="sm:col-span-12 border-t border-white/10 pt-4 mt-2">
                  <h5 className="text-[10px] uppercase font-bold text-sport-gold tracking-wider mb-3.5 flex items-center gap-1.5 font-mono">
                    🔑 PENGATURAN AKSES LOGIN GURU SAYA
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Username Login Anggota</label>
                      <input
                        type="text"
                        value={formNip ? formNip.replace(/\s+/g, '') : 'Masukkan NIP guru di atas'}
                        disabled
                        className="w-full p-2.5 bg-white/5 border border-white/15 text-slate-400 rounded-xl cursor-not-allowed font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Sandi / Password Akses (Kustom)</label>
                      <input
                        type="text"
                        placeholder="Jika dikosongkan, NIP otomatis digunakan sebagai password"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        className="w-full p-2.5 glass-input rounded-xl text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGuruForm(false);
                    setEditingGuru(null);
                  }}
                  className="px-4 py-2 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 btn-sport text-white rounded-xl font-bold cursor-pointer"
                >
                  {editingGuru ? 'Simpan Pembaruan Data' : 'Daftarkan Profil Guru'}
                </button>
              </div>
            </form>
          )}

          {/* Table display control panel */}
          <div className="glass-card border border-white/10 rounded-2xl shadow-xl overflow-hidden text-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4">Nama Guru & NIP</th>
                    <th className="py-3.5 px-4">Sekolah</th>
                    <th className="py-3.5 px-4">Jabatan</th>
                    <th className="py-3.5 px-4 text-center">Aksi Kendali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {gurus.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 px-4 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2 py-4">
                          <Users className="w-8 h-8 text-sport-gold animate-bounce" />
                          <p className="font-bold text-white text-xs">Belum ada data guru terdaftar dalam database.</p>
                          <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                            Gunakan tombol <strong className="text-sport-gold">"Tambah Guru PJOK Baru"</strong> di atas untuk daftarkan guru olahraga baru dan memberikan mereka akses login instan menggunakan NIP masing-masing.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    gurus.map((g, idx) => (
                      <tr key={g.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-extrabold text-white block">{g.nama}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{g.nip}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-205">{g.sekolah}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 bg-white/10 text-white font-extrabold rounded-full text-[9px] uppercase tracking-wide">
                            {g.jabatan}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => handleEditTrigger(g)}
                              className="p-1.5 text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 rounded-lg cursor-pointer"
                              title="Edit Guru"
                              type="button"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGuruTrigger(g.id, g.nama)}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg cursor-pointer"
                              title="Hapus Guru"
                              type="button"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: AGENDA SCHEDULERS
          ---------------------------------------------------- */}
      {activeTab === 'agenda' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 p-4 border border-white/10 rounded-xl text-white gap-3.5">
            <div>
              <h4 className="font-bold text-xs text-white uppercase font-mono tracking-wider">Penjadwalan Olahraga & Rencana Rapat</h4>
              <p className="text-[11px] text-slate-350">Merilis' timeline turnamen kids, bimbingan teknis tingkat kecamatan, dan agenda komite.</p>
            </div>

            <button
              onClick={() => setShowAddAgendaForm(!showAddAgendaForm)}
              className="px-4.5 py-2.5 btn-sport text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
            >
              <Plus className="w-4 h-4 text-sport-gold" />
              Buat Rencana Acara Baru
            </button>
          </div>

          {showAddAgendaForm && (
            <form onSubmit={handleAgendaSubmit} className="glass-modal border border-white/15 p-6 rounded-3xl shadow-2xl space-y-4 animate-fade-in text-xs text-white">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="font-extrabold text-white uppercase flex items-center gap-1">
                  📅 Tambah Acara / Turnamen Baru KKG
                </span>
                <button type="button" onClick={() => setShowAddAgendaForm(false)} className="text-slate-350 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Nama Acara / Turnamen</label>
                  <input
                    type="text"
                    placeholder="Contoh: Olimpiade Atletik Kids se-Kecamatan..."
                    value={agendaJudul}
                    onChange={(e) => setAgendaJudul(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Mata Kategori Lomba</label>
                  <select
                    value={agendaKat}
                    onChange={(e) => setAgendaKat(e.target.value as any)}
                    className="w-full p-2.5 glass-input rounded-xl text-slate-200"
                  >
                    <option value="Rapat KKG" className="bg-slate-900 text-white">Rapat KKG</option>
                    <option value="Pelatihan" className="bg-slate-900 text-white">Pelatihan</option>
                    <option value="Turnamen Olahraga" className="bg-slate-900 text-white">Turnamen Olahraga</option>
                    <option value="Kegiatan Siswa" className="bg-slate-900 text-white">Kegiatan Siswa</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={agendaTanggal}
                    onChange={(e) => setAgendaTanggal(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-slate-200"
                    required
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Deskripsi Lengkap Kegiatan</label>
                  <input
                    type="text"
                    placeholder="Tuliskan tujuan cabor olahraga, persuratan dsb..."
                    value={agendaDesk}
                    onChange={(e) => setAgendaDesk(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Waktu Pelaksanaan (WITA)</label>
                  <input
                    type="text"
                    value={agendaWaktu}
                    onChange={(e) => setAgendaWaktu(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 font-mono">Lokasi Sarbana / Lapangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Lapangan SDN 1 Hunduhon"
                    value={agendaLokasi}
                    onChange={(e) => setAgendaLokasi(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddAgendaForm(false)}
                  className="px-4 py-2 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 cursor-pointer font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 btn-sport text-white rounded-xl font-bold cursor-pointer"
                >
                  Rilis Agenda
                </button>
              </div>
            </form>
          )}

          {/* Agenda items lists deletion */}
          <div className="glass-card border border-white/10 rounded-2xl shadow-xl divide-y divide-white/5 overflow-hidden text-white">
            {kegiatans.map((agenda) => (
              <div key={agenda.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[9px] bg-white/10 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      {agenda.kategori}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">🗓️ {agenda.tanggal}</span>
                  </div>
                  <h4 className="font-extrabold text-white text-sm mt-1">{agenda.judul}</h4>
                  <p className="text-[11px] text-slate-300">Venue: {agenda.lokasi} | Jam: {agenda.waktu}</p>
                </div>

                <button
                  onClick={() => setDeleteTarget({ type: 'kegiatan', id: agenda.id, name: agenda.judul })}
                  className="p-2 text-rose-450 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/25 cursor-pointer"
                  title="Batalkan Kegiatan"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: NEWS & DOCUMENTS MANAGER
          ---------------------------------------------------- */}
      {activeTab === 'arsip' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Post reviews (col-span-1) */}
          <div className="glass-card border border-white/10 rounded-2xl p-5 shadow-lg space-y-4 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-2 gap-2">
              <h3 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <span>📰 Rilis Artikel / Pengumuman</span>
                <span className="bg-blue-600 border border-white/10 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                  {beritas.length} Arsip
                </span>
              </h3>
              
              <button
                onClick={() => setShowAddNewsForm(!showAddNewsForm)}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/35 text-blue-300 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Berita
              </button>
            </div>

            {/* Form writing inline collapse */}
            {showAddNewsForm && (
              <form onSubmit={handleNewsSubmit} className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3 animate-fade-in text-[11px]">
                <div className="flex justify-between items-center pb-1">
                  <span className="font-bold text-blue-300">Buat Berita / Pengumuman Baru</span>
                  <button type="button" onClick={() => setShowAddNewsForm(false)} className="text-slate-400 hover:text-white">Batal</button>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">Judul Berita</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Seleksi Atlet O2SN Kecamatan Luwuk Timur 2026"
                      value={newsJudul}
                      onChange={(e) => setNewsJudul(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">Ringkasan Ringkas (Ulasan Awal)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ulasan satu baris tentang berita..."
                      value={newsRingkasan}
                      onChange={(e) => setNewsRingkasan(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">Katagori Berita</label>
                    <select
                      value={newsKategori}
                      onChange={(e) => setNewsKategori(e.target.value as any)}
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-slate-200"
                    >
                      <option value="Berita KKG">Berita KKG & Kegiatan</option>
                      <option value="Lomba & Turnamen">Lomba & Turnamen Siswa</option>
                      <option value="Pengumuman Resmi">Pengumuman Resmi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">URL Gambar Sampul (Jika ada)</label>
                    <input
                      type="url"
                      placeholder="Contoh: https://images.unsplash.com/... (kosongkan untuk default)"
                      value={newsImage}
                      onChange={(e) => setNewsImage(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">Isi Naskah Berita Lengkap</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tulis disini isi naskah berita lengkap bapak ibu..."
                      value={newsIsi}
                      onChange={(e) => setNewsIsi(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1 border-t border-white/5">
                    <button type="button" onClick={() => setShowAddNewsForm(false)} className="px-3 py-1.5 rounded bg-white/5 text-slate-300 hover:bg-white/10">Batal</button>
                    <button type="submit" className="px-5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold">Simpan & Publis</button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-3.5 max-h-[400px] overflow-y-auto divide-y divide-white/5 pr-1">
              {beritas.map((ar) => (
                <div key={ar.id} className="pt-3.5 first:pt-0 flex justify-between items-start gap-4">
                  <div className="text-xs">
                    <h4 className="font-extrabold text-white line-clamp-1 leading-tight">{ar.judul}</h4>
                    <p className="text-slate-400 font-mono text-[9px] mt-1">📆 {ar.tanggal} | ✒️ {ar.penulis}</p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget({ type: 'berita', id: ar.id, name: ar.judul })}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg shrink-0 cursor-pointer"
                    title="Hapus Berita"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Docs reviews (col-span-2) */}
          <div className="glass-card border border-white/10 rounded-2xl p-5 shadow-lg space-y-4 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-2 gap-2">
              <h3 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <span>💾 Berkas Pembelajaran & Juknis</span>
                <span className="bg-emerald-500/20 border border-emerald-505 text-emerald-355 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                  {dokumens.length} File
                </span>
              </h3>

              <button
                onClick={() => setShowAddDocForm(!showAddDocForm)}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/35 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Berkas
              </button>
            </div>

            {/* Form uploading inline collapse */}
            {showAddDocForm && (
              <form onSubmit={handleDocSubmit} className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3 animate-fade-in text-[11px]">
                <div className="flex justify-between items-center pb-1">
                  <span className="font-bold text-emerald-300">Tambahkan Unduhan Berkas Baru</span>
                  <button type="button" onClick={() => setShowAddDocForm(false)} className="text-slate-400 hover:text-white">Batal</button>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">Nama Dokumen / Judul File</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Modul Ajar PJOK Kelas 4 Kurikulum Merdeka"
                      value={docJudul}
                      onChange={(e) => setDocJudul(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">Tipe Berkas</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-slate-200"
                    >
                      <option value="pdf">PDF (Dokumen Ringkas)</option>
                      <option value="docx">DOCX / Word (Materi RPP)</option>
                      <option value="xlsx">XLSX / Excel (Nilai/Skor)</option>
                      <option value="zip">ZIP (Bundel Materi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">Kategori Berkas</label>
                    <select
                      value={docKategori}
                      onChange={(e) => setDocKategori(e.target.value as any)}
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-slate-200"
                    >
                      <option value="Modul SD">Modul SD / Bahan Pelatihan</option>
                      <option value="Silabus">Silabus Kurikulum</option>
                      <option value="RPP">RPP / Modul Ajar</option>
                      <option value="Dokumen Lomba">Juknis / Dokumen Lomba</option>
                      <option value="Sertifikat">Piagam / Sertifikat</option>
                      <option value="Lainnya">Lain-Lain (Lainnya)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-slate-300">URL Tautan Google Drive / Unduhan</label>
                    <input
                      type="text"
                      placeholder="Contoh: https://drive.google.com/file/... (kosongkan jika belum ada)"
                      value={docFileUrl}
                      onChange={(e) => setDocFileUrl(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1 border-t border-white/5">
                    <button type="button" onClick={() => setShowAddDocForm(false)} className="px-3 py-1.5 rounded bg-white/5 text-slate-300 hover:bg-white/10">Batal</button>
                    <button type="submit" className="px-5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Terbitkan Berkas</button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-3.5 max-h-[400px] overflow-y-auto divide-y divide-white/5 pr-1">
              {dokumens.map((dc) => (
                <div key={dc.id} className="pt-3.5 first:pt-0 flex justify-between items-start gap-4">
                  <div className="text-xs">
                    <h4 className="font-extrabold text-white line-clamp-1 leading-tight">{dc.judul}</h4>
                    <p className="text-slate-400 font-mono text-[9.5px] mt-1">🏷️ {dc.kategori} | 📦 UKURAN: {dc.ukuran}</p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget({ type: 'dokumen', id: dc.id, name: dc.judul })}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg shrink-0 cursor-pointer"
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Reusable confirmation modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title={
          deleteTarget?.type === 'guru' ? 'Hapus Guru KKG' :
          deleteTarget?.type === 'kegiatan' ? 'Batalkan Kegiatan' :
          deleteTarget?.type === 'berita' ? 'Hapus Rilis Berita' :
          'Hapus Dokumen Belajar'
        }
        message={
          deleteTarget?.type === 'guru' 
            ? `Apakah Anda benar-benar ingin menghapus data "${deleteTarget?.name}" dari database Guru KKG? Tindakan ini tidak dapat dibatalkan.`
            : deleteTarget?.type === 'kegiatan'
            ? `Apakah Anda yakin ingin membatalkan/menghapus agenda kegiatan "${deleteTarget?.name}"?`
            : deleteTarget?.type === 'berita'
            ? `Apakah Anda yakin ingin menghapus rilis berita "${deleteTarget?.name}"?`
            : `Apakah Anda yakin ingin menghapus berkas dokumen "${deleteTarget?.name}" dari download center?`
        }
        onConfirm={executeConfirmedDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
}
