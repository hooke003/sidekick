// Importing necessary components and modules from various libraries
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import 'react-native-url-polyfill/auto'

import { images } from "../constants"; // Importing images from a constants file
import CustomButton from "../components/CustomButton"; // Importing a custom button component
import { useGlobalContext } from "../context/GlobalProvider"; // Importing a custom context

// This is the home page of the app
export default function App() {
  // Getting loading and login status from the global context
  const { isLoading, isLoggedIn } = useGlobalContext();

  // If not loading and the user is logged in, redirect to the home page
  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  // The main return statement that defines what is shown on the screen
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-4">
          {/* Displaying the logo */}
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          {/* Displaying a set of cards */}
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            {/* Displaying the main welcome text */}
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            {/* Adding a decorative image */}
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          {/* Displaying a smaller text below the main text */}
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          {/* Displaying a custom button that navigates to the sign-in page */}
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      {/* Setting the status bar style */}
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
