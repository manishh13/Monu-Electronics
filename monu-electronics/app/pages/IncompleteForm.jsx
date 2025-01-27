import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon library
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebaseConfig";
import { useRouter } from "expo-router";

const IncompleteForm = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  // Fetch incomplete forms from Firestore
  const getIncompleteForm = async () => {
    try {
      const q = query(collection(db, "IncompleteForm"));
      const querySnapshot = await getDocs(q);
      const cases = [];
      querySnapshot.forEach((doc) => {
        cases.push({ id: doc.id, ...doc.data() });
      });
      setData(cases);
      console.log("Incomplete forms fetched successfully", cases);
    } catch (e) {
      console.log("Incomplete Form Exception - " + e.message);
    }
  };

  useEffect(() => {
    getIncompleteForm();
  }, []);

  // Handle edit button press
  const handleEditPress = (item) => {
    console.log("Edit pressed:", item);
    router.push({
      pathname: "/Add_New",
      params: { item: JSON.stringify(item) },
    }); // Navigate to edit screen with item data
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Incomplete Entries</Text>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerColumn}>S.No</Text>
        <Text style={styles.headerColumn}>Contact</Text>
        <Text style={styles.headerColumn}>Cust.Name</Text>
        <Text style={styles.headerColumn}>Expense</Text>
        <Text style={styles.headerColumn}>Problem</Text>
        <Text style={styles.headerColumn}>Action</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.column}>{index + 1}</Text>
            <Text style={styles.column}>{item.contactNo}</Text>
            <Text style={styles.column}>{item.customerName}</Text>
            <Text style={styles.column}>{item.expense}</Text>
            <Text style={styles.column}>{item.selectedProblem}</Text>
            <TouchableOpacity onPress={() => handleEditPress(item)}>
              <Icon
                name="edit"
                size={20}
                color="green"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#f1f1f1",
  },
  headerColumn: {
    flex: 1,
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  column: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  editIcon: {
    width: 20,
    height: 20,
  },
});

export default IncompleteForm;
