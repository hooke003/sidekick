import React from 'react';
import { View, Text, Image } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { UserIcon, HomeIcon, PlusCircleIcon, ShoppingBagIcon, ChatBubbleOvalLeftIcon } from 'react-native-heroicons/solid'; // Imported from react-native-heroicons

// This is a component for the tab icon that shows the icon and name of the tab
const TabIcon = ({ icon, IconComponent, color, name, focused }) => {
  return (
    // A view to contain the icon and text, with some styling for alignment
    <View className="items-center justify-center gap-2">
      {/* Displaying the icon, either from an Image or a component */}
      {IconComponent ? (
        <IconComponent color={color} className="w-6 h-6" size={30} />
      ) : (
        <Image 
          source={icon} 
          resizeMode="contain"
          style={{ tintColor: color }}
          className="w-6 h-6"
        />
      )}
      {/* Displaying the name of the tab, changing style if it's focused */}
      <Text className={`${focused ? 'font-semibold' : 'font-regular'} text-xs`} style={{ color }}>
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
                IconComponent={HomeIcon} // Component for the home icon
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
                IconComponent={ShoppingBagIcon} // Component for the create icon
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
                IconComponent={PlusCircleIcon} // Component for the create icon
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
                IconComponent={UserIcon} // Component for the user icon
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={ChatBubbleOvalLeftIcon} // Component for the user icon
                color={color}
                name="Messages"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      {/* Setting the status bar style */}
      <StatusBar backgroundColor="#161622" style="light"/>
    </>
  );
};



// Exporting the TabsLayout component so it can be used in other parts of the app
export default TabsLayout;
