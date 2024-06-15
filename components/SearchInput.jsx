// Importing necessary hooks and components from React and React Native libraries
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { icons } from "../constants"; // Importing icons from a constants file
import { router, usePathname } from "expo-router"; // Importing router and usePathname from expo-router

// This is the search input component
const SearchInput = ({ initialQuery }) => {
  // Getting the current pathname using usePathname hook
  const pathname = usePathname();
  
  // State to manage the search query input
  const [query, setQuery] = useState(initialQuery || '');

  return (
    // Container for the search input with styling
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      {/* Text input field for entering search query */}
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)} // Updating the query state on text change
      />

      {/* Button to trigger search */}
      <TouchableOpacity
        onPress={() => {
          // Show an alert if the query is empty
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }

          // Navigate to search results if query is not empty
          if (pathname.startsWith("/search")) {
            // If already on the search page, update the query parameter
            router.setParams({ query });
          } else {
            // If not on the search page, navigate to the search page with the query
            router.push(`/search/${query}`);
          }
        }}
      >
        {/* Search icon */}
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

// Exporting the SearchInput component so it can be used in other parts of the app
export default SearchInput;

