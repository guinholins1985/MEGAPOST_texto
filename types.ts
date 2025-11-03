
export interface GeneratedContent {
  seoAndBlog: {
    seoTitles: string[];
    persuasiveDescriptions: string[];
    seoTags: string[];
    metaTagsAndAltText: string[];
    faq: { question: string; answer: string }[];
    longTailKeywords: string[];
    seoBlogPosts: { title: string; content: string }[];
    metaDescriptions: string[];
  };
  socialMediaAndEngagement: {
    popularHashtags: string[];
    socialMediaPosts: string[];
    shortVideoScripts: { title: string; script: string }[];
    instagramBio: string[];
    viralPhrases: string[];
    instagramCaptions: string[];
    tweets: string[];
    facebookGroupPosts: string[];
  };
  copywritingAndAdvertising: {
    promotionalSalePhrases: string[];
    paidAdCopy: string[];
    slogans: string[];
    catchyHeadlines: string[];
    ctas: string[];
    alternativeAdTitles: { tone: string; title: string }[];
    technicalDescriptions: string[];
    benefitsVsFeatures: { feature: string; benefit: string }[];
    remarketingPhrases: string[];
  };
  emailMarketingAndAutomation: {
    personalizedMarketingEmails: { subject: string; body: string }[];
    welcomeEmails: { subject: string; body: string }[];
    abandonedCartEmails: { subject: string; body: string }[];
    newsletters: { subject: string; body: string }[];
  };
  salesAndConversion: {
    priceVariations: { strategy: string; description: string }[];
    marketplacePricing: { platform: string; price: string; fee: string; finalPrice: string }[];
    competitorPriceAnalysis: { competitor: string; price: string; justification: string }[];
    competitorComparisons: { feature: string; thisProduct: string; competitor: string }[];
    promotionCountdowns: { event: string; text: string }[];
    discountCoupons: { code: string; discount: string; description: string }[];
    campaignLandingPages: { title: string; headline: string; body: string; cta: string }[];
    promotionalPopups: { headline: string; body: string; cta: string }[];
    interactiveQuizzes: { title: string; questions: { question: string; options: string[]; answer: string }[] }[];
    serviceChatbots: { initialMessage: string; options: { option: string; response: string }[] }[];
  };
  other: {
    fakeTestimonials: { author: string; text: string }[];
    purchaseGuides: { title: string; content: string }[];
  }
}

export interface ContentCategory {
  id: keyof GeneratedContent;
  title: string;
  items: ContentItem[];
}

export interface ContentItem {
  id: string;

  label: string;
  accessor: (content: GeneratedContent) => any;
}