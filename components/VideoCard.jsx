// Importing necessary components and modules from React and React Native libraries
import { icons } from "../constants"; // Importing icons from a constants file
import { Video, ResizeMode } from "expo-av"; // Importing Video component from expo-av
import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

// This component represents a video card
const VideoCard = ({
  video: {
    title, // Title of the video
    thumbnail, // Thumbnail image URL of the video
    video, // Video URL
    creator: { username, avatar }, // Creator's username and avatar
  },
}) => {
  // State to manage video play status
  const [play, setPlay] = useState(false);

  return (
    // Container for the video card
    <View className="flex-col items-center px-4 mb-14">
      {/* Header section with creator info */}
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          {/* Creator's avatar */}
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          {/* Creator's username and video title */}
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        {/* Menu icon */}
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {/* Video or thumbnail with play button */}
      {play ? (
        <Video
          source={{ uri: video }} // Video URL
          className="w-full h-60 rounded-xl mt-3"
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)} // Play video on press
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }} // Thumbnail image URL
            className="w-full h-full rounded-xl mt-3"
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
    </View>
  );
};

// Exporting the VideoCard component so it can be used in other parts of the app
export default VideoCard;

