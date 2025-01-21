import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import { auth } from "../../FirebaseConfig/firebaseConfig";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState();
  const [email, setEmail] = useState(null);
  const [boxSize, setBoxSize] = useState(
    (Dimensions.get("window").width - 50) / 2 // Adjusted for 2 boxes per row
  );

  const currentUser = () => {
    const user = auth.currentUser;
    setUser(user ? user?.displayName : "John Doe"); // Dynamic username
    setEmail(user ? user?.email : "johndoe@example.com"); // Dynamic email
  };

  useEffect(() => {
    currentUser();
  }, []);

  useEffect(() => {
    const updateBoxSize = () => {
      const screenWidth = Dimensions.get("window").width;
      setBoxSize((screenWidth - 50) / 2); // Adjust box size for 2 boxes per row
    };

    const subscription = Dimensions.addEventListener("change", updateBoxSize);

    return () => {
      subscription?.remove(); // Clean up event listener
    };
  }, []);

  const handleTechnicianPress = () => {
    router.push("/pages/Technician");
  };
  const handleDues = () => {
    router.push("/pages/Dues");
  };
  const handlePendingCases = () => {
    router.push("/pages/PendingCases");
  };
  const handleCompletedCases = () => {
    router.push("/pages/CompleteCases");
  };

  return (
    <>
      {/* Header Section */}
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Monu Electronics</Text>
          <Text style={styles.userName}>Welcome, {email}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.container}>
          {/* Box 1 */}
          <TouchableOpacity onPress={handleTechnicianPress}>
            <View style={[styles.box, { width: boxSize, height: boxSize }]}>
              <Text style={styles.boxText}>Technicians</Text>
            </View>
          </TouchableOpacity>

          {/* Box 2 */}
          <TouchableOpacity onPress={handleDues}>
            <View style={[styles.box, { width: boxSize, height: boxSize }]}>
              <Text style={styles.boxText}>Dues</Text>
            </View>
          </TouchableOpacity>

          {/* Box 3 */}
          <TouchableOpacity onPress={handlePendingCases}>
            <View style={[styles.box, { width: boxSize, height: boxSize }]}>
              <Text style={styles.boxText}>Pending Cases</Text>
            </View>
          </TouchableOpacity>

          {/* Box 4 */}
          <TouchableOpacity onPress={handleCompletedCases}>
            <View style={[styles.box, { width: boxSize, height: boxSize }]}>
              <Text style={styles.boxText}>Completed Cases</Text>
            </View>
          </TouchableOpacity>

          {/* Box 5 */}
          <TouchableOpacity>
            <View style={[styles.box, { width: boxSize, height: boxSize }]}>
              <Text style={styles.boxText}>Box 5</Text>
            </View>
          </TouchableOpacity>

          {/* Box 6 */}
          <TouchableOpacity>
            <View style={[styles.box, { width: boxSize, height: boxSize }]}>
              <Text style={styles.boxText}>Box 6</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 30, // Adjust as needed
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginVertical: 20, // Adjusted to accommodate the header
  },
  box: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    margin: 10, // Adjust margin as needed
    borderRadius: 10,
  },
  boxText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    wordWrap: "break-word",
  },
});
