import { useAppTheme } from '@/constants/theme';
import { Severity } from '@/types/pda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    filter: Severity | null;
    onFilterChange: (filter: Severity | null) => void;
    unreadCount: number;
};

const FILTERS: { key: Severity | null; labelKey: string }[] = [
    { key: null, labelKey: 'home.filterAll' },
    { key: 'error', labelKey: 'home.filterError' },
    { key: 'warning', labelKey: 'home.filterWarning' },
    { key: 'info', labelKey: 'home.filterInfo' },
];

export default function MessageListHeader({ filter, onFilterChange, unreadCount }: Props) {
    const { colors, fonts, headers } = useAppTheme();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={[headers.h1, { opacity: 1 }]}>{t('home.title')}</Text>
                {unreadCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.accent.primary }]}>
                        <Text style={[styles.badgeText, { color: colors.onAccent.primary, ...fonts.bold }]}>
                            {unreadCount}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.filterRow}>
                {FILTERS.map(({ key, labelKey }) => {
                    const isActive = filter === key;
                    return (
                        <Pressable
                            key={labelKey}
                            onPress={() => onFilterChange(key)}
                            style={({ pressed }) => [
                                styles.chip,
                                {
                                    backgroundColor: isActive
                                        ? colors.interactive.primary
                                        : colors.surface.level2,
                                    opacity: pressed ? 0.85 : 1,
                                    transform: [{ scale: pressed ? 0.96 : 1 }],
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.chipText,
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
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        gap: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    badge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        fontSize: 12,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
    },
    chipText: {
        fontSize: 13,
    },
});
