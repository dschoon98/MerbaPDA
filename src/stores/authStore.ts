import { create } from 'zustand';

type UserInfo = {
    name: string;
    email: string;
};

type AuthState = {
    isAuthenticated: boolean;
    user: UserInfo | null;
    accessToken: string | null;
    login: (user: UserInfo, accessToken: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    login: (user, accessToken) =>
        set({ isAuthenticated: true, user, accessToken }),
    logout: () =>
        set({ isAuthenticated: false, user: null, accessToken: null }),
}));
