import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';

// Icons
const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>
);
const DuplicateIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376H3.375A1.125 1.125 0 0 1 2.25 19.5V6.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v9.75z" /></svg>
);
const ZoomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" /></svg>
);
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
);

const Highlighter: React.FC<{ text: string; highlight: string }> = React.memo(({ text, highlight }) => {
    if (!text || !highlight.trim()) {
        return <>{text}</>;
    }
    try {
        const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedHighlight})`, 'gi');
        const parts = text.split(regex);
        return (
            <>
                {parts.filter(part => part).map((part, i) =>
                    regex.test(part) ? (
                        <mark key={i} className="bg-yellow-300/80 text-black px-0.5 rounded-sm font-bold">
                            {part}
                        </mark>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </>
        );
    } catch (error) {
        // Fallback for invalid regex, e.g. incomplete escape sequence
        return <>{text}</>;
    }
});

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

interface ContentCardProps {
    title: string;
    data: any;
    searchQuery: string;
}

const ActionButton: React.FC<{ tooltip: string, onClick: () => void, children: React.ReactNode }> = ({ tooltip, onClick, children }) => (
    <div className="relative group">
        <button onClick={onClick} className="p-2 rounded-full text-text-secondary hover:bg-slate-200 hover:text-text-primary transition-colors">
            {children}
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tooltip}
        </div>
    </div>
);

export const ContentCard: React.FC<ContentCardProps> = ({ title, data, searchQuery }) => {
    const [copiedTooltip, setCopiedTooltip] = useState('Copiar');
    const [isZoomed, setIsZoomed] = useState(false);
    const textToCopy = useMemo(() => formatDataForCopy(data), [data]);

    const handleCopy = (tooltipText: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedTooltip(tooltipText);
        setTimeout(() => setCopiedTooltip('Copiar'), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([textToCopy], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/ /g, '_').toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderContent = (isModal: boolean = false) => {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return <p className="text-text-secondary italic">Nenhum conteúdo gerado.</p>;
        }
        
        const textSize = isModal ? 'text-base' : 'text-sm';

        if (Array.isArray(data)) {
            return (
                <ul className={`space-y-4 ${textSize}`}>
                    {data.map((item, index) => (
                        <li key={index} className="text-text-primary bg-base-200 p-2 sm:p-3 rounded-md border border-base-300">
                           {typeof item === 'string' && <p><Highlighter text={item} highlight={searchQuery} /></p>}
                           {typeof item === 'object' && item !== null && (
                               <div className="space-y-1.5">
                                   {Object.entries(item).map(([key, value]) => (
                                       <div key={key}>
                                           <strong className="font-semibold text-sky-500 capitalize">{key}: </strong>
                                           <span className="text-text-secondary"><Highlighter text={String(value)} highlight={searchQuery} /></span>
                                       </div>
                                   ))}
                               </div>
                           )}
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className={textSize}><Highlighter text={String(data)} highlight={searchQuery} /></p>;
    };

    return (
        <>
            <div className="bg-slate-50/70 rounded-lg p-3 sm:p-4 flex flex-col h-full border border-base-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/50 hover:border-slate-300">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-md text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-800 pr-2">{title}</h4>
                    <div className="flex items-center space-x-0 sm:space-x-1 flex-shrink-0">
                        <ActionButton tooltip={copiedTooltip} onClick={() => handleCopy('Copiado!')}>
                             {copiedTooltip === 'Copiado!' ? <CheckIcon/> : <ClipboardIcon className="w-5 h-5"/> }
                        </ActionButton>
                        <ActionButton tooltip="Duplicar" onClick={() => handleCopy('Duplicado!')}>
                             {copiedTooltip === 'Duplicado!' ? <CheckIcon/> : <DuplicateIcon className="w-5 h-5"/> }
                        </ActionButton>
                        <ActionButton tooltip="Zoom" onClick={() => setIsZoomed(true)}>
                            <ZoomIcon className="w-5 h-5" />
                        </ActionButton>
                        <ActionButton tooltip="Download .txt" onClick={handleDownload}>
                            <DownloadIcon className="w-5 h-5" />
                        </ActionButton>
                    </div>
                </div>
                <div className="flex-grow max-h-60 sm:max-h-72 overflow-y-auto pr-2">
                    {renderContent()}
                </div>
            </div>
            <Modal isOpen={isZoomed} onClose={() => setIsZoomed(false)} title={title}>
                {renderContent(true)}
            </Modal>
        </>
    );
};