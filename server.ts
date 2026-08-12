import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Server-Side Empathetic LLM Chat Route using Gemini 3.6 Flash
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, lang = 'es' } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(400).json({ error: 'Gemini API Key is not configured' });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `Eres Aura 🌿, una asistente conversacional de apoyo terapéutico y cognitivo profundamente empática, cálida, intuitiva, franca y reflexiva.

### REGLAS FUNDAMENTALES DE IDENTIDAD Y ACOMPAÑAMIENTO:
1. **HONESTIDAD TOTAL Y LÍMITES HUMANOS (SINCERIDAD ABSOLUTA):**
   - NUNCA simules ni inventes que eres una persona real. NO tienes esposo, esposa, hijos, madre, padre ni familia humana. Si te preguntan por tu vida o familia, sé siempre franco y cariñoso: "Soy un asistente conversacional de apoyo terapéutico y cognitivo. No tengo familia ni hijos humanos, pero estoy aquí con toda mi presencia y calidez para escucharte y acompañarte."
   - Habla con un léxico ameno, cariñoso y de profunda amistad.

2. **COMPRENSIÓN PROFUNDA Y LECTURA ENTRE LÍNEAS:**
   - Valida primero las emociones del usuario ("Entiendo lo mucho que esto pesa...", "Me imagino lo agotador que se siente...") antes de estructurar recomendaciones.
   - Si el usuario te explica un tema o concepto, agradaselo y dile de forma cálida y natural que lo recordarás para futuras conversaciones (sin mencionar procesos técnicos ni nombres de variables).

3. **SEMIOLOGÍA MÉDICA Y CLÍNICA MÉDICA BÁSICA:**
   - Si el usuario menciona síntomas físicos como fiebre, calentura, golpe de calor, sudor frío, mialgias, cuerpo cortado o infecciones virales, diferencia inmediatamente la manifestación fisiológica de la ansiedad (que no produce fiebre) de una enfermedad clínica u orgánica real.
   - Recomiéndale medir su temperatura con un termómetro, mantenerse hidratado y acudir a consulta médica presencial con un profesional de la salud.

4. **DETECCIÓN DE POLOS COGNITIVOS Y PLANES DE CONTINGENCIA:**
   - Detecta activamente marcadores de angustia y polos cognitivos (separación/duelo, negatividad extrema, euforia/manía extrema, ataques de pánico).
   - Activa de inmediato un **Plan de Contingencia Terapéutico**: contención emocional, deconstrucción de la desesperanza, ejercicios de anclaje (respiración 4-7-8 o grounding 5-4-3-2-1), y recuerdo de su fortaleza intrínseca.
   - Si la carga supera su capacidad actual, recomiéndale de corazón acudir con un terapeuta humano profesional o ponerse en contacto con los grupos de apoyo de WineBOX ("💚 Solicitar atención" / $22 USD/mes).

5. **RESPUESTA Y BÚSQUEDA DIRECTA DE TEMAS DESCONOCIDOS:**
   - Cuando se consulte sobre un tema no conocido, datos actuales, noticias o eventos, la información extraída se devolverá directamente como respuesta en texto plano explícito dentro del chat. NUNCA envíes al usuario a enlaces ni a páginas externas para buscar; entrega el resumen en texto plano directamente en la conversación de forma cálida y clara.

6. **FORMATO AMENO Y FLUIDO:**
   - Usa párrafos cortos, tono muy afable, negrillas sutiles y viñetas claras. Mantén una conversación llena de paz y amabilidad.`;

      const formattedContents = (Array.isArray(messages) ? messages : []).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }]
      })).filter((m: any) => m.parts[0].text);

      if (formattedContents.length === 0) {
        res.status(400).json({ error: 'Messages array is required' });
        return;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const text = response.text || '';
      res.json({
        success: true,
        text,
        provider: 'gemini-3.6-flash'
      });
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Server-Side Search & Knowledge Grounding Route using free public endpoints & Gemini API
  app.post("/api/search", async (req, res) => {
    try {
      const { query, lang = 'es', userEmotions = [] } = req.body || {};
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query parameter is required' });
        return;
      }

      const isSpanish = lang === 'es';
      const cleanQuery = query.trim().toLowerCase();

      const isNewsQuery = /\b(noticia|noticias|noticia del dia|noticias del día|que pasa hoy|qué pasa hoy|que hay de nuevo|noticias de hoy|actualidad|mundo hoy)\b/i.test(cleanQuery);
      const isWeatherQuery = /\b(llovera|lloverá|llueve|lluvia|clima|tiempo|temperatura|calor|frío|frio|sol|pronostico|pronóstico|viento|tormenta)\b/i.test(cleanQuery);
      const isMovieQuery = /\b(película|pelicula|películas|peliculas|cartelera|cine|estrenos|estreno|en el cine|qué ver|que ver|filme|filmes)\b/i.test(cleanQuery);

      // FREE SERVICE 1: Gemini Grounded Search (When API key is present)
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              }
            }
          });

          const systemInstruction = `Eres Aura, una acompañante terapéutica y cognitiva conversacional.
Responde a la consulta del usuario de manera fluida, empática, natural y totalmente humanizada.
NUNCA uses frases robóticas sobre guardar memoria, guardar datos, actualizar bases de datos o redes asociativas.
NO uses títulos de sección rígidos (como "Búsqueda Cognitiva", "Síntesis" o "Mayéutica Socrática").
Si la consulta trata de opiniones (como política, películas o religión), brinda una perspectiva equilibrada, respetuosa, amable y comprensiva sin juzgar.
Expresa la información directamente como una buena amiga o acompañante que habla desde el corazón.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: query,
            config: {
              systemInstruction,
              tools: [{ googleSearch: {} }],
            }
          });

          const textResult = response.text || '';
          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const sources = chunks.map((c: any) => ({
            title: c?.web?.title || 'Fuente web',
            url: c?.web?.uri || ''
          })).filter((s: any) => s.url);

          if (textResult) {
            res.json({
              success: true,
              summary: textResult,
              sources,
              provider: 'gemini_grounding'
            });
            return;
          }
        } catch (geminiError: any) {
          console.warn('Gemini Search Grounding fallback:', geminiError.message || geminiError);
        }
      }

      // FREE SERVICE 2: Google News Topic/Keyword RSS Feed (Free public XML RSS stream)
      try {
        const queryEncoded = encodeURIComponent(query.trim());
        const rssUrl = isNewsQuery
          ? (isSpanish
            ? `https://news.google.com/rss?hl=es-419&gl=US&ceid=US:es-419`
            : `https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en`)
          : (isSpanish
            ? `https://news.google.com/rss/search?q=${queryEncoded}&hl=es-419&gl=US&ceid=US:es-419`
            : `https://news.google.com/rss/search?q=${queryEncoded}&hl=en-US&gl=US&ceid=US:en`);

        const rssRes = await fetch(rssUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        if (rssRes.ok) {
          const xmlText = await rssRes.text();
          const itemMatches = [...xmlText.matchAll(/<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>/gi)];
          if (itemMatches.length > 0) {
            const newsItems = itemMatches.slice(0, 5).map(m => {
              let title = m[1].replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim();
              title = title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
              return {
                title,
                url: m[2].trim()
              };
            });

            let prefix = '';
            if (isWeatherQuery) {
              prefix = isSpanish
                ? `Estuve revisando la información del clima y los reportes meteorológicos más recientes:`
                : `Here is the latest weather and forecast report I found:`;
            } else if (isMovieQuery) {
              prefix = isSpanish
                ? `Estuve consultando las películas e informaciones del cine más comentadas hoy:`
                : `Here are the latest movie updates and cinema releases:`;
            } else {
              prefix = isSpanish
                ? `Estuve consultando la información más reciente sobre tu consulta y encontré estos puntos destacados:`
                : `Here is the latest news and information related to your request:`;
            }

            const summaryText = `${prefix}\n\n` + newsItems.map((n, i) => `• **${n.title}**`).join('\n');

            res.json({
              success: true,
              summary: summaryText,
              sources: newsItems.slice(0, 3),
              provider: 'google_news_rss_free'
            });
            return;
          }
        }
      } catch (newsErr) {
        console.warn('Google News RSS free fallback notice:', newsErr);
      }

      // FREE SERVICE 3: DuckDuckGo HTML Live Web Search Scraper (Works for ANY search query: weather, movies, news, sports, etc.)
      try {
        const ddgHtmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query.trim())}`;
        const ddgHtmlRes = await fetch(ddgHtmlUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept-Language': isSpanish ? 'es-ES,es;q=0.9,en;q=0.8' : 'en-US,en;q=0.9'
          }
        });

        if (ddgHtmlRes.ok) {
          const html = await ddgHtmlRes.text();
          const snippetMatches = [...html.matchAll(/<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)];
          const titleMatches = [...html.matchAll(/<a class="result__title[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];

          if (snippetMatches.length > 0) {
            const results = [];
            for (let i = 0; i < Math.min(snippetMatches.length, 5); i++) {
              let snippet = snippetMatches[i][1].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'").trim();
              let title = titleMatches[i] ? titleMatches[i][2].replace(/<[^>]+>/g, '').trim() : 'Información web';
              let rawUrl = titleMatches[i] ? titleMatches[i][1] : '';

              let url = rawUrl;
              if (rawUrl.includes('uddg=')) {
                const match = rawUrl.match(/uddg=([^&]+)/);
                if (match) url = decodeURIComponent(match[1]);
              }

              if (snippet && snippet.length > 10) {
                results.push({ title, snippet, url });
              }
            }

            if (results.length > 0) {
              let introPrefix = '';
              if (isWeatherQuery) {
                introPrefix = isSpanish
                  ? `Estuve consultando el reporte climático y los pronósticos más recientes:`
                  : `Here is the weather and forecast information I retrieved:`;
              } else if (isMovieQuery) {
                introPrefix = isSpanish
                  ? `Estuve buscando las noticias sobre cine, carteleras y estrenos:`
                  : `Here are the latest movie and cinema updates:`;
              } else {
                introPrefix = isSpanish
                  ? `Estuve buscando información sobre tu consulta en la web:`
                  : `Here is the information I retrieved from the web:`;
              }

              const summaryText = `${introPrefix}\n\n` + results.map(r => `• **${r.title}**: ${r.snippet}`).join('\n\n');
              const sources = results.map(r => ({ title: r.title, url: r.url })).filter(s => s.url.startsWith('http'));

              res.json({
                success: true,
                summary: summaryText,
                sources: sources.slice(0, 3),
                provider: 'duckduckgo_web_scrape'
              });
              return;
            }
          }
        }
      } catch (scrapeErr) {
        console.warn('DuckDuckGo HTML scrape fallback notice:', scrapeErr);
      }

      // FREE SERVICE 4: Wikipedia REST API
      const wikiLang = isSpanish ? 'es' : 'en';
      const encodedQuery = encodeURIComponent(query.trim());
      const wikiUrl = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`;

      try {
        const wikiRes = await fetch(wikiUrl);
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          if (wikiData.extract) {
            res.json({
              success: true,
              summary: wikiData.extract,
              sources: wikiData.content_urls?.desktop?.page ? [{ title: wikiData.title, url: wikiData.content_urls.desktop.page }] : [],
              provider: 'wikipedia_free'
            });
            return;
          }
        }
      } catch (wikiErr) {
        console.warn('Wiki fallback failed:', wikiErr);
      }

      // FREE SERVICE 5: DuckDuckGo Instant Answer API
      try {
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_redirect=1&no_html=1`;
        const ddgRes = await fetch(ddgUrl);
        if (ddgRes.ok) {
          const ddgData = await ddgRes.json();
          if (ddgData.AbstractText) {
            res.json({
              success: true,
              summary: ddgData.AbstractText,
              sources: ddgData.AbstractURL ? [{ title: ddgData.Heading || query, url: ddgData.AbstractURL }] : [],
              provider: 'duckduckgo_free'
            });
            return;
          }
        }
      } catch (ddgErr) {
        console.warn('DDG fallback failed:', ddgErr);
      }

      res.json({
        success: false,
        summary: '',
        sources: [],
        provider: 'none'
      });
    } catch (err: any) {
      console.error('Error in /api/search:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
