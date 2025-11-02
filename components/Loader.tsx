
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Analisando seu produto...",
    "Consultando a criatividade da IA...",
    "Gerando títulos e descrições...",
    "Criando posts para redes sociais...",
    "Polindo os detalhes finais...",
    "Quase pronto!",
];

export const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center my-12 text-center">
            <svg className="animate-spin h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-text-primary">Aguarde, a mágica está acontecendo...</h3>
            <p className="text-text-secondary transition-opacity duration-500">{loadingMessages[messageIndex]}</p>
        </div>
    );
};
