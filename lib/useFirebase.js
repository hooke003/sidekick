import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

const useFirebase = (fn) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    console.log("Fetching data...");
    setIsLoading(true);
    try {
      const response = await fn();
      setData(response);
      console.log("Data fetched successfully:", response);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fn]);

  useEffect(() => {
    console.log("useEffect in useFirebase called");
    fetchData();

    return () => {
      console.log("Cleanup useEffect in useFirebase");
      // Any cleanup if necessary
    };
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};

export default useFirebase;


