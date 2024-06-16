// Importing necessary components and hooks from React and React Native libraries
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";

import { images } from "../../constants"; // Importing images from a constants file
import SearchInput from "../../components/SearchInput"; // Importing a custom search input component
import Trending from "../../components/Trending"; // Importing a custom trending component
import EmptyState from "../../components/EmptyState"; // Importing a custom empty state component
import VideoCard from "../../components/VideoCard"; // Importing a custom video card component
import { getAllPosts, getLatestPosts } from "../../lib/firebase"; // Importing functions to get posts
import useFirebase from "../../lib/useFirebase"; // Importing a custom hook for Firebase
import { useGlobalContext } from "../../context/GlobalProvider"; // Importing global context

// This is the home page component
const Home = () => {
  // Getting user info and functions from the global context
  const { user, setUser, isLoading, setIsLoggedIn } = useGlobalContext();
  
  // Using custom hook to get posts data
  const { data: posts, refetch } = useFirebase(getAllPosts);
  const { data: latestPosts } = useFirebase(getLatestPosts);

  // State to manage refreshing state
  const [refreshing, setRefreshing] = useState(false);
  
  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    await refetch(); // Refetch the posts data
    setRefreshing(false); // Set refreshing state to false
  };

  return (
    // SafeAreaView ensures the content is within the safe area boundaries of the device
    <SafeAreaView className="bg-primary border-2 h-full">
      {/* FlatList for displaying a list of posts */}
      <FlatList
        data={posts} // Data for the list
        keyExtractor={(item) => item.id} // Unique key for each item
        renderItem={({ item, index }) => (
          <VideoCard key={index} video={item} /> // Rendering each video card
        )}
        // Header component for the list
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            {/* Welcome message */}
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back,
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username || "Guest"}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall} // Displaying a small logo
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            {/* Search input component */}
            <SearchInput />
            {/* Latest videos section */}
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} /> 
            </View>
          </View>
        )}
        // Component to display when the list is empty
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Be the first to upload a video"
          />
        )}
        // Refresh control for pull-to-refresh
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

// Exporting the Home component so it can be used in other parts of the app
export default Home;
