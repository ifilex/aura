// ============================================================
// AURA GRAMMATICAL LANGUAGE PARSER
// Sistema de comprensión gramatical y semántica ligera
// ============================================================

export interface MathAnalysis {
    isMath: boolean;
    num1: number;
    num2: number;
    operator: string;
    result: number;
    expressionText: string;
}

export interface GrammaticalAnalysis {
    // Estructura básica
    subject: string | null;          // Sujeto de la oración
    verb: string | null;             // Verbo principal
    complement: string | null;       // Complemento
    fullParse: string;               // Análisis completo

    // Semántica
    entities: {
        people: string[];            // Nombres de personas
        emotions: string[];          // Emociones detectadas
        actions: string[];           // Acciones mencionadas
        objects: string[];           // Objetos / conceptos
        adjectives: string[];        // Adjetivos detectados
        time: string | null;         // Referencias temporales
    };

    // Intención
    intent: 'desahogo' | 'consulta_especifica' | 'pedido_ayuda' | 
            'reflexion' | 'compartir_experiencia' | 'duda_existencial' |
            'solicitud_ejercicio' | 'general';

    // Métricas
    emotionDetected: string;
    stressLevel: number;
    complexityScore: number;          // 1-10, qué tan compleja es la oración
    urgencyFlag: boolean;            // Si requiere respuesta urgente

    // Pronombres resueltos
    resolvedPronouns: Map<string, string>;
}

// ============================================================
// CLASIFICADOR GRAMATICAL LIGERO (SIN LIBRERÍAS EXTERNAS)
// ============================================================
export class GrammaticalParser {
    private static readonly EMOTION_KEYWORDS: Record<string, string[]> = {
        ansiedad: ['ansiedad', 'ansioso', 'nervioso', 'angustia', 'agobio', 'preocupación', 'miedo', 'pánico'],
        tristeza: ['triste', 'tristeza', 'llorar', 'deprimido', 'desanimado', 'sin fuerzas', 'vacío', 'solo'],
        frustracion: ['frustrado', 'enojo', 'ira', 'rabia', 'impotente', 'harto', 'cansancio emocional'],
        alegria: ['alegre', 'feliz', 'contento', 'agradecido', 'optimista', 'entusiasmado'],
        calma: ['tranquilo', 'calma', 'paz', 'sereno', 'relajado', 'bien', 'estable'],
        agotamiento: ['agotado', 'sin energía', 'fatiga', 'quemado', 'exhausto', 'drenado']
    };

    private static readonly INTENT_PATTERNS: Record<string, RegExp[]> = {
        desahogo: [/quiero contar/, /necesito hablar/, /siento que necesito/, /me pasa que/, /pasó que/],
        consulta_especifica: [/qué hago si/, /cómo puedo/, /qué debo/, /me puedes ayudar con/, /necesito ayuda para/],
        pedido_ayuda: [/ayuda/, /socorro/, /no puedo más/, /ya no sé qué hacer/, /necesito apoyo/, /necesito atención/],
        reflexion: [/creo que/, /pienso que/, /me pregunto/, /a veces siento/, /quizás/, /tal vez/],
        compartir_experiencia: [/me pasó/, /viví/, /experimenté/, /sucedió que/, /recuerdo cuando/],
        duda_existencial: [/por qué/, /qué sentido/, /para qué/, /quién soy/, /mi propósito/],
        solicitud_ejercicio: [/ejercicio/, /respiración/, /meditación/, /práctica/, /técnica/]
    };

    private static readonly PRONOUN_MAP: Record<string, string[]> = {
        'ello': ['eso', 'aquello', 'esto', 'lo que'],
        'él': ['el', 'aquel'],
        'ella': ['la', 'aquella'],
        'nosotros': ['nosotras', 'nos'],
        'ellos': ['ellas', 'los', 'les'],
        'mí': ['yo', 'me'],
        'ti': ['tú', 'te'],
        'sí': ['se', 'consigo']
    };

