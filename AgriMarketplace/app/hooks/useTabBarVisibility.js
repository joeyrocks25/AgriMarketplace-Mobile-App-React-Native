// useTabBarVisibility.js
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const useTabBarVisibility = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: true,
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: false,
      });
    });

    return unsubscribe;
  }, [navigation]);
};

export default useTabBarVisibility;
