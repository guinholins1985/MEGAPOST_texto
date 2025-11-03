import React, { useEffect } from 'react';

interface CompletionToastProps {
    show: boolean;
    onClose: () => void;
}

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const CompletionToast: React.FC<CompletionToastProps> = ({ show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 6000); 
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    const handleScrollDown = () => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        onClose();
    };
    
    return (
        <div 
            aria-live="assertive" 
            className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[200]"
        >
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                <div 
                    className={`transform transition-all duration-500 ease-in-out w-full max-w-sm bg-base-200 rounded-xl shadow-2xl shadow-slate-400/30 border border-base-300 overflow-hidden pointer-events-auto ${show ? 'translate-y-0 opacity-100 sm:translate-x-0' : 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'}`}
                    role="alert"
                >
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                               <CheckCircleIcon className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-bold text-text-primary">Conteúdo gerado com sucesso!</p>
                                <p className="mt-1 text-sm text-text-secondary">Seu arsenal de marketing está pronto.</p>
                                <div className="mt-3 flex space-x-4">
                                   <button type="button" onClick={handleScrollDown} className="bg-brand-primary text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
                                        Ver resultados
                                    </button>
                                    <button type="button" onClick={onClose} className="bg-slate-100 text-sm font-medium text-text-secondary px-3 py-1.5 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors">
                                        Fechar
                                    </button>
                                </div>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button onClick={onClose} className="rounded-md inline-flex text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};