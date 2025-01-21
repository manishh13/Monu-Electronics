import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constant/Colors";
import { db } from "../../FirebaseConfig/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons"; // For the search icon

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchQuery) {
      let results = [];
      // Check if the input is a 10-digit number (contact number)
      if (/^\d{10}$/.test(searchQuery)) {
        const contactQuery = query(
          collection(db, "PendingCases"),
          where("contactNo", "==", searchQuery)
        );
        const result = await getDocs(contactQuery);
        if (!result.empty) {
          result.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
        } else {
          console.log("No documents found with the given Contact No.");
        }
      } else {
        // Assume the input is a document ID
        const docRef = doc(db, "PendingCases", searchQuery);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          results.push({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No document found with the given Doc ID.");
        }
      }
      setSearchResults(results);
    } else {
      console.log("Please enter a valid Contact No or Doc ID");
      // Optionally, show an error message to the user
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input with Icon */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Contact No or Doc ID"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch} // Trigger search on "Enter" key press
          keyboardType="numeric" // Restrict input to numbers
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <MaterialIcons name="search" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Display Results in a Receipt-like Format */}
      {searchResults.length > 0 ? (
        <ScrollView style={styles.resultsContainer}>
          {searchResults.map((item) => (
            <View key={item.id} style={styles.receiptContainer}>
              <Text style={styles.receiptTitle}>Case Details</Text>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Doc ID:</Text>
                <Text style={styles.receiptValue}>{item.id}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Contact No:</Text>
                <Text style={styles.receiptValue}>{item.contactNo}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Status:</Text>
                <Text style={styles.receiptValue}>{item.status || "N/A"}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date:</Text>
                <Text style={styles.receiptValue}>
                  {item.createdAt?.toDate()?.toLocaleDateString() || "N/A"}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Brand:</Text>
                <Text style={styles.receiptValue}>
                  {item.selectedBrand || "N/A"}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Size:</Text>
                <Text style={styles.receiptValue}>
                  {item.screenRatio || "N/A"}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Problem:</Text>
                <Text style={styles.receiptValue}>
                  {item.selectedProblem || "N/A"}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Receiver:</Text>
                <Text style={styles.receiptValue}>
                  {item.receiverName || "N/A"}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Expense:</Text>
                <Text style={styles.receiptValue}>
                  {item.expense ? `\u20B9 ${item.expense}` : "N/A"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noResultsText}>No results found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
  resultsContainer: {
    marginTop: 10,
  },
  receiptContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  receiptRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  receiptLabel: {
    fontWeight: "bold",
    flex: 1,
  },
  receiptValue: {
    flex: 2,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: Colors.gray,
  },
});
