// Importing necessary modules and components from React Native and other libraries
import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { SplashScreen, Slot, Stack } from "expo-router";
import { useFonts } from "expo-font";
import GlobalProvider from "../context/GlobalProvider";

// This makes sure the splash screen (the first screen you see when the app opens) doesn't hide automatically
SplashScreen.preventAutoHideAsync();

// Defining the main part of the app
const RootLayout = () => {
  // Loading custom fonts and handling any errors
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  // This runs after the component mounts (is added to the screen). UseEffect allows us to preform actions while the page is loading
  useEffect(() => {
    // If there is an error loading the fonts, throw an error
    if (error) throw error;

    // If the fonts are loaded successfully, hide the splash screen
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // If the fonts are not loaded yet, return nothing (null)
  if (!fontsLoaded) {
    return null;
  }

  // If the fonts are not loaded and there is no error, return nothing (null)
  if (!fontsLoaded && !error) {
    return null;
  }

  // The main return statement that defines what is shown on the screen
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

// Exporting the RootLayout component so it can be used in other parts of the app
export default RootLayout;