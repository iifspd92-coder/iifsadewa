/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Plus, Table, Loader2, CheckCircle, 
  AlertCircle, ExternalLink, RefreshCw, Save, Grid, 
  Trash2, Send, Database, ArrowRight, Notebook, Edit2, 
  HelpCircle, ChevronRight, CornerDownRight, ArrowLeft
} from 'lucide-react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from '../lib/firebaseAuth';
import { listFiles, deleteDriveFile, DriveFile } from '../lib/googleDriveApi';
import { 
  createSpreadsheet, getSpreadsheetDetails, getSpreadsheetValues, 
  updateSpreadsheetValues, appendSpreadsheetValues, createNewSheetTab, SheetMetadata 
} from '../lib/googleSheetsApi';
import ConfirmationModal from './ConfirmationModal';

export default function GoogleSheetsView() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loadingSpreadsheets, setLoadingSpreadsheets] = useState<boolean>(false);
  
  // List of spreadsheet files in Drive
  const [spreadsheets, setSpreadsheets] = useState<DriveFile[]>([]);
  
  // Active selected spreadsheet engine states
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [selectedSheetUrl, setSelectedSheetUrl] = useState<string>('');
  const [sheetMetadata, setSheetMetadata] = useState<SheetMetadata | null>(null);
  const [activeTabName, setActiveTabName] = useState<string>('');
  const [sheetRows, setSheetRows] = useState<any[][]>([]);
  const [loadingSheetData, setLoadingSheetData] = useState<boolean>(false);
  
  // Cell modifier state
  const [editingCell, setEditingCell] = useState<{ row: number; col: number; val: string } | null>(null);
  const [isSavingCell, setIsSavingCell] = useState<boolean>(false);

  // Append entry form state
  const [newRowValues, setNewRowValues] = useState<string[]>([]);
  const [isAppendingRow, setIsAppendingRow] = useState<boolean>(false);

  // Template generation state
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);

  // Custom sheets input
  const [customSpreadsheetIdInput, setCustomSpreadsheetIdInput] = useState<string>('');

  // Notifications block
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDeleteSheet, setConfirmDeleteSheet] = useState<DriveFile | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  // Auth Initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch spreadsheets from Drive when token changes
  useEffect(() => {
    if (token) {
      loadSpreadsheetsList();
    }
  }, [token]);

  // Fetch sheet rows when spreadsheetId or active tab changes
  useEffect(() => {
    if (token && selectedSheetId && activeTabName) {
      loadSheetValues();
    }
  }, [token, selectedSheetId, activeTabName]);

  const loadSpreadsheetsList = async () => {
    if (!token) return;
    setLoadingSpreadsheets(true);
    try {
      // Find files of spreadsheet mimeType
      const driveSpreadsheets = await listFiles(token, 'root', '', 'spreadsheet');
      setSpreadsheets(driveSpreadsheets);
    } catch (err: any) {
      console.error(err);
      showNotification('Gagal memuat daftar spreadsheet dari Google Drive', 'error');
    } finally {
      setLoadingSpreadsheets(false);
    }
  };

  const handleDeleteSpreadsheetTrigger = (sheet: DriveFile) => {
    if (!token) return;
    setConfirmDeleteSheet(sheet);
  };

  const confirmDeleteSpreadsheetAction = async () => {
    if (!token || !confirmDeleteSheet) return;
    const sheetId = confirmDeleteSheet.id;
    const sheetName = confirmDeleteSheet.name;
    setConfirmDeleteSheet(null);

    setLoadingSpreadsheets(true);
    try {
      await deleteDriveFile(token, sheetId);
      showNotification(`Spreadsheet "${sheetName}" berhasil di hapus.`);
      if (selectedSheetId === sheetId) {
        setSelectedSheetId(null);
        setSheetMetadata(null);
        setSheetRows([]);
      }
      loadSpreadsheetsList();
    } catch (err: any) {
      console.error(err);
      showNotification(err?.message || 'Gagal menghapus spreadsheet', 'error');
    } finally {
      setLoadingSpreadsheets(false);
    }
  };

  const loadSheetValues = async () => {
    if (!token || !selectedSheetId || !activeTabName) return;
    setLoadingSheetData(true);
    try {
      // Load current tab rows (limit to standard range for viewport display, e.g., rows 1 to 50)
      const range = `${activeTabName}!A1:Z50`;
      const values = await getSpreadsheetValues(token, selectedSheetId, range);
      setSheetRows(values);
      
      // Auto size appending row template inputs
      if (values.length > 0) {
        setNewRowValues(new Array(values[0].length).fill(''));
      } else {
        setNewRowValues(['', '', '']);
      }
    } catch (err: any) {
      console.error(err);
      showNotification(`Gagal memuat baris data dari tab "${activeTabName}"`, 'error');
    } finally {
      setLoadingSheetData(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
        showNotification(`Akun Google divalidasi! Selamat bekerja, Bapak/Ibu ${result.user.displayName}`);
      }
    } catch (err: any) {
      console.error(err);
      showNotification('Login Google Sheets gagal diproses. Silakan coba kembali.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setNeedsAuth(true);
    setSpreadsheets([]);
    setSelectedSheetId(null);
    setSheetMetadata(null);
    setSheetRows([]);
    showNotification('Putuskan sambungan integrasi Google Workspace.');
  };

  // Open & Load selected spreadsheet metadata
  const handleSelectSpreadsheet = async (sheetId: string) => {
    if (!token) return;
    setLoadingSheetData(true);
    try {
      const details = await getSpreadsheetDetails(token, sheetId);
      setSheetMetadata(details);
      setSelectedSheetId(sheetId);
      setSelectedSheetUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`);
      
      // Select the first tab automatically
      if (details.sheets.length > 0) {
        setActiveTabName(details.sheets[0].title);
      }
      showNotification(`Berhasil memuat berkas spreadsheet "${details.title}"`);
    } catch (err: any) {
      console.error(err);
      showNotification(err?.message || 'Gagal membuka detail spreadsheet', 'error');
    } finally {
      setLoadingSheetData(false);
    }
  };

  const handleCustomSpreadsheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSpreadsheetIdInput.trim()) return;
    
    // Extract ID from URL if user posted a full sheets link
    let targetId = customSpreadsheetIdInput.trim();
    const urlMatches = targetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (urlMatches && urlMatches[1]) {
      targetId = urlMatches[1];
    }

    handleSelectSpreadsheet(targetId);
  };

  // Templates Generator
  const handleCreateTemplate = async (templateType: 'guru' | 'keuangan') => {
    if (!token) return;
    setIsCreatingTemplate(true);
    try {
      let title = '';
      let headers: string[] = [];
      
      if (templateType === 'guru') {
        title = 'KKG PJOK Luwuk Timur - Master Database Guru';
        headers = ['No', 'Nama Guru PJOK', 'Asal Sekolah SD', 'NIP / NUPTK', 'Status Kepegawaian', 'No. HP WhatsApp', 'Email Belajar ID'];
      } else {
        title = 'KKG PJOK Luwuk Timur - Jurnal Kas Keuangan';
        headers = ['No', 'Tanggal Transaksi', 'Keterangan Kas / Agenda', 'Nominal Debet (Masuk)', 'Nominal Kredit (Keluar)', 'Nama Penanggung Jawab', 'Catatan'];
      }

      const res = await createSpreadsheet(token, title, headers);
      showNotification(`Sukses menerbitkan spreadsheet template "${title}"!`);
      
      // Auto-load freshly created template
      await handleSelectSpreadsheet(res.spreadsheetId);
      
      // Refresh drive spreadsheet view list
      loadSpreadsheetsList();
    } catch (err: any) {
      console.error(err);
      showNotification(err?.message || 'Gagal membuat template KKG', 'error');
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  // Interactive sheet values cell updates
  const startEditingCell = (rowIndex: number, colIndex: number, currentVal: any) => {
    setEditingCell({
      row: rowIndex,
      col: colIndex,
      val: currentVal !== undefined ? String(currentVal) : '',
    });
  };

  const saveCellEdit = async () => {
    if (!token || !selectedSheetId || !editingCell) return;
    setIsSavingCell(true);
    try {
      // Maps Column index to google columns notation (e.g. 0 -> A, 1 -> B, ...)
      const colLetter = String.fromCharCode(65 + editingCell.col);
      // Row starts at 1
      const cellRange = `${activeTabName}!${colLetter}${editingCell.row + 1}`;
      
      await updateSpreadsheetValues(token, selectedSheetId, cellRange, [[editingCell.val]]);
      
      // Update local visible matrix immediately
      const updatedRows = [...sheetRows];
      if (!updatedRows[editingCell.row]) {
        updatedRows[editingCell.row] = [];
      }
      updatedRows[editingCell.row][editingCell.col] = editingCell.val;
      setSheetRows(updatedRows);
      
      setEditingCell(null);
      showNotification('Sel spreadsheet sukses diperbarui!');
    } catch (err: any) {
      console.error(err);
      showNotification('Gagal menyimpan nilai sel', 'error');
    } finally {
      setIsSavingCell(false);
    }
  };

  // Append New Row
  const handleAppendRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedSheetId || !activeTabName) return;

    // Check if there is data
    if (newRowValues.every(val => !val.trim())) {
      showNotification('Harap isi paling tidak salah satu kolom baru', 'error');
      return;
    }

    setIsAppendingRow(true);
    try {
      const appendRange = `${activeTabName}!A1`;
      await appendSpreadsheetValues(token, selectedSheetId, appendRange, [newRowValues]);
      
      showNotification('Data baris baru berhasil disisipkan!');
      
      // Reload values
      await loadSheetValues();
      
      // Reset inputs
      setNewRowValues(new Array(newRowValues.length).fill(''));
    } catch (err: any) {
      console.error(err);
      showNotification('Gagal menyisipkan baris di kueri Google Sheets', 'error');
    } finally {
      setIsAppendingRow(false);
    }
  };

  // Create a new empty tab
  const handleAddNewTab = async () => {
    if (!token || !selectedSheetId) return;
    const tabName = window.prompt('Masukkan nama Tab/Sheet baru:');
    if (!tabName || !tabName.trim()) return;

    setLoadingSheetData(true);
    try {
      await createNewSheetTab(token, selectedSheetId, tabName.trim());
      showNotification(`Tab "${tabName}" berhasil ditambahkan!`);
      
      // Reload spreadsheet details
      const details = await getSpreadsheetDetails(token, selectedSheetId);
      setSheetMetadata(details);
      setActiveTabName(tabName.trim());
    } catch (err: any) {
      console.error(err);
      showNotification('Gagal membuat tab baru', 'error');
    } finally {
      setLoadingSheetData(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 text-slate-100 font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 border py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce duration-300 ${
          notification.type === 'success' 
            ? 'bg-slate-900 border-indigo-500/30 text-white' 
            : 'bg-rose-950/90 border-rose-500/30 text-rose-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4.5 h-4.5 text-indigo-400" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 text-rose-400" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            Integrasi Google Sheets KKG
          </h2>
          <p className="text-xs text-slate-300">
            Kelola data guru, absensi, kompetisi siswa, dan transparansi kas KKG real-time dengan integrasi langsung Google Sheets.
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs shrink-0">
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Avatar'} 
                className="w-5 h-5 rounded-full border border-white/20"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="text-left">
              <p className="font-bold text-white leading-none text-[11px]">{user.displayName}</p>
              <p className="text-[9px] text-slate-400 leading-none mt-1">Sheets Connected</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-2.5 py-1 hover:bg-rose-500/20 rounded border border-rose-500/20 text-rose-350 hover:text-rose-200 cursor-pointer text-[10px] uppercase font-bold tracking-wider transition-colors ml-2"
              title="Putuskan Hubungan Google Sheets"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Unauthenticated view container */}
      {needsAuth ? (
        <div className="glass-card border border-white/10 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-md">
            <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">Hubungkan ke Google Sheets</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Anda memerlukan izin transfer data Google Sheets agar aplikasi dapat menulis, mengoreksi, dan membaca tabel instan draf materi secara aman dan lancar.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer font-bold text-xs shadow-md shadow-black/20"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
              ) : (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              )}
              {isLoggingIn ? 'Membuka pop-up autentikasi...' : 'Hubungkan Google Belajar ID / Gmail'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          
          {selectedSheetId ? (
            /* ACTIVE SPREADSHEET EDITOR VIEW */
            <div className="space-y-6">
              
              {/* Back Button and Sheet Info Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setSelectedSheetId(null);
                      setSheetMetadata(null);
                      setSheetRows([]);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white cursor-pointer transition-colors border border-white/5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25 uppercase">Spreadsheet Aktif</span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {selectedSheetId.slice(0, 12)}...</span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-1">{sheetMetadata?.title || 'Memuat berkas...'}</h3>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={loadSheetValues}
                    disabled={loadingSheetData}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-slate-200 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loadingSheetData ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>

                  <a
                    href={selectedSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-md shadow-indigo-950/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Kolaborasi Full
                  </a>
                </div>
              </div>

              {/* Dynamic Sheets / Tabs navigation bar */}
              {sheetMetadata && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2.5 bg-black/30 border border-white/10 rounded-xl gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase text-slate-400 font-bold px-2">📑 Tabs:</span>
                    {sheetMetadata.sheets.map((s) => (
                      <button
                        key={s.sheetId}
                        onClick={() => setActiveTabName(s.title)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          activeTabName === s.title
                            ? 'bg-indigo-605 bg-indigo-600 text-white border border-white/10 shadow-md shadow-indigo-950/30 font-extrabold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleAddNewTab}
                    className="px-3 py-1.5 hover:bg-white/5 border border-white/10 rounded-lg text-indigo-300 hover:text-white flex items-center gap-1 text-[11px] font-bold cursor-pointer self-stretch sm:self-auto text-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    Tambah Tab
                  </button>
                </div>
              )}

              {/* Interactive Cells Grid */}
              <div className="glass-card border border-white/10 rounded-2xl shadow-xl overflow-hidden text-white flex flex-col">
                <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <div className="text-left">
                    <p className="font-bold text-white flex items-center gap-1">
                      <Table className="w-4 h-4 text-indigo-400" />
                      Lembar Pratinjau & Edit Data Instan ({activeTabName})
                    </p>
                    <p className="text-[10px] text-indigo-300 mt-1">💡 Klik ganda atau klik tombol Edit (✏️) pada sel mana saja untuk merubah nilainya di Google Sheets.</p>
                  </div>

                  {editingCell && (
                    <div className="bg-black/55 border border-indigo-500/30 p-2 rounded-xl flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 animate-fade-in text-[11px]">
                      <span className="font-mono font-bold text-indigo-300">
                        Edit [{String.fromCharCode(65 + editingCell.col)}{editingCell.row + 1}]:
                      </span>
                      <input
                        type="text"
                        value={editingCell.val}
                        onChange={(e) => setEditingCell({ ...editingCell, val: e.target.value })}
                        className="p-1 px-2.5 bg-slate-900 border border-white/15 rounded text-white text-xs w-40 sm:w-52"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveCellEdit();
                          else if (e.key === 'Escape') setEditingCell(null);
                        }}
                      />
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => setEditingCell(null)}
                          className="px-2 py-1 hover:bg-white/10 rounded text-slate-300"
                        >
                          Batal
                        </button>
                        <button
                          onClick={saveCellEdit}
                          disabled={isSavingCell}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 font-bold rounded flex items-center gap-1"
                        >
                          {isSavingCell ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          Simpan
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {loadingSheetData ? (
                  <div className="py-24 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Sinkronisasi sel dari Google Sheets...</p>
                  </div>
                ) : sheetRows.length > 0 ? (
                  <div className="overflow-x-auto max-h-[460px]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#0b101e] border-b border-white/10 text-[10px] uppercase font-mono text-slate-400 sticky top-0 z-10 shadow shadow-black">
                        <tr>
                          <th className="py-2.5 px-3 border-r border-white/5 text-center w-10">#</th>
                          {sheetRows[0].map((_, colIndex) => (
                            <th key={colIndex} className="py-2.5 px-4 border-r border-white/5 font-mono text-slate-350">
                              Kolom {String.fromCharCode(65 + colIndex)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-sans">
                        {sheetRows.map((row, rowIndex) => {
                          // Check if header row for styling
                          const isHeaderRow = rowIndex === 0;
                          return (
                            <tr key={rowIndex} className={`hover:bg-white/5 ${isHeaderRow ? 'bg-white/5 font-semibold text-indigo-200' : ''}`}>
                              <td className="py-2 px-3 border-r border-white/5 text-center bg-black/25 font-mono font-bold text-[10px] text-slate-405 text-slate-400">
                                {rowIndex + 1}
                              </td>
                              {row.map((cellValue, colIndex) => (
                                <td 
                                  key={colIndex} 
                                  className="py-2 px-4 border-r border-white/5 relative group cursor-pointer hover:bg-indigo-500/10 transition-colors max-w-xs truncate"
                                  title="Klik Ganda untuk mengedit"
                                  onDoubleClick={() => startEditingCell(rowIndex, colIndex, cellValue)}
                                >
                                  <span>{cellValue !== undefined ? String(cellValue) : ''}</span>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditingCell(rowIndex, colIndex, cellValue);
                                    }}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 bg-indigo-600/90 text-white rounded hover:bg-indigo-700 transition-opacity"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-405 text-slate-400">
                    <Table className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-white text-sm">Tabel atau Tab ini Kosong</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Belum ada kolom baris atau baris data di tab ini. Isi data lewat form di bawah ini.</p>
                  </div>
                )}
              </div>

              {/* Add / Append Row Form */}
              {sheetRows.length > 0 && (
                <div className="glass-card border border-white/10 rounded-2xl p-5 shadow-xl text-white space-y-4 animate-fade-in text-left">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-indigo-400" />
                    Sisipkan Baris Data Baru (Baris Selanjutnya)
                  </h4>
                  <form onSubmit={handleAppendRow} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {sheetRows[0].map((headerName, hIndex) => {
                        const cellLabel = headerName ? String(headerName) : `Kolom ${String.fromCharCode(65 + hIndex)}`;
                        return (
                          <div key={hIndex} className="space-y-1">
                            <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase truncate">
                              {cellLabel}
                            </label>
                            <input
                              type="text"
                              value={newRowValues[hIndex] || ''}
                              onChange={(e) => {
                                const vals = [...newRowValues];
                                vals[hIndex] = e.target.value;
                                setNewRowValues(vals);
                              }}
                              placeholder={`Ketik ${cellLabel}...`}
                              className="w-full p-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isAppendingRow}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow shadow-indigo-950/20"
                      >
                        {isAppendingRow ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-white" />
                        )}
                        {isAppendingRow ? 'Menyisipkan...' : 'Tambahkan Baris Baru'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          ) : (
            /* DIRECTORY / HOME VIEW */
            <div className="space-y-6">

              {/* Template Quick Launch Panel */}
              <div className="glass-card border border-white/10 rounded-2xl p-5 sm:p-7 shadow-xl text-left space-y-4">
                <div>
                  <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                    <Database className="w-4.5 h-4.5 text-indigo-400" />
                    Inisiasi Templat Master KKG Resmi
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Buat file database atau buku jurnal kas baru yang sudah diformat dengan struktur KKG PJOK Luwuk Timur secara otomatis di Google Drive Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Template 1: Teachers */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition-all">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 uppercase tracking-wider text-left">Database Guru</span>
                      <h4 className="font-bold text-white text-xs mt-2.5">Tabel Master Guru PJOK</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                        Termasuk struktur tabel NIP/NUPTK, Asal Sekolah, No. HP WA (termasuk kontak 082213546580 Admin), Status Kepegawaian, dan akun Belajar.id.
                      </p>
                    </div>
                    <button
                      onClick={() => handleCreateTemplate('guru')}
                      disabled={isCreatingTemplate}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-700/50 text-[11px] font-bold text-white rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isCreatingTemplate ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      Inisiasi Master Guru
                    </button>
                  </div>

                  {/* Template 2: Kas Keuangan */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between space-y-4 hover:border-emerald-500/20 transition-all">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-emerald-450 text-emerald-300 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-wider text-left">Keuangan KKG</span>
                      <h4 className="font-bold text-white text-xs mt-2.5">Buku Kas Jurnal Keuangan</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                        Sistem pelaporan transparansi kas iuran KKG bulanan, debet masuk, pengeluaran logistik bimtek, dan saldo bersih otomatis.
                      </p>
                    </div>
                    <button
                      onClick={() => handleCreateTemplate('keuangan')}
                      disabled={isCreatingTemplate}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-700/50 text-[11px] font-bold text-white rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isCreatingTemplate ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      Inisiasi Buku Jurnal Kas
                    </button>
                  </div>
                </div>
              </div>

              {/* Search or Load by URL directly */}
              <div className="glass-card border border-white/10 rounded-2xl p-5 shadow-xl text-left space-y-3.5">
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Notebook className="w-4 h-4 text-indigo-400" />
                  Buka Spreadsheet Lewat ID / Link Google Sheets
                </h3>
                <form onSubmit={handleCustomSpreadsheetSubmit} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Masukkan Spreadsheet ID atau Tempel Tautan Google Sheets..."
                    value={customSpreadsheetIdInput}
                    onChange={(e) => setCustomSpreadsheetIdInput(e.target.value)}
                    className="flex-1 p-2.5 px-3.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-xs text-white font-bold rounded-xl flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                  >
                    Buka Tabel
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Spreadsheets Drive Directory list */}
              <div className="glass-card border border-white/10 rounded-2xl shadow-xl overflow-hidden text-left flex flex-col text-white">
                <div className="p-4 border-b border-white/5 bg-[#0e1424] flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5 font-display text-sm">
                    <Table className="w-4.5 h-4.5 text-indigo-400" />
                    Berkas Google Sheets di Google Drive Saya
                  </span>

                  <button
                    onClick={loadSpreadsheetsList}
                    disabled={loadingSpreadsheets}
                    className="p-1 px-2.5 hover:bg-white/10 text-slate-300 rounded border border-white/5 flex items-center gap-1 cursor-pointer transition-colors text-[10px]"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingSpreadsheets ? 'animate-spin' : ''}`} />
                    Refresh Daftar
                  </button>
                </div>

                {loadingSpreadsheets ? (
                  <div className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Sinkronisasi dokumen spreadsheet Anda...</p>
                  </div>
                ) : spreadsheets.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {spreadsheets.map((sheet) => (
                      <div 
                        key={sheet.id}
                        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 shadow">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-400 fill-emerald-400/15" />
                          </div>
                          
                          <div className="min-w-0 flex-1 text-left">
                            <button
                              onClick={() => handleSelectSpreadsheet(sheet.id)}
                              className="font-bold text-white text-xs hover:text-indigo-400 hover:underline transition-colors block text-left"
                            >
                              {sheet.name}
                            </button>
                            <p className="text-[10px] text-slate-405 text-slate-400 mt-1 font-mono uppercase">
                              📅 Terakhir Diubah: {sheet.modifiedTime ? new Date(sheet.modifiedTime).toLocaleDateString('id-ID') : '-'}
                              {sheet.owners && (
                                <span className="ml-2 pl-2 border-l border-white/10">👤 Pemilik: {sheet.owners[0]?.displayName}</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                          <a
                            href={sheet.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-white/10 text-slate-450 border border-white/5 rounded-lg text-slate-400 hover:text-white"
                            title="Tinjau Langsung di Google Sheets"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleDeleteSpreadsheetTrigger(sheet)}
                            className="p-2 hover:bg-rose-500/10 text-rose-450 border border-white/5 hover:border-rose-500/20 rounded-lg text-rose-400 hover:text-rose-350 transition-colors cursor-pointer"
                            title="Hapus Spreadsheet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleSelectSpreadsheet(sheet.id)}
                            className="px-4 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            Buka Editor
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-400">
                    <FileSpreadsheet className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-white text-xs">Belum ada spreadsheet terdeteksi</p>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-0.5">Silakan gunakan salah satu tombol Templat Master KKG di atas untuk membuat spreadsheet baru.</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      <ConfirmationModal
        isOpen={!!confirmDeleteSheet}
        title="Hapus Spreadsheet"
        message={`Apakah Anda yakin ingin menghapus spreadsheet "${confirmDeleteSheet?.name}"?\nTindakan ini akan menghapus berkas tersebut dari Google Drive Anda secara permanen.`}
        onConfirm={confirmDeleteSpreadsheetAction}
        onCancel={() => setConfirmDeleteSheet(null)}
      />

    </div>
  );
}
