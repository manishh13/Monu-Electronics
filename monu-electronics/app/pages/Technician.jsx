import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Colors from "../../constant/Colors";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebaseConfig";
export default function Technician() {
  const router = useRouter();
  // State for the list of technicians
  const [technicians, setTechnicians] = useState([
    {
      id: 1,
      name: "John Doe",
      address: "123 Main St",
      cases: 5,
      totalAmt: 1000,
      dueAmt: 200,
    },
    {
      id: 2,
      name: "Jane Smith",
      address: "456 Elm St",
      cases: 3,
      totalAmt: 800,
      dueAmt: 100,
    },
  ]);
  const getTechnicians = async () => {
    try {
      const q = query(collection(db, "technicians"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const cases = [];
      querySnapshot.forEach((doc) => {
        cases.push({ id: doc.id, ...doc.data() });
      });
      console.log("Found ", cases);
      // setPendingCasesData(cases);
      setTechnicians(cases);
    } catch (e) {
      console.log("Pending Case Exception - " + e.message);
    }
  };

  useEffect(() => {
    getTechnicians();
  }, []);
  // Function to handle navigation to the "Add Technician" page
  const handleAddTechnicianPress = () => {
    router.push("/pages/AddTechnician"); // Replace with your actual route name
  };

  // Render the table header
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Sr.No</Text>
      <Text style={styles.headerCell}>Name</Text>
      <Text style={styles.headerCell}>Address</Text>
      <Text style={styles.headerCell}>Cases</Text>
      <Text style={styles.headerCell}>Amount</Text>
      <Text style={styles.headerCell}>Dues</Text>
    </View>
  );

  // Render each technician row
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.address}</Text>
      <Text style={styles.cell}>{item.cases}</Text>
      <Text style={styles.cell}>{item.totalAmt}</Text>
      <Text style={styles.cell}>{item.dueAmt}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Button to navigate to the "Add Technician" page */}
      <TouchableOpacity
        onPress={handleAddTechnicianPress}
        style={{
          padding: 15,
          backgroundColor: Colors.primary,
          borderRadius: 10,
          marginTop: 15,
          marginBottom: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            wordWrap: "break-word",
          }}
        >
          Add Technician
        </Text>
      </TouchableOpacity>
      {/* <Button title="Add Technician"  /> */}

      {/* Table to display technicians */}
      <FlatList
        data={technicians}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    padding: 8,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    padding: 8,
  },
});
