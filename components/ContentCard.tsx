
import React, { useState } from 'react';

interface ContentCardProps {
    title: string;
    data: any;
}

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.042m-7.416 0v3.042c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


const formatDataForCopy = (data: any): string => {
    if (Array.isArray(data)) {
        return data.map(item => {
            if (typeof item === 'string') return `- ${item}`;
            if (typeof item === 'object' && item !== null) {
                return Object.entries(item)
                    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                    .join('\n');
            }
            return '';
        }).join('\n\n');
    }
    return String(data);
};


export const ContentCard: React.FC<ContentCardProps> = ({ title, data }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = formatDataForCopy(data);
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const renderContent = () => {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return <p className="text-text-secondary italic">Nenhum conteúdo gerado.</p>;
        }

        if (Array.isArray(data)) {
            return (
                <ul className="space-y-3 text-sm">
                    {data.map((item, index) => (
                        <li key={index} className="text-text-primary bg-base-200/50 p-3 rounded-md border border-white/10">
                           {typeof item === 'string' && <p>{item}</p>}
                           {typeof item === 'object' && item !== null && (
                               <div className="space-y-1">
                                   {Object.entries(item).map(([key, value]) => (
                                       <div key={key}>
                                           <strong className="font-semibold text-sky-400 capitalize">{key}: </strong>
                                           <span className="text-text-secondary">{String(value)}</span>
                                       </div>
                                   ))}
                               </div>
                           )}
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="text-sm">{String(data)}</p>;
    };

    return (
        <div className="bg-base-300/40 rounded-lg p-4 flex flex-col h-full border border-white/10">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-md text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">{title}</h4>
                <button
                    onClick={handleCopy}
                    className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 transition-all duration-200 ${copied ? 'bg-green-500/80 text-white' : 'bg-base-300 hover:bg-brand-primary text-text-primary'}`}
                >
                    {copied ? <CheckIcon/> : <ClipboardIcon />}
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
            <div className="flex-grow max-h-80 overflow-y-auto pr-2">
                {renderContent()}
            </div>
        </div>
    );
};
