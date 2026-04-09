import { ThemeProvider as AppThemeProvider, useAppTheme } from "@/constants/theme";
import '@/i18n';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutContent />
    </AppThemeProvider>
  );
}

export function RootLayoutContent() {
  const { colors, isDark } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.level0 }} edges={["top", "left", "right"]}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <View style={{ flex: 1, backgroundColor: colors.surface.level0 }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface.level0 } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}