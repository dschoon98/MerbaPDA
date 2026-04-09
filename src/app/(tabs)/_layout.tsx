import { useAppTheme } from '@/constants/theme'
import { useMessageStore } from '@/stores/messageStore'
import { NativeTabs } from 'expo-router/build/native-tabs/NativeTabs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const TabLayoutContent = () => {
    const { colors } = useAppTheme();
    const { t } = useTranslation();
    const messages = useMessageStore((s) => s.messages);
    const unreadCount = useMemo(
        () => messages.filter((m) => !m.read).length,
        [messages],
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "bottom"]}>
            <View style={{ flex: 1 }}>
                <NativeTabs
                    minimizeBehavior="onScrollDown"
                    backgroundColor={colors.background}
                    iconColor={Platform.OS === 'android' ? colors.onSurface.secondary : undefined}
                    tintColor={Platform.OS === 'android' ? colors.brand.primary : undefined}
                    indicatorColor={Platform.OS === 'android' ? colors.surface.level4 : undefined}
                    badgeBackgroundColor={Platform.OS === 'android' ? colors.accent.primary : undefined}
                    badgeTextColor={Platform.OS === 'android' ? colors.onAccent.primary : undefined}
                    rippleColor={'transparent'}
                >
                    <NativeTabs.Trigger name="home" >
                        <NativeTabs.Trigger.Label>{t('home.label')}</NativeTabs.Trigger.Label>
                        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
                        {
                            unreadCount > 0 && (
                                <NativeTabs.Trigger.Badge >
                                    {unreadCount.toString()}
                                </NativeTabs.Trigger.Badge>
                            )
                        }
                    </NativeTabs.Trigger>
                    <NativeTabs.Trigger name="profile">
                        <NativeTabs.Trigger.Label>{t('profile.label')}</NativeTabs.Trigger.Label>
                        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
                    </NativeTabs.Trigger>
                </NativeTabs>
            </View>
        </SafeAreaView>
    )
}

export default TabLayoutContent