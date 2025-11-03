
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Analisando seu produto...",
    "Consultando a criatividade da IA...",
    "Gerando títulos e descrições...",
    "Criando posts para redes sociais...",
    "Polindo os detalhes finais...",
    "Quase pronto!",
];

const SIMULATED_DURATION_MS = 15000;
const UPDATE_INTERVAL_MS = 100;

export const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const currentProgress = Math.min(Math.floor((elapsedTime / SIMULATED_DURATION_MS) * 100), 99);
            setProgress(currentProgress);
            
            if (currentProgress >= 99) {
                clearInterval(progressInterval);
            }
        }, UPDATE_INTERVAL_MS);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center my-12 text-center w-full max-w-lg mx-auto animate-fadeIn">
            <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-base font-semibold text-text-primary">A mágica está acontecendo...</span>
                    <span className="text-sm font-semibold text-brand-primary">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-brand-secondary to-brand-primary h-2.5 rounded-full transition-all duration-300 ease-linear" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            <p className="mt-4 text-text-secondary transition-opacity duration-500 h-6">{loadingMessages[messageIndex]}</p>
        </div>
    );
};