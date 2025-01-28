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
import * as Print from "expo-print";

// Function to generate bill
const generateBill = async (caseDetails) => {
  try {
    // Create bill content
    const items = [
      {
        particulars: caseDetails.selectedProblem,
        rate: caseDetails.expense,
        amount: caseDetails.expense,
      },
    ];
    const billContent = `
      <div style="display: flex; justify-content: center; item-align:center;width: 100%;">
        <div
          style="
            border: 2px solid black;
            width: 65%;
            height: auto;
            display: flex;
            flex-direction: column;
            margin-bottom: 2px;
          "
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;

              height: 30px;
            "
          >
            <h4>Mukesh Prajapati</h4>
            <h2>Bill</h2>
            <h4>Mob:9827204172</h4>
          </div>
          <div>
            <h1 style="margin-top: 8px; text-align: center; font-size: 40px">
              Monu Electronics
            </h1>
            <p style="margin-top: -20px">
              Shop No:164,165,Ekta Market Naya Basera Turn,Kotra
              Sultanabad,Bhopal(M.P.)
            </p>
          </div>
          <hr style="width: 100%" />
          <div>
            <ul
              style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                column-gap: 10px;
              "
            >
              <li style="font-size: 14px; font-weight: bold">
                All Type of LED-LCD TV Repairing
              </li>
              <li style="font-size: 14px; font-weight: bold">
                All Type of LED-LCD Panel Repairing
              </li>
              <li style="font-size: 14px; font-weight: bold">
                All Type Electronic Repairing here
              </li>
            </ul>
          </div>
          <div
            style="
              height: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <h5 style="font-size: 18px">Case-Id:${caseDetails.id}</h5>
            <h5 style="font-size: 18px">Date:${caseDetails.createdAt
              ?.toDate()
              ?.toLocaleDateString()}</h5>
          </div>
          <div>
            <h3>M/s:${caseDetails.contactNo}</h3>
          </div>
          <div>
            <table
              style="
                width: 100%;
                height: 400px;
                border-collapse: collapse;
                border: 1px solid black;
              "
            >
              <thead style="border-bottom: 1px solid black">
                <tr style="width: 100%; border-bottom: 1px solid black">
                  <th style="border-right: 1px solid black">S.No</th>
                  <th style="border-right: 1px solid black">Particulars</th>

                  <th style="border-right: 1px solid black">Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item, index) => {
                  return `<tr style="width: 100%">
                    <td style="border-right: 1px solid black; text-align: center">
                      ${index + 1}
                    </td>
                    <td style="border-right: 1px solid black; text-align: center">
                     ${item.particulars}
                    </td>

                    <td style="border-right: 1px solid black; text-align: center">
                      ${item.rate}
                    </td>
                    <td style="text-align: center">${item.amount}</td>
                  </tr>`;
                })}
                <tr style="width: 100%; border-top: 1px solid black">
                  <td
                    colspan="3"
                    style="
                      border-left: 1px solid black;
                      border-right: 1px solid black;
                      text-align: center;
                      padding-right: 10 px;
                      font-weight: bold;
                    "
                  >
                    Total
                  </td>
                  <td
                    colspan="1"
                    style="
                      text-align: center;
                      border-left: 1px solid black;
                      border-right: 1px solid black;
                      font-weight: bold;
                    "
                  >
                    ${items.reduce((acc, item) => acc + item.amount, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
    `;

    // Create a new folder for bills in the document directory
    const folderPath = `${FileSystem.documentDirectory}Bills`;
    console.log("Folder Path:", folderPath);

    // Check if the folder exists, if not, create it
    const folderInfo = await FileSystem.getInfoAsync(folderPath);
    if (!folderInfo.exists) {
      console.log("Creating folder...");
      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
    }

    // Create a new PDF file with the bill content
    const filePath = `${folderPath}/bill_${caseDetails.id}.pdf`;
    console.log("File Path:", filePath);

    // Generate PDF and get the file URI
    const { uri } = await Print.printToFileAsync({
      html: billContent,
      width: 595, // A4 width in pixels
      height: 842, // A4 height in pixels
    });

    console.log("PDF saved to file:", uri);

    // Copy the generated PDF to the desired location
    await FileSystem.copyAsync({
      from: uri,
      to: filePath,
    });

    console.log("File copied successfully to:", filePath);

    // Verify the file exists
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      console.log("File exists:", fileInfo);
    } else {
      console.log("File does not exist.");
    }

    return filePath;
  } catch (error) {
    console.error("Error saving or sharing bill:", error);
  }
};

// Function to share bill on WhatsApp
const shareBillOnWhatsApp = async (contactNo, docId, caseDetails) => {
  try {
    // Generate bill
    const filePath = await generateBill(caseDetails);

    // Open WhatsApp with the contact's phone number
    const url = `whatsapp://send?phone=+91${contactNo}`;
    await Linking.openURL(url);

    // Share the file on WhatsApp
    await Sharing.shareAsync(filePath, {
      dialogTitle: "Share Bill",
      UTI: "com.adobe.pdf",
    });
  } catch (error) {
    console.error("Error sharing bill on WhatsApp:", error);
  }
};

// Main component
export default function PendingCases() {
  const [pendingCasesData, setPendingCasesData] = useState([]);
  const [error, setError] = useState(null);

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
    } catch (error) {
      setError(error);
      console.error("Error fetching completed cases:", error);
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
        onPress={() => shareBillOnWhatsApp(item?.contactNo, item?.docId, item)}
      >
        <FontAwesome name="whatsapp" size={24} color="green" />
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

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
          <Text style={styles.headerCell}>Share</Text>
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
