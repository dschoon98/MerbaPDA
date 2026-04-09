import { useAppTheme } from '@/constants/theme';
import { PDAMessage } from '@/types/pda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    message: PDAMessage;
    onPress: (message: PDAMessage) => void;
};

function formatTimeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '<1m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
}

export default function MessageCard({ message, onPress }: Props) {
    const { colors, fonts } = useAppTheme();
    const { t } = useTranslation();
    const sv = colors.severity;
    const severityColor = sv[message.severity];
    const severityOnColor =
        message.severity === 'error' ? sv.onError
        : message.severity === 'warning' ? sv.onWarning
        : sv.onInfo;

    const cardStyle = Platform.select({
        ios: {
            backgroundColor: colors.surface.level1 + 'CC',
            borderRadius: 16,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border.subtle,
        },
        default: {
            backgroundColor: colors.surface.level1,
            borderRadius: 12,
            elevation: 2,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
        },
    });

    return (
        <Pressable
            onPress={() => onPress(message)}
            style={({ pressed }) => [
                styles.card,
                cardStyle,
                {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                },
            ]}
        >
            <View style={[styles.severityBar, { backgroundColor: severityColor }]} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        {!message.read && (
                            <View style={[styles.unreadDot, { backgroundColor: severityColor }]} />
                        )}
                        <Text
                            style={[styles.title, { color: colors.onSurface.primary, ...fonts.medium }]}
                            numberOfLines={1}
                        >
                            {message.title}
                        </Text>
                    </View>
                    <View style={styles.metaRow}>
                        <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
                            <Text style={[styles.severityText, { color: severityOnColor, ...fonts.medium }]}>
                                {t(`severity.${message.severity}`)}
                            </Text>
                        </View>
                        <Text style={[styles.time, { color: colors.onSurface.secondary }]}>
                            {formatTimeAgo(message.timestamp)}
                        </Text>
                    </View>
                </View>
                <Text
                    style={[styles.subtitle, { color: colors.onSurface.secondary, ...fonts.regular }]}
                    numberOfLines={2}
                >
                    {message.subtitle}
                </Text>
                <Text style={[styles.group, { color: colors.onSurface.disabled, ...fonts.regular }]}>
                    {message.visgroup} · {message.vislocation}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 6,
        overflow: 'hidden',
    },
    severityBar: {
        width: 4,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    content: {
        flex: 1,
        padding: 14,
        gap: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    title: {
        fontSize: 15,
        flex: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 8,
    },
    severityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    severityText: {
        fontSize: 11,
        textTransform: 'uppercase',
    },
    time: {
        fontSize: 12,
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 18,
    },
    group: {
        fontSize: 11,
    },
});
