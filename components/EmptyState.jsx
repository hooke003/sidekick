// Importing necessary components and modules from React and React Native libraries
import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants"; // Importing images from a constants file
import CustomButton from "./CustomButton"; // Importing a custom button component
import { router } from "expo-router"; // Importing router from expo-router

// This component represents an empty state view
const EmptyState = ({ title, subtitle }) => {
  return (
    // Container for the empty state with centered content
    <View className="justify-center items-center px-4">
      {/* Displaying an image for the empty state */}
      <Image
        source={images.empty} // Source of the empty state image
        className="w-[270px] h-[215px]" // Width and height of the image
        resizeMode="contain" // Resize mode for the image
      />
      {/* Displaying the title text */}
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {title}
      </Text>
      {/* Displaying the subtitle text */}
      <Text className="font-pmedium text-sm text-gray-100">
        {subtitle}
      </Text>
      {/* Custom button to navigate to the create video page */}
      <CustomButton 
         title="Create video" // Button text
         handlePress={() => router.push('/create')} // Function to handle button press
         containerStyles="w-full my-5" // Additional styles for the button container
      />
    </View>
  );
};

// Exporting the EmptyState component so it can be used in other parts of the app
export default EmptyState;

