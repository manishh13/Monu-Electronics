import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import { auth } from "../../FirebaseConfig/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setLocalStorage } from "../../Service/storage";

export default function SignUp() {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onCreateAccount = () => {
    if (email === "" || password === "" || Name === "") {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }

    // Check if password length is less than 6 characters
    if (password.length < 6) {
      ToastAndroid.show(
        "Password must be at least 6 characters",
        ToastAndroid.SHORT
      );
      return;
    }

    console.log("Email", email);
    console.log("Password", password);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        // await updateProfile(user, {
        //   displayName: Name,
        // });

        console.log("User  signed in:", user);
        setLocalStorage("userDetails", user);
        alert("Registration successful");
        router.push("(tabs)");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error", errorCode, errorMessage);
        if (errorCode === "auth/email-already-in-use") {
          ToastAndroid.show("Email already in use", ToastAndroid.SHORT);
        }
      });
  };

  return (
    <View style={{ padding: 25 }}>
      <Text style={styles.textHeader}>Create An Account</Text>

      {/* Name Input */}
      <View style={{ marginTop: 25 }}>
        <Text>Name</Text>
        <TextInput
          onChangeText={(value) => setName(value)}
          placeholder="Full Name"
          style={styles.textInput}
        />
      </View>

      {/* Email Input */}
      <View style={{ marginTop: 25 }}>
        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder="Email"
          style={styles.textInput}
        />
      </View>

      {/* Password Input */}
      <View style={{ marginTop: 25 }}>
        <Text>Password</Text>
        <TextInput
          value={password}
          onChangeText={(value) => setPassword(value)}
          placeholder="Password "
          secureTextEntry={true}
          style={[
            styles.textInput,
            password.length > 0 &&
              password.length < 6 && { borderColor: "red" },
          ]}
        />
        {password.length > 0 && password.length < 6 && (
          <Text style={{ color: "red", marginTop: 5 }}>
            Password must be at least 6 characters
          </Text>
        )}
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onCreateAccount}
        disabled={password.length > 0 && password.length < 6} // Disable button if password is invalid
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          Sign Up
        </Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={() => router.push("login/signin")}
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
            fontSize: 18,
            fontWeight: "bold",
            color: Colors.primary,
            textAlign: "center",
          }}
        >
          Already Have An Account? Sign In
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
