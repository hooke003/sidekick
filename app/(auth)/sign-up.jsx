// Importing necessary hooks and components from React and React Native libraries
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, Image } from "react-native";

import { images } from "../../constants"; // Importing images from a constants file
import { createUser } from "../../lib/firebase"; // Importing a function to create a new user
import FormField from '../../components/FormField'; // Importing a custom form field component
import CustomButton from '../../components/CustomButton'; // Importing a custom button component
import { useGlobalContext } from "../../context/GlobalProvider"; // Importing global context

// This is the sign-up page component
const SignUp = () => {
  // Getting functions to set user and login status from the global context
  const { setUser, setIsLoggedIn } = useGlobalContext();
  
  // State to manage loading state of the form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to manage the form inputs
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Function to handle form submission
  const submit = async () => {
    // Check if all fields are filled
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return; // Return early if fields are not filled
    }

    // Set loading state to true
    setIsSubmitting(true);
    try {
      // Try to create a new user with the form inputs
      const result = await createUser(form.email, form.password, form.username);
      // Set the user in the global context
      setUser(result);
      // Set logged in status in the global context
      setIsLoggedIn(true);
      // Redirect to home page
      router.replace('/home');
    } catch (error) {
      // Show an error alert if sign-up fails
      Alert.alert('Error', error.message);
    } finally {
      // Set loading state to false
      setIsSubmitting(false);
    }
  };

  return (
    // SafeAreaView ensures the content is within the safe area boundaries of the device
    <SafeAreaView className="bg-primary h-full">
      {/* ScrollView allows the content to be scrollable */}
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          {/* Displaying the logo */}
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          {/* Displaying the title text */}
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign up for Sidekick
          </Text>
          {/* Username input field */}
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
          {/* Email input field */}
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          {/* Password input field */}
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          {/* Sign Up button */}
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          {/* Link to sign-in page */}
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary-100"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Exporting the SignUp component so it can be used in other parts of the app
export default SignUp;

