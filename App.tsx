
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
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro ao gerar o conteúdo. Verifique o console para mais detalhes.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-base-100 font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <p className="text-center text-text-secondary mb-8">
                        Faça upload de uma imagem de produto ou cole um link para gerar instantaneamente todo o conteúdo de marketing que você precisa, com a tecnologia da IA.
                    </p>
                    <InputArea onGenerate={handleGenerate} isLoading={isLoading} />

                    {isLoading && <Loader />}

                    {error && (
                        <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Erro: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {generatedContent && !isLoading && (
                         <div className="mt-12">
                           <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Seu Conteúdo Gerado por IA</h2>
                            <ResultsDisplay content={generatedContent} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
