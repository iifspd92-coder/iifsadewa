/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, User as UserIcon, LogIn, Trophy, LogOut, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  onLoginClick,
  onLogout,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil' },
    { id: 'guru', label: 'Data Guru' },
    { id: 'agenda', label: 'Agenda & Kegiatan' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'berita', label: 'Berita & Pengumuman' },
    { id: 'download', label: 'Unduhan' },
    { id: 'drive', label: 'Google Drive' },
    { id: 'forum', label: 'Forum Diskusi' },
    { id: 'keuangan', label: 'Keuangan KKG' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10 shadow-lg text-white">
      {/* Top Bar with administrative info */}
      <div className="bg-black/35 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 flex justify-between items-center font-mono border-b border-white/5">
        <div className="flex items-center gap-3">
          <span>📍 KECAMATAN LUWUK TIMUR</span>
          <span className="opacity-30 hidden sm:inline">|</span>
          <span className="hidden sm:inline">KABUPATEN BANGGAI, SULAWESI TENGAH</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">Resmi & Terintegrasi</span>
        </div>
      </div>

      {/* Main Header / Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Representation */}
          <div 
            onClick={() => handleNavClick('beranda')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-105 border border-white/15">
              <Trophy className="w-6 h-6 text-sport-gold animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                KKG PJOK
              </h1>
              <p className="text-xs font-semibold text-emerald-400 tracking-wide">
                Kecamatan Luwuk Timur
              </p>
              <p className="text-[10px] text-slate-300">
                Kab. Banggai, Sulawesi Tengah
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-white/15 border border-white/10 text-emerald-400 font-bold scale-[1.02]'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs font-semibold text-white flex items-center justify-end gap-1">
                    {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-sport-gold" />}
                    {currentUser.nama}
                  </p>
                  <p className="text-[10px] text-slate-300 uppercase tracking-widest font-mono">
                    {currentUser.role}
                  </p>
                </div>
                
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin-dashboard')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Dashboard Admin
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-300 hover:text-rose-450 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer border border-white/10"
              >
                <LogIn className="w-4 h-4 text-sport-gold" />
                Masuk Anggota
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-3">
            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-semibold rounded-lg"
              >
                Dashboard
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-900/90 backdrop-blur-lg border-t border-white/10 py-3 px-4 shadow-inner space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile User Section */}
          <div className="border-t border-white/10 pt-3 mt-2">
            {currentUser ? (
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{currentUser.nama}</p>
                    <p className="text-[10px] text-slate-300 uppercase font-mono">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-rose-500/20 hover:bg-rose-500/10 text-rose-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-sport-gold" />
                Masuk Keanggotaan
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
