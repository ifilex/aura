import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

export interface State {
    messageHistory: ChatCompletionMessageParam[];
    criticalError: string | false;
    downloadStatus: string;
    isGenerating: boolean;
    isLiteMode: boolean;
}

const initialState: State = {
    messageHistory: [],
    criticalError: false,
    downloadStatus: 'waiting',
    isGenerating: false,
    isLiteMode: false,
};

export const llmSlice = createSlice({
    name: 'llm',
    initialState,
    reducers: {
        setMessageHistory: (
            state,
            action: PayloadAction<ChatCompletionMessageParam[]>
        ) => {
            state.messageHistory = action.payload;
        },
        setDownloadStatus: (
            state,
            action: PayloadAction<string>
        ) => {
            state.downloadStatus = action.payload;
        },
        setCriticalError: (
            state,
            action: PayloadAction<string | false>
        ) => {
            state.criticalError = action.payload;
        },
        setIsGenerating: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.isGenerating = action.payload;
        },
        setIsLiteMode: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.isLiteMode = action.payload;
        },
    },
});

export const { setMessageHistory, setDownloadStatus, setCriticalError, setIsGenerating, setIsLiteMode } = llmSlice.actions;
export const llmReducer = llmSlice.reducer;
