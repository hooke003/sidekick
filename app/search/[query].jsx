import { useEffect, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useFirebase from "../../lib/useFirebase";
import { searchPosts } from "../../lib/firebase";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";

const Search = () => {
  const { query } = useLocalSearchParams();

  // Memoize the searchPosts function to avoid re-creating it on each render
  const fetchPosts = useCallback(() => {
    console.log("Fetching posts with query:", query);
    return searchPosts(query);
  }, [query]);

  const { data: posts, isLoading, refetch } = useFirebase(fetchPosts);

  console.log("Render Search component with query:", query);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id} // Unique key for each item
        renderItem={({ item, index }) => (
          <VideoCard key={index} video={item} /> // Rendering each video card
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-gray-100 text-sm">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white mt-1">
              {query}
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </SafeAreaView>
  );
};

export default Search;

