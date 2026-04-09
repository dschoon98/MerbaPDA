import { ThemeMode, useAppTheme } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import * as AuthSession from 'expo-auth-session';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// ┌────────────────────────────────────────────────────────────┐
// │  AZURE AD / MICROSOFT ENTRA ID CONFIGURATION              │
// │                                                            │
// │  Replace these with your actual Azure App Registration:    │
// │  1. Go to https://entra.microsoft.com                     │
// │  2. App registrations → New registration                  │
// │  3. Set redirect URI to: merbapda://                      │
// │  4. Copy Application (client) ID → AZURE_CLIENT_ID        │
// │  5. Copy Directory (tenant) ID → AZURE_TENANT_ID          │
// └────────────────────────────────────────────────────────────┘
const AZURE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const AZURE_TENANT_ID = 'YOUR_TENANT_ID_HERE';

export default function Profile() {
    const { colors, fonts, headers, mode, setMode } = useAppTheme();
    const { t, i18n } = useTranslation();
    const { isAuthenticated, user, login, logout } = useAuthStore();

    const discovery = AuthSession.useAutoDiscovery(
        `https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0`
    );

    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'merbapda' });

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: AZURE_CLIENT_ID,
            scopes: ['openid', 'profile', 'email'],
            redirectUri,
        },
        discovery,
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { access_token } = response.params;
            // In production: decode the id_token or call /me endpoint
            login(
                { name: 'Operator', email: 'operator@merba.com' },
                access_token ?? '',
            );
        }
    }, [response, login]);

    const currentLang = i18n.language;

    const themeModes: { key: ThemeMode; labelKey: string }[] = [
        { key: 'light', labelKey: 'profile.themeLight' },
        { key: 'dark', labelKey: 'profile.themeDark' },
        { key: 'system', labelKey: 'profile.themeSystem' },
    ];

    const languages = [
        { key: 'en', labelKey: 'profile.langEn' },
        { key: 'nl', labelKey: 'profile.langNl' },
    ];

    const cardBg = Platform.select({
        ios: colors.surface.level1 + 'CC',
        default: colors.surface.level1,
    });

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.surface.level0 }]}
            contentContainerStyle={styles.content}
        >
            <Text style={[headers.h1, styles.pageTitle, { opacity: 1 }]}>{t('profile.title')}</Text>

            {/* Auth Card */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: colors.border.subtle }]}>
                {isAuthenticated && user ? (
                    <View style={styles.userInfo}>
                        <View style={[styles.avatar, { backgroundColor: colors.interactive.primary }]}>
                            <Text style={[styles.avatarText, { color: colors.onInteractive.primary, ...fonts.bold }]}>
                                {user.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.userText}>
                            <Text style={[styles.userName, { color: colors.onSurface.primary, ...fonts.medium }]}>
                                {user.name}
                            </Text>
                            <Text style={[styles.userEmail, { color: colors.onSurface.secondary, ...fonts.regular }]}>
                                {user.email}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <Text style={[styles.notLoggedIn, { color: colors.onSurface.secondary, ...fonts.regular }]}>
                        {t('profile.notLoggedIn')}
                    </Text>
                )}

                <Pressable
                    onPress={() => (isAuthenticated ? logout() : promptAsync())}
                    disabled={!isAuthenticated && !request}
                    style={({ pressed }) => [
                        styles.authButton,
                        {
                            backgroundColor: isAuthenticated
                                ? colors.feedback.error
                                : colors.interactive.primary,
                            opacity: pressed ? 0.9 : (!isAuthenticated && !request) ? 0.5 : 1,
                            transform: [{ scale: pressed ? 0.985 : 1 }],
                        },
                    ]}
                >
                    <Text style={[styles.authButtonText, { color: colors.onInteractive.primary, ...fonts.medium }]}>
                        {isAuthenticated ? t('profile.logout') : t('profile.login')}
                    </Text>
                </Pressable>
            </View>

            {/* Settings */}
            <Text style={[headers.h2, styles.sectionTitle, { opacity: 1 }]}>{t('profile.settings')}</Text>

            {/* Theme */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: colors.border.subtle }]}>
                <Text style={[styles.settingLabel, { color: colors.onSurface.primary, ...fonts.medium }]}>
                    {t('profile.theme')}
                </Text>
                <View style={styles.optionRow}>
                    {themeModes.map(({ key, labelKey }) => {
                        const isActive = mode === key;
                        return (
                            <Pressable
                                key={key}
                                onPress={() => setMode(key)}
                                style={({ pressed }) => [
                                    styles.optionChip,
                                    {
                                        backgroundColor: isActive
                                            ? colors.interactive.primary
                                            : colors.surface.level3,
                                        opacity: pressed ? 0.85 : 1,
                                        transform: [{ scale: pressed ? 0.96 : 1 }],
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            color: isActive
                                                ? colors.onInteractive.primary
                                                : colors.onSurface.secondary,
                                            ...fonts.medium,
                                        },
                                    ]}
                                >
                                    {t(labelKey)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* Language */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: colors.border.subtle }]}>
                <Text style={[styles.settingLabel, { color: colors.onSurface.primary, ...fonts.medium }]}>
                    {t('profile.language')}
                </Text>
                <View style={styles.optionRow}>
                    {languages.map(({ key, labelKey }) => {
                        const isActive = currentLang === key;
                        return (
                            <Pressable
                                key={key}
                                onPress={() => i18n.changeLanguage(key)}
                                style={({ pressed }) => [
                                    styles.optionChip,
                                    {
                                        backgroundColor: isActive
                                            ? colors.interactive.primary
                                            : colors.surface.level3,
                                        opacity: pressed ? 0.85 : 1,
                                        transform: [{ scale: pressed ? 0.96 : 1 }],
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            color: isActive
                                                ? colors.onInteractive.primary
                                                : colors.onSurface.secondary,
                                            ...fonts.medium,
                                        },
                                    ]}
                                >
                                    {t(labelKey)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
        gap: 12,
    },
    pageTitle: {
        marginBottom: 4,
    },
    sectionTitle: {
        marginTop: 12,
    },
    card: {
        borderRadius: 14,
        padding: 16,
        gap: 14,
        borderWidth: StyleSheet.hairlineWidth,
        ...Platform.select({
            android: {
                elevation: 2,
            },
            default: {},
        }),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 20,
    },
    userText: {
        flex: 1,
        gap: 2,
    },
    userName: {
        fontSize: 16,
    },
    userEmail: {
        fontSize: 13,
    },
    notLoggedIn: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 8,
    },
    authButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    authButtonText: {
        fontSize: 15,
    },
    settingLabel: {
        fontSize: 15,
    },
    optionRow: {
        flexDirection: 'row',
        gap: 8,
    },
    optionChip: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 13,
    },
});