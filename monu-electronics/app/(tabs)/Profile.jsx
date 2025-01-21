import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { removeLocalStorage } from "../../Service/storage";
import { auth } from "../../FirebaseConfig/firebaseConfig";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  // Get the current user from Firebase
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const currentUser = () => {
    const user = auth.currentUser;

    setUser(user ? user.displayName : "John Doe"); // Dynamic username
    setEmail(user ? user.email : "johndoe@example.com"); // Dynamic email
  };
  useEffect(() => {
    currentUser();
  }, []);

  // Handle logout functionality
  const handleLogout = () => {
    console.log("click me to log out");
    removeLocalStorage(); // Remove local storage data
    auth.signOut(); // Sign out the user from Firebase
    router.push("/login"); // Redirect to login page
  };

  // Handle update password functionality
  const handleUpdatePassword = () => {
    console.log("click me to update password");

    Alert.prompt(
      "Update Password",
      "Enter your new password:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: (newPassword) => {
            if (newPassword && newPassword.length >= 6) {
              user
                .updatePassword(newPassword)
                .then(() => {
                  Alert.alert("Success", "Password updated successfully!");
                })
                .catch((error) => {
                  Alert.alert("Error", error.message);
                });
            } else {
              Alert.alert(
                "Error",
                "Password must be at least 6 characters long."
              );
            }
          },
        },
      ],
      "secure-text" // Input type for password
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image
        source={{
          uri: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.1061501047.1705837116&semt=ais_hybrid",
        }} // Placeholder image URL
        style={styles.profileImage}
      />

      {/* Username */}
      <Text style={styles.username}>{user}</Text>

      {/* Email */}
      <Text style={styles.email}>{email}</Text>

      {/* Update Password Button */}
      <TouchableOpacity
        style={styles.updatePasswordButton}
        onPress={handleUpdatePassword}
      >
        <Text style={styles.updatePasswordButtonText}>Update Password</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the Profile Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5", // Light background color
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular image
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ccc", // Light border for the image
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Dark text color
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  updatePasswordButton: {
    backgroundColor: "#4CAF50", // Green background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  updatePasswordButtonText: {
    color: "#fff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4444", // Red background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
});
