// Importing necessary components and modules from React Native and other libraries
import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// This is the layout for authentication (sign-in and sign-up) pages
const AuthLayout = () => {
  return (
    <>
      {/* Stack Navigator to handle navigation between sign-in and sign-up screens */}
      <Stack>
        {/* Defining the sign-in screen */}
        <Stack.Screen 
          name="sign-in"
          options={{
            headerShown: false // Hides the header for this screen
          }}
        />
        {/* Defining the sign-up screen */}
        <Stack.Screen 
          name="sign-up"
          options={{
            headerShown: false // Hides the header for this screen
          }}
        />
      </Stack>

      {/* Setting the status bar style */}
      <StatusBar backgroundColor="#161622" style="light"/>
    </>
  );
};

// Exporting the AuthLayout component so it can be used in other parts of the app
export default AuthLayout;
