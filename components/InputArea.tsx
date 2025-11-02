
import React, { useState, useCallback } from 'react';

interface InputAreaProps {
    onGenerate: (image: File | null, url: string) => void;
    isLoading: boolean;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);


export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [productUrl, setProductUrl] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };
    
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files);
        }
    }, []);


    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(imageFile, productUrl);
    };
    
    const resetImage = () => {
        setImageFile(null);
        setImageUrl('');
    }

    return (
        <form onSubmit={handleFormSubmit} className="bg-base-200 border border-base-300 rounded-xl p-6 md:p-8 space-y-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div 
                    onDragEnter={handleDrag} 
                    onDragLeave={handleDrag} 
                    onDragOver={handleDrag} 
                    onDrop={handleDrop} 
                    className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors duration-200 ${dragActive ? 'border-brand-secondary bg-brand-dark/20' : 'border-base-300 hover:border-brand-secondary'}`}
                >
                    <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
                    {imageUrl ? (
                        <>
                           <img src={imageUrl} alt="Preview" className="max-h-48 rounded-lg object-contain"/>
                           <button type="button" onClick={resetImage} className="mt-4 text-sm text-brand-secondary hover:underline">Remover imagem</button>
                        </>
                    ) : (
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center cursor-pointer">
                            <UploadIcon className="w-12 h-12 text-text-secondary mb-3"/>
                            <p className="font-semibold">Arraste e solte uma imagem do produto</p>
                            <p className="text-sm text-text-secondary">ou clique para selecionar</p>
                        </label>
                    )}
                </div>

                <div className="flex flex-col h-full justify-center space-y-4">
                     <p className="text-center text-text-secondary font-semibold text-lg">OU</p>
                    <div>
                        <label htmlFor="product-url" className="block text-sm font-medium mb-2">Cole o link do produto</label>
                        <div className="relative">
                            <LinkIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"/>
                            <input
                                id="product-url"
                                type="url"
                                value={productUrl}
                                onChange={(e) => setProductUrl(e.target.value)}
                                placeholder="https://exemplo.com/produto"
                                className="w-full pl-10 pr-4 py-2 bg-base-300 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || (!imageFile && !productUrl)}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-base-300 disabled:text-text-secondary disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
                {isLoading ? 'Gerando...' : 'Gerar Conteúdo Mágico'}
                {!isLoading && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="m3.1 1.2.9-1.1 12.3 10-12.3 10-.9-1.2 11-8.8-11-8.9Z"/></svg>
                )}
            </button>
        </form>
    );
};
