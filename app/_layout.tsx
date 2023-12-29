import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, SafeAreaView, StatusBar, Platform, useColorScheme} from 'react-native';
import { colors } from '../assets/colors';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      throw error
    };
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  let colorScheme = useColorScheme();
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          
          options={{
            header: () => (
              <SafeAreaView style={[styles.SafeAreaView, {backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light}]}>
                <Image
                    style={styles.logo}
                    source={require('../assets/images/header.png')}
                  />
              </SafeAreaView>
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}


const styles = StyleSheet.create({
  SafeAreaView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logo: {
    height: 60,
    width: 200,
  },
});