// server/api/search.ts
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

interface SearchRequest {
    query: string;
    lang: string;
    userEmotions?: string[];
}

interface SearchResult {
    success: boolean;
    summary?: string;
    source?: string;
    error?: string;
    relatedTopics?: string[];
}

// ============================================================
// FUNCIONES DE BÚSQUEDA
// ============================================================

async function searchWikipedia(query: string, lang: string): Promise<{ summary: string; relatedTopics: string[] } | null> {
    try {
        let cleanQuery = query
            .replace(/^(qué es|que es|quién es|quien es|qué significa|que significa|definición de|definicion de|dime sobre|habla de|háblame de|qué es un|que es un|qué es una|que es una)\s+/i, '')
            .trim();
        
        if (cleanQuery.length > 50) {
            const words = cleanQuery.split(' ');
            cleanQuery = words.slice(0, 5).join(' ');
        }

        // Intentar en el idioma del usuario
        const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AuraCognitiveBot/1.0 (https://wineboxtool.cloud)'
            }
        });
        
        if (response.ok) {
            const data = await response.json() as any;
            if (data.extract && data.extract.length > 50) {
                let summary = data.extract
                    .replace(/\[[0-9]+\]/g, '')
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                if (summary.length > 500) {
                    summary = summary.slice(0, 497) + '...';
                }

                const relatedTopics = data.categories?.slice(0, 3) || [];
                return { summary, relatedTopics };
            }
        }

        // Fallback a inglés
        if (lang !== 'en') {
            const urlEn = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
            const responseEn = await fetch(urlEn, {
                headers: {
                    'User-Agent': 'AuraCognitiveBot/1.0 (https://wineboxtool.cloud)'
                }
            });
            
            if (responseEn.ok) {
                const data = await responseEn.json() as any;
                if (data.extract && data.extract.length > 50) {
                    let summary = data.extract
                        .replace(/\[[0-9]+\]/g, '')
                        .replace(/\n/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    
                    if (summary.length > 500) {
                        summary = summary.slice(0, 497) + '...';
                    }
                    
                    const title = data.title || cleanQuery;
                    return { 
                        summary: `**${title}**\n\n${summary}`,
                        relatedTopics: data.categories?.slice(0, 3) || []
                    };
                }
            }
        }

        return null;
    } catch (error) {
        console.warn('Wikipedia search error:', error);
        return null;
    }
}

async function searchDuckDuckGo(query: string): Promise<{ summary: string; relatedTopics: string[] } | null> {
    try {
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AuraCognitiveBot/1.0 (https://wineboxtool.cloud)'
            }
        });
        
        if (response.ok) {
            const data = await response.json() as any;
            
            if (data.AbstractText && data.AbstractText.length > 20) {
                let summary = data.AbstractText
                    .replace(/\s+/g, ' ')
                    .trim();
                
                if (summary.length > 500) {
                    summary = summary.slice(0, 497) + '...';
                }
                
                const relatedTopics = data.RelatedTopics?.slice(0, 3)
                    ?.map((topic: any) => topic.Text?.split(' - ')[0] || '')
                    ?.filter(Boolean) || [];

                return { 
                    summary: data.Heading ? `**${data.Heading}**\n\n${summary}` : summary,
                    relatedTopics
                };
            }
            
            if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                const firstResult = data.RelatedTopics[0];
                if (firstResult.Text && firstResult.Text.length > 20) {
                    let summary = firstResult.Text
                        .replace(/\s+/g, ' ')
                        .trim();
                    
                    if (summary.length > 500) {
                        summary = summary.slice(0, 497) + '...';
                    }
                    
                    return { 
                        summary: `**Información sobre ${query}**\n\n${summary}`,
                        relatedTopics: data.RelatedTopics.slice(1, 4)
                            ?.map((topic: any) => topic.Text?.split(' - ')[0] || '')
                            ?.filter(Boolean) || []
                    };
                }
            }
        }
        return null;
    } catch (error) {
        console.warn('DuckDuckGo search error:', error);
        return null;
    }
}

