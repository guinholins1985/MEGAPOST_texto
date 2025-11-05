import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import type { PerformanceReport } from '../types';

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
const ThumbsUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.59-11.25h.008v.008h-.008V8.25Z" /></svg>
);
const WrenchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.878-5.878m0 0L21 5.64l-2.121-2.121L5.638 21l-2.122-2.121L11.42 11.42Zm0 0L5.638 5.636l2.122-2.121L17.25 11.42l-2.121 2.121Z" /></svg>
);
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
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

const SentimentBadge: React.FC<{ sentiment: string }> = ({ sentiment }) => {
    const sentimentClasses: { [key: string]: string } = {
        'Positivo': 'bg-emerald-100 text-emerald-800',
        'Negativo': 'bg-red-100 text-red-800',
        'Neutro': 'bg-slate-200 text-slate-800',
    };
    const sentimentClass = sentimentClasses[sentiment] || sentimentClasses['Neutro'];
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${sentimentClass}`}>{sentiment}</span>;
};

const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = (s: number) => {
        if (s >= 80) return 'bg-emerald-500';
        if (s >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div className="flex items-center gap-2">
            <div className="w-24 bg-slate-200 rounded-full h-2.5">
                <div className={`${getScoreColor(score)} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="font-bold text-sm text-slate-700">{score}/100</span>
        </div>
    );
};


const formatDataForCopy = (data: any): string => {
    if (Array.isArray(data)) {
        return data.map(item => {
            if (typeof item === 'string') return `- ${item}`;
            if (typeof item === 'object' && item !== null) {
                return Object.entries(item)
                    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('\n');
            }
            return '';
        }).join('\n\n');
    }
     if (typeof data === 'object' && data !== null) {
        return Object.entries(data).map(([key, value]) => {
            if (Array.isArray(value)) {
                 const subItems = value.map(subItem => 
                     '  - ' + Object.entries(subItem).map(([subKey, subValue]) => `${subKey}: ${subValue}`).join(', ')
                 ).join('\n');
                 return `${key.charAt(0).toUpperCase() + key.slice(1)}:\n${subItems}`;
            }
            return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
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

const PerformanceReportDisplay: React.FC<{ report: PerformanceReport; searchQuery: string, isModal?: boolean }> = ({ report, searchQuery, isModal = false }) => {
    const score = report.overallScore || 0;
    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-emerald-500';
        if (s >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };
    
    const textSize = isModal ? 'text-base' : 'text-sm';

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-slate-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={`${getScoreColor(score)} transition-all duration-500`} strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className={`absolute inset-0 flex items-center justify-center font-extrabold text-3xl sm:text-4xl ${getScoreColor(score)}`}>
                        {score}
                    </div>
                </div>
                <div>
                    <h5 className="font-bold text-lg text-text-primary">Pontuação Geral</h5>
                    <p className={`text-text-secondary ${textSize}`}>Uma estimativa do potencial de sucesso do seu conteúdo de marketing.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h6 className="font-semibold text-emerald-600 flex items-center gap-2 mb-2">
                        <ThumbsUpIcon className="w-5 h-5" /> Pontos Fortes
                    </h6>
                    <ul className={`list-disc list-inside space-y-1 ${textSize} text-text-secondary`}>
                        {report.strengths.map((item, index) => <li key={index}><Highlighter text={item} highlight={searchQuery} /></li>)}
                    </ul>
                </div>
                <div>
                    <h6 className="font-semibold text-amber-600 flex items-center gap-2 mb-2">
                        <WrenchIcon className="w-5 h-5" /> Áreas de Melhoria
                    </h6>
                    <ul className={`list-disc list-inside space-y-1 ${textSize} text-text-secondary`}>
                        {report.areasForImprovement.map((item, index) => <li key={index}><Highlighter text={item} highlight={searchQuery} /></li>)}
                    </ul>
                </div>
                <div>
                     <h6 className="font-semibold text-sky-600 flex items-center gap-2 mb-2">
                        <StarIcon className="w-5 h-5" /> Anúncio Destaque
                    </h6>
                    <blockquote className={`border-l-4 border-sky-300 pl-4 italic ${textSize} text-text-secondary bg-sky-50 py-2`}>
                       <Highlighter text={report.bestPerformingAd} highlight={searchQuery} />
                    </blockquote>
                </div>
            </div>
        </div>
    );
};

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
        
        // Custom renderer for Performance Report
        if (title === 'Resumo da Performance' && typeof data === 'object' && data !== null) {
            return <PerformanceReportDisplay report={data as PerformanceReport} searchQuery={searchQuery} isModal={isModal} />;
        }

        if (Array.isArray(data)) {
            return (
                <ul className={`space-y-4 ${textSize}`}>
                    {data.map((item, index) => (
                        <li key={index} className="text-text-primary bg-base-200 p-2 sm:p-3 rounded-md border border-base-300">
                           {typeof item === 'string' && <p><Highlighter text={item} highlight={searchQuery} /></p>}
                           {typeof item === 'object' && item !== null && (
                               <div className="space-y-1.5">
                                   {Object.entries(item).map(([key, value]) => {
                                        if ((key === 'score' || key === 'overallScore') && typeof value === 'number') {
                                            return <div key={key} className="flex items-start"><strong className="w-24 flex-shrink-0 font-semibold text-sky-500 capitalize">{key}: </strong><ScoreDisplay score={value} /></div>
                                        }
                                        if (key === 'sentiment' && typeof value === 'string') {
                                            return <div key={key} className="flex items-start"><strong className="w-24 flex-shrink-0 font-semibold text-sky-500 capitalize">{key}: </strong><SentimentBadge sentiment={value} /></div>
                                        }
                                        return (
                                            <div key={key} className="flex items-start">
                                                <strong className="w-24 flex-shrink-0 font-semibold text-sky-500 capitalize">{key}: </strong>
                                                <span className="text-text-secondary"><Highlighter text={Array.isArray(value) ? value.join(', ') : String(value)} highlight={searchQuery} /></span>
                                            </div>
                                        )
                                   })}
                               </div>
                           )}
                        </li>
                    ))}
                </ul>
            );
        }

        if (typeof data === 'object' && data !== null) {
            return (
                 <div className={`space-y-4 ${textSize}`}>
                    {Object.entries(data).map(([key, value]) => {
                        if ((key === 'overallScore' || key === 'score') && typeof value === 'number') {
                            return (
                                <div key={key}>
                                    <strong className="font-semibold text-sky-500 capitalize">{key}: </strong>
                                    <div className="mt-1"><ScoreDisplay score={value} /></div>
                                </div>
                            );
                        }
                        return (
                            <div key={key}>
                                <strong className="font-semibold text-sky-500 capitalize">{key}: </strong>
                                {Array.isArray(value) 
                                    ? (
                                        <ul className="pl-0 mt-2 space-y-3">
                                            {value.map((subItem, index) => (
                                                <li key={index} className="text-text-primary bg-base-200 p-2 sm:p-3 rounded-md border border-base-300">
                                                    <div className="space-y-1.5">
                                                        {Object.entries(subItem).map(([subKey, subValue]) => (
                                                            <div key={subKey} className="flex items-start">
                                                                <strong className="w-24 flex-shrink-0 font-semibold text-sky-500 capitalize">{subKey}: </strong>
                                                                <span className="text-text-secondary"><Highlighter text={String(subValue)} highlight={searchQuery} /></span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                    : (
                                        <span className="text-text-secondary"><Highlighter text={String(value)} highlight={searchQuery} /></span>
                                    )
                                }
                            </div>
                        )
                    })}
                </div>
            )
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