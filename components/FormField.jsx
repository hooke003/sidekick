// Importing necessary hooks and components from React and React Native
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants"; // Importing icons from a constants file

// This is a custom form field component
const FormField = ({
  title, // The title or label of the form field
  value, // The value of the input field
  placeholder, // Placeholder text for the input field
  handleChangeText, // Function to handle text changes
  otherStyles, // Additional styles for the container
  ...props // Spread operator to accept other props
}) => {
  // State to manage visibility of password
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Container for the form field with space between elements
    <View className={`space-y-2 ${otherStyles}`}>
      {/* Label for the form field */}
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      {/* Container for the input field with background and border styles */}
      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        {/* Input field */}
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword} // Hide text for password fields
          {...props}
        />

        {/* Toggle button to show or hide password */}
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide} // Switch icon based on showPassword state
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Exporting the FormField component so it can be used in other parts of the app
export default FormField;

