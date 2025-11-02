
import type { ContentCategory, GeneratedContent } from './types';

export const CONTENT_CATEGORIES: ContentCategory[] = [
    {
        id: 'seoAndBlog',
        title: 'SEO e Conteúdo para Blogs',
        items: [
            { id: 'seoTitles', label: 'Títulos SEO (10-15)', accessor: (c: GeneratedContent) => c.seoAndBlog.seoTitles },
            { id: 'persuasiveDescriptions', label: 'Descrições Persuasivas (2-5)', accessor: (c: GeneratedContent) => c.seoAndBlog.persuasiveDescriptions },
            { id: 'seoTags', label: 'Tags SEO Relevantes (20-30)', accessor: (c: GeneratedContent) => c.seoAndBlog.seoTags },
            { id: 'metaTagsAndAltText', label: 'Meta Tags e Alt Text (5-10)', accessor: (c: GeneratedContent) => c.seoAndBlog.metaTagsAndAltText },
            { id: 'longTailKeywords', label: 'Keywords Long-Tail (10-15)', accessor: (c: GeneratedContent) => c.seoAndBlog.longTailKeywords },
            { id: 'metaDescriptions', label: 'Meta Descriptions Otimizadas (3-5)', accessor: (c: GeneratedContent) => c.seoAndBlog.metaDescriptions },
            { id: 'faq', label: 'Perguntas Frequentes (FAQ) (5-10)', accessor: (c: GeneratedContent) => c.seoAndBlog.faq },
            { id: 'seoBlogPosts', label: 'Artigos para Blog Otimizados (1-2)', accessor: (c: GeneratedContent) => c.seoAndBlog.seoBlogPosts },
        ],
    },
    {
        id: 'socialMediaAndEngagement',
        title: 'Redes Sociais e Engajamento',
        items: [
            { id: 'popularHashtags', label: 'Hashtags Populares (20-30)', accessor: (c: GeneratedContent) => c.socialMediaAndEngagement.popularHashtags },
            { id: 'socialMediaPosts', label: 'Frases para Posts (10-15)', accessor: (c: GeneratedContent) => c.socialMediaAndEngagement.socialMediaPosts },
            { id: 'instagramCaptions', label: 'Legendas para Instagram (3-5)', accessor: (c: GeneratedContent) => c.socialMediaAndEngagement.instagramCaptions },
            { id: 'tweets', label: 'Tweets Prontos (3-5)', accessor: (c: GeneratedContent) => c.socialMediaAndEngagement.tweets },
            { id: 'facebookGroupPosts', label: 'Posts para Grupos no Facebook (2-3)', accessor: (c: GeneratedContent) => c.socialMediaAndEngagement.facebookGroupPosts },
            { id: 'shortVideoScripts', label: 'Scripts para Vídeos Curtos (2-3)', accessor: (c: GeneratedContent) => c.socialMediaAndEngagement.shortVideoScripts },
            { id: 'instagramBio', label: 'Bio para Instagram/TikTok (1-3)', accessor: (c: GeneratedContent) => c.socialMediaAndEngagement.instagramBio },
            { id: 'viralPhrases', label: 'Frases Virais (5-10)', accessor: (c: GeneratedContent) => c.socialMediaAndEngagement.viralPhrases },
        ],
    },
    {
        id: 'copywritingAndAdvertising',
        title: 'Copywriting e Publicidade',
        items: [
            { id: 'catchyHeadlines', label: 'Títulos Chamativos (10-15)', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.catchyHeadlines },
            { id: 'promotionalSalePhrases', label: 'Frases Promocionais de Venda (10-15)', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.promotionalSalePhrases },
            { id: 'paidAdCopy', label: 'Copy para Anúncios Pagos (5-10)', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.paidAdCopy },
            { id: 'slogans', label: 'Slogans Publicitários (5-10)', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.slogans },
            { id: 'ctas', label: 'Call-to-Actions (CTAs) (5-10)', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.ctas },
            { id: 'alternativeAdTitles', label: 'Títulos Alternativos para Anúncios', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.alternativeAdTitles },
            { id: 'technicalDescriptions', label: 'Descrições Técnicas Detalhadas (1-2)', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.technicalDescriptions },
            { id: 'benefitsVsFeatures', label: 'Benefícios vs. Recursos', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.benefitsVsFeatures },
            { id: 'remarketingPhrases', label: 'Frases para Remarketing (3-5)', accessor: (c: GeneratedContent) => c.copywritingAndAdvertising.remarketingPhrases },
        ],
    },
    {
        id: 'emailMarketingAndAutomation',
        title: 'E-mail Marketing e Automação',
        items: [
            { id: 'personalizedMarketingEmails', label: 'E-mails Marketing Personalizados (2-3)', accessor: (c: GeneratedContent) => c.emailMarketingAndAutomation.personalizedMarketingEmails },
            { id: 'welcomeEmails', label: 'E-mail de Boas-Vindas (1-2)', accessor: (c: GeneratedContent) => c.emailMarketingAndAutomation.welcomeEmails },
            { id: 'abandonedCartEmails', label: 'E-mails de Recuperação de Carrinho (2-3)', accessor: (c: GeneratedContent) => c.emailMarketingAndAutomation.abandonedCartEmails },
            { id: 'newsletters', label: 'Newsletters Semanais (1-2)', accessor: (c: GeneratedContent) => c.emailMarketingAndAutomation.newsletters },
        ],
    },
    {
        id: 'other',
        title: 'Outros Conteúdos',
        items: [
            { id: 'fakeTestimonials', label: 'Depoimentos Fictícios (2-3)', accessor: (c: GeneratedContent) => c.other.fakeTestimonials },
            { id: 'purchaseGuides', label: 'Guias de Compra Comparativos (1-2)', accessor: (c: GeneratedContent) => c.other.purchaseGuides },
        ],
    },
];
