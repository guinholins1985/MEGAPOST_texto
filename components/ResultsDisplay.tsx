
import React, { useState } from 'react';
import type { GeneratedContent, ContentCategory } from '../types';
import { CONTENT_CATEGORIES } from '../constants';
import { ContentCard } from './ContentCard';

interface ResultsDisplayProps {
    content: GeneratedContent;
}

const AccordionItem: React.FC<{ category: ContentCategory; content: GeneratedContent, isOpen: boolean, onToggle: () => void }> = ({ category, content, isOpen, onToggle }) => {
    return (
        <div className="border border-base-300 bg-base-200 rounded-lg overflow-hidden">
            <h3>
                <button
                    onClick={onToggle}
                    className="flex justify-between items-center w-full p-5 font-medium text-left text-text-primary hover:bg-base-300/50 transition-colors"
                    aria-expanded={isOpen}
                >
                    <span>{category.title}</span>
                    <svg className={`w-6 h-6 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </h3>
            {isOpen && (
                <div className="p-5 border-t border-base-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {category.items.map((item) => {
                             const data = item.accessor(content);
                             if(!data || (Array.isArray(data) && data.length === 0)) return null;

                             return <ContentCard key={item.id} title={item.label} data={data} />
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ content }) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(CONTENT_CATEGORIES[0].id);

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="space-y-4">
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
