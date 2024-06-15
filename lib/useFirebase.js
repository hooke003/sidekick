// Importing necessary modules from React and React Native libraries
import { Alert } from "react-native";
import { useEffect, useState } from "react";

// This is a custom hook for fetching data from Firebase
const useFirebase = (fn) => {
  // State to manage the fetched data
  const [data, setData] = useState([]);
  
  // State to manage the loading state
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch data
  const fetchData = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await fn(); // Call the provided function to get data
      setData(response); // Set the fetched data
    } catch (error) {
      // Show an alert if there is an error
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // useEffect to fetch data when the component mounts or when the provided function changes
  useEffect(() => {
    fetchData();
  }, [fn]);

  const refetch = () => fetchData();

  // Return the data, loading state, and a function to refetch data
  return { data, isLoading, refetch};
};

// Exporting the custom hook so it can be used in other parts of the app
export default useFirebase;
