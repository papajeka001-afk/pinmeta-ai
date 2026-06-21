import React from 'react';
import { Pin } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-[#E8E0D8] flex items-center justify-between px-8 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#E60023] rounded-full flex items-center justify-center text-white font-bold text-xl font-serif">P</div>
        <span className="text-xl font-bold tracking-tight text-[#111111]">Pin<span className="text-[#E60023]">Meta</span> AI</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-[#FFE8EC] text-[#E60023] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">✦ AI Powered</div>
      </div>
    </header>
  );
}
