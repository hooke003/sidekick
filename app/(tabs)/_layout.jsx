// Importing necessary components and modules from React Native and other libraries
import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";

import { icons } from "../../constants"; // Importing icons from a constants file

// This file allows you to navigate pages using the bottom navigation bar

// This is a component for the tab icon that shows the icon and name of the tab
const TabIcon = ({ icon, color, name, focused }) => {
  return (
    // A view to contain the icon and text, with some styling for alignment
    <View className="items-center justify-center gap-2">
      {/* Displaying the icon */}
      <Image 
        source={icon} 
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      {/* Displaying the name of the tab, changing style if it's focused */}
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{color: color}}>
        {name}
      </Text>
    </View>
  );
};

// This is the main layout for the tabs
const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          // Setting common options for all tabs
          tabBarShowLabel: false, // Hides the default tab labels
          tabBarActiveTintColor: '#FFA001', // Color of the active tab icon
          tabBarInactiveTintColor: '#CDCDE0', // Color of the inactive tab icons
          tabBarStyle: {
            backgroundColor: '#161622', // Background color of the tab bar
            borderTopWidth: 1, // Width of the top border of the tab bar
            borderTopColor: '#232533', // Color of the top border of the tab bar
            height: 84, // Height of the tab bar
          }
        }}
      >
        {/* Defining each tab screen */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home", // Title of the tab
            headerShown: false, // Hides the header
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home} // Icon for the home tab
                color={color} // Color for the icon and text
                name="Home" // Name of the tab
                focused={focused} // Whether the tab is focused
              />
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: "Shop",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark} // Icon for the bookmark tab
                color={color}
                name="Shop"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus} // Icon for the create tab
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile} // Icon for the profile tab
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

// Exporting the TabsLayout component so it can be used in other parts of the app
export default TabsLayout;

