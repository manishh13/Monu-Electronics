import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { getLocalStorage } from "../../Service/storage";
import { auth } from "../../FirebaseConfig/firebaseConfig";
import Colors from "../../constant/Colors";
export default function TabLayout() {
  // const [authenticated, setAuthenticated] = useState(null);
  const router = useRouter();
  const getUserDetails = async () => {
    const userInfo = await getLocalStorage("userDetails");
    if (!userInfo) {
      router.replace("/login");
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     const uid = user.uid;
  //     console.log("User is signed in", uid);
  //     setAuthenticated(true);
  //     // ...
  //   } else {
  //     router.replace("/login");
  //     setAuthenticated(false);
  //     // User is signed out
  //   }
  // });

  // useEffect(() => {
  //   if (authenticated === false) {
  //     router.replace("/login");
  //   }
  // }, [authenticated]);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesome name="home" size={size} color={Colors.primary} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="Add_New"
        options={{
          tabBarLabel: "Add New",
          tabBarIcon: ({ color, size }) => {
            return (
              <Octicons name="diff-added" size={size} color={Colors.primary} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => {
            return (
              <Octicons name="search" size={size} color={Colors.primary} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesome6 name="user" size={size} color={Colors.primary} />
            );
          },
        }}
      />
    </Tabs>
  );
}
