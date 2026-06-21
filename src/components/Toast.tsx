import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2.5 items-center pointer-events-none">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}

function Toast({ toast }: { toast: ToastMessage }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  return (
    <div 
      className={cn(
        "px-6 py-3 rounded-lg text-sm text-white shadow-lg transition-all duration-300 pointer-events-auto font-medium",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        toast.type === 'error' ? "bg-[#E60023]" : "bg-[#111111]"
      )}
    >
      {toast.message}
    </div>
  );
}
