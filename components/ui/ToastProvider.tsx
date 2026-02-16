"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        error: <XCircle className="w-5 h-5 text-rose-500" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
        info: <Info className="w-5 h-5 text-sky-500" />,
    };

    const backgrounds = {
        success: 'bg-emerald-50 border-emerald-100',
        error: 'bg-rose-50 border-rose-100',
        warning: 'bg-amber-50 border-amber-100',
        info: 'bg-sky-50 border-sky-100',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg w-full max-w-sm pointer-events-auto',
                            'animate-in slide-in-from-right-full duration-300',
                            backgrounds[toast.type]
                        )}
                    >
                        {icons[toast.type]}
                        <p className="text-sm font-medium text-slate-800 flex-1">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-0.5 hover:bg-white/50 rounded-md transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
