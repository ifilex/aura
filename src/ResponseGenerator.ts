// ============================================================
// AURA GRAMMATICAL RESPONSE GENERATOR
// Generación de respuestas con estructura gramatical correcta
// ============================================================

import { GrammaticalAnalysis } from './GrammaticalParser.ts';

export class ResponseGenerator {
    /**
     * GENERA UNA RESPUESTA EMPÁTICA CON ESTRUCTURA GRAMATICAL
     */
    static generateEmpathicResponse(
        analysis: GrammaticalAnalysis,
        lang: string = 'es',
        _userMessage: string
    ): string {
        const isSpanish = lang === 'es';
        const { emotionDetected, stressLevel, entities, subject } = analysis;

        // 1. APERTURA EMPÁTICA
        let opening = '';
        if (stressLevel > 6) {
            opening = isSpanish 
                ? `💛 **Te escucho.** Noto que esto es muy importante para ti. ` 
                : `💛 **I hear you.** I can tell this really matters to you. `;
        } else if (stressLevel > 4) {
            opening = isSpanish 
                ? `🌱 **Gracias por compartir.** Veo que estás procesando algo importante. ` 
                : `🌱 **Thank you for sharing.** I see you're processing something important. `;
        } else {
            opening = isSpanish 
                ? `🌸 **Qué bonito que estás aquí.** ` 
                : `🌸 **It's lovely to have you here.** `;
        }

        // 2. RECONOCIMIENTO DE EMOCIÓN
        let emotionRecognition = '';
        if (emotionDetected && emotionDetected !== 'calma') {
            const emotionMap = isSpanish ? {
                ansiedad: 'ansiedad o preocupación',
                tristeza: 'tristeza o melancolía',
                frustracion: 'frustración o enojo',
                agotamiento: 'cansancio o falta de energía',
                alegria: 'alegría o entusiasmo'
            } : {
                ansiedad: 'anxiety or worry',
                tristeza: 'sadness',
                frustracion: 'frustration',
                agotamiento: 'exhaustion',
                alegria: 'joy'
            };
            
            const emotionLabel = emotionMap[emotionDetected as keyof typeof emotionMap] || emotionDetected;
            emotionRecognition = isSpanish 
                ? `Percibo que estás sintiendo **${emotionLabel}**. ` 
                : `I sense you're feeling **${emotionLabel}**. `;
        }

        // 3. REFERENCIA AL CONTENIDO (usando el sujeto si existe)
        let contentReflection = '';
        if (subject && subject.length > 2) {
            contentReflection = isSpanish 
                ? `Noto que estás pensando en **${subject}**. ` 
                : `I notice you're thinking about **${subject}**. `;
        } else if (entities.objects.length > 0) {
            const obj = entities.objects.slice(0, 2).join(' y ');
            contentReflection = isSpanish 
                ? `Veo que **${obj}** está en tu mente. ` 
                : `I see **${obj}** is on your mind. `;
        }

        // 4. PREGUNTA REFLEXIVA (adaptada al contexto gramatical)
        let reflectiveQuestion = '';
        if (analysis.intent === 'duda_existencial') {
            reflectiveQuestion = isSpanish 
                ? `¿Qué crees que cambiaría si te permitieras no tener todas las respuestas hoy?`
                : `What do you think would change if you allowed yourself not to have all the answers today?`;
        } else if (analysis.intent === 'reflexion') {
            reflectiveQuestion = isSpanish 
                ? `¿Cómo te sientes al observar esto desde una distancia compasiva?`
                : `How do you feel observing this from a compassionate distance?`;
        } else if (analysis.entities.actions.length > 0) {
            const action = analysis.entities.actions[0];
            reflectiveQuestion = isSpanish 
                ? `¿Qué sería el primer paso pequeño que podrías dar hacia **${action}**?`
                : `What would be the first small step you could take toward **${action}**?`;
        } else if (stressLevel > 5) {
            reflectiveQuestion = isSpanish 
                ? `¿Te gustaría hacer una pausa de 30 segundos para respirar juntos?`
                : `Would you like to take a 30-second pause to breathe together?`;
        } else {
            reflectiveQuestion = isSpanish 
                ? `¿Qué te gustaría explorar o resolver en este momento?`
                : `What would you like to explore or resolve right now?`;
        }

        // 5. CONSTRUIR RESPUESTA FINAL
        return `${opening}${emotionRecognition}${contentReflection}\n\n💭 **${reflectiveQuestion}**`;
    }

    /**
     * GENERA RESPUESTA CONCISA Y RÁPIDA PARA PREGUNTAS SIMPLES
     */
    static generateQuickResponse(
        analysis: GrammaticalAnalysis,
        lang: string = 'es'
    ): string {
        const isSpanish = lang === 'es';
        const { emotionDetected, stressLevel } = analysis;

        // Respuestas rápidas para preguntas simples
        if (stressLevel <= 3) {
            return isSpanish
                ? `✅ **Entendido.** ¿Hay algo más en lo que pueda ayudarte hoy?`
                : `✅ **Understood.** Is there anything else I can help you with today?`;
        }

        if (stressLevel <= 5) {
            return isSpanish
                ? `🌿 **Gracias por compartir.** Recuerda que puedes respirar y tomarte el tiempo que necesites.`
                : `🌿 **Thank you for sharing.** Remember you can breathe and take the time you need.`;
        }

        return isSpanish
            ? `💚 **Escucho tu preocupación.** Estoy aquí contigo. ¿Te gustaría hacer una pausa para respirar?`
            : `💚 **I hear your concern.** I'm here with you. Would you like to pause and breathe?`;
    }

    /**
     * ADAPTA LA RESPUESTA AL NIVEL DE COMPRENSIÓN DEL USUARIO
     */
    static adaptToUserLevel(
        baseResponse: string,
        analysis: GrammaticalAnalysis,
        lang: string = 'es'
    ): string {
        const isSpanish = lang === 'es';
        
        // Si la complejidad es baja, simplificar aún más
        if (analysis.complexityScore <= 3) {
            const simplified = baseResponse
                .replace(/[\(\)\[\]\{\}]/g, '')
                .replace(/\n{2,}/g, '\n')
                .slice(0, 200);
            
            return isSpanish
                ? `${simplified}\n\n💬 **En pocas palabras:** ¿Quieres que te lo explique de otra forma?`
                : `${simplified}\n\n💬 **In short:** Would you like me to explain it differently?`;
        }

        return baseResponse;
    }
}
