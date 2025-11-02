
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
