/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Bot, MessageCircle } from 'lucide-react';
import { ForumMessage, User, Guru } from '../types';

interface ForumViewProps {
  forumMessages: ForumMessage[];
  onSendMessage: (msg: ForumMessage) => void;
  gurus: Guru[];
  currentUser: User | null;
}

export default function ForumView({
  forumMessages,
  onSendMessage,
  gurus,
  currentUser,
}: ForumViewProps) {
  const [typedMessage, setTypedMessage] = useState('');
  
  // Custom identity for Guest if not authenticated
  const [guestName, setGuestName] = useState('');
  const [guestSekolah, setGuestSekolah] = useState('');

  const randomAvatars = [
    '🏃', '🏀', '⚽', '🏸', '🤸', '🏊', '🏆', '🏐'
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage) return;

    let senderName = 'Guru Anonim';
    let senderSchool = 'SDN Luwuk Timur';

    if (currentUser) {
      senderName = currentUser.nama;
      senderSchool = currentUser.sekolah || 'Kantor KKG';
    } else {
      senderName = guestName.trim() || 'Pegiat Olahraga';
      senderSchool = guestSekolah.trim() || 'Luwuk Timur';
    }

    const newMessage: ForumMessage = {
      id: `F_MOCK_${Date.now()}`,
      nama: senderName,
      sekolah: senderSchool,
      pesan: typedMessage,
      tanggal: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onSendMessage(newMessage);
    setTypedMessage('');
  };

  return (
    <div className="space-y-6 pb-16 text-slate-100">
      
      {/* Title */}
      <div className="px-1">
        <h2 className="text-xl font-bold text-white font-display">Forum Diskusi KKG PJOK</h2>
        <p className="text-xs text-slate-300">
          Gagasan inovatif pembelajaran olahraga, sarana prasarana sekolah, bimbingan senam, dan curah pendapat guru.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Discussion Bubble Feed (col-span-8) */}
        <div className="lg:col-span-8 glass-card border border-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col h-[525px]">
          
          {/* Header */}
          <div className="bg-white/5 border-b border-white/10 px-5 py-4 flex items-center justify-between">
            <span className="text-xs font-bold font-display text-white uppercase flex items-center gap-1.5 tracking-wider">
              <MessageCircle className="w-5 h-5 text-emerald-450" />
              Ruang Komunikasi Aktif ({forumMessages.length} Pesan)
            </span>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse font-mono">
              ● Online
            </span>
          </div>

          {/* Messages lists scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-black/10">
            {forumMessages.map((msg, index) => {
              // Pick avatar icon based on index or name
              const avatar = randomAvatars[msg.nama.charCodeAt(0) % randomAvatars.length];
              
              return (
                <div
                  key={msg.id}
                  className="flex gap-3 items-start animate-fade-in"
                >
                  {/* Avatar bubble */}
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-lg shadow-md shrink-0">
                    {avatar}
                  </div>

                  {/* Message card */}
                  <div className="bg-slate-900/40 border border-white/10 p-4 rounded-r-2xl rounded-bl-2xl shadow-md text-xs space-y-1.5 flex-1 max-w-[90%]">
                    <div className="flex justify-between items-baseline gap-4 text-[10.5px] border-b border-white/5 pb-1">
                      <div>
                        <span className="font-bold text-white">{msg.nama}</span>
                        <span className="text-slate-400 font-bold ml-1.5 font-mono text-[9px]">({msg.sekolah})</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[9px]">{msg.tanggal}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-line sm:text-[13px]">{msg.pesan}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Dispatch Area */}
          <form onSubmit={handleSend} className="p-4 bg-slate-900/10 border-t border-white/10 space-y-3">
            
            {/* Guest Identifier prompts */}
            {!currentUser && (
              <div className="grid grid-cols-2 gap-2 pb-1">
                <input
                  type="text"
                  placeholder="Ketik nama Anda..."
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="p-2.5 glass-input rounded-xl text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Ketik sekolah asal..."
                  value={guestSekolah}
                  onChange={(e) => setGuestSekolah(e.target.value)}
                  className="p-2.5 glass-input rounded-xl text-xs text-white"
                  required
                />
              </div>
            )}

            {currentUser && (
              <div className="text-[10px] text-slate-350 font-bold px-2 font-mono">
                ✍️ Berkirim pesan sebagai: <span className="text-emerald-400 font-extrabold">{currentUser.nama} ({currentUser.sekolah})</span>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tulis gagasan olahraga atau tanggapan diskusi Anda di sini..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="flex-1 py-2.5 px-4 glass-input rounded-xl text-xs"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 btn-sport text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim
              </button>
            </div>
          </form>

        </div>

        {/* Info & Sidebars (col-span-4) */}
        <div className="lg:col-span-4 glass-card border border-white/10 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-display font-bold text-sm text-white border-b border-white/10 pb-2">
            Panduan Berkomunikasi KKG
          </h3>
          <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">🏃</span>
              <span><strong>Fokus PJOK</strong>: Sarana diskusi dikhususkan bagi pembahasan kurikulum raga, ketersediaan matras, bola basket, raket, juknis O2SN atau administrasi olahraga.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">🤝</span>
              <span><strong>Jaga Kesopanan</strong>: Saling menghormati sesama guru sejawat demi nama baik instansi Kecamatan Luwuk Timur.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">💡</span>
              <span><strong>Inovasi Alat Ajar</strong>: Bagikan ide memodifikasi kardus, ban bekas, atau pipa paralon untuk cabor atletik kids.</span>
            </li>
          </ul>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-[11px] text-slate-300 space-y-2 shadow-inner">
            <p className="font-bold flex items-center gap-1 text-xs text-white">
              <Bot className="w-4 h-4 text-emerald-400" />
              Info Otomatis KKG
            </p>
            <p className="leading-relaxed">
              Seluruh rekam jejak forum ini disimpan dalam basis arsip lokal website, sehingga perbincangan bapak ibu guru tetap tersimpan rapi untuk rapat komite selanjutnya.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
