// ============================================================
// AURA LITE - ENGINE DE ACOMPAÑAMIENTO COGNITIVO (OFFLINE)
// 100% Local, sin dependencias externas, sin descarga de modelos
// ============================================================

import { setMessageHistory, setCriticalError, setIsGenerating } from "./redux/llmSlice.ts";
import { dispatch, getState } from "./redux/store.ts";
import { streamLiteResponse } from "./LiteAiEngine.ts";

let shouldStop = false;

// No se necesita downloadModel - siempre estamos en modo Lite
export async function downloadModel(_name: string) {
    // No-op: siempre en modo Lite
    return Promise.resolve();
}

export function stopGeneration() {
    const isGenerating = getState(state => state.llm.isGenerating);
    if (isGenerating) {
        shouldStop = true;
        dispatch(setIsGenerating(false));
    }
}

export async function sendPrompt(message: string) {
    const messagesHistory = getState(state => state.llm.messageHistory);
    const lang = localStorage.getItem('aura_language') || 'es';

    const newUserMessage: { role: string; content: string } = { role: 'user', content: message };
    let updatedHistory = [...messagesHistory, newUserMessage];
    dispatch(setMessageHistory(updatedHistory));

    shouldStop = false;
    dispatch(setIsGenerating(true));

    try {
        const assistantResponse: { role: string; content: string } = {
            role: "assistant",
            content: ""
        };
        updatedHistory = [...updatedHistory, assistantResponse];
        dispatch(setMessageHistory(updatedHistory));

        await streamLiteResponse(
            message,
            lang,
            messagesHistory.map(m => ({
                role: typeof m.role === 'string' ? m.role : 'user',
                content: typeof m.content === 'string' ? m.content : ''
            })),
            (accumulatedText) => {
                const current = getState(state => state.llm.messageHistory);
                const updated = [...current];
                const lastIndex = updated.length - 1;
                if (lastIndex >= 0) {
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        content: accumulatedText
                    };
                    dispatch(setMessageHistory(updated));
                }
            },
            () => shouldStop
        );
    } catch (err) {
        console.error("Error streaming Lite response:", err);
        const current = getState(state => state.llm.messageHistory);
        const updated = [...current];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = {
                ...updated[lastIndex],
                content: (updated[lastIndex].content || "") + "\n\n*Hubo un error al generar la respuesta. Por favor, intenta de nuevo.*"
            };
            dispatch(setMessageHistory(updated));
        }
    } finally {
        dispatch(setIsGenerating(false));
        shouldStop = false;
    }
}

// Función para limpiar el historial actual de la conversación activa
export function clearChatHistory() {
    dispatch(setMessageHistory([]));
}