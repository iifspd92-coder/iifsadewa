/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, File, FolderPlus, UploadCloud, LogOut, Search, 
  Trash2, Copy, ExternalLink, ChevronRight, Loader2, 
  CheckCircle, RefreshCw, AlertCircle, HardDrive, ArrowLeft,
  FileText, FilePlus, Eye, Filter
} from 'lucide-react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from '../lib/firebaseAuth';
import { listFiles, createFolder, deleteDriveFile, uploadDriveFile, DriveFile } from '../lib/googleDriveApi';
import ConfirmationModal from './ConfirmationModal';

export default function GoogleDriveView() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Drive state
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([
    { id: 'root', name: 'Drive Saya' }
  ]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('semua');
  
  // UI states
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  
  // Upload states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDeleteFile, setConfirmDeleteFile] = useState<DriveFile | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
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

  // Fetch files when folder, search, list filters, or token changes
  useEffect(() => {
    if (token) {
      fetchDriveFiles();
    }
  }, [token, currentFolderId, filterType]);

  const fetchDriveFiles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const gFiles = await listFiles(token, currentFolderId, searchTerm, filterType);
      setFiles(gFiles);
    } catch (err: any) {
      console.error(err);
      showNotification(err?.message || 'Gagal memuat berkas Drive', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDriveFiles();
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
        showNotification(`Selamat datang Bapak/Ibu ${result.user.displayName}! Akun Google berhasil terhubung.`);
      }
    } catch (err: any) {
      console.error(err);
      showNotification('Login Google gagal. Coba lagi.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setFiles([]);
      setCurrentFolderId('root');
      setFolderPath([{ id: 'root', name: 'Drive Saya' }]);
      showNotification('Sesi Google Drive telah dinonaktifkan.');
    } catch (err) {
      console.error(err);
    }
  };

  // Directory navigation
  const openFolder = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setFolderPath((prev) => [...prev, { id: folderId, name: folderName }]);
    setSearchTerm('');
  };

  const navigateToBreadcrumb = (index: number) => {
    const selected = folderPath[index];
    setCurrentFolderId(selected.id);
    setFolderPath(folderPath.slice(0, index + 1));
    setSearchTerm('');
  };

  // Folder creation
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !token) return;
    setIsCreatingFolder(true);
    try {
      await createFolder(token, newFolderName, currentFolderId);
      showNotification(`Folder "${newFolderName}" berhasil dibuat!`);
      setNewFolderName('');
      setShowCreateFolder(false);
      fetchDriveFiles();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal membuat folder', 'error');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Multipart File upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !token) return;

    setIsUploading(true);
    setUploadProgress(`Mengunggah "${selectedFile.name}"...`);
    try {
      await uploadDriveFile(token, selectedFile, currentFolderId);
      showNotification(`File "${selectedFile.name}" berhasil diunggah ke Google Drive!`);
      fetchDriveFiles();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal mengunggah berkas', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Delete file (with custom non-blocking confirmation dialog)
  const handleDelete = (file: DriveFile) => {
    if (!token) return;
    setConfirmDeleteFile(file);
  };

  const confirmDeleteAction = async () => {
    if (!token || !confirmDeleteFile) return;
    const file = confirmDeleteFile;
    setConfirmDeleteFile(null);

    setLoading(true);
    try {
      await deleteDriveFile(token, file.id);
      showNotification(`"${file.name}" sukses dihapus!`);
      fetchDriveFiles();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal menghapus berkas', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Copy shared link
  const copyShareLink = (link?: string, fileName?: string) => {
    if (!link) {
      showNotification('Tautan tidak tersedia untuk dokumen ini', 'error');
      return;
    }
    navigator.clipboard.writeText(link);
    showNotification(`🔗 Tautan "${fileName}" berhasil disalin ke clipboard!`);
  };

  // Helper size formatter
  const formatBytes = (bytesStr?: string) => {
    if (!bytesStr) return '-';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '-';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Check file icons
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-indigo-400 fill-indigo-400/25" />;
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-400 fill-red-400/10" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return <FileText className="w-5 h-5 text-emerald-400 fill-emerald-400/10" />;
    }
    return <File className="w-5 h-5 text-slate-350" />;
  };

  return (
    <div className="space-y-6 pb-20 text-slate-100 font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 border py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce duration-300 ${
          notification.type === 'success' 
            ? 'bg-slate-900 border-emerald-500/30 text-white' 
            : 'bg-rose-950/90 border-rose-500/30 text-rose-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
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
            <HardDrive className="w-5 h-5 text-indigo-400" />
            Pustaka Cloud KKG (Google Drive)
          </h2>
          <p className="text-xs text-slate-300">
            Hubungkan akun Google Belajar ID atau Gmail Anda untuk menyimpan, mengambil, dan mengatur file materi mengajar langsung di Google Drive.
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs">
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
              <p className="text-[9px] text-slate-400 leading-none mt-1">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 ml-2 hover:bg-white/10 rounded-lg text-rose-400 hover:text-rose-300 cursor-pointer transition-colors"
              title="Putuskan Hubungan Google Drive"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Unauthenticated view container */}
      {needsAuth ? (
        <div className="glass-card border border-white/10 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-md">
            <HardDrive className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">Hubungkan ke Google Drive</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Anda membutuhkan izin akses Google Drive untuk dapat mengedit, menghapus, atau mengunggah materi ajar olahraga secara real-time ke penyimpanan awan Anda.
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
              {isLoggingIn ? 'Sedang menghubungkan...' : 'Hubungkan Akun Google Drive'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          
          {/* Breadcrumbs Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-350 bg-white/5 border border-white/5 p-3 rounded-xl">
            <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase mr-1">📂 Lokasi:</span>
            {folderPath.map((folder, index) => {
              const isLast = index === folderPath.length - 1;
              return (
                <React.Fragment key={folder.id}>
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  <button
                    onClick={() => navigateToBreadcrumb(index)}
                    disabled={isLast}
                    className={`font-semibold hover:underline cursor-pointer ${
                      isLast 
                        ? 'text-white font-bold pointer-events-none' 
                        : 'text-indigo-305 text-indigo-300'
                    }`}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 text-white">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari file pembelajaran di folder ini..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 glass-input rounded-xl text-xs"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/15 hover:bg-white/20 rounded-lg text-[9px] font-mono select-none uppercase font-bold"
              >
                Cari
              </button>
            </form>

            {/* Type Filters */}
            <div className="flex bg-black/20 border border-white/10 rounded-xl p-1 gap-1">
              {[
                { id: 'semua', label: 'Semua' },
                { id: 'folder', label: 'Folder' },
                { id: 'document', label: 'Dokumen' },
                { id: 'spreadsheet', label: 'Sheet' },
                { id: 'media', label: 'Media' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterType(filter.id)}
                  className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    filterType === filter.id 
                      ? 'bg-indigo-650 bg-indigo-600 border border-white/10 text-white'
                      : 'text-slate-350 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* File Actions Row */}
            <div className="flex gap-2 w-full md:col-span-2 lg:col-span-1">
              
              {/* Create new folder button */}
              <button
                onClick={() => setShowCreateFolder(!showCreateFolder)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 rounded-xl text-xs font-bold text-indigo-300 transition-colors cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-indigo-400" />
                Folder Baru
              </button>

              {/* Upload file triggers input */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-300 transition-colors cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                )}
                {isUploading ? 'Mengupload...' : 'Upload Berkas'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Create Folder Collapse */}
          {showCreateFolder && (
            <form onSubmit={handleCreateFolder} className="bg-white/5 border border-white/10 rounded-2xl p-4.5 flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 w-full">
                <label className="block text-[10px] uppercase font-bold tracking-wider font-mono text-slate-400 mb-1">Nama Folder Baru</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Ajar Kelas 6"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto pt-4 sm:pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs text-slate-200 cursor-pointer font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder}
                  className="flex-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1"
                >
                  {isCreatingFolder && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Buat Folder
                </button>
              </div>
            </form>
          )}

          {/* Upload loading bar indicator */}
          {isUploading && (
            <div className="bg-slate-900/50 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-emerald-450 animate-spin shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Sedang menginput berkas pembelajaran</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{uploadProgress}</p>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 uppercase tracking-widest font-extrabold animate-pulse">
                Proses
              </span>
            </div>
          )}

          {/* Drive Files Listing Table / list */}
          <div className="glass-card border border-white/10 rounded-2xl shadow-xl overflow-hidden text-white">
            
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400">Sinkronisasi data Google Drive Anda...</p>
              </div>
            ) : files.length > 0 ? (
              <div className="divide-y divide-white/5">
                {files.map((file) => {
                  const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                  return (
                    <div 
                      key={file.id}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          {getFileIcon(file.mimeType)}
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          {isFolder ? (
                            <button
                              onClick={() => openFolder(file.id, file.name)}
                              className="font-bold text-white text-sm hover:text-indigo-400 hover:underline transition-colors block text-left"
                            >
                              {file.name}
                            </button>
                          ) : (
                            <a 
                              href={file.webViewLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-semibold text-white text-sm hover:text-indigo-400 hover:underline transition-colors block text-left"
                            >
                              {file.name}
                            </a>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400 uppercase font-mono mt-1">
                            {isFolder ? (
                              <span className="font-bold text-indigo-455 text-indigo-400">🏷️ Folder</span>
                            ) : (
                              <>
                                <span className="font-bold text-slate-350">📦 KELAS: {formatBytes(file.size)}</span>
                                <span>|</span>
                              </>
                            )}
                            <span>📅 UBAH: {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID') : '-'}</span>
                            
                            {file.owners && file.owners.length > 0 && (
                              <>
                                <span>|</span>
                                <span className="flex items-center gap-1 lowercase">
                                  👤 {file.owners[0].displayName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Options and quick triggers */}
                      <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                        
                        {/* Preview / Eye for files */}
                        {!isFolder && file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg border border-white/5 cursor-pointer transition-colors"
                            title="Tinjau Berkas"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}

                        {/* Copy Share Link */}
                        <button
                          onClick={() => copyShareLink(file.webViewLink, file.name)}
                          className="p-2 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg border border-white/5 cursor-pointer transition-colors"
                          title="Salin Link Berkas"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Download for files */}
                        {!isFolder && file.webContentLink && (
                          <a
                            href={file.webContentLink}
                            className="p-2 bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20 hover:text-white rounded-lg border border-indigo-500/10 cursor-pointer transition-colors"
                            title="Unduh Berkas Direct"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {/* Delete trigger */}
                        <button
                          onClick={() => handleDelete(file)}
                          className="p-2 bg-rose-500/10 text-rose-350 hover:bg-rose-500/20 hover:text-rose-200 rounded-lg border border-rose-500/10 cursor-pointer transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <Folder className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="font-bold text-white text-sm">Tidak ada berkas/folder</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Folder ini kosong atau belum ada berkas pembelajaran yang diunggah. Gunakan tombol 'Upload Berkas' di atas.
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => { setSearchTerm(''); fetchDriveFiles(); }}
                    className="mt-3 px-3 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-[10px] font-semibold"
                  >
                    Batal Pencarian
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!confirmDeleteFile}
        title={confirmDeleteFile?.mimeType === 'application/vnd.google-apps.folder' ? "Hapus Folder" : "Hapus Berkas"}
        message={`Apakah Anda yakin ingin menghapus ${confirmDeleteFile?.mimeType === 'application/vnd.google-apps.folder' ? 'folder beserta seluruh isinya' : 'berkas'} "${confirmDeleteFile?.name}" dari Google Drive? Anda tidak dapat membatalkan tindakan ini.`}
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDeleteFile(null)}
      />

    </div>
  );
}
