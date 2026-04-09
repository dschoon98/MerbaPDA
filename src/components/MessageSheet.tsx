import { ThemeColors, ThemeFonts, useAppTheme } from '@/constants/theme';
import { useMessageStore } from '@/stores/messageStore';
import { EvilIcons } from '@expo/vector-icons';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import React, { forwardRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
    onAcknowledge?: () => void;
};

const MessageSheet = forwardRef<TrueSheet, Props>(({ onAcknowledge }, ref) => {
    const { colors, fonts, headers } = useAppTheme();
    const { t } = useTranslation();
    const selectedMessage = useMessageStore((s) => s.selectedMessage);
    const markAsRead = useMessageStore((s) => s.markAsRead);
    const [responseText, setResponseText] = useState('');
    const [showResponse, setShowResponse] = useState(false);

    const handleAcknowledge = useCallback(() => {
        if (selectedMessage) {
            markAsRead(selectedMessage.id);
        }
        setShowResponse(false);
        setResponseText('');
        onAcknowledge?.();
        if (ref && 'current' in ref) {
            ref.current?.dismiss();
        }
    }, [selectedMessage, markAsRead, onAcknowledge, ref]);

    const handleSendResponse = useCallback(() => {
        if (selectedMessage && responseText.trim()) {
            markAsRead(selectedMessage.id);
            // In production: send responseText to backend
        }
        setShowResponse(false);
        setResponseText('');
        onAcknowledge?.();
        if (ref && 'current' in ref) {
            ref.current?.dismiss();
        }
    }, [selectedMessage, responseText, markAsRead, onAcknowledge, ref]);

    if (!selectedMessage) return null;

    const sv = colors.severity;
    const severityColor = sv[selectedMessage.severity];
    const severityOnColor =
        selectedMessage.severity === 'error' ? sv.onError
        : selectedMessage.severity === 'warning' ? sv.onWarning
        : sv.onInfo;

    return (
        <TrueSheet
            ref={ref}
            detents={['auto', 1]}
            cornerRadius={20}
            grabber={Platform.OS === 'ios'}
            backgroundColor={colors.surface.level1}
            onDidDismiss={() => {
                setShowResponse(false);
                setResponseText('');
            }}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.severityIndicator, { backgroundColor: severityColor }]} />
                    <View style={styles.headerText}>
                        <Text style={[headers.h3, { color: colors.onSurface.primary, opacity: 1 }]} numberOfLines={2}>
                            {selectedMessage.title}
                        </Text>
                        <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
                            <Text style={[styles.badgeText, { color: severityOnColor, ...fonts.medium }]}>
                                {t(`severity.${selectedMessage.severity}`)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.onSurface.secondary, ...fonts.medium }]}>
                        {t('sheet.description')}
                    </Text>
                    <Text style={[styles.body, { color: colors.onSurface.primary, ...fonts.regular }]}>
                        {selectedMessage.description}
                    </Text>
                </View>

                {/* Full Message (say) */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.onSurface.secondary, ...fonts.medium }]}>
                        {t('sheet.fullMessage')}
                    </Text>
                    <Text style={[styles.body, { color: colors.onSurface.primary, ...fonts.regular }]}>
                        {selectedMessage.say}
                    </Text>
                </View>

                {/* Metadata */}
                <View style={[styles.metaGrid, { borderColor: colors.border.subtle }]}>
                    <MetaItem label={t('sheet.group')} value={`${selectedMessage.visgroup} (${selectedMessage.groupid})`} colors={colors} fonts={fonts} />
                    <MetaItem label={t('sheet.location')} value={`${selectedMessage.vislocation} (${selectedMessage.locationid})`} colors={colors} fonts={fonts} />
                    <MetaItem label={t('sheet.systemPart')} value={String(selectedMessage.systempartid)} colors={colors} fonts={fonts} />
                    <MetaItem label={t('sheet.status')} value={String(selectedMessage.statusid)} colors={colors} fonts={fonts} />
                </View>

                {/* Response area */}
                {showResponse && (
                    <View style={styles.responseSection}>
                        <TextInput
                            style={[
                                styles.responseInput,
                                {
                                    color: colors.onSurface.primary,
                                    backgroundColor: colors.surface.level2,
                                    borderColor: colors.border.default,
                                    ...fonts.regular,
                                },
                            ]}
                            placeholder={t('sheet.responsePlaceholder')}
                            placeholderTextColor={colors.onSurface.disabled}
                            value={responseText}
                            onChangeText={setResponseText}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                        <Pressable
                            onPress={handleSendResponse}
                            style={({ pressed }) => [
                                styles.button,
                                styles.sendButton,
                                {
                                    backgroundColor: colors.interactive.primary,
                                    opacity: pressed ? 0.9 : 1,
                                    transform: [{ scale: pressed ? 0.985 : 1 }],
                                },
                            ]}
                        >
                            <Text style={{...styles.buttonText, color: colors.onInteractive.primary, ...fonts.medium}}>
                                {t('sheet.send')}
                            </Text>
                            <EvilIcons name='arrow-up' size={20} color={colors.onInteractive.primary} style={{ marginLeft: 6 }} />
                        </Pressable>
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <Pressable
                        onPress={handleAcknowledge}
                        style={({ pressed }) => [
                            styles.button,
                            {
                                backgroundColor: colors.feedback.success,
                                opacity: pressed ? 0.9 : 1,
                                transform: [{ scale: pressed ? 0.985 : 1 }],
                            },
                        ]}
                    >
                        <Text style={[styles.buttonText, { color: colors.feedback.onSuccess, ...fonts.medium }]}>
                            {t('sheet.acknowledge')}
                        </Text>
                    </Pressable>
                    {!showResponse && (
                        <Pressable
                            onPress={() => setShowResponse(true)}
                            style={({ pressed }) => [
                                styles.button,
                                styles.outlineButton,
                                {
                                    borderColor: colors.interactive.primary,
                                    opacity: pressed ? 0.9 : 1,
                                    transform: [{ scale: pressed ? 0.985 : 1 }],
                                },
                            ]}
                        >
                            <Text style={[styles.buttonText, { color: colors.interactive.primary, ...fonts.medium }]}>
                                {t('sheet.respond')}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </TrueSheet>
    );
});

function MetaItem({ label, value, colors, fonts }: {
    label: string;
    value: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
}) {
    return (
        <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: colors.onSurface.secondary, ...fonts.medium }]}>
                {label}
            </Text>
            <Text style={[styles.metaValue, { color: colors.onSurface.primary, ...fonts.regular }]}>
                {value}
            </Text>
        </View>
    );
}

MessageSheet.displayName = 'MessageSheet';

export default MessageSheet;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    severityIndicator: {
        width: 4,
        borderRadius: 2,
        alignSelf: 'stretch',
    },
    headerText: {
        flex: 1,
        gap: 6,
    },
    severityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        textTransform: 'uppercase',
    },
    section: {
        gap: 4,
    },
    label: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    body: {
        fontSize: 14,
        lineHeight: 20,
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 12,
        gap: 12,
    },
    metaItem: {
        width: '46%',
        gap: 2,
    },
    metaLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    metaValue: {
        fontSize: 14,
    },
    responseSection: {
        gap: 10,
    },
    responseInput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        minHeight: 80,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    sendButton: {
        flex: undefined,
        alignSelf: 'stretch',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
    },
    buttonText: {
        fontSize: 15,
    },
});
