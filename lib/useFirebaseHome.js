// Importing necessary modules from React and React Native libraries
import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

// Custom hook for fetching data from Firebase
const useFirebaseHome = (fetchFunction) => {
  // State to manage the fetched data
  const [data, setData] = useState([]);
  // State to manage the loading state
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await fetchFunction(); // Call the provided function to get data
      setData(response); // Set the fetched data
    } catch (error) {
      // Show an alert if there is an error
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  }, [fetchFunction]);

  // Function to reset data
  const resetData = () => {
    setData([]); // Clear data
    setIsLoading(true); // Set loading state to true
  };

  // useEffect to fetch data when the component mounts or when fetchFunction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return the data, loading state, a function to refetch data, and a function to reset data
  return { data, isLoading, refetch: fetchData, reset: resetData };
};

// Exporting the custom hook so it can be used in other parts of the app
export default useFirebaseHome;
