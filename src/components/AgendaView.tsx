/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Kegiatan } from '../types';

interface AgendaViewProps {
  kegiatans: Kegiatan[];
}

export default function AgendaView({ kegiatans }: AgendaViewProps) {
  // Calendar State - Defaulting to June 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed, so 5 is June
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Calculate days in active month
  const totalDaysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  // Calculate starting day of the week (0 = Sunday, 1 = Monday...)
  const startDayOfWeek = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  // Go to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  // Go to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Check if a calendar day has scheduled events
  const getEventsForDay = (dayNum: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return kegiatans.filter(k => k.tanggal === dateStr);
  };

  // Filter events list based on interactive selections
  const filteredEventsBySelectedDate = useMemo(() => {
    if (selectedDay === null) return kegiatans;
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(selectedDay).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return kegiatans.filter(k => k.tanggal === dateStr);
  }, [kegiatans, selectedDay, currentMonth, currentYear]);

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      
      {/* Page Title Block */}
      <div className="px-1">
        <h2 className="text-xl font-bold text-white font-display">Agenda & Rencana Kegiatan</h2>
        <p className="text-xs text-slate-300">
          Ikuti jadwal bimtek olahraga, rapat koordinasi bulanan KKG, dan turnamen siswa se-Luwuk Timur.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Calendar Widget (col-span-5) */}
        <div className="lg:col-span-5 glass-card border border-white/10 rounded-2xl shadow-lg p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wide">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              Kalender Interaktif
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1 hover:bg-white/10 rounded text-slate-350 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-white min-w-[100px] text-center font-mono">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-white/10 rounded text-slate-350 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold text-slate-300 uppercase tracking-wider">
            {daysInWeek.map((day, i) => (
              <div key={i} className="py-1">{day.slice(0, 3)}</div>
            ))}
          </div>

          {/* Calendar grid of numbers */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {/* Pad leading unassigned days */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 text-slate-650" />
            ))}

            {/* Render actual days */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const cellEvents = getEventsForDay(dayNum);
              const hasEvents = cellEvents.length > 0;
              const isSelected = selectedDay === dayNum;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                  className={`p-2 rounded-lg font-bold font-mono transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg text-xs scale-105 border border-white/20'
                      : hasEvents
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{dayNum}</span>
                  {/* Event Dot */}
                  {hasEvents && !isSelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day control instructions */}
          <div className="bg-white/5 border border-white/15 p-3 rounded-xl text-[10px] sm:text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white">Petunjuk:</p>
            <p>🟢 Tanggal dengan background hijau muda mengandung rangkaian rapat / turnamen KKG PJOK.</p>
            <p>👉 Klik tanggal tersebut untuk memfilter dan menampilkan rencana detailnya.</p>
            {selectedDay !== null && (
              <button
                onClick={() => setSelectedDay(null)}
                className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-350 hover:underline block cursor-pointer"
              >
                Clear Filter Tanggal
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Agenda Cards (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-display font-bold text-white text-sm">
              {selectedDay !== null 
                ? `Acara Terjadwal Pada ${selectedDay} ${monthNames[currentMonth]} ${currentYear}`
                : 'Daftar Seluruh Rencana KKG PJOK'
              }
            </h3>
            <span className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              {filteredEventsBySelectedDate.length} Kegiatan
            </span>
          </div>

          <div className="space-y-4">
            {filteredEventsBySelectedDate.length > 0 ? (
              filteredEventsBySelectedDate.map((k) => (
                <div
                  key={k.id}
                  className="glass-card border-l-4 border-amber-500 border-y border-r border-white/10 rounded-r-2xl p-5 shadow-md hover:border-white/20 transition-all space-y-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-white/10 border border-white/10 text-slate-300 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1.5">
                        {k.kategori}
                      </span>
                      <h4 className="font-bold text-white text-base leading-tight">
                        {k.judul}
                      </h4>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {k.deskripsi}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{new Date(k.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1 sm:mb-0">
                      <Clock className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="font-mono">{k.waktu}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-medium text-slate-200 truncate" title={k.lokasi}>
                        {k.lokasi}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card border border-white/10 p-8 text-center rounded-2xl text-slate-400">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm">Tidak ada jadwal KKG pada hari terpilih.</p>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="mt-2 text-xs text-emerald-450 hover:text-emerald-350 hover:underline font-bold cursor-pointer"
                >
                  Tampilkan seluruh agenda
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