function generateContextualResponse(query: string, lang: string, userEmotions: string[]): string {
    const isSpanish = lang === 'es';
    const cleanQuery = query
        .replace(/[?¿!¡,.:;]/g, '')
        .trim()
        .slice(0, 50);

    const isPersonal = /\b(yo|mi|me|siento|pienso|creo|estoy|tengo|quiero|necesito)\b/i.test(query);
    
    if (isPersonal) {
        if (isSpanish) {
            return `🌿 **Entiendo que estás explorando algo personal.**

"${cleanQuery}" es una pregunta que surge desde lo más profundo. Aunque no tengo una respuesta específica almacenada, quiero acompañarte en este proceso de reflexión.

💡 **¿Qué podemos hacer juntos?**
- Hablar sobre cómo te sientes al respecto
- Explorar juntos las diferentes perspectivas
- Buscar juntos información que te ayude a encontrar tu propia respuesta

Recuerda: las respuestas más valiosas suelen nacer de la conversación y la reflexión compartida. ¿Qué te gustaría explorar primero?`;
        }

        return `🌿 **I understand you're exploring something personal.**

"${cleanQuery}" is a question that comes from deep within. Although I don't have a specific answer stored, I want to accompany you in this reflection process.

💡 **What can we do together?**
- Talk about how you feel about it
- Explore different perspectives together
- Look for information that helps you find your own answer

Remember: the most valuable answers often come from conversation and shared reflection. What would you like to explore first?`;
    }

    if (isSpanish) {
        return `📚 **Sobre "${cleanQuery}"**

Esta es una consulta interesante que abarca varios aspectos. Si bien mi especialidad es el apoyo cognitivo y emocional, puedo orientarte hacia dónde encontrar información confiable.

🔍 **Recomendaciones:**
- Consulta fuentes oficiales y especializadas
- Verifica la información en múltiples sitios
- Busca actualizaciones recientes sobre el tema

💡 **Mientras tanto:** ¿Cómo te sientes al hacer esta pregunta? A veces, lo que buscamos no es solo información, sino comprender cómo nos afecta.

¿Te gustaría que hablemos de esto desde una perspectiva más personal?`;
    }

    return `📚 **About "${cleanQuery}"**

This is an interesting query that covers several aspects. While my specialty is cognitive and emotional support, I can guide you toward reliable information sources.

🔍 **Recommendations:**
- Consult official and specialized sources
- Verify information across multiple sites
- Look for recent updates on the topic

💡 **In the meantime:** How do you feel asking this question? Sometimes, what we seek is not just information, but to understand how it affects us.

Would you like to talk about this from a more personal perspective?`;
}

// ============================================================
// RUTA PRINCIPAL
// ============================================================

router.post('/', async (req, res) => {
    try {
        const { query, lang, userEmotions = [] } = req.body as SearchRequest;
        
        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: 'La consulta es demasiado corta'
            });
        }

        console.log(`🔍 Buscando: "${query}" en ${lang}`);

        // 1. Intentar Wikipedia
        let result = await searchWikipedia(query, lang);
        if (result) {
            return res.json({
                success: true,
                summary: result.summary,
                source: 'wikipedia',
                relatedTopics: result.relatedTopics
            });
        }

        // 2. Intentar DuckDuckGo
        result = await searchDuckDuckGo(query);
        if (result) {
            return res.json({
                success: true,
                summary: result.summary,
                source: 'duckduckgo',
                relatedTopics: result.relatedTopics
            });
        }

        // 3. Generar respuesta contextual
        const contextualResponse = generateContextualResponse(query, lang, userEmotions);
        return res.json({
            success: true,
            summary: contextualResponse,
            source: 'contextual'
        });

    } catch (error: any) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            error: error?.message || 'Error al procesar la búsqueda'
        });
    }
});

export default router;