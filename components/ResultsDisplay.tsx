import React, { useState } from 'react';
import type { GeneratedContent, ContentCategory } from '../types';
import { CONTENT_CATEGORIES } from '../constants';
import { ContentCard } from './ContentCard';

interface ResultsDisplayProps {
    content: GeneratedContent;
}

// Icons
const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>
);
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
);

const ActionButton: React.FC<{ tooltip: string, onClick: (e: React.MouseEvent) => void, children: React.ReactNode }> = ({ tooltip, onClick, children }) => (
    <div className="relative group">
        <button onClick={onClick} className="p-2 rounded-full text-text-secondary hover:bg-slate-200 hover:text-text-primary transition-colors">
            {children}
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tooltip}
        </div>
    </div>
);

const formatItemForCopy = (data: any): string => {
    if (Array.isArray(data)) {
        return data.map(item => {
            if (typeof item === 'string') return `- ${item}`;
            if (typeof item === 'object' && item !== null) {
                return Object.entries(item)
                    .map(([key, value]) => `  • ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                    .join('\n');
            }
            return String(item);
        }).join('\n\n');
    }
    return String(data);
};

const formatCategoryForCopy = (category: ContentCategory, content: GeneratedContent): string => {
    const title = `Conteúdo Gerado: ${category.title}`;
    const separator = "=".repeat(title.length);

    const categoryContent = category.items
        .map(item => {
            const data = item.accessor(content);
            if (!data || (Array.isArray(data) && data.length === 0)) {
                return null;
            }
            const itemContent = formatItemForCopy(data);
            return `\n--- ${item.label} ---\n\n${itemContent}\n`;
        })
        .filter(Boolean)
        .join('');

    return `${title}\n${separator}\n${categoryContent}`;
};

const AccordionItem: React.FC<{ category: ContentCategory; content: GeneratedContent, isOpen: boolean, onToggle: () => void }> = ({ category, content, isOpen, onToggle }) => {
    const [copiedTooltip, setCopiedTooltip] = useState('Copiar categoria');
    
    const handleCategoryCopy = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent accordion from toggling
        const textToCopy = formatCategoryForCopy(category, content);
        navigator.clipboard.writeText(textToCopy);
        setCopiedTooltip('Copiado!');
        setTimeout(() => setCopiedTooltip('Copiar categoria'), 2000);
    };

    const handleCategoryDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent accordion from toggling
        const textToDownload = formatCategoryForCopy(category, content);
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${category.title.replace(/ /g, '_').toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="border border-base-300 bg-base-200 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:border-slate-300 shadow-lg shadow-slate-200/60">
            <h3>
                <button
                    onClick={onToggle}
                    className="flex justify-between items-center w-full p-4 sm:p-5 font-semibold text-left text-base sm:text-lg text-text-primary hover:bg-slate-50 transition-colors"
                    aria-expanded={isOpen}
                >
                    <span className="flex-grow pr-4">{category.title}</span>
                    <div className="flex items-center flex-shrink-0">
                        {isOpen && (
                            <div className="flex items-center space-x-1 mr-2 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                                <ActionButton tooltip={copiedTooltip} onClick={handleCategoryCopy}>
                                    {copiedTooltip === 'Copiado!' ? <CheckIcon/> : <ClipboardIcon className="w-5 h-5"/> }
                                </ActionButton>
                                <ActionButton tooltip="Baixar .txt" onClick={handleCategoryDownload}>
                                    <DownloadIcon className="w-5 h-5" />
                                </ActionButton>
                            </div>
                        )}
                        <svg className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </button>
            </h3>
            <div
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="p-4 sm:p-5 border-t border-base-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {category.items.map((item) => {
                             const data = item.accessor(content);
                             if(!data || (Array.isArray(data) && data.length === 0)) return null;

                             return <ContentCard key={item.id} title={item.label} data={data} />
                        })}
                    </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ content }) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(CONTENT_CATEGORIES[0].id);

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="space-y-3 sm:space-y-4 text-left">
            {CONTENT_CATEGORIES.map((category) => (
                <AccordionItem 
                    key={category.id} 
                    category={category} 
                    content={content} 
                    isOpen={openAccordion === category.id} 
                    onToggle={() => toggleAccordion(category.id)} 
                />
            ))}
        </div>
    );
};