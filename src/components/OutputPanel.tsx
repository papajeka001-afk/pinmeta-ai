import React, { useState } from 'react';
import { PinterestMetadata } from '../types';
import { Sparkles, Pin } from 'lucide-react';
import { cn } from '../lib/utils';
import { BarTrack } from './BarTrack';

interface OutputPanelProps {
  isLoading: boolean;
  loadingStep: string;
  metadata: PinterestMetadata | null;
  onCopyAll: () => void;
  performCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

export function OutputPanel({ isLoading, loadingStep, metadata, onCopyAll, performCopy, copiedId }: OutputPanelProps) {
  return (
    <section className="flex-1 flex flex-col gap-4 w-full">
      <div className="bg-white rounded-[24px] border border-[#E8E0D8] shadow-sm flex flex-col h-full">
        <div className="p-4 border-b border-[#F0ECE6] bg-[#F9F7F5] rounded-t-[24px] flex items-center gap-2">
          <span className="text-lg">✨</span>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#4A4A4A]">Metadata Pinterest</h2>
        </div>
      
        <div className="p-6">
          
          {!isLoading && !metadata && (
            <div className="text-center py-10 px-4 text-gray-500">
              <div className="text-5xl mb-3 opacity-40 flex justify-center"><Pin size={48} /></div>
              <p className="text-[13px] leading-relaxed">
                Metadata Pinterest-mu akan muncul di sini.<br/>
                Upload gambar atau masukkan konten, lalu klik Generate.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-4 border-[#F0ECE6] border-t-[#E60023] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-[13px]">AI sedang menganalisa konten kamu...</p>
              <div className="mt-3 text-[11px] text-[#E60023] font-bold tracking-wide min-h-[20px] uppercase">{loadingStep}</div>
            </div>
          )}

          {!isLoading && metadata && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-5">
              
              <div className="bg-[#111111] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between text-white gap-4">
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">SEO Health Score</span>
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className={cn("text-5xl font-bold font-serif", metadata.seo_scores.overall >= 80 ? "text-[#4CFF91]" : metadata.seo_scores.overall >= 60 ? "text-[#ffc94a]" : "text-[#ff6b6b]")}>{metadata.seo_scores.overall}</span>
                    <span className="text-gray-400 text-sm">/100</span>
                  </div>
                  <span className={cn("text-[11px] mt-1 font-bold", metadata.seo_scores.overall >= 80 ? "text-[#4CFF91]" : metadata.seo_scores.overall >= 60 ? "text-[#ffc94a]" : "text-[#ff6b6b]")}>● {metadata.seo_label}</span>
                </div>
                <div className="w-full sm:w-[300px] flex flex-col gap-3">
                  <BarTrack label="Title Impact" value={metadata.seo_scores.title_score || 0} />
                  <BarTrack label="Desc Density" value={metadata.seo_scores.description_score || 0} />
                  <BarTrack label="KW Relevancy" value={metadata.seo_scores.keyword_score || 0} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <ResultSection label="Judul Pin (Title)" onCopy={() => performCopy(metadata.title, 'title')} copied={copiedId === 'title'}>
                  <div className="bg-[#F9F7F5] border border-[#E8E0D8] p-3 rounded-xl text-[15px] font-bold font-serif text-[#111111]">
                    {metadata.title}
                  </div>
                </ResultSection>

                <ResultSection label="Deskripsi Pin" onCopy={() => performCopy(metadata.description, 'desc')} copied={copiedId === 'desc'}>
                  <div className="bg-[#F9F7F5] border border-[#E8E0D8] p-3 rounded-xl text-[13px] leading-relaxed text-gray-700">
                    {metadata.description}
                  </div>
                </ResultSection>

                <ResultSection label="Keyword & Tags">
                  <div className="flex flex-wrap gap-2">
                    {(metadata.primary_keywords || []).map((kw, i) => (
                      <KeywordTag key={`pri-${i}`} text={kw} primary={true} onCopy={() => performCopy(kw, `kw-pri-${i}`)} />
                    ))}
                    {(metadata.secondary_keywords || []).map((kw, i) => (
                      <KeywordTag key={`sec-${i}`} text={kw} primary={false} onCopy={() => performCopy(kw, `kw-sec-${i}`)} />
                    ))}
                    {(metadata.hashtags || []).map((ht, i) => {
                      const c = ht.startsWith('#') ? ht : `#${ht}`;
                      return <KeywordTag key={`ht-${i}`} text={c} primary={false} onCopy={() => performCopy(c, `ht-${i}`)} />
                    })}
                  </div>
                </ResultSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl relative group">
                    <button onClick={() => performCopy(metadata.alt_text, 'alt')} className="absolute top-2 right-2 text-[10px] text-[#92400E] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">{copiedId==='alt'?'✓':'Salin'}</button>
                    <span className="text-[10px] font-bold text-[#92400E] uppercase block mb-1">Alt Text (Aksesibilitas)</span>
                    <p className="text-[11px] text-[#92400E] leading-tight italic pr-8">{metadata.alt_text}</p>
                  </div>
                  <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-3 rounded-xl relative group">
                    <button onClick={() => performCopy((metadata.board_suggestions || []).join(' · '), 'boards')} className="absolute top-2 right-2 text-[10px] text-[#166534] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">{copiedId==='boards'?'✓':'Salin'}</button>
                    <span className="text-[10px] font-bold text-[#166534] uppercase block mb-1">Rekomendasi Board</span>
                    <p className="text-[12px] text-[#166534] font-bold pr-8">{(metadata.board_suggestions || []).join(' · ')}</p>
                  </div>
                </div>

                <div className="bg-[#F9F7F5] border border-[#E8E0D8] p-3 rounded-xl flex items-center justify-between">
                   <span className="text-[10px] font-bold uppercase text-[#4A4A4A]">Waktu Posting Terbaik</span>
                   <span className="text-[12px] font-bold text-[#E60023]">{metadata.best_posting_time}</span>
                </div>
              </div>

              <button 
                onClick={onCopyAll}
                className="w-full border-2 border-[#E60023] text-[#E60023] py-3 rounded-xl font-bold text-[14px] hover:bg-[#E60023] hover:text-white transition-colors mt-2"
              >
                {copiedId === 'all' ? '✅ Berhasil Disalin!' : '📋 Salin Semua Metadata Ke Clipboard'}
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

function ResultSection({ label, children, onCopy, copied }: { label: string, children: React.ReactNode, onCopy?: () => void, copied?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase text-[#4A4A4A] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#E60023] rounded-full"></span> {label}
        </label>
        {onCopy && (
          <button onClick={onCopy} className="text-[10px] text-[#E60023] font-bold uppercase transition-colors hover:text-[#cc0020]">
            {copied ? 'Tersalin ✓' : 'Salin'}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function KeywordTag({ text, primary, onCopy }: { text: string, primary: boolean, onCopy: () => void }) {
  return (
    <span 
      onClick={onCopy}
      className={cn(
        "px-3 py-1 rounded-full text-[11px] cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] select-none text-center",
        primary 
          ? "bg-[#E60023] text-white font-bold uppercase tracking-tight" 
          : "bg-white border border-[#E8E0D8] text-gray-700 font-medium hover:border-gray-300"
      )}
    >
      {text}
    </span>
  );
}
