import { mockMessages } from '@/data/mockMessages';
import { PDAMessage, Severity } from '@/types/pda';
import { create } from 'zustand';

type MessageState = {
    messages: PDAMessage[];
    selectedMessage: PDAMessage | null;
    filter: Severity | null;
    setSelectedMessage: (message: PDAMessage | null) => void;
    markAsRead: (id: string) => void;
    setFilter: (filter: Severity | null) => void;
    refreshMessages: () => void;
};

export const useMessageStore = create<MessageState>((set) => ({
    messages: mockMessages,
    selectedMessage: null,
    filter: null,
    setSelectedMessage: (message) => set({ selectedMessage: message }),
    markAsRead: (id) =>
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === id ? { ...m, read: true } : m
            ),
            selectedMessage:
                state.selectedMessage?.id === id
                    ? { ...state.selectedMessage, read: true }
                    : state.selectedMessage,
        })),
    setFilter: (filter) => set({ filter }),
    refreshMessages: () =>
        set({
            messages: mockMessages.map((m) => ({
                ...m,
                timestamp: Date.now() - Math.random() * 1000 * 60 * 120,
            })),
        }),
}));
