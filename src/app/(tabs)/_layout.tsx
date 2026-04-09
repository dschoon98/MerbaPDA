import { useAppTheme } from '@/constants/theme'
import { NativeTabs } from 'expo-router/build/native-tabs/NativeTabs'
import { Platform, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const TabLayoutContent = () => {
    const { colors } = useAppTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.level1 }} edges={["left", "right", "bottom"]}>
            <View style={{ flex: 1, backgroundColor: colors.surface.level0 }}>
                <NativeTabs
                    minimizeBehavior="onScrollDown"
                    backgroundColor={colors.surface.level0}
                    iconColor={Platform.OS === 'android' ? colors.onSurface.secondary : undefined}
                    tintColor={Platform.OS === 'android' ? colors.brand.primary : undefined}
                    indicatorColor={Platform.OS === 'android' ? colors.brand.primary + '28' : undefined}
                    badgeBackgroundColor={Platform.OS === 'android' ? colors.accent.primary : undefined}
                    badgeTextColor={Platform.OS === 'android' ? colors.onAccent.primary : undefined}
                    rippleColor={'transparent'}
                >
                    <NativeTabs.Trigger name="home">
                        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
                    </NativeTabs.Trigger>
                    <NativeTabs.Trigger name="profile">
                        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
                    </NativeTabs.Trigger>
                </NativeTabs>
            </View>
        </SafeAreaView>
    )
}

export default TabLayoutContent