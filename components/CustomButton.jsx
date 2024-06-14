// Importing necessary components from React Native
import { TouchableOpacity, Text } from "react-native";
import React from "react";

// This is a custom button component
const CustomButton = ({
  title, // The text displayed on the button
  handlePress, // Function to handle button press
  containerStyles, // Additional styles for the button container
  textStyles, // Additional styles for the button text
  isLoading, // Boolean to indicate if the button should show a loading state
}) => {
  return (
    // TouchableOpacity is a component that makes its children touchable with feedback
    <TouchableOpacity
      onPress={handlePress} // Assigning the press handler function
      activeOpacity={0.7} // Opacity of button when pressed
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : "" // Reducing opacity if loading
      }`}
      disabled={isLoading} // Disabling the button if loading
    >
      {/* Text component to display the button title */}
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title} {/* Displaying the button title */}
      </Text>
    </TouchableOpacity>
  );
};

// Exporting the CustomButton component so it can be used in other parts of the app
export default CustomButton;

