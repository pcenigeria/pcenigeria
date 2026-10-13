import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/design-system', '/docs'],
      },
      {
        // Explicitly allow all major LLM/AI crawlers to index public content
        userAgent: [
          'GPTBot',            // OpenAI ChatGPT training
          'OAI-SearchBot',     // OpenAI Search
          'ChatGPT-User',      // ChatGPT browsing
          'ClaudeBot',         // Anthropic Claude training
          'Claude-Web',        // Anthropic Claude browsing
          'PerplexityBot',     // Perplexity AI
          'Google-Extended',   // Google AI (Gemini / AI Overviews)
          'Amazonbot',         // Amazon Alexa / Rufus
          'Applebot-Extended', // Apple AI
          'Bytespider',        // ByteDance / TikTok AI
          'meta-externalagent', // Meta AI
          'cohere-ai',         // Cohere AI
          'YouBot',            // You.com AI search
        ],
        allow: '/',
        disallow: ['/studio/', '/api/', '/design-system', '/docs'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

