import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { CompletionToast } from './components/CompletionToast';
import { generateProductContent } from './services/geminiService';
import type { GeneratedContent } from './types';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [generationId, setGenerationId] = useState<number>(0);
    const [showCompletionToast, setShowCompletionToast] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleGenerate = useCallback(async (image: File | null, url: string) => {
        if (!image && !url) {
            setError('Por favor, forneça uma imagem ou um URL do produto.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedContent(null);
        setShowCompletionToast(false);
        setSearchQuery(''); // Reset search on new generation

        try {
            const content = await generateProductContent(image, url);
            setGeneratedContent(content);
            setGenerationId(Date.now()); // Update key to re-trigger animation
            setShowCompletionToast(true);
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro ao gerar o conteúdo. A IA pode estar sobrecarregada. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-transparent font-sans text-text-primary">
            <Header />
            <CompletionToast show={showCompletionToast} onClose={() => setShowCompletionToast(false)} />
            <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-brand-primary to-brand-secondary mb-4 animate-[fadeIn_1s_ease-out]">
                        Crie Conteúdo de Marketing em Segundos
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-10 animate-[fadeIn_1.5s_ease-out]">
                        Faça upload de uma imagem ou cole um link de produto. Nossa IA analisará e gerará textos de alta conversão para todas as suas necessidades.
                    </p>
                    
                    <InputArea onGenerate={handleGenerate} isLoading={isLoading} />

                    <div id="results-section" className="mt-12 min-h-[200px]">
                        {isLoading && <Loader />}

                        {error && (
                            <div className="mt-8 text-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg animate-fadeIn" role="alert">
                                <strong className="font-bold">Oops! Algo deu errado: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {generatedContent && !isLoading && (
                             <div key={generationId} className="animate-fadeIn">
                               <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-violet-600">
                                   Seu Conteúdo Mágico está Pronto!
                               </h2>
                                
                                <div className="my-6 max-w-xl mx-auto animate-fadeIn">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                            <SearchIcon className="w-5 h-5 text-text-secondary" />
                                        </div>
                                        <input
                                            type="search"
                                            placeholder="Buscar em todo o conteúdo gerado..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition duration-200 shadow-sm placeholder-text-secondary"
                                            aria-label="Buscar conteúdo"
                                        />
                                    </div>
                                </div>

                                <ResultsDisplay content={generatedContent} searchQuery={searchQuery} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
