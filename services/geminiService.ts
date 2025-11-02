
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedContent } from '../types';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const buildPrompt = async (image: File | null, url: string) => {
    const promptParts: any[] = [
        { text: "Analise o produto fornecido e gere um conjunto completo de conteúdo de marketing em português do Brasil. O conteúdo deve ser profissional, criativo e otimizado para vendas. Se for um produto conhecido, use seu conhecimento da web para extrair informações relevantes. Siga estritamente o schema JSON fornecido." }
    ];

    if (image) {
        const imagePart = await fileToGenerativePart(image);
        promptParts.push(imagePart);
    }
    
    if (url) {
        promptParts.push({ text: `\nURL do Produto para referência (use seu conhecimento para analisá-lo): ${url}` });
    }

    return promptParts;
};

const getResponseSchema = () => ({
    type: Type.OBJECT,
    properties: {
        seoAndBlog: {
            type: Type.OBJECT,
            properties: {
                seoTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
                persuasiveDescriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                seoTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                metaTagsAndAltText: { type: Type.ARRAY, items: { type: Type.STRING } },
                faq: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } } } },
                longTailKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                seoBlogPosts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING } } } },
                metaDescriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        },
        socialMediaAndEngagement: {
            type: Type.OBJECT,
            properties: {
                popularHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                socialMediaPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
                shortVideoScripts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, script: { type: Type.STRING } } } },
                instagramBio: { type: Type.ARRAY, items: { type: Type.STRING } },
                viralPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
                instagramCaptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                tweets: { type: Type.ARRAY, items: { type: Type.STRING } },
                facebookGroupPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        },
        copywritingAndAdvertising: {
            type: Type.OBJECT,
            properties: {
                promotionalSalePhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
                paidAdCopy: { type: Type.ARRAY, items: { type: Type.STRING } },
                slogans: { type: Type.ARRAY, items: { type: Type.STRING } },
                catchyHeadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                ctas: { type: Type.ARRAY, items: { type: Type.STRING } },
                alternativeAdTitles: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { tone: { type: Type.STRING }, title: { type: Type.STRING } } } },
                technicalDescriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                benefitsVsFeatures: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { feature: { type: Type.STRING }, benefit: { type: Type.STRING } } } },
                remarketingPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        },
        emailMarketingAndAutomation: {
            type: Type.OBJECT,
            properties: {
                personalizedMarketingEmails: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } } },
                welcomeEmails: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } } },
                abandonedCartEmails: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } } },
                newsletters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } } },
            },
        },
        other: {
            type: Type.OBJECT,
            properties: {
                fakeTestimonials: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { author: { type: Type.STRING }, text: { type: Type.STRING } } } },
                purchaseGuides: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING } } } },
            },
        },
    },
});

export const generateProductContent = async (image: File | null, url: string): Promise<GeneratedContent> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const promptParts = await buildPrompt(image, url);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: promptParts },
        config: {
            responseMimeType: "application/json",
            responseSchema: getResponseSchema(),
            temperature: 0.7,
            topP: 0.95,
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeneratedContent;
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("A resposta da IA não estava no formato JSON esperado.");
    }
};
