import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
  Button
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useCallback } from "react";

import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { getAllPosts, getLatestPosts } from "../../lib/firebase";
import useFirebaseHome from "../../lib/useFirebaseHome";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user } = useGlobalContext();

  const { data: posts, refetch: refetchAllPosts, reset: resetAllPosts, isLoading: isLoadingAllPosts } = useFirebaseHome(getAllPosts);
  const { data: latestPosts, refetch: refetchLatestPosts, reset: resetLatestPosts, isLoading: isLoadingLatestPosts } = useFirebaseHome(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchAllPosts(), refetchLatestPosts()]);
    setRefreshing(false);
  }, [refetchAllPosts, refetchLatestPosts]);

  const handleFullReset = async () => {
    resetAllPosts();
    resetLatestPosts();
    await Promise.all([refetchAllPosts(), refetchLatestPosts()]);
  };

  return (
    <SafeAreaView className="bg-primary border-2 h-full">
      {/* FlatList for displaying a list of posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <VideoCard key={index} video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
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
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} /> 
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          (!isLoadingAllPosts && !posts.length) && (
            <EmptyState
              title="No videos found"
              subtitle="Be the first to upload a video"
            />
          )
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleFullReset} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;

