import MessageCard from '@/components/MessageCard';
import MessageListHeader from '@/components/MessageListHeader';
import MessageSheet from '@/components/MessageSheet';
import { useAppTheme } from '@/constants/theme';
import { useMessageStore } from '@/stores/messageStore';
import { PDAMessage, Severity } from '@/types/pda';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function Home() {
    const { colors, fonts } = useAppTheme();
    const { t } = useTranslation();
    const sheetRef = useRef<TrueSheet>(null);

    const messages = useMessageStore((s) => s.messages);
    const setSelectedMessage = useMessageStore((s) => s.setSelectedMessage);
    const refreshMessages = useMessageStore((s) => s.refreshMessages);

    const [filter, setFilter] = useState<Severity | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const filteredMessages = useMemo(() => {
        const sorted = [...messages].sort((a, b) => b.timestamp - a.timestamp);
        if (!filter) return sorted;
        return sorted.filter((m) => m.severity === filter);
    }, [messages, filter]);

    const unreadCount = useMemo(
        () => messages.filter((m) => !m.read).length,
        [messages],
    );

    const handleCardPress = useCallback(
        (message: PDAMessage) => {
            setSelectedMessage(message);
            sheetRef.current?.present();
        },
        [setSelectedMessage],
    );

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        refreshMessages();
        setTimeout(() => setRefreshing(false), 600);
    }, [refreshMessages]);

    const renderItem = useCallback(
        ({ item }: { item: PDAMessage }) => (
            <MessageCard message={item} onPress={handleCardPress} />
        ),
        [handleCardPress],
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.surface.level0 }]}>
            <FlatList
                data={filteredMessages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={
                    <MessageListHeader
                        filter={filter}
                        onFilterChange={setFilter}
                        unreadCount={unreadCount}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={[styles.emptyText, { color: colors.onSurface.secondary, ...fonts.regular }]}>
                            {t('home.noMessages')}
                        </Text>
                    </View>
                }
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.interactive.primary}
                        colors={[colors.interactive.primary]}
                    />
                }
            />
            <MessageSheet ref={sheetRef} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        paddingBottom: 20,
    },
    empty: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 15,
    },
});