import { ThemeProvider as AppThemeProvider, useAppTheme } from "@/constants/theme";
import { Stack } from 'expo-router';
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
  const { colors } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.level0 }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1, backgroundColor: colors.surface.level0 }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface.level0 } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}