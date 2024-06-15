// Importing necessary components and hooks from React and React Native libraries
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from "react-native";
import React, { useState } from "react";
import * as Animatable from 'react-native-animatable'; // Importing animation library
import { icons } from "../constants"; // Importing icons from a constants file
import { Video, ResizeMode } from "expo-av"; // Importing Video component from expo-av

// Defining animation for zooming in
const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

// Defining animation for zooming out
const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

// This component represents an individual trending item (video or thumbnail)
const TrendingItem = ({ activeItem, item }) => {
  // State to manage video play status
  const [play, setPlay] = useState(false);

  return (
    // Animatable view to handle animations
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        // If play is true, show the video
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            // Stop playing when the video finishes
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        // If play is false, show the thumbnail with a play button
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          {/* Play button on the thumbnail */}
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

// This component represents the list of trending items
const Trending = ({ posts }) => {
  // State to manage the currently active item
  const [activeItem, setActiveItem] = useState(posts[0]);

  // Function to handle the change of viewable items
  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    // FlatList to display the list of trending items horizontally
    <FlatList
      data={posts} // Data for the list
      horizontal // Display the list horizontally
      keyExtractor={(item) => item.$id} // Unique key for each item
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} /> // Render each trending item
      )}
      onViewableItemsChanged={viewableItemsChanged} // Handle viewable items change
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70, // Threshold for item visibility
      }}
      contentOffset={{ x: 170 }} // Initial scroll offset
    />
  );
};

// Exporting the Trending component so it can be used in other parts of the app
export default Trending;
