import React from 'react';
import { cn } from '../lib/utils';
import { InputMode } from '../types';
import { Inbox, Image as ImageIcon, Link as LinkIcon, AlignLeft } from 'lucide-react';

interface InputPanelProps {
  currentTab: InputMode;
  setCurrentTab: (tab: InputMode) => void;
  uploadedImageUrl: string | null;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  dragOver: boolean;
  setDragOver: (over: boolean) => void;
  urlVal: string;
  setUrlVal: (val: string) => void;
  textVal: string;
  setTextVal: (val: string) => void;
  niche: string;
  setNiche: (val: string) => void;
  audience: string;
  setAudience: (val: string) => void;
  lang: string;
  setLang: (val: string) => void;
  extra: string;
  setExtra: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function InputPanel({
  currentTab, setCurrentTab, uploadedImageUrl, handleFile, handleDrop,
  dragOver, setDragOver, urlVal, setUrlVal, textVal, setTextVal,
  niche, setNiche, audience, setAudience, lang, setLang,
  extra, setExtra, onGenerate, isLoading
}: InputPanelProps) {

  const tabs: { id: InputMode; label: string; icon: React.ReactNode }[] = [
    { id: 'image', label: 'Upload Gambar', icon: <ImageIcon size={14} /> },
    { id: 'url', label: 'Link Produk', icon: <LinkIcon size={14} /> },
    { id: 'text', label: 'Deskripsi', icon: <AlignLeft size={14} /> }
  ];

  return (
    <section className="w-full md:w-[380px] flex flex-col gap-4">
      <div className="bg-white rounded-[24px] border border-[#E8E0D8] shadow-sm flex flex-col h-full">
        <div className="p-4 border-b border-[#F0ECE6] bg-[#F9F7F5] rounded-t-[24px] flex items-center gap-2">
          <span className="text-lg">📥</span>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#4A4A4A]">
            Input Konten
          </h2>
        </div>
        
        <div className="p-5 flex flex-col gap-4 flex-1">
          <div className="bg-[#F0ECE6] p-1 rounded-xl flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[12px] flex items-center justify-center gap-1.5 transition-colors",
                  currentTab === tab.id 
                    ? "bg-white font-bold text-[#E60023] shadow-sm" 
                    : "font-medium text-gray-500 bg-transparent"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {currentTab === 'image' && (
            <div className="flex flex-col gap-4">
              {uploadedImageUrl && (
                <img src={uploadedImageUrl} alt="preview" className="w-full max-h-[220px] object-cover rounded-xl border border-[#E8E0D8] block" />
              )}
              <div 
                className={cn(
                  "border-2 border-dashed border-[#E8E0D8] rounded-2xl bg-[#F9F7F5] p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors relative",
                  dragOver && "border-[#E60023] bg-[#FFE8EC]",
                  uploadedImageUrl && "border-[#E60023] bg-transparent py-4"
                )}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onDrop={(e) => { e.preventDefault(); handleDrop(e); }}
              >
                <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-[0px]" title="" />
                {!uploadedImageUrl && <span className="text-[2.5rem] mb-1 block">📌</span>}
                <strong className={cn("text-[#E60023]", uploadedImageUrl ? "text-[14px]" : "text-[14px]")}>
                  {uploadedImageUrl ? 'Ganti Foto Produk' : 'Pilih Foto Produk'}
                </strong>
                {!uploadedImageUrl && <p className="text-[11px] text-gray-500 mt-1">Seret gambar ke sini atau klik untuk browse</p>}
              </div>
            </div>
          )}

          {currentTab === 'url' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-500">URL Produk / Landing Page</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔗</span>
                <input 
                  type="url" 
                  value={urlVal}
                  onChange={e => setUrlVal(e.target.value)}
                  className="w-full py-2 pl-9 pr-3 border border-[#E8E0D8] rounded-lg font-sans text-[13px] bg-white focus:border-[#E60023] outline-none transition-colors" 
                  placeholder="https://tokopedia.com/produk-kamu..." 
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Berikan link yang valid untuk dianalisis oleh AI.</p>
            </div>
          )}

          {currentTab === 'text' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-500">Deskripsi Produk</label>
              <textarea 
                rows={4}
                value={textVal}
                onChange={e => setTextVal(e.target.value)}
                className="w-full py-2 px-3 border border-[#E8E0D8] rounded-lg font-sans text-[13px] bg-white focus:border-[#E60023] outline-none transition-colors resize-y min-h-[70px]"
                placeholder="Contoh: Tas kulit wanita premium handmade..."
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-500">Kategori / Niche</label>
              <select value={niche} onChange={e => setNiche(e.target.value)} className="w-full py-2 px-3 border border-[#E8E0D8] rounded-lg font-sans text-[13px] bg-white focus:border-[#E60023] outline-none transition-colors">
                <option value="">Pilih niche...</option>
                <option>Home Decor</option>
                <option>Fashion & Style</option>
                <option>Food & Recipe</option>
                <option>Beauty & Skincare</option>
                <option>Travel</option>
                <option>DIY & Crafts</option>
                <option>Fitness & Health</option>
                <option>Finance & Business</option>
                <option>Parenting</option>
                <option>Technology</option>
                <option>Art & Design</option>
                <option>Lainnya</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-500">Target Audiens</label>
              <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full py-2 px-3 border border-[#E8E0D8] rounded-lg font-sans text-[13px] bg-white focus:border-[#E60023] outline-none transition-colors">
                <option value="">Pilih audiens...</option>
                <option>Wanita 18–25</option>
                <option>Wanita 25–40</option>
                <option>Pria 18–30</option>
                <option>Pria 30–45</option>
                <option>Ibu Rumah Tangga</option>
                <option>Profesional Muda</option>
                <option>Pelajar/Mahasiswa</option>
                <option>Semua Usia</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-gray-500">Bahasa Output</label>
            <select value={lang} onChange={e => setLang(e.target.value)} className="w-full py-2 px-3 border border-[#E8E0D8] rounded-lg font-sans text-[13px] bg-white focus:border-[#E60023] outline-none transition-colors">
              <option value="Indonesia">🇮🇩 Indonesia</option>
              <option value="English">🇺🇸 English</option>
              <option value="Bilingual">🌐 Bilingual (ID + EN)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-gray-500">Kata Kunci Tambahan (opsional)</label>
            <input 
              type="text" 
              value={extra}
              onChange={e => setExtra(e.target.value)}
              className="w-full py-2 px-3 border border-[#E8E0D8] rounded-lg font-sans text-[13px] bg-white focus:border-[#E60023] outline-none transition-colors"
              placeholder="Pisahkan dengan koma, mis: premium, murah, terbaik" 
            />
          </div>

          <div className="mt-auto pt-4">
            <button 
              onClick={onGenerate}
              disabled={isLoading}
              className="w-full py-4 bg-[#E60023] text-white rounded-2xl font-serif text-lg font-bold cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(230,0,35,0.2)] disabled:bg-gray-300 disabled:shadow-none disabled:transform-none"
            >
              ✦ Generate Metadata
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-3">AI akan menganalisa gambar & trend Pinterest terbaru</p>
          </div>

        </div>
      </div>
    </section>
  );
}