    /**
     * ANALIZA UN TEXTO COMPLETO Y DEVUELVE UN ANÁLISIS GRAMATICAL ESTRUCTURADO
     */
    static analyze(text: string): GrammaticalAnalysis {
        const normalized = text.trim();
        const words = normalized.split(/\s+/);

        // 1. Extraer sujeto, verbo y complemento
        const { subject, verb, complement } = this.extractSubjectVerbComplement(words, normalized);

        // 2. Detectar entidades
        const entities = this.extractEntities(normalized, words);

        // 3. Resolver pronombres
        const resolvedPronouns = this.resolvePronouns(normalized, entities);

        // 4. Detectar emoción y nivel de estrés
        const { emotion, stressLevel } = this.detectEmotionAndStress(normalized);

        // 5. Clasificar intención
        const intent = this.classifyIntent(normalized);

        // 6. Calcular complejidad
        const complexityScore = this.calculateComplexity(words, normalized);

        // 7. Detectar urgencia
        const urgencyFlag = this.detectUrgency(normalized);

        return {
            subject,
            verb,
            complement,
            fullParse: `Sujeto: ${subject || '(no identificado)'} | Verbo: ${verb || '(no identificado)'} | Complemento: ${complement || '(no identificado)'}`,
            entities,
            intent,
            emotionDetected: emotion,
            stressLevel,
            complexityScore,
            urgencyFlag,
            resolvedPronouns
        };
    }

    /**
     * EXTRAE SUJETO, VERBO Y COMPLEMENTO DE LA ORACIÓN
     */
    private static extractSubjectVerbComplement(words: string[], _fullText: string): {
        subject: string | null;
        verb: string | null;
        complement: string | null;
    } {
        // Verbos comunes en español
        const commonVerbs = [
            'ser', 'estar', 'tener', 'hacer', 'decir', 'ir', 'ver', 'saber',
            'querer', 'poder', 'sentir', 'pensar', 'creer', 'encontrar',
            'necesitar', 'querer', 'desear', 'esperar', 'saber', 'entender',
            'comprender', 'manejar', 'controlar', 'calmar', 'resolver',
            'organizar', 'ordenar', 'dormir', 'descansar', 'relajarse',
            'preocuparse', 'angustiarse', 'sentirse', 'encontrarse'
        ];

        // Buscar el verbo principal (primer verbo en la oración)
        let verbIndex = -1;
        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase();
            // Buscar verbos conjugados o infinitivos
            const isVerb = commonVerbs.some(v => word.includes(v) || word.startsWith(v));
            if (isVerb || word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir')) {
                verbIndex = i;
                break;
            }
        }

        if (verbIndex === -1) {
            return { subject: null, verb: null, complement: null };
        }

        const verb = words[verbIndex];

        // Sujeto: palabras antes del verbo (últimas 2-3 palabras)
        let subject = null;
        if (verbIndex > 0) {
            const subjectWords = words.slice(Math.max(0, verbIndex - 3), verbIndex);
            subject = subjectWords.join(' ');
        }

        // Complemento: palabras después del verbo
        let complement = null;
        if (verbIndex < words.length - 1) {
            const complementWords = words.slice(verbIndex + 1);
            complement = complementWords.join(' ');
        }

