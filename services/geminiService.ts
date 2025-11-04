
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedContent } from '../types';

// Gemini has a 4MB limit for image uploads.
const MAX_FILE_SIZE = 4 * 1024 * 1024; 

const fileToGenerativePart = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error("O arquivo de imagem excede o limite de 4MB.");
    }

    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                resolve((reader.result as string).split(',')[1]);
            } else {
                reject(new Error("Falha ao ler o arquivo."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const buildPrompt = async (image: File | null, url: string) => {
    const promptParts: any[] = [
        { text: "Você é um especialista em marketing digital e copywriting. Analise o produto fornecido e gere um conjunto completo de conteúdo de marketing em português do Brasil. O conteúdo deve ser criativo, profissional e altamente otimizado para vendas e engajamento. Se for um produto conhecido, use seu conhecimento da web para extrair informações relevantes. Gere também respostas para comentários negativos, textos para stories, descrições para vídeos no YouTube, sequências de e-mail para nutrição de leads e textos para embalagens. Calcule também o preço de venda para marketplaces como Shopee, Mercado Livre, Amazon e OLX, considerando taxas comuns, e faça uma análise de preço em relação a possíveis concorrentes. Adicionalmente, gere uma análise de sentimento para possíveis comentários de clientes, classifique os anúncios criados com um score de potencial de venda, sugira categorias de e-commerce com tags, e crie uma análise de posicionamento de preço. Siga estritamente o schema JSON fornecido para a sua resposta." }
    ];

    if (image) {
        const imagePart = await fileToGenerativePart(image);
        promptParts.push(imagePart);
        promptParts.push({ text: "\nEste é a imagem do produto." });
    }
    
    if (url) {
        promptParts.push({ text: `\nAnalise também a URL do produto: ${url}` });
    }

    return promptParts;
};

const getResponseSchema = () => ({
    type: Type.OBJECT,
    properties: {
        seoAndBlog: {
            type: Type.OBJECT,
            properties: {
                seoTitles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Títulos chamativos otimizados para SEO (10–15)" },
                seoTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tags SEO relevantes (20–30)" },
                metaTagsAndAltText: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Meta tags e alt text para imagens (5–10)" },
                faq: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } } }, description: "Perguntas frequentes (FAQ) automáticas (5–10)" },
                longTailKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords long-tail sugeridas (10–15)" },
                seoBlogPosts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING } } }, description: "Artigos para blog otimizados para SEO (1–2)" },
                metaDescriptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Meta descriptions otimizadas (3-5)" },
                blogPostIntroductions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Introduções que prendem a atenção para artigos de blog (2-4)" },
                blogPostConclusions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Conclusões para artigos com chamadas para ação (CTAs) (2-4)" },
            },
        },
        socialMediaAndEngagement: {
            type: Type.OBJECT,
            properties: {
                popularHashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hashtags populares (20–30)" },
                socialMediaPosts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Frases para postagens em redes sociais (10–15)" },
                shortVideoScripts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, script: { type: Type.STRING } } }, description: "Scripts para vídeos curtos (Reels/TikTok) (2–3)" },
                instagramBio: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bio para Instagram/TikTok (1–3)" },
                viralPhrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Frases virais (5–10)" },
                instagramCaptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Legendas para posts no Instagram (3–5)" },
                tweets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tweets prontos (3-5)" },
                facebookGroupPosts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Postagens para grupos no Facebook (2–3)" },
                storyTexts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Textos para Stories (perguntas interativas, enquetes) (3-5)" },
                youtubeVideoDescriptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Descrições otimizadas para vídeos no YouTube (2-3)" },
            },
        },
        copywritingAndAdvertising: {
            type: Type.OBJECT,
            properties: {
                persuasiveDescriptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Descrições persuasivas com benefícios (2–5)" },
                promotionalSalePhrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Frases promocionais de venda (10–15)" },
                paidAdCopy: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { ad: { type: Type.STRING }, score: { type: Type.NUMBER }, justification: { type: Type.STRING } } }, description: "Copy para anúncios pagos com score de potencial de venda (0-100) e justificativa (5–10)" },
                slogans: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Slogans publicitários (5–10)" },
                catchyHeadlines: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Títulos chamativos (10–15)" },
                ctas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "CTA automático (5–10)" },
                alternativeAdTitles: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { tone: { type: Type.STRING, description: "Tom do anúncio (ex: urgente, emocional, racional)" }, title: { type: Type.STRING } } }, description: "Títulos alternativos para anúncios (3-5)" },
                technicalDescriptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Descrições técnicas detalhadas (1-2)" },
                benefitsVsFeatures: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { feature: { type: Type.STRING }, benefit: { type: Type.STRING } } }, description: "Benefícios vs. recursos" },
                remarketingPhrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Frases para campanhas de remarketing (3–5)" },
                negativeCommentResponses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Respostas automáticas para comentários negativos com tom empático e solucionador (2-4)" },
                thankYouCardMessages: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Mensagens para cartões de agradecimento pós-compra (2-4)" },
                productPackagingTexts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Textos curtos e chamativos para embalagens de produtos (2-4)" },
            },
        },
        emailMarketingAndAutomation: {
            type: Type.OBJECT,
            properties: {
                personalizedMarketingEmails: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } }, description: "E-mails marketing personalizados (2–3)" },
                welcomeEmails: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } }, description: "E-mail de boas-vindas automatizado (1–2)" },
                abandonedCartEmails: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } }, description: "E-mails de recuperação de carrinho abandonado (2-3)" },
                newsletters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } }, description: "Newsletters semanais (1-2)" },
                leadNurturingSequence: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } }, description: "Sequência de e-mails para nutrição de leads (1-2 sequências com 2-3 e-mails cada)" },
                reactivationEmails: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } } }, description: "E-mails para reativar clientes inativos (1-2)" },
            },
        },
        salesAndConversion: {
            type: Type.OBJECT,
            properties: {
                priceVariations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { strategy: { type: Type.STRING }, description: { type: Type.STRING } } }, description: "Variações de preço e descontos progressivos (3–5)" },
                marketplacePricing: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            platform: { type: Type.STRING, description: "Nome do marketplace (ex: Shopee, Mercado Livre)" },
                            price: { type: Type.STRING, description: "Preço base do produto" },
                            fee: { type: Type.STRING, description: "Taxa estimada do marketplace" },
                            finalPrice: { type: Type.STRING, description: "Preço final sugerido para venda no marketplace" },
                        }
                    },
                    description: "Cálculo de preço para diferentes marketplaces (Shopee, Mercado Livre, Amazon, OLX)"
                },
                competitorPriceAnalysis: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            competitor: { type: Type.STRING, description: "Nome do concorrente" },
                            price: { type: Type.STRING, description: "Preço praticado pelo concorrente" },
                            justification: { type: Type.STRING, description: "Análise e justificativa para o preço do nosso produto em comparação" },
                        }
                    },
                    description: "Análise de preços de concorrentes (1–3)"
                },
                competitorComparisons: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { feature: { type: Type.STRING }, thisProduct: { type: Type.STRING }, competitor: { type: Type.STRING } } }, description: "Comparativos com concorrentes (1–3)" },
                promotionCountdowns: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { event: { type: Type.STRING }, text: { type: Type.STRING } } }, description: "Textos para contagens regressivas para promoções (1–3)" },
                discountCoupons: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { code: { type: Type.STRING }, discount: { type: Type.STRING }, description: { type: Type.STRING } } }, description: "Cupons de desconto personalizados (5–10)" },
                campaignLandingPages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, headline: { type: Type.STRING }, body: { type: Type.STRING }, cta: { type: Type.STRING } } }, description: "Conteúdo para landpages simples para campanhas (1–2)" },
                promotionalPopups: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, body: { type: Type.STRING }, cta: { type: Type.STRING } } }, description: "Textos para pop-ups promocionais (3–5)" },
                interactiveQuizzes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, questions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, answer: { type: Type.STRING } } } } } }, description: "Quizzes interativos para engajamento (2–3)" },
                serviceChatbots: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { initialMessage: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { option: { type: Type.STRING }, response: { type: Type.STRING } } } } } }, description: "Scripts para chatbots de atendimento (1–2)" },
                suggestedCategoriesAndTags: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, tags: { type: Type.ARRAY, items: { type: Type.STRING } } } }, description: "Sugestões de categorias e tags para e-commerce (2-4)" },
                pricePositioning: { type: Type.OBJECT, properties: { summary: { type: Type.STRING, description: "Resumo do posicionamento de preço" }, comparison: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { competitor: { type: Type.STRING }, price: { type: Type.STRING }, positioning: { type: Type.STRING } } } } }, description: "Análise de posicionamento de preço contra concorrentes" },
            },
        },
        other: {
            type: Type.OBJECT,
            properties: {
                fakeTestimonials: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { author: { type: Type.STRING }, text: { type: Type.STRING } } }, description: "Depoimentos fictícios gerados por IA (2–3)" },
                purchaseGuides: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING } } }, description: "Guias de compra comparativos (1–2)" },
            },
        },
        customerFeedback: {
            type: Type.OBJECT,
            properties: {
                sentimentAnalysis: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { comment: { type: Type.STRING }, sentiment: { type: Type.STRING, enum: ['Positivo', 'Negativo', 'Neutro'] }, analysis: { type: Type.STRING } } }, description: "Análise de sentimento de possíveis comentários e avaliações de clientes (3-5)" },
            },
        },
    },
});

export const generateProductContent = async (image: File | null, url: string): Promise<GeneratedContent> => {
    if (!process.env.API_KEY) {
        throw new Error("API key não está configurada.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const promptParts = await buildPrompt(image, url);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
        // Sanitize the response to remove potential markdown code block fences
        const sanitizedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        return JSON.parse(sanitizedJsonText) as GeneratedContent;
    } catch (e) {
        console.error("Falha ao analisar a resposta JSON:", response.text);
        if (e instanceof SyntaxError) {
             throw new Error("A resposta da IA não estava em um formato JSON válido. Isso pode ser um problema temporário. Tente novamente.");
        }
        throw new Error("Ocorreu um erro inesperado ao processar a resposta da IA.");
    }
};
