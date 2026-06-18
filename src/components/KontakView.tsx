/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldAlert, ExternalLink } from 'lucide-react';

export default function KontakView() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [pesan, setPesan] = useState('');
  const [notif, setNotif] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif(true);
    setNama('');
    setEmail('');
    setNoHp('');
    setPesan('');
    setTimeout(() => setNotif(false), 5000);
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100 font-sans">
      
      {/* Toast Notification */}
      {notif && (
        <div className="fixed bottom-6 right-6 glass-card border border-white/15 text-white text-xs py-3.5 px-6 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-bold">Pesan Berhasil Terkirim!</p>
            <p className="text-slate-350 text-[10px]">Admin KKG PJOK akan merespon via WhatsApp / Email Bapak/Ibu segera.</p>
          </div>
        </div>
      )}

      {/* Header and overview */}
      <div className="px-1">
        <h2 className="text-xl font-bold text-white font-display">Hubungi KKG PJOK Luwuk Timur</h2>
        <p className="text-xs text-slate-300">
          Untuk penawaran kemitraan, perizinan sarana olahraga, pendaftaran turnamen, atau pengaduan administrasi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Contact Info (col-span-5) */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="glass-card border border-white/10 p-6 rounded-2xl shadow-lg space-y-6">
            <h3 className="font-display font-bold text-white text-sm border-b border-white/10 pb-2">
              Saluran Informasi Resmi
            </h3>
            
            <div className="space-y-5 text-xs text-slate-200">
              
              {/* Alamat */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-rose-350 shrink-0 shadow-md">
                  <MapPin className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Pusat Sekretariat</p>
                  <p className="text-slate-300 leading-relaxed mt-0.5">
                    Kecamatan Luwuk Timur, Kabupaten Banggai, Provinsi Sulawesi Tengah, Kode Pos 94771.
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                  <Mail className="w-5 h-5 text-blue-450" />
                </div>
                <div>
                  <p className="font-bold text-white">Surel Resmi</p>
                  <a href="mailto:kkg.pjok.luwuktimur@gmail.com" className="text-blue-400 hover:text-blue-300 font-bold font-mono block mt-0.5 hover:underline">
                    kkg.pjok.luwuktimur@gmail.com
                  </a>
                </div>
              </div>

              {/* Whatsapp */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400 shrink-0 shadow-md animate-pulse">
                  <Phone className="w-5 h-5 text-emerald-450" />
                </div>
                <div>
                  <p className="font-bold text-white">Hubungi WhatsApp Admin (Iif Sadewa)</p>
                  <a href="https://wa.me/6282213546580" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-350 font-extrabold font-mono block mt-0.5 hover:underline">
                    0822-1354-6580
                  </a>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kirim pesan cepat (Fast response)</p>
                </div>
              </div>

            </div>
          </div>

          <div className="glass-card border border-white/10 text-white p-5 rounded-2xl shadow-md space-y-2">
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-sport-gold shrink-0" />
              Masa Operasional Guru KKG:
            </h4>
            <p className="text-[11px] text-slate-350 leading-relaxed font-sans pl-6">
              Senin sampai Sabtu (07:30 - 14:00 WITA) mengikuti jam kerja kedinasan guru sekolah dasar Kecamatan Luwuk Timur.
            </p>
          </div>
        </div>

        {/* Contact Form (col-span-7) */}
        <div className="md:col-span-7 glass-card border border-white/10 p-6 sm:p-8 rounded-2xl shadow-lg">
          <h3 className="font-display font-bold text-white text-sm border-b border-white/10 pb-2 mb-6 uppercase tracking-wider">
            Kirimkan Formulir Pesan Cepat
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Nama Lengkap Anda</label>
                <input
                  type="text"
                  placeholder="Contoh: Drs. Wahyu..."
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full p-2.5 glass-input rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Nomor Handphone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234..."
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  className="w-full p-2.5 glass-input rounded-xl text-xs text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Surel / Email Aktif</label>
              <input
                type="email"
                placeholder="Contoh: nama@domain.com..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 glass-input rounded-xl text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Isi Pesan Pertanyaan / Saran Kegiatan</label>
              <textarea
                placeholder="Tuliskan secara jelas maksud kunjungan atau pertanyaan administrasi KKG Anda di sini..."
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                rows={4}
                className="w-full p-3 glass-input rounded-xl text-xs text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-3 btn-sport text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4 text-sport-gold" />
              Kirim Pesan Administrasi KKG
            </button>
          </form>
        </div>

      </div>

      {/* Google Maps block */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-display font-bold text-white text-sm">Lokasi Kecamatan Luwuk Timur via Google Maps</h3>
          <span className="text-[10px] font-mono text-slate-350 flex items-center gap-1">
            Kabupaten Banggai, Sulteng <ExternalLink className="w-3 h-3" />
          </span>
        </div>

        {/* Embedded Iframe Map representation pointing to Bualemo/Luwuk Timur, Banggai Regency */}
        <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-white/10 relative shadow-lg bg-slate-900/40">
          <iframe
            title="Luwuk Timur, Kabupaten Banggai"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127632.74853245413!2d122.95114771485603!3d-0.7818451197475133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768|4f13.1!3m3!1m2!1s0x2d86a635848bb247%3A0xe6bf446eebe7cead!2sLuwuk%20Timur%2C%20Kabupaten%20Banggai%2C%20Sulawesi%20Tengah!5e0!3m2!1sid!2sid!4v1718300000000!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

    </div>
  );
}