        return { subject, verb, complement };
    }

    /**
     * EXTRAE ENTIDADES DEL TEXTO
     */
    private static extractEntities(text: string, words: string[]): GrammaticalAnalysis['entities'] {
        const entities: GrammaticalAnalysis['entities'] = {
            people: [],
            emotions: [],
            actions: [],
            objects: [],
            adjectives: [],
            time: null
        };

        // Detectar nombres propios (palabras con mayúscula que no están al inicio)
        for (const word of words) {
            if (/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*$/.test(word) && word.length > 1) {
                // Evitar palabras que son días, meses, etc.
                const excludedWords = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                if (!excludedWords.includes(word) && word !== text.substring(0, word.length)) {
                    entities.people.push(word);
                }
            }
        }

        // Detectar emociones
        for (const [emotion, keywords] of Object.entries(this.EMOTION_KEYWORDS)) {
            for (const keyword of keywords) {
                if (text.toLowerCase().includes(keyword)) {
                    entities.emotions.push(emotion);
                    break;
                }
            }
        }

        // Detectar adjetivos
        const adjectivePatterns = [
            'triste', 'ansioso', 'ansiosa', 'nervioso', 'nerviosa', 'cansado', 'cansada',
            'agobiado', 'agobiada', 'frustrado', 'frustrada', 'feliz', 'contento', 'contenta',
            'solo', 'sola', 'confundido', 'confundida', 'preocupado', 'preocupada', 'alegre',
            'difícil', 'dificil', 'fácil', 'facil', 'importante', 'pesado', 'lindo', 'bueno', 'malo'
        ];
        for (const adj of adjectivePatterns) {
            if (text.toLowerCase().includes(adj)) {
                entities.adjectives.push(adj);
            }
        }

        // Detectar acciones (verbos en infinitivo o conjugados)
        const actionPatterns = ['quiero', 'necesito', 'voy a', 'debo', 'puedo', 'tengo que', 'me gustaría'];
        for (const pattern of actionPatterns) {
            if (text.toLowerCase().includes(pattern)) {
                const afterPattern = text.split(pattern)[1]?.trim();
                if (afterPattern) {
                    const firstWords = afterPattern.split(/\s+/).slice(0, 4).join(' ');
                    entities.actions.push(`${pattern} ${firstWords}`);
                }
            }
        }

        // Detectar objetos/conceptos clave
        const conceptPatterns = ['trabajo', 'familia', 'hijos', 'pareja', 'amigos', 'salud', 'dinero',
            'estrés', 'ansiedad', 'miedo', 'futuro', 'pasado', 'vida', 'muerte', 'sentido', 'propósito'];
        for (const concept of conceptPatterns) {
            if (text.toLowerCase().includes(concept)) {
                entities.objects.push(concept);
            }
        }

        return entities;
    }

    /**
     * RESUELVE PRONOMBRES EN EL TEXTO
     */
    private static resolvePronouns(text: string, entities: GrammaticalAnalysis['entities']): Map<string, string> {
        const resolved = new Map<string, string>();
        const lowerText = text.toLowerCase();

        // Si hay nombres de personas detectados, resolver pronombres
        if (entities.people.length > 0) {
            const lastPerson = entities.people[entities.people.length - 1];
            for (const [_pronoun, references] of Object.entries(this.PRONOUN_MAP)) {
                for (const ref of references) {
                    if (lowerText.includes(ref)) {
                        resolved.set(ref, lastPerson);
                    }
                }
            }
        }

        // Resolver "eso" / "esto" / "aquello" con el concepto mencionado
        const lastObject = entities.objects[entities.objects.length - 1] || null;
        if (lastObject) {
            if (lowerText.includes('eso') || lowerText.includes('esto') || lowerText.includes('aquello')) {
                resolved.set('eso', lastObject);
                resolved.set('esto', lastObject);
                resolved.set('aquello', lastObject);
            }
        }

        return resolved;
    }

    /**
     * DETECTA EMOCIÓN Y NIVEL DE ESTRÉS
     */
    private static detectEmotionAndStress(text: string): { emotion: string; stressLevel: number } {
        let detectedEmotion = 'calma';
        let stressLevel = 3;
        let highestScore = 0;

        const lowerText = text.toLowerCase();

        // Mapeo de emociones a palabras clave con peso
        const emotionMap: Record<string, { keywords: string[]; baseStress: number }> = {
            ansiedad: {
                keywords: ['ansiedad', 'ansioso', 'nervioso', 'angustia', 'agobio', 'preocupación', 'miedo', 'pánico', 'terror'],
                baseStress: 7
            },
            tristeza: {
                keywords: ['triste', 'tristeza', 'llorar', 'deprimido', 'desanimado', 'sin fuerzas', 'vacío', 'solo', 'soledad'],
                baseStress: 6
            },
            frustracion: {
                keywords: ['frustrado', 'enojo', 'ira', 'rabia', 'impotente', 'harto', 'cansancio emocional', 'rabieta'],
                baseStress: 7
            },
            agotamiento: {
                keywords: ['agotado', 'sin energía', 'fatiga', 'quemado', 'exhausto', 'drenado', 'no puedo más'],
                baseStress: 7
            },
            serenidad: {
                keywords: ['tranquilo', 'calma', 'paz', 'sereno', 'relajado', 'bien', 'estable', 'en paz'],
                baseStress: 2
            }
        };

        for (const [emotion, data] of Object.entries(emotionMap)) {
            let score = 0;
            for (const keyword of data.keywords) {
                if (lowerText.includes(keyword)) {
                    score += 2;
                }
            }
            if (score > highestScore) {
                highestScore = score;
                detectedEmotion = emotion;
                stressLevel = data.baseStress;
            }
        }

        // Ajustar estrés basado en palabras intensificadoras
        const intensifiers = ['mucho', 'muy', 'demasiado', 'extremadamente', 'increíblemente', 'terriblemente'];
        for (const word of intensifiers) {
            if (lowerText.includes(word)) {
                stressLevel = Math.min(10, stressLevel + 1);
            }
        }

        return { emotion: detectedEmotion, stressLevel };
    }

    /**
     * CLASIFICA LA INTENCIÓN DEL USUARIO
     */
    private static classifyIntent(text: string): GrammaticalAnalysis['intent'] {
        const lowerText = text.toLowerCase();

        for (const [intent, patterns] of Object.entries(this.INTENT_PATTERNS)) {
            for (const pattern of patterns) {
                if (pattern.test(lowerText)) {
                    return intent as GrammaticalAnalysis['intent'];
                }
            }
        }

        // Si contiene signos de pregunta, es consulta
        if (text.includes('?') || text.includes('¿')) {
            return 'consulta_especifica';
        }

        // Si es muy corto (1-3 palabras), es probablemente saludo o interacción simple
        if (text.split(/\s+/).length <= 3) {
            return 'general';
        }

        return 'general';
    }

    /**
     * CALCULA LA COMPLEJIDAD DEL TEXTO
     */
    private static calculateComplexity(words: string[], text: string): number {
        let score = 1;

        // Longitud de la oración
        if (words.length > 20) score += 2;
        else if (words.length > 10) score += 1;

        // Presencia de conjunciones complejas
        const conjunctions = ['porque', 'pero', 'sin embargo', 'aunque', 'mientras', 'cuando', 'si'];
        for (const conj of conjunctions) {
            if (text.toLowerCase().includes(conj)) {
                score += 0.5;
                break;
            }
        }

        // Presencia de subordinadas
        if (text.includes('que') || text.includes('cómo') || text.includes('donde')) {
            score += 0.5;
        }

        // Presencia de vocabulario emocional
        if (this.detectEmotionAndStress(text).stressLevel > 5) {
            score += 1;
        }

        return Math.min(10, Math.round(score));
    }

    /**
     * DETECTA SITUACIONES DE URGENCIA
     */
    private static detectUrgency(text: string): boolean {
        const urgentPatterns = [
            'ayuda', 'socorro', 'no puedo más', 'ya no sé qué hacer',
            'necesito apoyo', 'estoy desesperado', 'por favor',
            'no aguanto', 'me siento muy mal', 'no puedo seguir',
            'quiero morir', 'quiero matarme', 'hacerme daño'
        ];

        const lowerText = text.toLowerCase();
        for (const pattern of urgentPatterns) {
            if (lowerText.includes(pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * GENERA UN RESUMEN SEMÁNTICO DEL TEXTO
     */
    static generateSemanticSummary(analysis: GrammaticalAnalysis): string {
        const parts: string[] = [];

        if (analysis.entities.people.length > 0) {
            parts.push(`🧑 Hablas de: ${analysis.entities.people.join(', ')}`);
        }

        if (analysis.entities.emotions.length > 0) {
            parts.push(`💭 Emociones detectadas: ${[...new Set(analysis.entities.emotions)].join(', ')}`);
        }

        if (analysis.entities.actions.length > 0) {
            parts.push(`🎯 Acciones mencionadas: ${analysis.entities.actions.slice(0, 2).join(', ')}`);
        }

        if (analysis.entities.objects.length > 0) {
            parts.push(`📌 Conceptos clave: ${[...new Set(analysis.entities.objects)].join(', ')}`);
        }

        parts.push(`📊 Intensidad emocional: ${analysis.stressLevel}/10`);

        return parts.join(' · ');
    }

    /**
     * GENERA UNA RESPUESTA GRAMATICAL Y CONCISA
     */
    static generateGrammaticalResponse(analysis: GrammaticalAnalysis, lang: string = 'es'): string {
        const isSpanish = lang === 'es';
        const baseResponse = isSpanish ? 
            this.generateSpanishResponse(analysis) : 
            this.generateEnglishResponse(analysis);

        // Adaptar longitud según complejidad
        if (analysis.complexityScore > 6) {
            // Respuesta más detallada para preguntas complejas
            return baseResponse + (isSpanish ? 
                `\n\n¿Te gustaría que profundice en algún punto en particular?` : 
                `\n\nWould you like me to elaborate on any specific point?`);
        }

        return baseResponse;
    }

    private static generateSpanishResponse(analysis: GrammaticalAnalysis): string {
        const { intent, emotionDetected, stressLevel, entities, urgencyFlag } = analysis;

        // URGENCIA - Prioridad máxima
        if (urgencyFlag) {
            return `⚠️ **Te escucho con mucha atención.** Por favor, si estás en crisis o necesitas ayuda inmediata, presiona el botón **"💚 Solicitar atención"** arriba. También puedes llamar al 911 o contactar a las líneas de emergencia de tu país. \n\n**Respira hondo conmigo:** Inhala en 4 segundos, exhala en 7. Estoy aquí contigo. ¿Puedes decirme si estás en un lugar seguro?`;
        }

        // Construir respuesta basada en intención
        let response = '';

        switch (intent) {
            case 'desahogo':
                response = `💬 **Te escucho con atención.** Noto que necesitas expresar lo que sientes. Eso es muy importante y valiente. `;
                if (entities.emotions.length > 0) {
                    response += `Percibo que estás sintiendo **${entities.emotions.join(', ')}**. Es completamente normal sentirse así. `;
                }
                response += `\n\n¿Qué te gustaría compartir conmigo? Estoy aquí sin apuros.`;
                break;

            case 'consulta_especifica':
                response = `💡 **Buena pregunta.** Déjame ayudarte a organizar esto. `;
                if (stressLevel > 6) {
                    response += `Noto que esto te preocupa bastante. Vamos a ir paso a paso. `;
                }
                response += `\n\nPara empezar, ¿podrías decirme con una frase corta qué es lo que más te preocupa de esta situación?`;
                break;

            case 'reflexion':
                response = `🧘 **Interesante reflexión.** A veces, observar nuestros propios pensamientos desde afuera nos da claridad. `;
                if (entities.objects.length > 0) {
                    response += `Veo que estás pensando en **${entities.objects.join(', ')}**. `;
                }
                response += `\n\n¿Qué crees que cambiaría si te permitieras ver esto con un poco más de distancia?`;
                break;

            case 'duda_existencial':
                response = `🌿 **Preguntas profundas.** No siempre hay respuestas inmediatas, pero hacerte esta pregunta ya es un gran paso. `;
                response += `\n\nA veces, la respuesta no está en encontrar el significado perfecto, sino en cómo decidimos vivir el día de hoy. ¿Qué te gustaría hacer hoy que te acerque a lo que valoras?`;
                break;

            default:
                response = `💚 **Gracias por compartir.** Veo que estás en un momento de ${emotionDetected}. `;
                if (stressLevel > 5) {
                    response += `Puedo notar que hay cierta tensión. ¿Te parece si hacemos una pausa de 30 segundos para respirar juntos? Inhala... y exhala lentamente. `;
                }
                response += `\n\n¿Qué te gustaría explorar o resolver en este momento?`;
        }

        return response;
    }

    private static generateEnglishResponse(analysis: GrammaticalAnalysis): string {
        const { intent, emotionDetected, stressLevel, entities, urgencyFlag } = analysis;

        if (urgencyFlag) {
            return `⚠️ **I hear you with full attention.** If you are in crisis or need immediate help, please press the **"💚 Support request"** button above. You can also call your local emergency number (911 in the US).\n\n**Breathe with me:** Inhale for 4 seconds, exhale for 7. I am here with you. Are you in a safe place right now?`;
        }

        let response = '';

        switch (intent) {
            case 'desahogo':
                response = `💬 **I'm listening carefully.** It takes courage to express what you feel. `;
                if (entities.emotions.length > 0) {
                    response += `I notice you're feeling **${entities.emotions.join(', ')}**. That's completely valid. `;
                }
                response += `\n\nWhat would you like to share? I'm here without rushing.`;
                break;

            case 'consulta_especifica':
                response = `💡 **Great question.** Let me help you organize this. `;
                if (stressLevel > 6) {
                    response += `I can see this is quite important to you. Let's take it step by step. `;
                }
                response += `\n\nCould you tell me in one short sentence what worries you most about this situation?`;
                break;

            case 'reflexion':
                response = `🧘 **Beautiful reflection.** Observing our own thoughts from a distance brings clarity. `;
                if (entities.objects.length > 0) {
                    response += `I see you're thinking about **${entities.objects.join(', ')}**. `;
                }
                response += `\n\nWhat would change if you allowed yourself to see this with a bit more compassion?`;
                break;

            default:
                response = `💚 **Thank you for sharing.** I see you're in a moment of ${emotionDetected}. `;
                if (stressLevel > 5) {
                    response += `I can sense some tension. Would you like to take a 30-second pause to breathe together? Inhale... and exhale slowly. `;
                }
                response += `\n\nWhat would you like to explore or resolve right now?`;
        }

        return response;
    }

    /**
     * EVALÚA EXPRESIONES ARITMÉTICAS BÁSICAS (SUMA, RESTA, MULTIPLICACIÓN, DIVISIÓN)
     * Soporta lenguaje natural y símbolos: "2 mas 2", "4 por 2", "10 dividido 2", "15 - 3", "2 + 2", "4 x 2"
     */
    static parseMath(text: string): MathAnalysis | null {
        if (!text || text.length > 100) return null;
        const normalized = text.toLowerCase()
            .replace(/¿|\?|cuanto|cuánto|es|calcula|calculame|calculáme|dime|resultado|de|por favor|cuanto es|cuánto es/gi, '')
            .trim();

        // Patrón flexible para detectar dos números con operador verbal o simbólico
        const regex = /(-?\d+(?:\.\d+)?)\s*([\+\-\*\/xX]|mas|más|menos|por|multiplicado por|dividido|dividido por|entre)\s*(-?\d+(?:\.\d+)?)/i;
        const match = normalized.match(regex);

        if (!match) return null;

        const num1 = parseFloat(match[1]);
        const opRaw = match[2].toLowerCase();
        const num2 = parseFloat(match[3]);

        if (isNaN(num1) || isNaN(num2)) return null;

        let operatorSymbol = '+';
        let result = 0;

        if (opRaw === '+' || opRaw === 'mas' || opRaw === 'más') {
            operatorSymbol = '+';
            result = num1 + num2;
        } else if (opRaw === '-' || opRaw === 'menos') {
            operatorSymbol = '-';
            result = num1 - num2;
        } else if (opRaw === '*' || opRaw === 'x' || opRaw === 'por' || opRaw === 'multiplicado por') {
            operatorSymbol = '×';
            result = num1 * num2;
        } else if (opRaw === '/' || opRaw === 'dividido' || opRaw === 'dividido por' || opRaw === 'entre') {
            operatorSymbol = '÷';
            if (num2 === 0) {
                return {
                    isMath: true,
                    num1,
                    num2,
                    operator: '÷',
                    result: NaN,
                    expressionText: `${num1} ÷ 0`
                };
            }
            result = num1 / num2;
        } else {
            return null;
        }

        const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));

        return {
            isMath: true,
            num1,
            num2,
            operator: operatorSymbol,
            result: formattedResult,
            expressionText: `${num1} ${operatorSymbol} ${num2}`
        };
    }

    /**
     * FORMATEA UNA RESPUESTA ARITMÉTICA CÁLIDA Y CLARA
     */
    static formatMathResponse(math: MathAnalysis, lang: string = 'es'): string {
        const isSpanish = lang === 'es';

        if (isNaN(math.result)) {
            return isSpanish
                ? `🔢 **Operación Aritmética:**\n\nNo es posible dividir entre **0** en matemáticas. Si necesitas resolver otro cálculo o conversar sobre cualquier otro tema, estoy aquí a tu lado.`
                : `🔢 **Arithmetic Operation:**\n\nDivision by zero is undefined. If you need any other calculation or wish to talk, I am here for you.`;
        }

        return isSpanish
            ? `🔢 **Cálculo Aritmético:**\n\nEl resultado de **${math.expressionText}** es **${math.result}**.\n\nEstoy a tu disposición para ayudarte con cálculos básicos, organizar tus pensamientos o acompañarte cuando lo necesites. ¿En qué más puedo colaborarte?`
            : `🔢 **Arithmetic Calculation:**\n\nThe result of **${math.expressionText}** is **${math.result}**.\n\nI am here to help with basic calculations, organize your thoughts, or support you whenever you need. How else can I assist you?`;
    }
}
