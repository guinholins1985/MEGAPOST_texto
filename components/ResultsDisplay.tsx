
import React, { useState } from 'react';
import type { GeneratedContent, ContentCategory } from '../types';
import { CONTENT_CATEGORIES } from '../constants';
import { ContentCard } from './ContentCard';

interface ResultsDisplayProps {
    content: GeneratedContent;
}

const AccordionItem: React.FC<{ category: ContentCategory; content: GeneratedContent, isOpen: boolean, onToggle: () => void }> = ({ category, content, isOpen, onToggle }) => {
    return (
        <div className="border border-white/10 bg-base-200/50 rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300">
            <h3>
                <button
                    onClick={onToggle}
                    className="flex justify-between items-center w-full p-5 font-semibold text-left text-lg text-text-primary hover:bg-white/5 transition-colors"
                    aria-expanded={isOpen}
                >
                    <span>{category.title}</span>
                    <svg className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </h3>
            <div
              className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="p-5 border-t border-white/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <div className="space-y-4 text-left">
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
