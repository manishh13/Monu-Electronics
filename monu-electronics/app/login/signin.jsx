import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { auth } from "../../FirebaseConfig/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setLocalStorage } from "../../Service/storage";

export default function Sign_in() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();
  const onSignIn = () => {
    if (email === "" || password === "") {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }
    console.log("Email", email);
    console.log("Password", password);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);
        await setLocalStorage("userDetails", user);
        router.replace("/(tabs)");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/invalid-credentials") {
          ToastAndroid.show("Invalid email or password", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Error", ToastAndroid.SHORT);
        }
      });
  };
  return (
    <View style={{ padding: 25 }}>
      <Text style={styles.textHeader}>Let's Sign You In</Text>
      <Text style={styles.subText}>Welcome Back</Text>
      <Text style={styles.subText}>You've been Missed</Text>
      <View style={{ marginTop: 25 }}>
        <Text>Email</Text>
        <TextInput
          onChangeText={(value) => {
            setEmail(value);
          }}
          placeholder="Email"
          style={styles.textInput}
        />
      </View>
      <View style={{ marginTop: 25 }}>
        <Text>Password</Text>
        <TextInput
          onChangeText={(value) => {
            setPassword(value);
          }}
          placeholder="Password"
          secureTextEntry={true}
          style={styles.textInput}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => onSignIn()}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/login/signup")}
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 10,
          marginTop: 35,
          display: "flex",
          alignItems: "center",

          borderWidth: 1,
          borderColor: Colors.primary,
          marginTop: 15,
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
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  textHeader: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.Gray,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    fontSize: 17,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 35,
    display: "flex",
    alignItems: "center",
  },
});
