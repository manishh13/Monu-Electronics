import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebaseConfig";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

// Function to generate bill
const generateBill = async (caseDetails) => {
  const { id, selectedProblem, createdAt, contactNo, expense } = caseDetails;

  // Create bill content
  const billContent = `
    <h1 style="text-align: center;">Bill Details</h1>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="border: 1px solid #000; padding: 8px;">Case ID</th>
        <td style="border: 1px solid #000; padding: 8px;">${id}</td>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 8px;">Case Type</th>
        <td style="border: 1px solid #000; padding: 8px;">${selectedProblem}</td>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 8px;">Date</th>
        <td style="border: 1px solid #000; padding: 8px;">${createdAt
          ?.toDate()
          ?.toLocaleDateString()}</td>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 8px;">Contact No</th>
        <td style="border: 1px solid #000; padding: 8px;">${contactNo}</td>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 8px;">Amount</th>
        <td style="border: 1px solid #000; padding: 8px;">${expense}</td>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 8px;">Payment Method</th>
        <td style="border: 1px solid #000; padding: 8px;">Cash</td>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 8px;">Payment Status</th>
        <td style="border: 1px solid #000; padding: 8px;">Paid</td>
      </tr>
    </table>
  `;

  try {
    // Create a new folder for bills in the document directory
    const folderPath = `${FileSystem.documentDirectory}Bills`;
    console.log("Folder Path:", folderPath);

    // Check if the folder exists, if not, create it
    const folderInfo = await FileSystem.getInfoAsync(folderPath);
    if (!folderInfo.exists) {
      console.log("Creating folder...");
      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
    }

    // Create a new file with the bill content
    const filePath = `${folderPath}/bill_${id}.html`;
    console.log("File Path:", filePath);

    await FileSystem.writeAsStringAsync(filePath, billContent);
    console.log("Bill saved to file:", filePath);

    // Verify the file exists
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      console.log("File exists:", fileInfo);
    } else {
      console.log("File does not exist.");
    }

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      console.log("Sharing is not available on this platform.");
    }
  } catch (error) {
    console.error("Error saving or sharing bill:", error);
  }
};

// Function to handle WhatsApp message
const handleWhatsAppMessage = (contactNo, docId) => {
  const url = `https://wa.me/+91${contactNo}?text=Your case no ${docId} has been resolved. Thank you!`;
  Linking.openURL(url).catch((err) =>
    console.log("Error opening WhatsApp: " + err)
  );
};

// Main component
export default function PendingCases() {
  const [pendingCasesData, setPendingCasesData] = useState([]);

  const getCompletedCases = async () => {
    try {
      const q = query(
        collection(db, "PendingCases"),
        where("status", "==", "Completed")
      );
      const querySnapshot = await getDocs(q);
      const cases = [];
      querySnapshot.forEach((doc) => {
        cases.push({ id: doc.id, ...doc.data() });
      });
      setPendingCasesData(cases);
      console.log("Completed cases fetched successfully", cases);
    } catch (e) {
      console.log("Completed Case Exception - " + e.message);
    }
  };

  useEffect(() => {
    getCompletedCases();
  }, []);

  // Render each row of the table
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cellWide}>{item.selectedProblem}</Text>
      <Text style={styles.cellWide}>
        {item.createdAt?.toDate()?.toLocaleDateString()}
      </Text>
      <Text style={styles.cellWide}>{item.contactNo}</Text>
      <Text style={styles.cellWide}>{item.expense}</Text>
      <TouchableOpacity
        style={styles.iconCell}
        onPress={() => generateBill(item)} // Call bill generation
      >
        <Icon name="file-text" size={20} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconCell}
        onPress={() => handleWhatsAppMessage(item?.contactNo, item?.docId)}
      >
        <FontAwesome name="whatsapp" size={24} color="green" />
      </TouchableOpacity>
    </View>
  );

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
        Complete Cases
      </Text>
      <View style={styles.container}>
        {/* Table Header */}
        <View style={styles.header}>
          <Text style={styles.headerCell}>Sr.No</Text>
          <Text style={styles.headerCell}>Case Type</Text>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Contact No</Text>
          <Text style={styles.headerCell}>Amt</Text>
          <Text style={styles.headerCell}>Bill</Text>
          <Text style={styles.headerCell}>Msg</Text>
        </View>

        {/* Table Body */}
        <FlatList
          data={pendingCasesData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
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
    flex: 1, // Consistent flex value for all header cells
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    flex: 0.5, // Default flex value for all row cells
    textAlign: "center",
    wordWrap: "break-word",
  },
  cellWide: {
    flex: 1.5, // Wider flex value for "Case Type"
    textAlign: "center",
    wordWrap: "break-word",
  },
  iconCell: {
    flex: 0.5, // Consistent flex value for the icon cell
    alignItems: "center",
    justifyContent: "center",
  },
});
