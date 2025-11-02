import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-base-200/95 border border-base-300 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl shadow-slate-400/50 animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-base-300 flex-shrink-0">
                    <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-violet-600">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};