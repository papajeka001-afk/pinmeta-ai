import React, { useEffect, useState } from 'react';

export function BarTrack({ label, value }: { label: string; value: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => setWidth(value), 50);
    });
  }, [value]);

  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-gray-400 w-24">{label}</span>
      <div className="flex-1 mx-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-400 to-[#E60023] transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="font-bold w-10 text-right">{value}%</span>
    </div>
  );
}
