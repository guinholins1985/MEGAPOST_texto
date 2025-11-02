import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { generateProductContent } from './services/geminiService';
import type { GeneratedContent } from './types';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [generationId, setGenerationId] = useState<number>(0);

    const handleGenerate = useCallback(async (image: File | null, url: string) => {
        if (!image && !url) {
            setError('Por favor, forneça uma imagem ou um URL do produto.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedContent(null);

        try {
            const content = await generateProductContent(image, url);
            setGeneratedContent(content);
            setGenerationId(Date.now()); // Update key to re-trigger animation
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
            <main className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-brand-primary to-brand-secondary mb-4 animate-[fadeIn_1s_ease-out]">
                        Crie Conteúdo de Marketing em Segundos
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-[fadeIn_1.5s_ease-out]">
                        Faça upload de uma imagem ou cole um link de produto. Nossa IA analisará e gerará textos de alta conversão para todas as suas necessidades.
                    </p>
                    
                    <InputArea onGenerate={handleGenerate} isLoading={isLoading} />

                    <div className="mt-12 min-h-[200px]">
                        {isLoading && <Loader />}

                        {error && (
                            <div className="mt-8 text-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg animate-fadeIn" role="alert">
                                <strong className="font-bold">Oops! Algo deu errado: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {generatedContent && !isLoading && (
                             <div key={generationId} className="animate-fadeIn">
                               <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-violet-600">
                                   Seu Conteúdo Mágico está Pronto!
                               </h2>
                                <ResultsDisplay content={generatedContent} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;