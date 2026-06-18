/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, LogIn, Lock, X, RefreshCw, CheckCircle, 
  User as UserIcon, ShieldAlert, Users, Calendar, 
  MapPin, HelpCircle, ArrowRight
} from 'lucide-react';

// Main types
import { Guru, Kegiatan, Galeri, Berita, Dokumen, ForumMessage, User, Komentar, TransaksiKeuangan } from './types';

// Seed initial data
import { 
  INITIAL_GURU, 
  INITIAL_KEGIATAN, 
  INITIAL_GALERI, 
  INITIAL_BERITA, 
  INITIAL_DOKUMEN, 
  INITIAL_FORUM,
  INITIAL_KEUANGAN
} from './data';

// Subcomponents modular imports
import Header from './components/Header';
import HomeView from './components/HomeView';
import ProfilView from './components/ProfilView';
import DataGuruView from './components/DataGuruView';
import AgendaView from './components/AgendaView';
import GaleriView from './components/GaleriView';
import BeritaView from './components/BeritaView';
import DownloadView from './components/DownloadView';
import ForumView from './components/ForumView';
import KeuanganView from './components/KeuanganView';
import KontakView from './components/KontakView';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core database states
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [kegiatans, setKegiatans] = useState<Kegiatan[]>([]);
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [beritas, setBeritas] = useState<Berita[]>([]);
  const [dokumens, setDokumens] = useState<Dokumen[]>([]);
  const [forumMessages, setForumMessages] = useState<ForumMessage[]>([]);
  const [transaksis, setTransaksis] = useState<TransaksiKeuangan[]>([]);

  // Form states for login
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // ----------------------------------------------------
  // LOCALSTORAGE MANAGEMENT & SYNCHRONIZATION
  // ----------------------------------------------------
  useEffect(() => {
    // Migration block to ensure old cached data is updated to standard configuration requested by the user
    const MIGRATION_VERSION = 'v6_empty_gurus_finance_v5_nomock';
    const currentMigration = localStorage.getItem('kkg_pjok_migration_ver');

    if (currentMigration !== MIGRATION_VERSION) {
      // Clean default teachers as requested by user ("untuk data guru tolong kosongkan nanti saya yang akan menambahkan sendiri")
      localStorage.setItem('kkg_pjok_gurus', JSON.stringify([]));
      setGurus([]);

      // Reset the older default active sessions to force fresh login with new username NIP
      localStorage.removeItem('kkg_pjok_session');
      setCurrentUser(null);

      // Save version flag
      localStorage.setItem('kkg_pjok_migration_ver', MIGRATION_VERSION);
    } else {
      // Gurus fallback
      const cachedG = localStorage.getItem('kkg_pjok_gurus');
      if (cachedG) {
        setGurus(JSON.parse(cachedG));
      } else {
        setGurus([]);
        localStorage.setItem('kkg_pjok_gurus', JSON.stringify([]));
      }
    }

    // Kegiatans
    const cachedK = localStorage.getItem('kkg_pjok_kegiatans');
    if (cachedK) setKegiatans(JSON.parse(cachedK));
    else {
      setKegiatans(INITIAL_KEGIATAN);
      localStorage.setItem('kkg_pjok_kegiatans', JSON.stringify(INITIAL_KEGIATAN));
    }

    // Galeri
    const cachedGl = localStorage.getItem('kkg_pjok_galeri');
    if (cachedGl) setGaleriList(JSON.parse(cachedGl));
    else {
      setGaleriList(INITIAL_GALERI);
      localStorage.setItem('kkg_pjok_galeri', JSON.stringify(INITIAL_GALERI));
    }

    // Berita
    const cachedB = localStorage.getItem('kkg_pjok_berita');
    if (cachedB) setBeritas(JSON.parse(cachedB));
    else {
      setBeritas(INITIAL_BERITA);
      localStorage.setItem('kkg_pjok_berita', JSON.stringify(INITIAL_BERITA));
    }

    // Download Center docs
    const cachedD = localStorage.getItem('kkg_pjok_dokumens');
    if (cachedD) setDokumens(JSON.parse(cachedD));
    else {
      setDokumens(INITIAL_DOKUMEN);
      localStorage.setItem('kkg_pjok_dokumens', JSON.stringify(INITIAL_DOKUMEN));
    }

    // Forum messages
    const cachedF = localStorage.getItem('kkg_pjok_forums');
    if (cachedF) setForumMessages(JSON.parse(cachedF));
    else {
      setForumMessages(INITIAL_FORUM);
      localStorage.setItem('kkg_pjok_forums', JSON.stringify(INITIAL_FORUM));
    }

    // Keuangan Jurnal
    const cachedKeuangan = localStorage.getItem('kkg_pjok_keuangan');
    if (cachedKeuangan) setTransaksis(JSON.parse(cachedKeuangan));
    else {
      setTransaksis(INITIAL_KEUANGAN);
      localStorage.setItem('kkg_pjok_keuangan', JSON.stringify(INITIAL_KEUANGAN));
    }

    // Current Session & Automatic conversion of outdated admin profiles
    const cachedSession = localStorage.getItem('kkg_pjok_session');
    if (cachedSession) {
      try {
        const parsed = JSON.parse(cachedSession);
        if (parsed.role === 'admin' && parsed.username !== '199602292024211024') {
          const migratedAdmin: User = {
            username: '199602292024211024',
            nama: 'Iif Sadewa Goa, S.Pd.',
            role: 'admin',
            sekolah: 'SD Negeri Banpres Bantayan 2'
          };
          setCurrentUser(migratedAdmin);
          localStorage.setItem('kkg_pjok_session', JSON.stringify(migratedAdmin));
        } else {
          setCurrentUser(parsed);
        }
      } catch (err) {
        localStorage.removeItem('kkg_pjok_session');
      }
    }
  }, []);

  // Update helpers to trigger sync and local persistence
  const updateGurusState = (newGurus: Guru[]) => {
    setGurus(newGurus);
    localStorage.setItem('kkg_pjok_gurus', JSON.stringify(newGurus));
  };

  const updateKegiatansState = (newK: Kegiatan[]) => {
    setKegiatans(newK);
    localStorage.setItem('kkg_pjok_kegiatans', JSON.stringify(newK));
  };

  const updateGaleriListState = (newGl: Galeri[]) => {
    setGaleriList(newGl);
    localStorage.setItem('kkg_pjok_galeri', JSON.stringify(newGl));
  };

  const updateBeritasState = (newB: Berita[]) => {
    setBeritas(newB);
    localStorage.setItem('kkg_pjok_berita', JSON.stringify(newB));
  };

  const updateDokumensState = (newD: Dokumen[]) => {
    setDokumens(newD);
    localStorage.setItem('kkg_pjok_dokumens', JSON.stringify(newD));
  };

  const updateForumsState = (newF: ForumMessage[]) => {
    setForumMessages(newF);
    localStorage.setItem('kkg_pjok_forums', JSON.stringify(newF));
  };

  const updateTransaksisState = (newTx: TransaksiKeuangan[]) => {
    setTransaksis(newTx);
    localStorage.setItem('kkg_pjok_keuangan', JSON.stringify(newTx));
  };

  // ----------------------------------------------------
  // MUTATION WORKFLOW IMPLEMENTATIONS
  // ----------------------------------------------------
  
  // Teachers mutate
  const handleAddGuru = (newGuru: Guru) => {
    const updated = [newGuru, ...gurus];
    updateGurusState(updated);
  };

  const handleEditGuru = (updatedGuru: Guru) => {
    const updated = gurus.map(g => g.id === updatedGuru.id ? updatedGuru : g);
    updateGurusState(updated);
  };

  const handleDeleteGuru = (id: string) => {
    const updated = gurus.filter(g => g.id !== id);
    updateGurusState(updated);
  };

  // Agenda mutate
  const handleAddKegiatan = (newK: Kegiatan) => {
    const updated = [newK, ...kegiatans];
    updateKegiatansState(updated);
  };

  const handleDeleteKegiatan = (id: string) => {
    const updated = kegiatans.filter(k => k.id !== id);
    updateKegiatansState(updated);
  };

  // Galeri mutate
  const handleUploadGaleriItem = (newItem: Galeri) => {
    const updated = [newItem, ...galeriList];
    updateGaleriListState(updated);
  };

  // Berita mutate
  const handleAddBerita = (newB: Berita) => {
    const updated = [newB, ...beritas];
    updateBeritasState(updated);
  };

  const handleDeleteBerita = (id: string) => {
    const updated = beritas.filter(b => b.id !== id);
    updateBeritasState(updated);
  };

  const handleAddKomentar = (beritaId: string, komentar: Komentar) => {
    const updated = beritas.map(b => {
      if (b.id === beritaId) {
        return {
          ...b,
          komentar: [komentar, ...b.komentar]
        };
      }
      return b;
    });
    updateBeritasState(updated);
  };

  // Download center mutate
  const handleUploadDocument = (newDoc: Dokumen) => {
    const updated = [newDoc, ...dokumens];
    updateDokumensState(updated);
  };

  const handleDeleteDocument = (id: string) => {
    const updated = dokumens.filter(d => d.id !== id);
    updateDokumensState(updated);
  };

  // Forum dispatch message
  const handleSendMessage = (msg: ForumMessage) => {
    const updated = [msg, ...forumMessages];
    updateForumsState(updated);
  };

  // Keuangan Mutate
  const handleAddTransaksi = (newTx: TransaksiKeuangan) => {
    const updated = [newTx, ...transaksis];
    updateTransaksisState(updated);
  };

  const handleDeleteTransaksi = (id: string) => {
    const updated = transaksis.filter(tx => tx.id !== id);
    updateTransaksisState(updated);
  };

  // ----------------------------------------------------
  // AUTHENTICATION LOGIN / OVERLAY DIALOGS
  // ----------------------------------------------------
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedUser = usernameInput.trim();
    const trimmedPass = passwordInput.trim();

    // Check custom Admin credentials
    if (trimmedUser === '199602292024211024' && trimmedPass === '@Iifsadewa1996') {
      const sess: User = {
        username: '199602292024211024',
        nama: 'Iif Sadewa Goa, S.Pd.',
        role: 'admin',
        sekolah: 'SD Negeri Banpres Bantayan 2'
      };
      setLoginSuccess('Selamat Datang, Bapak Iif Sadewa Goa, S.Pd.!');
      setTimeout(() => {
        setCurrentUser(sess);
        localStorage.setItem('kkg_pjok_session', JSON.stringify(sess));
        setShowLoginModal(false);
        setActiveTab('admin-dashboard');
        setUsernameInput('');
        setPasswordInput('');
        setLoginSuccess('');
      }, 1000);
    } else if (trimmedUser.toLowerCase() === 'bendahara' && trimmedPass === '@BendaharaKKG') {
      const sess: User = {
        username: 'bendahara',
        nama: 'Nurhasanah, S.Pd.',
        role: 'bendahara',
        sekolah: 'SDN Louk'
      };
      setLoginSuccess('Selamat Datang, Ibu Nurhasanah, S.Pd. (Bendahara KKG)!');
      setTimeout(() => {
        setCurrentUser(sess);
        localStorage.setItem('kkg_pjok_session', JSON.stringify(sess));
        setShowLoginModal(false);
        setActiveTab('keuangan');
        setUsernameInput('');
        setPasswordInput('');
        setLoginSuccess('');
      }, 1000);
    } else {
      // Look up teachers added dynamically by the Admin
      const foundGuru = gurus.find(g => 
        (g.nip && g.nip.replace(/\s+/g, '') === trimmedUser.replace(/\s+/g, '')) ||
        (g.email && g.email.toLowerCase() === trimmedUser.toLowerCase())
      );

      if (foundGuru) {
        // Authenticate using custom password (if provided), or default to NIP, then phone number
        const expectedPassword = foundGuru.password || (foundGuru.nip && foundGuru.nip.replace(/\s+/g, '')) || foundGuru.noHp || '@GuruPJOK';
        
        if (trimmedPass === expectedPassword) {
          const sess: User = {
            username: foundGuru.nip || foundGuru.id,
            nama: foundGuru.nama,
            role: 'guru',
            sekolah: foundGuru.sekolah
          };
          setLoginSuccess(`Selamat Datang, ${foundGuru.nama}!`);
          setTimeout(() => {
            setCurrentUser(sess);
            localStorage.setItem('kkg_pjok_session', JSON.stringify(sess));
            setShowLoginModal(false);
            setActiveTab('forum'); // Redirect to Forum
            setUsernameInput('');
            setPasswordInput('');
            setLoginSuccess('');
          }, 1000);
          return;
        }
      }

      setLoginError('Kredensial salah! Gunakan NIP dan password akun Anda, atau login cepat dengan tombol Pintasan di bawah.');
    }
  };

  const handleShortcutLogin = (role: 'admin' | 'guru') => {
    setLoginError('');
    if (role === 'admin') {
      const sess: User = {
        username: '199602292024211024',
        nama: 'Iif Sadewa Goa, S.Pd.',
        role: 'admin',
        sekolah: 'SD Negeri Banpres Bantayan 2'
      };
      setCurrentUser(sess);
      localStorage.setItem('kkg_pjok_session', JSON.stringify(sess));
      setShowLoginModal(false);
      setActiveTab('admin-dashboard');
    } else {
      // Fallback for demo/quick login
      const firstGuru = gurus[0] || { nama: 'Dewan Guru PJOK', sekolah: 'SD Negeri Banpres Bantayan 2' };
      const sess: User = {
        username: 'guru_demo',
        nama: firstGuru.nama,
        role: 'guru',
        sekolah: firstGuru.sekolah
      };
      setCurrentUser(sess);
      localStorage.setItem('kkg_pjok_session', JSON.stringify(sess));
      setShowLoginModal(false);
      setActiveTab('forum'); // jump to discussion forum
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kkg_pjok_session');
    setActiveTab('beranda');
  };

  // ----------------------------------------------------
  // NAVIGATION ROUTER SWITCH VIEWS
  // ----------------------------------------------------
  const renderActiveView = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <HomeView
            gurus={gurus}
            kegiatans={kegiatans}
            beritas={beritas}
            setActiveTab={setActiveTab}
            onLoginClick={() => setShowLoginModal(true)}
          />
        );
      case 'profil':
        return <ProfilView />;
      case 'guru':
        return <DataGuruView gurus={gurus} />;
      case 'agenda':
        return <AgendaView kegiatans={kegiatans} />;
      case 'galeri':
        return (
          <GaleriView
            galeriList={galeriList}
            onUploadItem={handleUploadGaleriItem}
            currentUser={currentUser}
          />
        );
      case 'berita':
        return (
          <BeritaView
            beritaList={beritas}
            onAddBerita={handleAddBerita}
            onAddKomentar={handleAddKomentar}
            currentUser={currentUser}
          />
        );
      case 'download':
        return (
          <DownloadView
            dokumens={dokumens}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
            currentUser={currentUser}
          />
        );
      case 'forum':
        return (
          <ForumView
            forumMessages={forumMessages}
            onSendMessage={handleSendMessage}
            gurus={gurus}
            currentUser={currentUser}
          />
        );
      case 'keuangan':
        return (
          <KeuanganView
            transaksiList={transaksis}
            onAddTransaksi={handleAddTransaksi}
            onDeleteTransaksi={handleDeleteTransaksi}
            currentUser={currentUser}
          />
        );
      case 'kontak':
        return <KontakView />;
      case 'admin-dashboard':
        if (currentUser?.role !== 'admin') {
          return (
            <div className="py-16 text-center max-w-md mx-auto space-y-4">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
              <h3 className="font-display font-bold text-slate-900 text-lg">Akses Ditolak</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda mencoba membuka Halaman Dashboard Admin tanpa kewenangan login yang tepat. Silakan klik tombol Masuk Anggota untuk login sebagai Admin.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2 bg-sport-blue text-white font-semibold rounded-xl text-xs"
              >
                Masuk sebagai Admin
              </button>
            </div>
          );
        }
        return (
          <AdminDashboard
            gurus={gurus}
            onAddGuru={handleAddGuru}
            onEditGuru={handleEditGuru}
            onDeleteGuru={handleDeleteGuru}
            kegiatans={kegiatans}
            onAddKegiatan={handleAddKegiatan}
            onDeleteKegiatan={handleDeleteKegiatan}
            beritas={beritas}
            onAddBerita={handleAddBerita}
            onDeleteBerita={handleDeleteBerita}
            dokumens={dokumens}
            onUploadDocument={handleUploadDocument}
            onDeleteDokumen={handleDeleteDocument}
          />
        );
      default:
        return (
          <div className="py-16 text-center">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold">Halaman tidak ditemukan</h3>
            <button onClick={() => setActiveTab('beranda')} className="text-xs text-sport-blue underline mt-1">
              Kembali ke Beranda
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-bg text-slate-100 flex flex-col justify-between font-sans">
      
      {/* 1. Header Navigation block */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main content container rendered based on active tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full text-slate-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer Branding */}
      <footer className="glass border-t border-white/10 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left brand column (col-span-5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow">
                  🏆
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">KKG PJOK Luwuk Timur</h4>
                  <p className="text-[10px] text-slate-300 font-semibold tracking-wide">Kabupaten Banggai, Sulawesi Tengah</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Kelompok Kerja Guru Pendidikan Jasmani, Olahraga, dan Kesehatan (KKG PJOK) merupakan organisasi resmi bagi dewan guru olahraga di bawah binaan Dinas Pendidikan Kabupaten Banggai. Wadah kolaborasi kebugaran dan sportivitas murid.
              </p>
            </div>

            {/* Quick links list column (col-span-3) */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-sport-gold">Menu Navigasi</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li><button onClick={() => setActiveTab('beranda')} className="hover:text-white transition-colors">Beranda Utama</button></li>
                <li><button onClick={() => setActiveTab('profil')} className="hover:text-white transition-colors">Profil KKG & Visi Misi</button></li>
                <li><button onClick={() => setActiveTab('guru')} className="hover:text-white transition-colors">Database Guru PJOK</button></li>
                <li><button onClick={() => setActiveTab('download')} className="hover:text-white transition-colors">Unduh Perangkat Belajar</button></li>
                <li><button onClick={() => setActiveTab('kontak')} className="hover:text-white transition-colors">Kontak & Surat Admin</button></li>
              </ul>
            </div>

            {/* Admin Shortcuts login helper column (col-span-4) */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-sport-gold">Pusat Layanan Aplikasi</h4>
              <p className="text-slate-300 text-xs leading-normal">
                Klik tombol "Masuk Anggota" untuk memperbarui data NIP Anda, merilis berita turnamen olahraga sekolah, atau memposting diagram modul.
              </p>
              
              <div className="pt-1.5">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all scale-100 hover:scale-102 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-sport-gold" />
                  Masuk Anggota / Admin
                </button>
              </div>
            </div>

          </div>

          {/* Bottom administrative copyright */}
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10.5px] text-slate-400 font-mono gap-4">
            <p>© {new Date().getFullYear()} KKG PJOK Kecamatan Luwuk Timur. Hak Cipta Dilindungi.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Sistem Website Terintegrasi Berbasis React</span>
            </p>
          </div>
        </div>
      </footer>

      {/* 4. Overlay Modal Login System */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-modal rounded-3xl overflow-hidden shadow-2xl max-w-md w-full animate-fade-in relative text-slate-100">
            
            {/* Header Form */}
            <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-emerald-600/20 text-white p-6 relative border-b border-white/10">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError('');
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shadow-inner">
                  🔑
                </div>
                <h3 className="font-display font-bold text-lg text-white">Keanggotaan KKG PJOK</h3>
                <p className="text-xs text-slate-300">Silakan login untuk memperbarui data pengajar atau mengupload RPP & sertifikat kegiatan.</p>
              </div>
            </div>

            {/* Body Form */}
            <div className="p-6 space-y-5">
              
              {/* Manual Fields Form */}
              <form onSubmit={handleManualLogin} className="space-y-4">
                
                {loginError && (
                  <p className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-[11px] leading-relaxed font-semibold">
                    ⚠️ {loginError}
                  </p>
                )}

                {loginSuccess && (
                  <p className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-[11px] font-bold">
                    🎉 {loginSuccess}
                  </p>
                )}

                <div className="text-xs space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username</label>
                  <input
                    type="text"
                    placeholder="Contoh: admin..."
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="text-xs space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-xl text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 btn-sport hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  Masuk Ke Aplikasi
                </button>
              </form>

              {/* Secure explanation block replacing shortcut buttons */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  🔐 Informasi Akses Akun Resmi KKG
                </span>
                <p className="text-[10px] text-slate-350 leading-relaxed text-center">
                  Hubungi Pengurus KKG untuk mendaftar. Anggota dapat login menggunakan username <strong>NIP</strong> dan password masing-masing.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
