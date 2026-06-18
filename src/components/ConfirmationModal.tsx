import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  isDanger = true,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in text-white z-10">
        <div className="p-5 space-y-4">
          <div className="flex gap-3.5 items-start">
            <div className={`p-2.5 rounded-xl shrink-0 ${isDanger ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
              {isDanger ? <Trash2 className="w-5 h-5 text-rose-400" /> : <AlertCircle className="w-5 h-5 text-indigo-400" />}
            </div>
            <div className="space-y-1 text-left min-w-0 flex-1">
              <h3 className="font-display font-bold text-sm tracking-wide text-white">
                {title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
                {message}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2.5 pt-1.5">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isDanger 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
