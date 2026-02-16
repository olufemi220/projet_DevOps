import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-slate-700 ml-0.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white transition-all',
                        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-rose-500 focus-visible:ring-rose-500',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-rose-500 ml-0.5">{error}</p>}
                {helperText && !error && <p className="text-xs text-slate-500 ml-0.5">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
