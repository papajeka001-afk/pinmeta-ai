import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ToastContainer, ToastMessage } from './components/Toast';
import { InputMode, PinterestMetadata } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<InputMode>('image');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImageData, setUploadedImageData] = useState<{ mimeType: string, base64: string } | null>(null);
  
  const [dragOver, setDragOver] = useState(false);
  
  const [urlVal, setUrlVal] = useState('');
  const [textVal, setTextVal] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [lang, setLang] = useState('Indonesia');
  const [extra, setExtra] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('🔍 Memproses input...');
  const [metadata, setMetadata] = useState<PinterestMetadata | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadingMessages = [
    '🔍 Menganalisa visual konten...',
    '🎯 Mengidentifikasi kata kunci utama...',
    '✍️ Menyusun judul yang optimal...',
    '📝 Membuat deskripsi SEO-friendly...',
    '🏷️ Merekomendasikan hashtag & keyword...',
    '📊 Menghitung SEO score...',
    '✨ Hampir selesai...'
  ];

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Hanya file gambar yang diperbolehkan.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploadedImageUrl(dataUrl);
      const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
      const base64 = dataUrl.split(',')[1];
      setUploadedImageData({ mimeType, base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleGenerate = async () => {
    if (currentTab === 'image' && !uploadedImageData) {
      showToast('Silakan upload gambar terlebih dahulu.', 'error');
      return;
    }
    if (currentTab === 'url' && !urlVal.trim()) {
      showToast('Silakan masukkan URL produk.', 'error');
      return;
    }
    if (currentTab === 'text' && !textVal.trim()) {
      showToast('Silakan masukkan deskripsi produk.', 'error');
      return;
    }

    setIsLoading(true);
    setMetadata(null);

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      setLoadingStep(loadingMessages[stepIdx % loadingMessages.length]);
      stepIdx++;
    }, 1200);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: niche || 'Umum',
          audience: audience || 'Semua Audiens',
          lang,
          extra,
          urlVal,
          textVal,
          currentTab,
          uploadedImageData: currentTab === 'image' ? uploadedImageData : null
        })
      });

      if (!response.ok) {
        let errMessage = 'Terjadi kesalahan saat menghubungi server.';
        try {
          const errData = await response.json();
          errMessage = errData.error || errMessage;
        } catch { } // ignore
        throw new Error(errMessage);
      }

      const data = await response.json();
      setMetadata(data);
      showToast('Metadata berhasil di-generate!', 'success');

    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const performCopy = async (text: string, id: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      showToast('Gagal menyalin teks.', 'error');
    }
  };

  const copyAll = () => {
    if (!metadata) return;
    const m = metadata;
    const cleanHashtags = (m.hashtags || []).map(h => h.startsWith('#') ? h : '#' + h).join(' ');
    
    const text = `=== PINTEREST METADATA ===

🏷️ JUDUL PIN:
${m.title}

📝 DESKRIPSI:
${m.description}

🖼️ ALT TEXT:
${m.alt_text}

🔑 PRIMARY KEYWORDS:
${(m.primary_keywords || []).join(', ')}

🔍 SECONDARY KEYWORDS:
${(m.secondary_keywords || []).join(', ')}

#️⃣ HASHTAG:
${cleanHashtags}

📋 NAMA BOARD:
${(m.board_suggestions || []).join(' | ')}

⏰ WAKTU POSTING TERBAIK:
${m.best_posting_time}

📊 SEO SCORE: ${m.seo_scores?.overall || '—'}/100`.trim();

    performCopy(text, 'all');
  };

  return (
    <>
      <Header />
      <Hero />
      <main className="max-w-[1024px] mx-auto px-6 pb-16 flex flex-col md:flex-row gap-6 items-start">
        <InputPanel
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          uploadedImageUrl={uploadedImageUrl}
          handleFile={handleFile}
          handleDrop={handleDrop}
          dragOver={dragOver}
          setDragOver={setDragOver}
          urlVal={urlVal}
          setUrlVal={setUrlVal}
          textVal={textVal}
          setTextVal={setTextVal}
          niche={niche}
          setNiche={setNiche}
          audience={audience}
          setAudience={setAudience}
          lang={lang}
          setLang={setLang}
          extra={extra}
          setExtra={setExtra}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        <OutputPanel 
          isLoading={isLoading}
          loadingStep={loadingStep}
          metadata={metadata}
          onCopyAll={copyAll}
          performCopy={performCopy}
          copiedId={copiedId}
        />
      </main>
      <ToastContainer toasts={toasts} />
    </>
  );
}
