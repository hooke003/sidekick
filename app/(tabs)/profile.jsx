import { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts } from "../../lib/appwrite";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Profile = () => {
  const { user, isLoading } = useGlobalContext();

  // Defensive check to ensure user is defined
  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white">No user found</Text>
      </SafeAreaView>
    );
  }

  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center">
            {/* Profile header can go here */}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this user"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;