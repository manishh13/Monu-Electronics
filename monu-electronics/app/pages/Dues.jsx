import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebaseConfig";
export default function Dues() {
  const [dueData, setDueData] = useState([
    {
      id: 1,
      name: "John Doe",
      address: "123 Main St",
      // lastPaid: "2023-09-01",
      totalAmt: 500,
      dueAmt: 100,
    },
    {
      id: 2,
      name: "Jane Smith",
      address: "456 Elm St",
      // lastPaid: "2023-08-15",
      totalAmt: 300,
      dueAmt: 50,
    },
    // Add more entries as needed
  ]);
  const getDues = async () => {
    try {
      const q = query(collection(db, "technicians"), where("dueAmt", ">", 0));
      const querySnapshot = await getDocs(q);
      const cases = [];
      querySnapshot.forEach((doc) => {
        cases.push({ id: doc.id, ...doc.data() });
      });
      console.log("Found ", cases);
      setDueData(cases);
    } catch (e) {
      console.log("Pending Case Exception - " + e.message);
    }
  };
  useEffect(() => {
    getDues();
  }, []);
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.idCell]}>{index + 1}</Text>
      <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
      <Text style={[styles.cell, styles.addressCell]}>{item.address}</Text>
      <Text style={[styles.cell, styles.lastPaidCell]}>
        {item.lastPaid?.toDate()?.toLocaleDateString()}
      </Text>
      <Text style={[styles.cell, styles.totalAmtCell]}>{item.totalAmt}</Text>
      <Text style={[styles.cell, styles.dueAmtCell]}>{item.dueAmt}</Text>
      <Icon name="call" size={24} color="#007AFF" style={styles.actionCell} />
    </View>
  );

  return (
    <>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          textAlign: "center",
          marginTop: 30,
        }}
      >
        Dues List
      </Text>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerCell, styles.idCell]}>Sr.No</Text>
          <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
          <Text style={[styles.headerCell, styles.addressCell]}>Address</Text>
          <Text style={[styles.headerCell, styles.lastPaidCell]}>
            Last Paid
          </Text>
          <Text style={[styles.headerCell, styles.totalAmtCell]}>Total</Text>
          <Text style={[styles.headerCell, styles.dueAmtCell]}>Due</Text>
          <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
        </View>
        <FlatList
          data={dueData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 8,
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  cell: {
    textAlign: "center",
  },
  idCell: {
    width: 20, // Adjust the width as needed
  },
  nameCell: {
    width: 50, // Adjust the width as needed
  },
  addressCell: {
    width: 100, // Adjust the width as needed
  },
  lastPaidCell: {
    width: 70, // Adjust the width as needed
  },
  totalAmtCell: {
    width: 50, // Adjust the width as needed
  },
  dueAmtCell: {
    width: 50, // Adjust the width as needed
  },
  actionCell: {
    width: 40, // Adjust the width as needed
    textAlign: "center",
  },
});
