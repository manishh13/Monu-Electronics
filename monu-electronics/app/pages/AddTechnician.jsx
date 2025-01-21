import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon library
import { useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebaseConfig";
// import firestore from "@react-native-firebase/firestore";
export default function AddTechnician() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();
  const handleSubmit = async () => {
    console.log("Name:", name);
    console.log("Address:", address);
    const docId = Date.now().toString();
    try {
      await setDoc(doc(db, "technicians", docId), {
        name: name,
        address: address,
        totalAmt: 0,
        dueAmt: 0,
        paidAmt: 0,
        cases: 0,
        docId: docId, // Add the docId to the document
        createdAt: new Date(),
      });
      alert("Data saved successfully with docId: " + docId);
      console.log("Technician added successfully with docId:", docId);
      setAddress("");
      setName("");
    } catch (e) {
      console.error("Error adding technician: ", e);
    }
    // Add your logic to handle form submission here
  };

  const handleBack = () => {
    router.push("/pages/Technician");
    // Navigate back to the previous screen
  };
  return (
    <>
      <View>
        <TouchableOpacity onPress={handleBack} style={styles.backIcon}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 16,
            textAlign: "center",
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          Add Technician
        </Text>
      </View>
      <View style={styles.container}>
        {/* Name Input Field */}
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
        />

        {/* Address Input Field */}
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Address"
          value={address}
          onChangeText={setAddress}
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
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
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
  },
  input: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  backIcon: {
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 16,
    position: "absolute",
    left: 0,
    zIndex: 99,
  },
});
