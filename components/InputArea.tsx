import React, { useState, useCallback } from 'react';

interface InputAreaProps {
    onGenerate: (image: File | null, url: string) => void;
    isLoading: boolean;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [productUrl, setProductUrl] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = useCallback((files: FileList | null) => {
        if (isLoading || !files || files.length === 0) return;
        
        const file = files[0];
        if (file.size > 4 * 1024 * 1024) { // 4MB size limit
            alert("O arquivo de imagem é muito grande. Por favor, use um arquivo com menos de 4MB.");
            return;
        }
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        onGenerate(file, productUrl);
    }, [isLoading, onGenerate, productUrl]);
    
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
    }, [handleFileChange]);

    const handleUrlBlur = () => {
        if (isLoading) return;
        
        const isValidUrl = productUrl.startsWith('http://') || productUrl.startsWith('https://');

        // Trigger only if there's a valid URL, or if an image exists.
        // This prevents triggering on blur with an empty/invalid URL when no image is present.
        if (isValidUrl || imageFile) {
             onGenerate(imageFile, productUrl);
        }
    };
    
    const resetImage = () => {
        setImageFile(null);
        setImageUrl('');
        const isValidUrl = productUrl.startsWith('http://') || productUrl.startsWith('https://');
        if (isValidUrl) {
            onGenerate(null, productUrl);
        }
    }

    return (
        <div className={`bg-base-200 border border-base-300 rounded-xl p-4 sm:p-6 md:p-8 space-y-6 shadow-xl shadow-slate-200/70 animate-[slideUp_1s_ease-out] transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <div className="flex-1">
                    <label 
                        htmlFor="file-upload" 
                        onDragEnter={handleDrag} 
                        onDragLeave={handleDrag} 
                        onDragOver={handleDrag} 
                        onDrop={handleDrop}
                        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg h-full transition-all duration-300 group cursor-pointer ${dragActive ? 'border-brand-primary bg-brand-primary/10' : 'border-base-300 hover:border-brand-primary'}`}
                    >
                         <div className={`absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg opacity-0 transition-opacity duration-300 ${dragActive ? 'opacity-20' : 'group-hover:opacity-10'}`}></div>
                        <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} disabled={isLoading} />
                        {imageUrl ? (
                            <div className="text-center relative z-10">
                               <img src={imageUrl} alt="Preview" className="max-h-32 sm:max-h-40 rounded-lg object-contain shadow-md"/>
                               <button type="button" onClick={resetImage} className="mt-4 text-sm text-brand-primary hover:underline" disabled={isLoading}>Trocar imagem</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center relative z-10">
                                <UploadIcon className="w-10 h-10 sm:w-12 sm:h-12 text-text-secondary mb-3 group-hover:text-brand-primary transition-colors"/>
                                <p className="text-sm sm:text-base font-semibold text-text-primary">Arraste a imagem do produto aqui</p>
                                <p className="text-xs sm:text-sm text-text-secondary">ou clique para selecionar (Max 4MB)</p>
                            </div>
                        )}
                    </label>
                </div>
                
                <div className="flex items-center justify-center md:flex-col">
                  <div className="h-full md:h-auto w-px md:w-full bg-base-300"></div>
                  <span className="mx-4 md:my-2 text-sm font-bold text-text-secondary">OU</span>
                  <div className="h-full md:h-auto w-px md:w-full bg-base-300"></div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <label htmlFor="product-url" className="block text-sm font-medium mb-2 text-left">Cole o link do produto</label>
                    <div className="relative">
                        <LinkIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"/>
                        <input
                            id="product-url"
                            type="url"
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            onBlur={handleUrlBlur}
                            placeholder="https://sua-loja.com/produto"
                            className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-transparent rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:shadow-inner focus:bg-base-200 outline-none transition duration-200"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
            <div className="text-center text-sm text-text-secondary pt-4 border-t border-base-300/60">
                <p>A geração de conteúdo começará automaticamente ao adicionar uma imagem ou um link válido.</p>
            </div>
        </div>
    );
};