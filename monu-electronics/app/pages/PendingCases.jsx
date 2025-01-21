import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebaseConfig";
import Icon from "react-native-vector-icons/MaterialIcons"; // Use any icon library

// Sample data for pending cases (for testing purposes)
const samplePendingCasesData = [
  {
    id: 1,
    caseType: "Mother Board",
    date: "2023-10-01",
    contactNo: "1234567890",
    amt: 500,
    status: "Pending",
  },
  {
    id: 2,
    caseType: "Backlight",
    date: "2023-10-02",
    contactNo: "9876543210",
    amt: 300,
    status: "Pending",
  },
  {
    id: 3,
    caseType: "Audio",
    date: "2023-10-03",
    contactNo: "1122334455",
    amt: 200,
    status: "Pending",
  },
];

export default function PendingCases() {
  const [pendingCasesData, setPendingCasesData] = useState(
    samplePendingCasesData
  );

  // Fetch pending cases from Firestore
  const getPendingCases = async () => {
    try {
      const q = query(
        collection(db, "PendingCases"),
        where("status", "==", "Pending")
      );
      const querySnapshot = await getDocs(q);
      const cases = [];
      querySnapshot.forEach((doc) => {
        cases.push({ id: doc.id, ...doc.data() });
      });
      setPendingCasesData(cases);
    } catch (e) {
      console.log("Pending Case Exception - " + e.message);
    }
  };

  // Handle case completion
  const handleCompleteCase = async (caseId) => {
    try {
      const caseRef = doc(db, "PendingCases", caseId);
      await updateDoc(caseRef, { status: "Completed" });
      console.log("Case marked as complete");
      getPendingCases(); // Refresh the list
    } catch (e) {
      console.log("Error completing case: " + e.message);
    }
  };

  // Handle WhatsApp message
  const handleWhatsAppMessage = (contactNo, docId) => {
    const url = `https://wa.me/${contactNo}?text=Your case no ${docId} has been resolved. Thank you!`;
    Linking.openURL(url).catch((err) =>
      console.log("Error opening WhatsApp: " + err)
    );
  };

  // Render each row of the table
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>

      <Text style={styles.cell}>{item?.selectedProblem}</Text>
      <Text style={styles.cell}>
        {item.createdAt?.toDate()?.toLocaleDateString()}
      </Text>
      <Text style={styles.cell}>{item.contactNo}</Text>
      <Text style={styles.cell}>{item.expense}</Text>
      <TouchableOpacity onPress={() => handleCompleteCase(item.id)}>
        <Icon name="check-circle" size={24} color="green" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  // Fetch data on component mount
  useEffect(() => {
    getPendingCases();
  }, []);

  return (
    <>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 10,
          marginLeft: 10,
          marginTop: 20,
          color: "#000",
          textAlign: "center",
        }}
      >
        Pending Cases
      </Text>
      <View style={styles.container}>
        {/* Table Header */}
        <View style={styles.header}>
          <Text style={styles.headerCell}>Sr.No</Text>
          <Text style={styles.headerCell}>Case Type</Text>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Contact No</Text>
          <Text style={styles.headerCell}>Amt</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>

        {/* Table Body */}
        <FlatList
          data={pendingCasesData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        {console.log(pendingCasesData)}
      </View>
    </>
  );
}

// Styles for the table
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 2,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    flex: 2,
    textAlign: "center",
    marginLeft: 2,
    paddingHorizontal: 8,
  },
  icon: {
    marginLeft: 10,
  },
});
