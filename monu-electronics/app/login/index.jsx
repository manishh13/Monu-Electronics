import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View>
      <View style={{ diplay: "flex", alignItems: "center" }}>
        <Image
          style={{ width: "100%", height: "450" }}
          source={require("../../assets/images/2149067226.jpg")}
        />
      </View>

      <View
        style={{ padding: 25, backgroundColor: Colors.primary, height: "100%" }}
      >
        <Text
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          Monu Electronics Services
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/login/signin")}
          style={{
            backgroundColor: "white",
            padding: 15,
            borderRadius: 99,
            marginTop: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: Colors.primary,

              textAlign: "center",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
