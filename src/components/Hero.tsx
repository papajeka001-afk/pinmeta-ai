import React from 'react';

export function Hero() {
  return (
    <div className="text-center pt-8 pb-4 px-6 max-w-[680px] mx-auto">
      <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-[#111111] mb-3">
        Generate <em className="text-[#E60023] not-italic font-style-italic font-serif">Pinterest Metadata</em><br/>yang Mengoptimalkan Traffic
      </h1>
      <p className="text-gray-500 text-sm md:text-base leading-relaxed">
        Upload gambar produk atau masukkan link, dan AI akan otomatis menganalisa & membuat Judul, Deskripsi, Keyword, Alt Text, dan skor SEO Pinterest-mu.
      </p>
    </div>
  );
}
